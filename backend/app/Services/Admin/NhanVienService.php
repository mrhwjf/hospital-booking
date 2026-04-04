<?php

namespace App\Services\Admin;

use App\Models\NhanVien;
use App\Models\NguoiDung;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\DB;

class NhanVienService
{
    public function layDanhSach(array $filters): LengthAwarePaginator
    {
        $query = NhanVien::query()->with([
            'nguoiDung:id,email,hinh_anh',
        ]);

        if (!empty($filters['q'])) {
            $q = trim($filters['q']);
            $query->where(function ($builder) use ($q) {
                $builder->where('ho_ten', 'like', '%' . $q . '%')
                    ->orWhere('ma_nhan_vien', 'like', '%' . $q . '%')
                    ->orWhere('so_dien_thoai', 'like', '%' . $q . '%')
                    ->orWhereHas('nguoiDung', function ($nested) use ($q) {
                        $nested->where('email', 'like', '%' . $q . '%');
                    });
            });
        }

        if (!empty($filters['chuc_vu'])) {
            $query->where('chuc_vu', $filters['chuc_vu']);
        }

        if (!empty($filters['trang_thai'])) {
            $query->where('trang_thai', $filters['trang_thai']);
        }

        $query->orderBy('created_at', 'desc');

        $perPage = min((int) ($filters['per_page'] ?? 10), 100);

        return $query->paginate($perPage);
    }

    public function layChiTiet(int $id): NhanVien
    {
        return NhanVien::query()
            ->with(['nguoiDung:id,email,hinh_anh'])
            ->findOrFail($id);
    }

    public function tao(array $payload): NhanVien
    {
        return DB::transaction(function () use ($payload) {
            $nguoiDung = NguoiDung::query()
                ->with(['vaiTro:id,ma_vai_tro', 'nhanVien:id,nguoi_dung_id'])
                ->find($payload['nguoi_dung_id']);

            if (!$nguoiDung) {
                throw new ModelNotFoundException('Không tìm thấy tài khoản người dùng đã chọn.');
            }

            if (($nguoiDung->vaiTro?->ma_vai_tro ?? '') !== 'NHANVIEN') {
                throw new \DomainException('Tài khoản đã chọn không phải vai trò nhân viên.');
            }

            if ($nguoiDung->nhanVien) {
                throw new \DomainException('Tài khoản này đã có hồ sơ nhân viên.');
            }

            $nhanVien = NhanVien::query()->create([
                'ma_nhan_vien' => $this->taoMaNhanVien(),
                'nguoi_dung_id' => $nguoiDung->id,
                'ho_ten' => $payload['ho_ten'],
                'so_dien_thoai' => $payload['so_dien_thoai'],
                'chuc_vu' => $payload['chuc_vu'],
                'ngay_vao_lam' => $payload['ngay_vao_lam'],
                'trang_thai' => $payload['trang_thai'] ?? 'hoat_dong',
                'ghi_chu' => $payload['ghi_chu'] ?? null,
            ]);

            if (array_key_exists('hinh_anh', $payload)) {
                $nguoiDung->update([
                    'hinh_anh' => $payload['hinh_anh'],
                ]);
            }

            return $this->layChiTiet($nhanVien->id);
        });
    }

    public function capNhat(int $id, array $payload): NhanVien
    {
        return DB::transaction(function () use ($id, $payload) {
            $nhanVien = NhanVien::query()->findOrFail($id);

            $nhanVienData = [];
            foreach (['ho_ten', 'so_dien_thoai', 'chuc_vu', 'ngay_vao_lam', 'trang_thai', 'ghi_chu'] as $field) {
                if (array_key_exists($field, $payload)) {
                    $nhanVienData[$field] = $payload[$field];
                }
            }

            if (!empty($nhanVienData)) {
                $nhanVien->update($nhanVienData);
            }

            if (array_key_exists('hinh_anh', $payload)) {
                $nhanVien->nguoiDung()->update([
                    'hinh_anh' => $payload['hinh_anh'],
                ]);
            }

            return $this->layChiTiet($nhanVien->id);
        });
    }

    public function xoa(int $id): void
    {
        $nhanVien = NhanVien::query()->findOrFail($id);
        $nhanVien->delete();
    }

    public function layDanhSachTaiKhoanNhanVien(array $filters = []): LengthAwarePaginator
    {
        $query = NguoiDung::query()
            ->with(['vaiTro:id,ma_vai_tro,ten_vai_tro', 'nhanVien:id,nguoi_dung_id,ma_nhan_vien'])
            ->whereHas('vaiTro', function ($builder) {
                $builder->where('ma_vai_tro', 'NHANVIEN');
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

    private function taoMaNhanVien(): string
    {
        $nextId = (int) DB::table('nhan_vien')->lockForUpdate()->max('id') + 1;
        return 'NV' . str_pad((string) $nextId, 4, '0', STR_PAD_LEFT);
    }
}
