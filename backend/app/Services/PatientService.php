<?php

namespace App\Services;

use App\Models\BenhNhan;
use App\Models\PhieuKham;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class PatientService
{
    private const LICH_SU_RELATIONS = [
        'bacSi.chuyenKhoas',
        'lichHen',
        'icd10Chinh',
    ];

    public function getLichSuPhieuKham(int $benhNhanId, array $filters = []): LengthAwarePaginator
    {
        BenhNhan::findOrFail($benhNhanId);

        $query = PhieuKham::with(self::LICH_SU_RELATIONS)
            ->forPatient($benhNhanId)
            ->where('trang_thai', 'hoan_thanh')
            ->orderByDesc('thoi_gian_tiep_nhan');

        if (!empty($filters['tu_ngay'])) {
            $query->whereDate('thoi_gian_tiep_nhan', '>=', $filters['tu_ngay']);
        }

        if (!empty($filters['den_ngay'])) {
            $query->whereDate('thoi_gian_tiep_nhan', '<=', $filters['den_ngay']);
        }

        $perPage = min((int) ($filters['per_page'] ?? 10), 50);

        return $query->paginate($perPage);
    }
}
