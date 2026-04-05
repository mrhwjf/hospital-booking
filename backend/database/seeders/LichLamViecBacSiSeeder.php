<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LichLamViecBacSiSeeder extends Seeder
{
    public function run(): void
    {
        $bacSi = DB::table('bac_si')->pluck('id', 'ma_bac_si');
        $ca = DB::table('lich_lam_viec')->pluck('id', 'ma_ca');
        $phong = DB::table('phong_kham')->pluck('id', 'ma_phong');

        $doctorIds = array_values($bacSi->all());
        $roomIds = array_values($phong->all());

        $doctorOneId = $bacSi['BS-0001'] ?? ($doctorIds[0] ?? null);
        $doctorTwoId = $bacSi['BS-0002'] ?? ($doctorIds[1] ?? $doctorOneId);
        $roomOneId = $phong['PK-101'] ?? ($roomIds[0] ?? null);
        $roomTwoId = $phong['PK-201'] ?? ($roomIds[1] ?? $roomOneId);

        $rows = [];

        // Generate schedule rows from today for the next 7 days.
        foreach (range(0, 6) as $offset) {
            $date = Carbon::now()->startOfDay()->addDays($offset);
            $thu = $date->isoWeekday(); // 1=Mon ... 7=Sun

            // Current shift seed only defines T2..T7 (1..6), skip Sunday.
            if ($thu > 6) {
                continue;
            }

            $rows[] = [
                'bac_si_id' => $doctorOneId,
                'lich_lam_viec_id' => $ca['CA_SANG_T' . $thu] ?? null,
                'phong_kham_id' => $roomOneId,
                'ngay_lam_viec' => $date->format('Y-m-d'),
                'ghi_chu' => null,
                'trang_thai' => 'hoat_dong',
                'created_at' => now(),
                'updated_at' => now(),
            ];

            $rows[] = [
                'bac_si_id' => $doctorTwoId,
                'lich_lam_viec_id' => $ca['CA_CHIEU_T' . $thu] ?? null,
                'phong_kham_id' => $roomTwoId,
                'ngay_lam_viec' => $date->format('Y-m-d'),
                'ghi_chu' => null,
                'trang_thai' => 'hoat_dong',
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        $rows = array_values(array_filter($rows, function (array $row) {
            return !is_null($row['bac_si_id']) && !is_null($row['lich_lam_viec_id']);
        }));

        DB::table('lich_lam_viec_bac_si')->upsert(
            $rows,
            ['bac_si_id', 'ngay_lam_viec', 'lich_lam_viec_id'],
            ['phong_kham_id', 'ghi_chu', 'trang_thai', 'updated_at']
        );
    }
}
