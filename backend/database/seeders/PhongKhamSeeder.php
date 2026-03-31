<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PhongKhamSeeder extends Seeder
{
    public function run(): void
    {
        $chuyenKhoa = DB::table('chuyen_khoa')->pluck('id', 'ma_chuyen_khoa');

        DB::table('phong_kham')->upsert([
            [
                'ma_phong' => 'PK101',
                'ten_phong' => 'Phong kham Noi 1',
                'chuyen_khoa_id' => $chuyenKhoa['NOI'] ?? null,
                'vi_tri' => 'Tang 2 khu A',
                'trang_thiet_bi' => 'May do huyet ap, monitor.',
                'trang_thai' => 'hoat_dong',
                'ghi_chu' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'ma_phong' => 'PK201',
                'ten_phong' => 'Phong kham Nhi 1',
                'chuyen_khoa_id' => $chuyenKhoa['NHI'] ?? null,
                'vi_tri' => 'Tang 3 khu B',
                'trang_thiet_bi' => 'Can tre em, den soi tai.',
                'trang_thai' => 'hoat_dong',
                'ghi_chu' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ], ['ma_phong'], ['ten_phong', 'chuyen_khoa_id', 'vi_tri', 'trang_thiet_bi', 'trang_thai', 'ghi_chu', 'updated_at']);
    }
}
