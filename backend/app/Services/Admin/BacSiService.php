<?php

namespace App\Services\Admin;

use App\Models\BacSi;
use App\Models\BacSiChuyenKhoa;
use App\Models\ChuyenKhoa;
use App\Models\NguoiDung;
use App\Models\VaiTro;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class BacSiService
{
    public function layDanhSach(array $filters): LengthAwarePaginator
    {
        $query = BacSi::query()->with([
            'nguoiDung:id,email,hinh_anh',
            'bacSiChuyenKhoas.chuyenKhoa:id,ma_chuyen_khoa,ten_chuyen_khoa',
        ]);

        if (!empty($filters['q'])) {
            $q = trim($filters['q']);
            $query->where(function ($builder) use ($q) {
                $builder->where('ho_ten', 'like', '%' . $q . '%')
                    ->orWhere('ma_bac_si', 'like', '%' . $q . '%')
                    ->orWhere('so_dien_thoai', 'like', '%' . $q . '%')
                    ->orWhereHas('nguoiDung', function ($nested) use ($q) {
                        $nested->where('email', 'like', '%' . $q . '%');
                    });
            });
        }

        if (!empty($filters['hoc_vi'])) {
            $query->where('hoc_vi', $filters['hoc_vi']);
        }

        if (!empty($filters['trang_thai'])) {
            $query->where('trang_thai', $filters['trang_thai']);
        }

        if (!empty($filters['chuyen_khoa_id'])) {
            $query->whereHas('bacSiChuyenKhoas', function ($nested) use ($filters) {
                $nested->where('chuyen_khoa_id', $filters['chuyen_khoa_id']);
            });
        }

        $query->orderBy('created_at', 'desc');

        $perPage = min((int) ($filters['per_page'] ?? 10), 100);

        return $query->paginate($perPage);
    }

    public function layChiTiet(int $id): BacSi
    {
        return BacSi::query()
            ->with([
                'nguoiDung:id,email,hinh_anh',
                'bacSiChuyenKhoas.chuyenKhoa:id,ma_chuyen_khoa,ten_chuyen_khoa',
            ])
            ->findOrFail($id);
    }

    public function tao(array $payload): BacSi
    {
        return DB::transaction(function () use ($payload) {
            $vaiTroBacSi = VaiTro::query()->where('ma_vai_tro', 'BACSI')->first();
            if (!$vaiTroBacSi) {
                throw new ModelNotFoundException('Không tìm thấy vai trò BACSI.');
            }

            $kieuTao = $payload['kieu_tao'] ?? 'tao_moi_tai_khoan';
            $nguoiDung = null;

            if ($kieuTao === 'tai_khoan_co_san') {
                $nguoiDung = NguoiDung::query()
                    ->with(['vaiTro', 'bacSi'])
                    ->find($payload['nguoi_dung_id'] ?? 0);

                if (!$nguoiDung) {
                    throw new ModelNotFoundException('Không tìm thấy tài khoản người dùng đã chọn.');
                }

                if (($nguoiDung->vaiTro?->ma_vai_tro ?? '') !== 'BACSI') {
                    throw new ModelNotFoundException('Tài khoản đã chọn không phải vai trò bác sĩ.');
                }

                if ($nguoiDung->bacSi) {
                    throw new ModelNotFoundException('Tài khoản này đã có hồ sơ bác sĩ.');
                }
            } else {
                $nguoiDung = NguoiDung::query()->create([
                    'email'      => $payload['email'],
                    'mat_khau'   => Hash::make($payload['mat_khau']),
                    'vai_tro_id' => $vaiTroBacSi->id,
                    'hinh_anh'   => $payload['hinh_anh'] ?? null,
                    'trang_thai' => 'hoat_dong',
                ]);
            }

            $bacSi = BacSi::query()->create([
                'ma_bac_si'            => $this->taoMaBacSi(),
                'nguoi_dung_id'        => $nguoiDung->id,
                'ho_ten'               => $payload['ho_ten'],
                'so_dien_thoai'        => $payload['so_dien_thoai'],
                'hoc_vi'               => $payload['hoc_vi'],
                'chung_chi_hanh_nghe'  => $payload['chung_chi_hanh_nghe'],
                'kinh_nghiem'          => $payload['kinh_nghiem'] ?? null,
                'gioi_thieu'           => $payload['gioi_thieu'] ?? null,
                'trang_thai'           => $payload['trang_thai'] ?? 'hoat_dong',
            ]);

            $this->dongBoChuyenKhoa(
                $bacSi->id,
                $payload['chuyen_khoa_ids'],
                $payload['chuyen_khoa_chinh_id'] ?? null
            );

            return $this->layChiTiet($bacSi->id);
        });
    }

    public function layDanhSachTaiKhoanBacSi(array $filters = []): LengthAwarePaginator
    {
        $query = NguoiDung::query()
            ->with(['vaiTro:id,ma_vai_tro,ten_vai_tro', 'bacSi:id,nguoi_dung_id,ma_bac_si'])
            ->whereHas('vaiTro', function ($builder) {
                $builder->where('ma_vai_tro', 'BACSI');
            });

        if (!empty($filters['q'])) {
            $q = trim($filters['q']);
            $query->where('email', 'like', '%' . $q . '%');
        }

        if (!empty($filters['trang_thai'])) {
            $query->where('trang_thai', $filters['trang_thai']);
        }

        $perPage = min((int) ($filters['per_page'] ?? 20), 100);

        return $query
            ->orderBy('id')
            ->paginate($perPage);
    }

    public function capNhat(int $id, array $payload): BacSi
    {
        return DB::transaction(function () use ($id, $payload) {
            $bacSi = BacSi::query()->findOrFail($id);

            $bacSiData = [];
            foreach (['ho_ten', 'so_dien_thoai', 'hoc_vi', 'chung_chi_hanh_nghe', 'kinh_nghiem', 'gioi_thieu', 'trang_thai'] as $field) {
                if (array_key_exists($field, $payload)) {
                    $bacSiData[$field] = $payload[$field];
                }
            }

            if (!empty($bacSiData)) {
                $bacSi->update($bacSiData);
            }

            $nguoiDungData = [];
            if (array_key_exists('email', $payload)) {
                $nguoiDungData['email'] = $payload['email'];
            }
            if (array_key_exists('hinh_anh', $payload)) {
                $nguoiDungData['hinh_anh'] = $payload['hinh_anh'];
            }

            if (!empty($nguoiDungData)) {
                $bacSi->nguoiDung()->update($nguoiDungData);
            }

            if (array_key_exists('chuyen_khoa_ids', $payload)) {
                $this->dongBoChuyenKhoa(
                    $bacSi->id,
                    $payload['chuyen_khoa_ids'],
                    $payload['chuyen_khoa_chinh_id'] ?? null
                );
            }

            return $this->layChiTiet($bacSi->id);
        });
    }

    public function xoa(int $id): void
    {
        DB::transaction(function () use ($id) {
            $bacSi = BacSi::query()->findOrFail($id);
            $nguoiDungId = $bacSi->nguoi_dung_id;

            BacSiChuyenKhoa::query()->where('bac_si_id', $bacSi->id)->delete();
            $bacSi->delete();

            if ($nguoiDungId) {
                NguoiDung::query()->where('id', $nguoiDungId)->delete();
            }
        });
    }

    public function layDanhMucChuyenKhoa(array $filters): LengthAwarePaginator
    {
        $query = ChuyenKhoa::query()->select(['id', 'ma_chuyen_khoa', 'ten_chuyen_khoa', 'trang_thai']);

        if (!empty($filters['q'])) {
            $q = trim($filters['q']);
            $query->where(function ($builder) use ($q) {
                $builder->where('ten_chuyen_khoa', 'like', '%' . $q . '%')
                    ->orWhere('ma_chuyen_khoa', 'like', '%' . $q . '%');
            });
        }

        if (!empty($filters['trang_thai'])) {
            $query->where('trang_thai', $filters['trang_thai']);
        }

        $query->orderBy('thu_tu_hien_thi')->orderBy('ten_chuyen_khoa');

        $perPage = min((int) ($filters['per_page'] ?? 100), 100);

        return $query->paginate($perPage);
    }

    private function dongBoChuyenKhoa(int $bacSiId, array $chuyenKhoaIds, ?int $chuyenKhoaChinhId): void
    {
        BacSiChuyenKhoa::query()->where('bac_si_id', $bacSiId)->delete();

        $rows = collect($chuyenKhoaIds)
            ->unique()
            ->values()
            ->map(function ($chuyenKhoaId) use ($bacSiId, $chuyenKhoaChinhId) {
                return [
                    'bac_si_id'             => $bacSiId,
                    'chuyen_khoa_id'        => $chuyenKhoaId,
                    'la_chuyen_khoa_chinh'  => $chuyenKhoaChinhId ? ((int) $chuyenKhoaId === (int) $chuyenKhoaChinhId) : false,
                    'created_at'            => now(),
                    'updated_at'            => now(),
                ];
            })
            ->all();

        if (!empty($rows)) {
            BacSiChuyenKhoa::query()->insert($rows);
        }
    }

    private function taoMaBacSi(): string
    {
        $nextId = (int) DB::table('bac_si')->lockForUpdate()->max('id') + 1;
        return 'BS' . str_pad((string) $nextId, 4, '0', STR_PAD_LEFT);
    }
}
