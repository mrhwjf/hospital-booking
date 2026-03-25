<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BenhNhanSeeder extends Seeder
{
    public function run(): void
    {
        $users = DB::table('nguoi_dung')->pluck('id', 'email');

        DB::table('benh_nhan')->upsert([
            [
                'ma_benh_nhan' => 'BN0001',
                'nguoi_dung_id' => $users['patient1@hospital.local'] ?? null,
                'ho_ten' => 'Nguyen Van An',
                'ngay_sinh' => '1993-05-21',
                'gioi_tinh' => 'nam',
                'so_dien_thoai' => '0901000001',
                'email' => 'patient1@hospital.local',
                'so_cccd' => '079093001111',
                'dia_chi' => 'Quan 1, TP HCM',
                'nguoi_lien_he' => 'Nguyen Thi Hoa',
                'sdt_nguoi_lien_he' => '0909000001',
                'nhom_mau' => 'O+',
                'tien_su_di_ung' => 'Di ung hai san nhe',
                'tien_su_benh' => 'Viem da day',
                'ghi_chu' => null,
                'trang_thai' => 'hoat_dong',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'ma_benh_nhan' => 'BN0002',
                'nguoi_dung_id' => $users['patient2@hospital.local'] ?? null,
                'ho_ten' => 'Tran Thi Bich',
                'ngay_sinh' => '2000-11-12',
                'gioi_tinh' => 'nu',
                'so_dien_thoai' => '0901000002',
                'email' => 'patient2@hospital.local',
                'so_cccd' => '079093002222',
                'dia_chi' => 'Thu Duc, TP HCM',
                'nguoi_lien_he' => 'Tran Van Loc',
                'sdt_nguoi_lien_he' => '0909000002',
                'nhom_mau' => 'A+',
                'tien_su_di_ung' => null,
                'tien_su_benh' => null,
                'ghi_chu' => null,
                'trang_thai' => 'hoat_dong',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ], ['ma_benh_nhan'], ['nguoi_dung_id', 'ho_ten', 'ngay_sinh', 'gioi_tinh', 'so_dien_thoai', 'email', 'so_cccd', 'dia_chi', 'nguoi_lien_he', 'sdt_nguoi_lien_he', 'nhom_mau', 'tien_su_di_ung', 'tien_su_benh', 'ghi_chu', 'trang_thai', 'updated_at']);
    }
}
