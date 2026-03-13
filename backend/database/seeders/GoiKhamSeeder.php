<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class GoiKhamSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('goi_kham')->upsert([
            [
                'ma_goi_kham' => 'GK001',
                'ten_goi_kham' => 'Goi kham suc khoe co ban',
                'mo_ta' => 'Kham tong quat va xet nghiem co ban.',
                'gia_goi_kham' => 290000,
                'thoi_gian_du_kien' => 60,
                'trang_thai' => 'hoat_dong',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'ma_goi_kham' => 'GK002',
                'ten_goi_kham' => 'Goi kham nhi dinh ky',
                'mo_ta' => 'Kham tong quat danh cho tre em.',
                'gia_goi_kham' => 250000,
                'thoi_gian_du_kien' => 45,
                'trang_thai' => 'hoat_dong',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ], ['ma_goi_kham'], ['ten_goi_kham', 'mo_ta', 'gia_goi_kham', 'thoi_gian_du_kien', 'trang_thai', 'updated_at']);
    }
}
