<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ChuyenKhoaSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('chuyen_khoa')->upsert([
            [
                'ma_chuyen_khoa' => 'NOI',
                'ten_chuyen_khoa' => 'Noi tong quat',
                'mo_ta' => 'Kham va dieu tri cac benh ly noi khoa.',
                'hinh_anh' => null,
                'vi_tri' => 'Tang 2 khu A',
                'so_dien_thoai' => '02811110001',
                'truong_khoa_id' => null,
                'thu_tu_hien_thi' => 1,
                'trang_thai' => 'hoat_dong',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'ma_chuyen_khoa' => 'NHI',
                'ten_chuyen_khoa' => 'Nhi khoa',
                'mo_ta' => 'Kham va theo doi suc khoe tre em.',
                'hinh_anh' => null,
                'vi_tri' => 'Tang 3 khu B',
                'so_dien_thoai' => '02811110002',
                'truong_khoa_id' => null,
                'thu_tu_hien_thi' => 2,
                'trang_thai' => 'hoat_dong',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'ma_chuyen_khoa' => 'TMH',
                'ten_chuyen_khoa' => 'Tai mui hong',
                'mo_ta' => 'Kham cac benh ve tai mui hong.',
                'hinh_anh' => null,
                'vi_tri' => 'Tang 1 khu C',
                'so_dien_thoai' => '02811110003',
                'truong_khoa_id' => null,
                'thu_tu_hien_thi' => 3,
                'trang_thai' => 'hoat_dong',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ], ['ma_chuyen_khoa'], ['ten_chuyen_khoa', 'mo_ta', 'hinh_anh', 'vi_tri', 'so_dien_thoai', 'truong_khoa_id', 'thu_tu_hien_thi', 'trang_thai', 'updated_at']);
    }
}
