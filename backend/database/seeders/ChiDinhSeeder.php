<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ChiDinhSeeder extends Seeder
{
    public function run(): void
    {
        $phieu = DB::table('phieu_kham')->pluck('id', 'ma_phieu_kham');
        $bacSi = DB::table('bac_si')->pluck('id', 'ma_bac_si');
        $dichVu = DB::table('dich_vu')->pluck('id', 'ma_dich_vu');

        $rows = [
            [
                'phieu_kham_id' => $phieu['PK0001'] ?? null,
                'bac_si_id' => $bacSi['BS0001'] ?? null,
                'dich_vu_id' => $dichVu['DV003'] ?? null,
                'so_luong' => 1,
                'trang_thai' => 'da_hoan_thanh',
                'ngay_chi_dinh' => '2026-03-16',
                'ghi_chu' => 'Thuc hien trong buoi sang.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        $rows = array_values(array_filter($rows, function (array $row) {
            return !is_null($row['phieu_kham_id']) && !is_null($row['bac_si_id']) && !is_null($row['dich_vu_id']);
        }));

        DB::table('chi_dinh')->upsert($rows, ['phieu_kham_id', 'dich_vu_id'], ['bac_si_id', 'so_luong', 'trang_thai', 'ngay_chi_dinh', 'ghi_chu', 'updated_at']);
    }
}
