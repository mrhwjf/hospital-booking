<?php

namespace App\Services;

use App\Models\BacSi;
use App\Models\CauHinhHeThong;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Cache;

class DoctorService
{
    public function getAllDoctors(array $filters = []): Collection
    {
        $normalizedFilters = [
            'specialty_id' => $filters['specialty_id'] ?? null,
            'q' => isset($filters['q']) ? trim((string) $filters['q']) : null,
        ];
        ksort($normalizedFilters);

        $cacheKey = 'doctors:list:' . md5(json_encode($normalizedFilters));

        return Cache::remember($cacheKey, now()->addMinutes(5), function () use ($normalizedFilters) {
            $query = BacSi::query()
                ->select([
                    'id',
                    'ma_bac_si',
                    'nguoi_dung_id',
                    'ho_ten',
                    'so_dien_thoai',
                    'hoc_vi',
                    'chung_chi_hanh_nghe',
                    'kinh_nghiem',
                    'gioi_thieu',
                    'trang_thai',
                ])
                ->active()
                ->with([
                    'nguoiDung:id,hinh_anh,email',
                    'bacSiChuyenKhoas' => function ($relation) {
                        $relation->with('chuyenKhoa:id,ten_chuyen_khoa,mo_ta,vi_tri,so_dien_thoai')
                            ->orderByDesc('la_chuyen_khoa_chinh');
                    },
                ]);

            if (!empty($normalizedFilters['specialty_id'])) {
                $specialtyId = (int) $normalizedFilters['specialty_id'];

                $query->whereHas('bacSiChuyenKhoas', function ($relation) use ($specialtyId) {
                    $relation->where('chuyen_khoa_id', $specialtyId);
                });
            }

            if (!empty($normalizedFilters['q'])) {
                $keyword = $normalizedFilters['q'];
                $query->where(function ($subQuery) use ($keyword) {
                    $subQuery->where('ho_ten', 'like', "%{$keyword}%")
                        ->orWhere('gioi_thieu', 'like', "%{$keyword}%");
                });
            }

            return $query
                ->orderByDesc('kinh_nghiem')
                ->orderBy('ho_ten')
                ->get();
        });
    }

    public function getDoctorById(int $id): BacSi
    {
        $cacheKey = "doctors:detail:{$id}";

        return Cache::remember($cacheKey, now()->addMinutes(5), function () use ($id) {
            return BacSi::query()
                ->select([
                    'id',
                    'ma_bac_si',
                    'nguoi_dung_id',
                    'ho_ten',
                    'so_dien_thoai',
                    'hoc_vi',
                    'chung_chi_hanh_nghe',
                    'kinh_nghiem',
                    'gioi_thieu',
                    'trang_thai',
                ])
                ->active()
                ->with([
                    'nguoiDung:id,hinh_anh,email',
                    'bacSiChuyenKhoas' => function ($relation) {
                        $relation->with('chuyenKhoa:id,ten_chuyen_khoa,mo_ta,vi_tri,so_dien_thoai')
                            ->orderByDesc('la_chuyen_khoa_chinh');
                    },
                ])
                ->findOrFail($id);
        });
    }

    public function getHospitalName(): ?string
    {
        return Cache::remember('doctors:hospital_name', now()->addMinutes(30), function () {
            return CauHinhHeThong::query()
                ->where('khoa', 'TEN_BENH_VIEN')
                ->value('gia_tri');
        });
    }
}
