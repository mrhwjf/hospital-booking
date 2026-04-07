<?php

namespace App\Services;

use App\Models\ChiDinh;
use App\Models\DichVu;
use App\Models\GoiKham;
use App\Models\Icd10;
use App\Models\PhieuKham;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;


use App\Models\ChiTietDonThuoc;
use App\Models\DonThuoc;
use App\Models\Thuoc;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ClinicalService
{
    private const WITH_RELATIONS = [
        'benhNhan',
        'bacSi',
        'nguoiTao.nhanVien',
        'icd10Chinh',
        'lichHen.dichVuLichHens.dichVu',
        'lichHen.dichVuLichHens.goiKham',
    ];

    public function getPhieuKham(int $id): PhieuKham
    {
        return PhieuKham::with(self::WITH_RELATIONS)->findOrFail($id);
    }

    public function updatePhieuKham(PhieuKham $phieuKham, array $data): PhieuKham
    {
        $phieuKham->update($data);
        $phieuKham->load(self::WITH_RELATIONS);

        return $phieuKham;
    }

    public function completePhieuKham(PhieuKham $phieuKham): PhieuKham
    {
        $phieuKham->update([
            'trang_thai' => 'hoan_thanh',
        ]);
        $phieuKham->load(self::WITH_RELATIONS);

        return $phieuKham;
    }

    public function startPhieuKham(PhieuKham $phieuKham): PhieuKham
    {
        $phieuKham->update([
            'trang_thai' => 'dang_kham',
        ]);
        $phieuKham->load(self::WITH_RELATIONS);

        return $phieuKham;
    }

    public function searchIcd10(string $query = '', int $limit = 30): Collection
    {
        $effectiveLimit = max(1, min($limit, 100));

        return Icd10::query()
            ->select(['ma_icd10', 'ten_chan_doan', 'nhom_chuong', 'trang_thai'])
            ->when($query !== '', function ($builder) use ($query) {
                $builder->where(function ($nested) use ($query) {
                    $nested
                        ->where('ma_icd10', 'like', "%{$query}%")
                        ->orWhere('ten_chan_doan', 'like', "%{$query}%");
                });
            })
            ->orderBy('ma_icd10')
            ->limit($effectiveLimit)
            ->get();
    }

    public function getChiDinhList(int $phieuKhamId): Collection
    {
        PhieuKham::findOrFail($phieuKhamId);

        return ChiDinh::query()
            ->with(['bacSi', 'dichVu', 'goiKham'])
            ->where('phieu_kham_id', $phieuKhamId)
            ->orderByDesc('id')
            ->get();
    }

    public function createChiDinh(int $phieuKhamId, array $data): Collection
    {
        $phieuKham = PhieuKham::findOrFail($phieuKhamId);

        $bacSiId = $data['bac_si_id'] ?? $phieuKham->bac_si_id;

        if (!$bacSiId) {
            throw ValidationException::withMessages([
                'bac_si_id' => 'Không xác định được bác sĩ cho phiếu chỉ định.',
            ]);
        }

        $savedIds = DB::transaction(function () use ($phieuKhamId, $bacSiId, $data) {
            ChiDinh::query()->where('phieu_kham_id', $phieuKhamId)->delete();

            $ids = [];

            foreach ($data['items'] as $item) {
                $chiDinh = ChiDinh::create([
                    'phieu_kham_id' => $phieuKhamId,
                    'bac_si_id' => $bacSiId,
                    'dich_vu_id' => $item['dich_vu_id'] ?? null,
                    'goi_kham_id' => $item['goi_kham_id'] ?? null,
                    'so_luong' => $item['so_luong'] ?? 1,
                    'trang_thai' => $item['trang_thai'] ?? 'cho_thuc_hien',
                    'ngay_chi_dinh' => $item['ngay_chi_dinh'] ?? now()->toDateString(),
                    'ghi_chu' => $item['ghi_chu'] ?? null,
                ]);

                $ids[] = $chiDinh->id;
            }

            return $ids;
        });

        if (empty($savedIds)) {
            return collect();
        }

        return ChiDinh::query()
            ->with(['bacSi', 'dichVu', 'goiKham'])
            ->whereIn('id', $savedIds)
            ->orderByDesc('id')
            ->get();
    }

    public function getDichVuList(?int $phieuKhamId = null): Collection
    {
        $specialtyIds = $this->resolveSpecialtyIds($phieuKhamId);

        $dichVuQuery = DichVu::query()
            ->active()
            ->with('chuyenKhoa')
            ->orderBy('ten_dich_vu');

        if ($specialtyIds->isNotEmpty()) {
            $dichVuQuery->whereIn('chuyen_khoa_id', $specialtyIds->all());
        }

        $dichVuItems = $dichVuQuery
            ->get()
            ->map(function (DichVu $dichVu) {
                return [
                    'id' => $dichVu->id,
                    'loai_nguon' => 'dich_vu',
                    'ma_dich_vu' => $dichVu->ma_dich_vu,
                    'ten_dich_vu' => $dichVu->ten_dich_vu,
                    'gia_dich_vu' => (int) $dichVu->gia_dich_vu,
                    'loai_dich_vu' => $dichVu->loai_dich_vu,
                    'chuyen_khoa_id' => $dichVu->chuyen_khoa_id,
                    'chuyen_khoa' => $dichVu->chuyenKhoa ? [
                        'id' => $dichVu->chuyenKhoa->id,
                        'ten_chuyen_khoa' => $dichVu->chuyenKhoa->ten_chuyen_khoa,
                    ] : null,
                    'ma_goi_kham' => null,
                    'ten_goi_kham' => null,
                    'gia_goi_kham' => null,
                ];
            });

        $goiKhamQuery = GoiKham::query()
            ->active()
            ->with([
                'dichVus' => function ($query) use ($specialtyIds) {
                    $query->select(['dich_vu.id', 'dich_vu.ten_dich_vu', 'dich_vu.chuyen_khoa_id']);

                    if ($specialtyIds->isNotEmpty()) {
                        $query->whereIn('dich_vu.chuyen_khoa_id', $specialtyIds->all());
                    }
                },
                'dichVus.chuyenKhoa:id,ten_chuyen_khoa',
            ])
            ->orderBy('ten_goi_kham');

        if ($specialtyIds->isNotEmpty()) {
            $goiKhamQuery->whereHas('dichVus', function ($query) use ($specialtyIds) {
                $query->whereIn('dich_vu.chuyen_khoa_id', $specialtyIds->all());
            });
        }

        $goiKhamItems = $goiKhamQuery
            ->get()
            ->map(function (GoiKham $goiKham) use ($specialtyIds) {
                $scopedDichVus = $specialtyIds->isNotEmpty()
                    ? $goiKham->dichVus->filter(fn($dichVu) => $specialtyIds->contains((int) $dichVu->chuyen_khoa_id))
                    : $goiKham->dichVus;

                $specialties = $scopedDichVus
                    ->map(fn($dichVu) => $dichVu->chuyenKhoa)
                    ->filter()
                    ->unique('id')
                    ->values()
                    ->map(fn($chuyenKhoa) => [
                        'id' => $chuyenKhoa->id,
                        'ten_chuyen_khoa' => $chuyenKhoa->ten_chuyen_khoa,
                    ])
                    ->all();

                return [
                    'id' => $goiKham->id,
                    'loai_nguon' => 'goi_kham',
                    'ma_dich_vu' => null,
                    'ten_dich_vu' => null,
                    'gia_dich_vu' => null,
                    'loai_dich_vu' => 'goi_kham',
                    'chuyen_khoa_id' => $specialties[0]['id'] ?? null,
                    'chuyen_khoa' => $specialties,
                    'ma_goi_kham' => $goiKham->ma_goi_kham,
                    'ten_goi_kham' => $goiKham->ten_goi_kham,
                    'gia_goi_kham' => (int) $goiKham->gia_goi_kham,
                ];
            });

        return $dichVuItems->concat($goiKhamItems)->values();
    }

    private function resolveSpecialtyIds(?int $phieuKhamId): Collection
    {
        if (!$phieuKhamId) {
            return collect();
        }

        $phieuKham = PhieuKham::query()
            ->with(['bacSi.chuyenKhoas:id', 'lichHen:id,chuyen_khoa_id'])
            ->find($phieuKhamId);

        $specialtyIds = collect($phieuKham?->bacSi?->chuyenKhoas?->pluck('id')->all() ?? [])
            ->map(fn($id) => (int) $id)
            ->filter()
            ->unique()
            ->values();

        if ($specialtyIds->isEmpty() && $phieuKham?->lichHen?->chuyen_khoa_id) {
            $specialtyIds = collect([(int) $phieuKham->lichHen->chuyen_khoa_id]);
        }

        return $specialtyIds;
    }

    // Đơn thuốc
    public const DEFAULT_PAGE_SIZE = 10;

    // Tạo đơn thuốc mới cho một phiếu khám, đảm bảo mỗi phiếu khám chỉ có một đơn thuốc
    public function createPrescription(int $phieuKhamId, array $payload): DonThuoc
    {
        return DB::transaction(function () use ($phieuKhamId, $payload) {
            // Kiểm tra phiếu khám có tồn tại
            $phieuKham = PhieuKham::query()->find($phieuKhamId);
            if ($phieuKham === null) {
                throw ValidationException::withMessages([
                    'phieu_kham_id' => ['Không tìm thấy phiếu khám.'],
                ]);
            }

            // Kiểm tra phiếu khám chưa có đơn thuốc nào
            $existingPrescription = DonThuoc::query()
                ->where('phieu_kham_id', $phieuKhamId)
                ->first();

            if ($existingPrescription !== null) {
                throw ValidationException::withMessages([
                    'phieu_kham_id' => ['Phiếu khám đã có đơn thuốc, không thể tạo mới.'],
                ]);
            }

            // Tạo đơn thuốc mới
            $donThuoc = DonThuoc::query()->create([
                'ma_don_thuoc' => $this->generatePrescriptionCode(),
                'phieu_kham_id' => $phieuKhamId,
                'ngay_ke' => $payload['ngay_ke'],
                'ghi_chu' => $payload['ghi_chu'] ?? null,
                'trang_thai' => 'moi_tao',
            ]);

            return $donThuoc;
        });
    }

    // Thêm nhiều mục thuốc vào đơn thuốc đã tồn tại
    public function addItemsToPrescription(int $donThuocId, array $items): array
    {
        return DB::transaction(function () use ($donThuocId, $items) {
            // Kiểm tra đơn thuốc có tồn tại
            $donThuoc = DonThuoc::query()->find($donThuocId);
            if ($donThuoc === null) {
                throw ValidationException::withMessages([
                    'don_thuoc_id' => ['Không tìm thấy đơn thuốc.'],
                ]);
            }

            // Kiểm tra tất cả thuốc có tồn tại trong hệ thống
            $thuocIds = collect($items)
                ->pluck('thuoc_id')
                ->unique()
                ->values();

            if ($thuocIds->isNotEmpty()) {
                $existingThuocIds = Thuoc::query()
                    ->whereIn('id', $thuocIds->all())
                    ->pluck('id')
                    ->toArray();

                $invalidThuocIds = $thuocIds->diff($existingThuocIds);

                if ($invalidThuocIds->isNotEmpty()) {
                    throw ValidationException::withMessages([
                        'items' => ['Một số thuốc được chọn không tồn tại trong hệ thống.'],
                    ]);
                }
            }

            // Thêm các items vào đơn
            $donThuoc->chiTietDonThuocs()->createMany($items);

            return [
                'created' => count($items),
                'don_thuoc_id' => $donThuoc->id,
            ];
        });
    }

    // Cập nhật toàn bộ danh sách mục thuốc của một đơn thuốc (xóa hết các mục cũ và thêm mới)
    public function updatePrescriptionItems(int $donThuocId, array $items): array
    {
        return DB::transaction(function () use ($donThuocId, $items) {
            // Kiểm tra đơn thuốc có tồn tại
            $donThuoc = DonThuoc::query()->find($donThuocId);
            if ($donThuoc === null) {
                throw ValidationException::withMessages([
                    'don_thuoc_id' => ['Không tìm thấy đơn thuốc.'],
                ]);
            }

            // Kiểm tra tất cả thuốc có tồn tại trong hệ thống
            $thuocIds = collect($items)
                ->pluck('thuoc_id')
                ->unique()
                ->values();

            if ($thuocIds->isNotEmpty()) {
                $existingThuocIds = Thuoc::query()
                    ->whereIn('id', $thuocIds->all())
                    ->pluck('id')
                    ->toArray();

                $invalidThuocIds = $thuocIds->diff($existingThuocIds);

                if ($invalidThuocIds->isNotEmpty()) {
                    throw ValidationException::withMessages([
                        'items' => ['Một số thuốc được chọn không tồn tại trong hệ thống.'],
                    ]);
                }
            }

            // Xóa tất cả các items cũ
            $donThuoc->chiTietDonThuocs()->delete();

            // Thêm các items mới
            $donThuoc->chiTietDonThuocs()->createMany($items);

            return [
                'updated' => count($items),
                'don_thuoc_id' => $donThuoc->id,
            ];
        });
    }

    // Xóa đơn thuốc cùng với các items của nó
    public function deletePrescription(int $donThuocId): array
    {
        return DB::transaction(function () use ($donThuocId) {
            // Kiểm tra đơn thuốc có tồn tại
            $donThuoc = DonThuoc::query()->find($donThuocId);
            if ($donThuoc === null) {
                throw ValidationException::withMessages([
                    'don_thuoc_id' => ['Không tìm thấy đơn thuốc.'],
                ]);
            }

            // Lưu dữ liệu để trả về response
            $deletedData = [
                'id' => $donThuoc->id,
                'ma_don_thuoc' => $donThuoc->ma_don_thuoc,
                'phieu_kham_id' => $donThuoc->phieu_kham_id,
            ];

            // Xóa đơn thuốc (các items sẽ tự động bị xóa do cascade delete)
            $donThuoc->delete();

            return $deletedData;
        });
    }


    // Tìm kiếm thuốc theo tên hoặc mã thuốc với phân trang
    public function searchMedicines(array $filters): LengthAwarePaginator
    {
        $pageSize = $this->resolvePageSize($filters['per_page'] ?? null);
        $query = $filters['q'] ?? null;

        $result = Thuoc::query()
            ->select(['id', 'ma_thuoc', 'ten_thuoc', 'don_vi', 'duong_dung', 'trang_thai'])
            ->when($query, function ($q) use ($query) {
                // Tìm kiếm trong tên thuốc hoặc mã thuốc
                $q->where(function ($builder) use ($query) {
                    $builder->where('ten_thuoc', 'like', "%{$query}%")
                        ->orWhere('ma_thuoc', 'like', "%{$query}%");
                });
            })
            ->orderBy('ten_thuoc')
            ->paginate($pageSize);

        return $result;
    }


    // Lấy đơn thuốc theo ID cùng với thông tin phiếu khám và danh sách thuốc trong đơn
    public function getPrescriptionById(int $donThuocId): DonThuoc
    {
        $donThuoc = DonThuoc::query()
            ->with([
                'phieuKham:id,ma_phieu_kham',
                'chiTietDonThuocs.thuoc:id,ma_thuoc,ten_thuoc',
            ])
            ->find($donThuocId);

        if ($donThuoc === null) {
            throw ValidationException::withMessages([
                'don_thuoc_id' => ['Không tìm thấy đơn thuốc.'],
            ]);
        }

        return $donThuoc;
    }

    // Lấy đơn thuốc theo ID phiếu khám cùng với thông tin phiếu khám và danh sách thuốc trong đơn
    public function getPrescriptionByPhieuKham(int $phieuKhamId): ?DonThuoc
    {
        // Kiểm tra phiếu khám có tồn tại
        $phieuKham = PhieuKham::query()->find($phieuKhamId);
        if ($phieuKham === null) {
            throw ValidationException::withMessages([
                'phieu_kham_id' => ['Không tìm thấy phiếu khám.'],
            ]);
        }

        // Lấy đơn thuốc cùng với các items
        return DonThuoc::query()
            ->where('phieu_kham_id', $phieuKhamId)
            ->with([
                'chiTietDonThuocs.thuoc:id,ma_thuoc,ten_thuoc',
            ])
            ->first();
    }

    // Hàm hỗ trợ để tạo mã đơn thuốc tự động theo định dạng: "DT-{YYYYMMDD}-{STT}"
    private function generatePrescriptionCode(): string
    {
        $prefix = 'DT-' . now()->format('Ymd') . '-';

        $lastCode = DonThuoc::query()
            ->where('ma_don_thuoc', 'like', $prefix . '%')
            ->orderByDesc('ma_don_thuoc')
            ->value('ma_don_thuoc');

        $nextNumber = $lastCode
            ? ((int) substr($lastCode, -3)) + 1
            : 1;

        return $prefix . str_pad((string) $nextNumber, 3, '0', STR_PAD_LEFT);
    }

    // Hàm hỗ trợ để xác định kích thước trang hợp lý cho phân trang khi tìm kiếm thuốc
    private function resolvePageSize(mixed $pageSize): int
    {
        $size = (int) ($pageSize ?? self::DEFAULT_PAGE_SIZE);

        if ($size <= 0) {
            $size = self::DEFAULT_PAGE_SIZE;
        }

        return min($size, 100);
    }
}