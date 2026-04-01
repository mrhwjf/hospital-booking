<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class NguoiDungSeeder extends Seeder
{
    public function run(): void
    {
        $roles = DB::table('vai_tro')->pluck('id', 'ma_vai_tro');

        $rows = [
            [
                'email' => 'admin@hospital.local',
                'ho_ten' => 'Admin Hospital',
                'mat_khau' => Hash::make('12345678'),
                'vai_tro_id' => $roles['ADMIN'] ?? null,
                'hinh_anh' => null,
                'trang_thai' => 'hoat_dong',
                'lan_dang_nhap_cuoi' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'email' => 'doctor1@hospital.local',
                'ho_ten' => 'Bác Sĩ Nguyễn Văn A',
                'mat_khau' => Hash::make('12345678'),
                'vai_tro_id' => $roles['BACSI'] ?? null,
                'hinh_anh' => null,
                'trang_thai' => 'hoat_dong',
                'lan_dang_nhap_cuoi' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'email' => 'doctor2@hospital.local',
                'ho_ten' => 'Bác Sĩ Trần Thị B',
                'mat_khau' => Hash::make('12345678'),
                'vai_tro_id' => $roles['BACSI'] ?? null,
                'hinh_anh' => null,
                'trang_thai' => 'hoat_dong',
                'lan_dang_nhap_cuoi' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'email' => 'staff1@hospital.local',
                'ho_ten' => 'Nhân Viên Lê Văn C',
                'mat_khau' => Hash::make('12345678'),
                'vai_tro_id' => $roles['NHANVIEN'] ?? null,
                'hinh_anh' => null,
                'trang_thai' => 'hoat_dong',
                'lan_dang_nhap_cuoi' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'email' => 'staff2@hospital.local',
                'ho_ten' => 'Nhân Viên Đỗ Thị D',
                'mat_khau' => Hash::make('12345678'),
                'vai_tro_id' => $roles['NHANVIEN'] ?? null,
                'hinh_anh' => null,
                'trang_thai' => 'hoat_dong',
                'lan_dang_nhap_cuoi' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'email' => 'patient1@hospital.local',
                'ho_ten' => 'Nguyễn Văn Bệnh Nhân',
                'mat_khau' => Hash::make('12345678'),
                'vai_tro_id' => $roles['BENHNHAN'] ?? null,
                'hinh_anh' => null,
                'trang_thai' => 'hoat_dong',
                'lan_dang_nhap_cuoi' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'email' => 'patient2@hospital.local',
                'ho_ten' => 'Trần Thị Mệnh Bệnh',
                'mat_khau' => Hash::make('12345678'),
                'vai_tro_id' => $roles['BENHNHAN'] ?? null,
                'hinh_anh' => null,
                'trang_thai' => 'hoat_dong',
                'lan_dang_nhap_cuoi' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        $rows = array_filter($rows, fn(array $row) => !is_null($row['vai_tro_id']));

        DB::table('nguoi_dung')->upsert(
            $rows,
            ['email'],
            ['ho_ten', 'mat_khau', 'vai_tro_id', 'hinh_anh', 'trang_thai', 'lan_dang_nhap_cuoi', 'updated_at']
        );
    }
}
