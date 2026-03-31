
<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BenhNhanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('benh_nhan')->upsert([
            [
                'ma_benh_nhan' => 'BN001',
                'ho_ten' => 'Nguyen Van A',
                'ngay_sinh' => '1995-05-10',
                'gioi_tinh' => 'nam',
                'so_dien_thoai' => '0987654321',
                'email' => 'benhnhan1@gmail.com',
                'dia_chi' => 'TP HCM',
                'nhom_mau' => 'O+',
                'trang_thai' => 'hoat_dong',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'ma_benh_nhan' => 'BN002',
                'ho_ten' => 'Tran Thi B',
                'ngay_sinh' => '1988-11-22',
                'gioi_tinh' => 'nu',
                'so_dien_thoai' => '0987654322',
                'email' => 'benhnhan2@gmail.com',
                'dia_chi' => 'Da Nang',
                'nhom_mau' => 'A+',
                'trang_thai' => 'hoat_dong',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'ma_benh_nhan' => 'BN003',
                'ho_ten' => 'Le Van C',
                'ngay_sinh' => '2000-01-15',
                'gioi_tinh' => 'nam',
                'so_dien_thoai' => '0987654323',
                'email' => 'benhnhan3@gmail.com',
                'dia_chi' => 'Ha Noi',
                'nhom_mau' => 'B+',
                'trang_thai' => 'hoat_dong',
                'created_at' => now(),
                'updated_at' => now()
            ]
        ], ['ma_benh_nhan'], ['ho_ten', 'ngay_sinh', 'gioi_tinh', 'so_dien_thoai', 'email', 'dia_chi', 'nhom_mau', 'trang_thai', 'updated_at']);
    }
}
