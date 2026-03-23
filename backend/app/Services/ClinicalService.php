<?php

namespace App\Services;

use App\Models\ChiDinh;
use App\Models\DichVu;
use App\Models\PhieuKham;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class ClinicalService
{
    private const WITH_RELATIONS = [
        'benhNhan',
        'bacSi',
        'nguoiTao',
        'icd10Chinh',
        'lichHen',
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

    public function getChiDinhList(int $phieuKhamId): Collection
    {
        PhieuKham::findOrFail($phieuKhamId);

        return ChiDinh::query()
            ->with(['bacSi', 'dichVu'])
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

        $createdIds = DB::transaction(function () use ($phieuKhamId, $bacSiId, $data) {
            $ids = [];

            foreach ($data['items'] as $item) {
                $chiDinh = ChiDinh::create([
                    'phieu_kham_id' => $phieuKhamId,
                    'bac_si_id' => $bacSiId,
                    'dich_vu_id' => $item['dich_vu_id'],
                    'so_luong' => $item['so_luong'] ?? 1,
                    'trang_thai' => $item['trang_thai'] ?? 'cho_thuc_hien',
                    'ngay_chi_dinh' => $item['ngay_chi_dinh'] ?? now()->toDateString(),
                    'ghi_chu' => $item['ghi_chu'] ?? null,
                ]);

                $ids[] = $chiDinh->id;
            }

            return $ids;
        });

        return ChiDinh::query()
            ->with(['bacSi', 'dichVu'])
            ->whereIn('id', $createdIds)
            ->orderByDesc('id')
            ->get();
    }

    public function getDichVuList(): Collection
    {
        return DichVu::query()
            ->active()
            ->with('chuyenKhoa')
            ->orderBy('ten_dich_vu')
            ->get();
    }
}
