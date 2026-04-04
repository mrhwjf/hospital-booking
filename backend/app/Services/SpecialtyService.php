<?php

namespace App\Services;

use App\Models\Specialty;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Cache;

class SpecialtyService
{
    public function getAll(array $filters = []): Collection
    {
        $keyword = isset($filters['q']) ? trim((string) $filters['q']) : null;
        $cacheKey = 'specialties:list:' . md5((string) $keyword);

        return Cache::remember($cacheKey, now()->addMinutes(10), function () use ($keyword) {
            $query = Specialty::query()
                ->select(['id', 'ten_chuyen_khoa', 'mo_ta', 'hinh_anh'])
                ->active();

            if (!empty($keyword)) {
                $query->where(function ($subQuery) use ($keyword) {
                    $subQuery->where('ten_chuyen_khoa', 'like', "%{$keyword}%")
                        ->orWhere('mo_ta', 'like', "%{$keyword}%");
                });
            }

            return $query
                ->orderBy('thu_tu_hien_thi')
                ->orderBy('ten_chuyen_khoa')
                ->get();
        });
    }
}
