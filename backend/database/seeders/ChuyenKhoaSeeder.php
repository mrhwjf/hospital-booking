<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ChuyenKhoaSeeder extends Seeder
{
    public function run(): void
    {
        $rows = [
            [
                'ma_chuyen_khoa' => 'CK001',
                'ten_chuyen_khoa' => 'Noi tong quat',
                'mo_ta' => 'Kham va dieu tri benh ly noi khoa tong quat.',
                'hinh_anh' => null,
                'vi_tri' => 'Tang 1',
                'so_dien_thoai' => '0281234567',
                'truong_khoa_id' => null,
                'thu_tu_hien_thi' => 1,
                'trang_thai' => 'hoat_dong',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'ma_chuyen_khoa' => 'CK002',
                'ten_chuyen_khoa' => 'Tim mach',
                'mo_ta' => 'Kham va theo doi cac benh ly tim mach.',
                'hinh_anh' => null,
                'vi_tri' => 'Tang 2',
                'so_dien_thoai' => '0281234568',
                'truong_khoa_id' => null,
                'thu_tu_hien_thi' => 2,
                'trang_thai' => 'hoat_dong',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'ma_chuyen_khoa' => 'CK003',
                'ten_chuyen_khoa' => 'Nhi khoa',
                'mo_ta' => 'Kham benh nhi va tu van suc khoe tre em.',
                'hinh_anh' => null,
                'vi_tri' => 'Tang 3',
                'so_dien_thoai' => '0281234569',
                'truong_khoa_id' => null,
                'thu_tu_hien_thi' => 3,
                'trang_thai' => 'hoat_dong',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'ma_chuyen_khoa' => 'CK004',
                'ten_chuyen_khoa' => 'Chan doan hinh anh',
                'mo_ta' => 'Chan doan hinh anh va ho tro doc ket qua can lam sang.',
                'hinh_anh' => null,
                'vi_tri' => 'Tang 4',
                'so_dien_thoai' => '0281234570',
                'truong_khoa_id' => null,
                'thu_tu_hien_thi' => 4,
                'trang_thai' => 'hoat_dong',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'ma_chuyen_khoa' => 'CK005',
                'ten_chuyen_khoa' => 'Co xuong khop',
                'mo_ta' => 'Kham va dieu tri benh ly co xuong khop.',
                'hinh_anh' => null,
                'vi_tri' => 'Tang 5',
                'so_dien_thoai' => '0281234571',
                'truong_khoa_id' => null,
                'thu_tu_hien_thi' => 5,
                'trang_thai' => 'hoat_dong',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('chuyen_khoa')->upsert(
            $rows,
            ['ma_chuyen_khoa'],
            ['ten_chuyen_khoa', 'mo_ta', 'hinh_anh', 'vi_tri', 'so_dien_thoai', 'truong_khoa_id', 'thu_tu_hien_thi', 'trang_thai', 'updated_at']
        );
    }
}
