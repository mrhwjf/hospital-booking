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
                'ma_chuyen_khoa' => 'CK001',
                'ten_chuyen_khoa' => 'Nội tổng quát',
                'mo_ta' => 'Khám và điều trị nội tổng quát',
                'vi_tri' => 'Tầng 1',
                'so_dien_thoai' => '02812340001',
                'thu_tu_hien_thi' => 1,
                'trang_thai' => 'hoat_dong',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'ma_chuyen_khoa' => 'CK002',
                'ten_chuyen_khoa' => 'Xét nghiệm',
                'mo_ta' => 'Xét nghiệm huyết học và sinh hóa',
                'vi_tri' => 'Tầng 2',
                'so_dien_thoai' => '02812340002',
                'thu_tu_hien_thi' => 2,
                'trang_thai' => 'hoat_dong',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'ma_chuyen_khoa' => 'CK003',
                'ten_chuyen_khoa' => 'Chẩn đoán hình ảnh',
                'mo_ta' => 'Siêu âm, X-quang, CT',
                'vi_tri' => 'Tầng 3',
                'so_dien_thoai' => '02812340003',
                'thu_tu_hien_thi' => 3,
                'trang_thai' => 'hoat_dong',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ], ['ma_chuyen_khoa'], ['ten_chuyen_khoa', 'mo_ta', 'vi_tri', 'so_dien_thoai', 'thu_tu_hien_thi', 'trang_thai', 'updated_at']);
    }
}