<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class GoiKhamSeeder extends Seeder
{
    public function run(): void
    {
        $rows = [
            [
                'ma_goi_kham' => 'GK0001',
                'ten_goi_kham' => 'Goi kham tong quat co ban',
                'mo_ta' => 'Goi kham du lieu mau cho bao cao.',
                'gia_goi_kham' => 900000,
                'thoi_gian_du_kien' => 90,
                'trang_thai' => 'hoat_dong',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'ma_goi_kham' => 'GK0002',
                'ten_goi_kham' => 'Goi kham tim mach',
                'mo_ta' => 'Goi kham tim mach mau.',
                'gia_goi_kham' => 1200000,
                'thoi_gian_du_kien' => 120,
                'trang_thai' => 'hoat_dong',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'ma_goi_kham' => 'GK0003',
                'ten_goi_kham' => 'Goi kham nhi khoa',
                'mo_ta' => 'Goi kham nhi khoa mau.',
                'gia_goi_kham' => 800000,
                'thoi_gian_du_kien' => 75,
                'trang_thai' => 'hoat_dong',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('goi_kham')->upsert(
            $rows,
            ['ma_goi_kham'],
            ['ten_goi_kham', 'mo_ta', 'gia_goi_kham', 'thoi_gian_du_kien', 'trang_thai', 'updated_at']
        );
    }
}
