<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BacSiNghiSeeder extends Seeder
{
    public function run(): void
    {
        $bacSi = DB::table('bac_si')->pluck('id', 'ma_bac_si');

        $rows = [
            [
                'bac_si_id' => $bacSi['BS-0001'] ?? null,
                'ngay' => '2026-03-20',
                'gio_bat_dau' => null,
                'gio_ket_thuc' => null,
                'ly_do' => 'Nghi phep ca ngay.',
                'trang_thai' => 'hoat_dong',
                'created_at' => now(),
            ],
            [
                'bac_si_id' => $bacSi['BS-0002'] ?? null,
                'ngay' => '2026-03-22',
                'gio_bat_dau' => '13:30:00',
                'gio_ket_thuc' => '17:00:00',
                'ly_do' => 'Tham du hoi nghi chuyen mon.',
                'trang_thai' => 'hoat_dong',
                'created_at' => now(),
            ],
        ];

        $rows = array_values(array_filter($rows, fn(array $row) => !is_null($row['bac_si_id'])));

        DB::table('bac_si_nghi')->upsert($rows, ['bac_si_id', 'ngay'], ['gio_bat_dau', 'gio_ket_thuc', 'ly_do', 'trang_thai']);
    }
}
