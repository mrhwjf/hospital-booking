<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ChiTietGoiKhamSeeder extends Seeder
{
    public function run(): void
    {
        $goiKham = DB::table('goi_kham')->pluck('id', 'ma_goi_kham');
        $dichVu = DB::table('dich_vu')->pluck('id', 'ma_dich_vu');

        $rows = [
            [
                'goi_kham_id' => $goiKham['GK001'] ?? null,
                'dich_vu_id' => $dichVu['DV001'] ?? null,
                'thu_tu_hien_thi' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'goi_kham_id' => $goiKham['GK001'] ?? null,
                'dich_vu_id' => $dichVu['DV003'] ?? null,
                'thu_tu_hien_thi' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'goi_kham_id' => $goiKham['GK002'] ?? null,
                'dich_vu_id' => $dichVu['DV002'] ?? null,
                'thu_tu_hien_thi' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        $rows = array_values(array_filter($rows, fn(array $row) => !is_null($row['goi_kham_id']) && !is_null($row['dich_vu_id'])));

        DB::table('chi_tiet_goi_kham')->upsert($rows, ['goi_kham_id', 'dich_vu_id'], ['thu_tu_hien_thi', 'updated_at']);
    }
}
