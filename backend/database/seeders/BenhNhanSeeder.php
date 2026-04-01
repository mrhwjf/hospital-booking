<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BenhNhanSeeder extends Seeder
{
    public function run(): void
    {
        $now = now();

        $rows = [
            [
                'ma_benh_nhan' => 'BN000001',
                'nguoi_dung_id' => null,
                'ho_ten' => 'Nguyen Thi Lan',
                'ngay_sinh' => '1992-04-16',
                'gioi_tinh' => 'nu',
                'so_dien_thoai' => '0901000001',
                'email' => 'bn1@hospital.local',
                'so_cccd' => '001092000001',
                'dia_chi' => 'Quan 1, TP.HCM',
                'nguoi_lien_he' => 'Nguyen Van Minh',
                'sdt_nguoi_lien_he' => '0909000001',
                'nhom_mau' => 'A+',
                'tien_su_di_ung' => null,
                'tien_su_benh' => null,
                'ghi_chu' => null,
                'trang_thai' => 'hoat_dong',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'ma_benh_nhan' => 'BN000002',
                'nguoi_dung_id' => null,
                'ho_ten' => 'Tran Quoc Bao',
                'ngay_sinh' => '1988-11-02',
                'gioi_tinh' => 'nam',
                'so_dien_thoai' => '0901000002',
                'email' => 'bn2@hospital.local',
                'so_cccd' => '001088000002',
                'dia_chi' => 'Quan 3, TP.HCM',
                'nguoi_lien_he' => 'Tran Thi Ha',
                'sdt_nguoi_lien_he' => '0909000002',
                'nhom_mau' => 'O+',
                'tien_su_di_ung' => null,
                'tien_su_benh' => 'Tang huyet ap',
                'ghi_chu' => null,
                'trang_thai' => 'hoat_dong',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'ma_benh_nhan' => 'BN000003',
                'nguoi_dung_id' => null,
                'ho_ten' => 'Le Minh Chau',
                'ngay_sinh' => '2000-01-20',
                'gioi_tinh' => 'nu',
                'so_dien_thoai' => '0901000003',
                'email' => 'bn3@hospital.local',
                'so_cccd' => '001200000003',
                'dia_chi' => 'Thu Duc, TP.HCM',
                'nguoi_lien_he' => 'Le Van Long',
                'sdt_nguoi_lien_he' => '0909000003',
                'nhom_mau' => 'B+',
                'tien_su_di_ung' => 'Di ung hai san',
                'tien_su_benh' => null,
                'ghi_chu' => null,
                'trang_thai' => 'hoat_dong',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'ma_benh_nhan' => 'BN000004',
                'nguoi_dung_id' => null,
                'ho_ten' => 'Pham Hoang Nam',
                'ngay_sinh' => '1979-06-11',
                'gioi_tinh' => 'nam',
                'so_dien_thoai' => '0901000004',
                'email' => 'bn4@hospital.local',
                'so_cccd' => '001079000004',
                'dia_chi' => 'Quan 7, TP.HCM',
                'nguoi_lien_he' => 'Pham Thi Mai',
                'sdt_nguoi_lien_he' => '0909000004',
                'nhom_mau' => 'AB+',
                'tien_su_di_ung' => null,
                'tien_su_benh' => null,
                'ghi_chu' => null,
                'trang_thai' => 'hoat_dong',
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ];

        DB::table('benh_nhan')->upsert(
            $rows,
            ['ma_benh_nhan'],
            [
                'ho_ten',
                'ngay_sinh',
                'gioi_tinh',
                'so_dien_thoai',
                'email',
                'so_cccd',
                'dia_chi',
                'nguoi_lien_he',
                'sdt_nguoi_lien_he',
                'nhom_mau',
                'tien_su_di_ung',
                'tien_su_benh',
                'ghi_chu',
                'trang_thai',
                'updated_at',
            ]
        );
    }
}
