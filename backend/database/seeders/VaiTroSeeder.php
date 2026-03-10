<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class VaiTroSeeder extends Seeder
{
	public function run(): void
	{
		DB::table('vai_tro')->upsert([
			[
				'ma_vai_tro' => 'ADMIN',
				'ten_vai_tro' => 'Quan tri vien',
				'mo_ta' => 'Quan tri toan bo he thong',
				'trang_thai' => 'hoat_dong',
				'created_at' => now(),
				'updated_at' => now(),
			],
			[
				'ma_vai_tro' => 'BACSI',
				'ten_vai_tro' => 'Bac si',
				'mo_ta' => 'Kham benh va cap nhat ho so benh an',
				'trang_thai' => 'hoat_dong',
				'created_at' => now(),
				'updated_at' => now(),
			],
			[
				'ma_vai_tro' => 'NHANVIEN',
				'ten_vai_tro' => 'Nhan vien',
				'mo_ta' => 'Le tan va nhan vien y te',
				'trang_thai' => 'hoat_dong',
				'created_at' => now(),
				'updated_at' => now(),
			],
			[
				'ma_vai_tro' => 'BENHNHAN',
				'ten_vai_tro' => 'Benh nhan',
				'mo_ta' => 'Nguoi dung dat lich va theo doi lich su kham',
				'trang_thai' => 'hoat_dong',
				'created_at' => now(),
				'updated_at' => now(),
			],
		], ['ma_vai_tro'], ['ten_vai_tro', 'mo_ta', 'trang_thai', 'updated_at']);
	}
}
