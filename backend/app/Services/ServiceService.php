<?php

namespace App\Services;

use App\Models\Service;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Cache;

class ServiceService
{
    public function getAllServices(array $filters = []): Collection
    {
        $normalizedFilters = [
            'specialty_id' => $filters['specialty_id'] ?? null,
            'q' => isset($filters['q']) ? trim((string) $filters['q']) : null,
        ];
        ksort($normalizedFilters);

        $cacheKey = 'services:list:' . md5(json_encode($normalizedFilters));

        return Cache::remember($cacheKey, now()->addMinutes(5), function () use ($normalizedFilters) {
            $query = Service::query()
                ->select([
                    'id',
                    'ma_goi_kham',
                    'ten_goi_kham',
                    'mo_ta',
                    'gia_goi_kham',
                    'thoi_gian_du_kien',
                    'trang_thai',
                ])
                ->active()
                ->with([
                    'dichVus:id,chuyen_khoa_id',
                    'dichVus.chuyenKhoa:id,ten_chuyen_khoa',
                ]);

            if (!empty($normalizedFilters['specialty_id'])) {
                $specialtyId = (int) $normalizedFilters['specialty_id'];

                $query->whereHas('dichVus', function ($relation) use ($specialtyId) {
                    $relation->where('chuyen_khoa_id', $specialtyId);
                });
            }

            if (!empty($normalizedFilters['q'])) {
                $keyword = $normalizedFilters['q'];
                $query->where(function ($subQuery) use ($keyword) {
                    $subQuery->where('ten_goi_kham', 'like', "%{$keyword}%")
                        ->orWhere('mo_ta', 'like', "%{$keyword}%");
                });
            }

            return $query
                ->orderBy('ten_goi_kham')
                ->get();
        });
    }

    public function getServiceById(int $id): Service
    {
        $cacheKey = "services:detail:{$id}";

        return Cache::remember($cacheKey, now()->addMinutes(5), function () use ($id) {
            return Service::query()
                ->select([
                    'id',
                    'ma_goi_kham',
                    'ten_goi_kham',
                    'mo_ta',
                    'gia_goi_kham',
                    'thoi_gian_du_kien',
                    'trang_thai',
                ])
                ->active()
                ->with([
                    'dichVus:id,ma_dich_vu,ten_dich_vu,chuyen_khoa_id,mo_ta,gia_dich_vu,thoi_gian_du_kien,yeu_cau_dac_biet,loai_dich_vu,trang_thai',
                    'dichVus.chuyenKhoa:id,ten_chuyen_khoa,mo_ta,vi_tri,so_dien_thoai',
                ])
                ->findOrFail($id);
        });
    }
}
