<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BacSiChuyenKhoaSeeder extends Seeder
{
    public function run(): void
    {
        $bacSiRows = DB::table('bac_si')
            ->orderBy('ma_bac_si')
            ->get(['id', 'ma_bac_si']);

        $chuyenKhoaRows = DB::table('chuyen_khoa')
            ->orderBy('thu_tu_hien_thi')
            ->orderBy('ma_chuyen_khoa')
            ->get(['id', 'ma_chuyen_khoa']);

        if ($bacSiRows->isEmpty() || $chuyenKhoaRows->isEmpty()) {
            return;
        }

        $specialtyIds = $chuyenKhoaRows->pluck('id', 'ma_chuyen_khoa')->all();
        $specialtyCodes = array_keys($specialtyIds);
        $specialtyCount = count($specialtyCodes);
        $now = now();

        $rows = [];
        $primaryHeads = [];

        foreach ($bacSiRows as $index => $doctor) {
            $primaryCode = $specialtyCodes[$index % $specialtyCount];
            $primarySpecialtyId = $specialtyIds[$primaryCode] ?? null;

            if (!is_null($primarySpecialtyId)) {
                $rows[] = [
                    'bac_si_id' => $doctor->id,
                    'chuyen_khoa_id' => $primarySpecialtyId,
                    'la_chuyen_khoa_chinh' => true,
                    'ghi_chu' => 'Phu trach chuyen mon chinh.',
                    'created_at' => $now,
                    'updated_at' => $now,
                ];

                if (!isset($primaryHeads[$primarySpecialtyId])) {
                    $primaryHeads[$primarySpecialtyId] = $doctor->id;
                }
            }

            if ($specialtyCount > 1 && $index % 3 === 0) {
                $secondaryCode = $specialtyCodes[($index + 7) % $specialtyCount];
                $secondarySpecialtyId = $specialtyIds[$secondaryCode] ?? null;

                if (!is_null($secondarySpecialtyId) && $secondarySpecialtyId !== $primarySpecialtyId) {
                    $rows[] = [
                        'bac_si_id' => $doctor->id,
                        'chuyen_khoa_id' => $secondarySpecialtyId,
                        'la_chuyen_khoa_chinh' => false,
                        'ghi_chu' => 'Ho tro hoi chan lien chuyen khoa.',
                        'created_at' => $now,
                        'updated_at' => $now,
                    ];
                }
            }

            if ($specialtyCount > 2 && $index % 10 === 0) {
                $thirdCode = $specialtyCodes[($index + 13) % $specialtyCount];
                $thirdSpecialtyId = $specialtyIds[$thirdCode] ?? null;

                if (!is_null($thirdSpecialtyId) && $thirdSpecialtyId !== $primarySpecialtyId) {
                    $rows[] = [
                        'bac_si_id' => $doctor->id,
                        'chuyen_khoa_id' => $thirdSpecialtyId,
                        'la_chuyen_khoa_chinh' => false,
                        'ghi_chu' => 'Tham gia luan phien theo nhu cau khoa.',
                        'created_at' => $now,
                        'updated_at' => $now,
                    ];
                }
            }
        }

        $rows = collect($rows)
            ->unique(fn(array $row) => $row['bac_si_id'] . '-' . $row['chuyen_khoa_id'])
            ->values()
            ->all();

        DB::table('bac_si_chuyen_khoa')->upsert(
            $rows,
            ['bac_si_id', 'chuyen_khoa_id'],
            ['la_chuyen_khoa_chinh', 'ghi_chu', 'updated_at']
        );

        foreach ($primaryHeads as $specialtyId => $doctorId) {
            DB::table('chuyen_khoa')
                ->where('id', $specialtyId)
                ->update([
                    'truong_khoa_id' => $doctorId,
                    'updated_at' => $now,
                ]);
        }
    }
}
