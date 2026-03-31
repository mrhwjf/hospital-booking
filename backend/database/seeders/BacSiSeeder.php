<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BacSiSeeder extends Seeder
{
    public function run(): void
    {
        $users = DB::table('nguoi_dung')->pluck('id', 'email');

        DB::table('bac_si')->upsert([
            [
                'ma_bac_si' => 'BS0001',
                'nguoi_dung_id' => $users['doctor1@hospital.local'] ?? null,
                'ho_ten' => 'BS Nguyen Minh',
                'so_dien_thoai' => '0911000001',
                'hoc_vi' => 'thac_si',
                'chung_chi_hanh_nghe' => 'CCHN-BS-0001',
                'kinh_nghiem' => 8,
                'gioi_thieu' => 'Chuyen kham noi tong quat.',
                'trang_thai' => 'hoat_dong',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'ma_bac_si' => 'BS0002',
                'nguoi_dung_id' => $users['doctor2@hospital.local'] ?? null,
                'ho_ten' => 'BS Tran Ngoc',
                'so_dien_thoai' => '0911000002',
                'hoc_vi' => 'bac_si',
                'chung_chi_hanh_nghe' => 'CCHN-BS-0002',
                'kinh_nghiem' => 5,
                'gioi_thieu' => 'Kham nhi tong quat va tu van dinh duong.',
                'trang_thai' => 'hoat_dong',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ], ['ma_bac_si'], ['nguoi_dung_id', 'ho_ten', 'so_dien_thoai', 'hoc_vi', 'chung_chi_hanh_nghe', 'kinh_nghiem', 'gioi_thieu', 'trang_thai', 'updated_at']);
    }
}
