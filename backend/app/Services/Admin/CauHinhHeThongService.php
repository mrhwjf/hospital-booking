<?php

namespace App\Services\Admin;

use App\Models\CauHinhHeThong;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class CauHinhHeThongService
{
    public function layDanhSach(array $filters = []): LengthAwarePaginator
    {
        $query = CauHinhHeThong::query();

        if (!empty($filters['q'])) {
            $q = trim($filters['q']);
            $query->where(function ($builder) use ($q) {
                $builder->where('khoa', 'like', '%' . $q . '%')
                    ->orWhere('mo_ta', 'like', '%' . $q . '%')
                    ->orWhere('gia_tri', 'like', '%' . $q . '%');
            });
        }

        if (!empty($filters['nhom'])) {
            $query->where('nhom', $filters['nhom']);
        }

        $perPage = min((int) ($filters['per_page'] ?? 20), 100);

        return $query
            ->orderBy('nhom')
            ->orderBy('khoa')
            ->paginate($perPage);
    }

    public function capNhatHangLoat(array $items): Collection
    {
        return DB::transaction(function () use ($items) {
            foreach ($items as $item) {
                CauHinhHeThong::query()
                    ->where('khoa', $item['khoa'])
                    ->update([
                        'gia_tri' => $item['gia_tri'],
                        'mo_ta' => $item['mo_ta'] ?? null,
                        'nhom' => $item['nhom'] ?? null,
                    ]);
            }

            $khoas = collect($items)
                ->pluck('khoa')
                ->values();

            return CauHinhHeThong::query()
                ->whereIn('khoa', $khoas)
                ->get()
                ->sortBy(function ($item) use ($khoas) {
                    return $khoas->search($item->khoa);
                })
                ->values();
        });
    }
}
