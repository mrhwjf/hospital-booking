<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BacSiSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('bac_si')->upsert([
            [
                'ma_bac_si' => 'BS001',
                'nguoi_dung_id' => 1,
                'ho_ten' => 'Tran Van Bac',
                'so_dien_thoai' => '0912345678',
                'hoc_vi' => 'bac_si',
                'chung_chi_hanh_nghe' => 'CCHN001',
                'kinh_nghiem' => 5,
                'gioi_thieu' => 'Bác sĩ nội tổng quát',
                'trang_thai' => 'hoat_dong',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'ma_bac_si' => 'BS002',
                'nguoi_dung_id' => 2,
                'ho_ten' => 'Le Thi Bich',
                'so_dien_thoai' => '0912345679',
                'hoc_vi' => 'thac_si',
                'chung_chi_hanh_nghe' => 'CCHN002',
                'kinh_nghiem' => 7,
                'gioi_thieu' => 'Bác sĩ xét nghiệm',
                'trang_thai' => 'hoat_dong',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'ma_bac_si' => 'BS003',
                'nguoi_dung_id' => 3,
                'ho_ten' => 'Pham Quang Huy',
                'so_dien_thoai' => '0912345680',
                'hoc_vi' => 'bac_si',
                'chung_chi_hanh_nghe' => 'CCHN003',
                'kinh_nghiem' => 3,
                'gioi_thieu' => 'Bác sĩ chẩn đoán hình ảnh',
                'trang_thai' => 'hoat_dong',
                'created_at' => now(),
                'updated_at' => now()
            ]
        ], ['ma_bac_si'], ['nguoi_dung_id', 'ho_ten', 'so_dien_thoai', 'hoc_vi', 'chung_chi_hanh_nghe', 'kinh_nghiem', 'gioi_thieu', 'trang_thai', 'updated_at']);
    }
}
