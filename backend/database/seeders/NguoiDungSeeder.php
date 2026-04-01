<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class NguoiDungSeeder extends Seeder
{
	public function run(): void
	{
		$vaiTro = DB::table('vai_tro')->pluck('id', 'ma_vai_tro');
		$now = now();

		$rows = [
			[
				'email' => 'admin@hospital.local',
				'mat_khau' => Hash::make('Admin@123'),
				'vai_tro_id' => $vaiTro['ADMIN'] ?? null,
				'hinh_anh' => null,
				'trang_thai' => 'hoat_dong',
				'lan_dang_nhap_cuoi' => $now->copy()->subMinutes(10),
				'created_at' => $now,
				'updated_at' => $now,
			],
			[
				'email' => 'nhanvien1@hospital.local',
				'mat_khau' => Hash::make('NhanVien@123'),
				'vai_tro_id' => $vaiTro['NHANVIEN'] ?? null,
				'hinh_anh' => null,
				'trang_thai' => 'hoat_dong',
				'lan_dang_nhap_cuoi' => $now->copy()->subDay(),
				'created_at' => $now,
				'updated_at' => $now,
			],
			[
				'email' => 'nhanvien2@hospital.local',
				'mat_khau' => Hash::make('NhanVien@123'),
				'vai_tro_id' => $vaiTro['NHANVIEN'] ?? null,
				'hinh_anh' => null,
				'trang_thai' => 'hoat_dong',
				'lan_dang_nhap_cuoi' => $now->copy()->subDays(2),
				'created_at' => $now,
				'updated_at' => $now,
			],
			[
				'email' => 'benhnhan1@hospital.local',
				'mat_khau' => Hash::make('BenhNhan@123'),
				'vai_tro_id' => $vaiTro['BENHNHAN'] ?? null,
				'hinh_anh' => null,
				'trang_thai' => 'hoat_dong',
				'lan_dang_nhap_cuoi' => null,
				'created_at' => $now,
				'updated_at' => $now,
			],
		];

		$bacSiTaiKhoanRows = [];
		for ($i = 1; $i <= 5; $i++) {
			$bacSiTaiKhoanRows[] = [
				'email' => "bacsi{$i}@hospital.local",
				'mat_khau' => Hash::make('BacSi@123'),
				'vai_tro_id' => $vaiTro['BACSI'] ?? null,
				'hinh_anh' => null,
				'trang_thai' => 'hoat_dong',
				'lan_dang_nhap_cuoi' => $now->copy()->subHours($i),
				'created_at' => $now,
				'updated_at' => $now,
			];
		}

		$rows = array_merge($rows, $bacSiTaiKhoanRows);

		$rows = array_values(array_filter($rows, function (array $row) {
			return $row['vai_tro_id'] !== null;
		}));

		DB::table('nguoi_dung')->upsert(
			$rows,
			['email'],
			['mat_khau', 'vai_tro_id', 'hinh_anh', 'trang_thai', 'lan_dang_nhap_cuoi', 'updated_at']
		);
	}
}
