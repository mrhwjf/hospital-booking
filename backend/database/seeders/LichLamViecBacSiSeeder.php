<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LichLamViecBacSiSeeder extends Seeder
{
    public function run(): void
    {
        $bacSi = DB::table('bac_si')->pluck('id', 'ma_bac_si');
        $ca = DB::table('lich_lam_viec')->pluck('id', 'ma_ca');
        $phong = DB::table('phong_kham')->pluck('id', 'ma_phong');

        $rows = [
            [
                'bac_si_id' => $bacSi['BS0001'] ?? null,
                'lich_lam_viec_id' => $ca['CA_SANG_T2'] ?? null,
                'phong_kham_id' => $phong['PK101'] ?? null,
                'ngay_lam_viec' => '2026-03-16',
                'ghi_chu' => null,
                'trang_thai' => 'hoat_dong',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'bac_si_id' => $bacSi['BS0002'] ?? null,
                'lich_lam_viec_id' => $ca['CA_CHIEU_T2'] ?? null,
                'phong_kham_id' => $phong['PK201'] ?? null,
                'ngay_lam_viec' => '2026-03-16',
                'ghi_chu' => null,
                'trang_thai' => 'hoat_dong',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'bac_si_id' => $bacSi['BS0001'] ?? null,
                'lich_lam_viec_id' => $ca['CA_SANG_T3'] ?? null,
                'phong_kham_id' => $phong['PK101'] ?? null,
                'ngay_lam_viec' => '2026-03-17',
                'ghi_chu' => null,
                'trang_thai' => 'hoat_dong',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

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
