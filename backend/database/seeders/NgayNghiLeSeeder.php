<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class NgayNghiLeSeeder extends Seeder
{
	public function run(): void
	{
		DB::table('ngay_nghi_le')->upsert([
			['ten_ngay_nghi' => 'Tet Duong lich', 'ngay' => '2026-01-01', 'mo_ta' => 'Nghi le toan quoc', 'trang_thai' => 'hoat_dong', 'created_at' => now()],
			['ten_ngay_nghi' => 'Gio to Hung Vuong', 'ngay' => '2026-04-26', 'mo_ta' => 'Nghi le toan quoc', 'trang_thai' => 'hoat_dong', 'created_at' => now()],
			['ten_ngay_nghi' => 'Ngay Giai phong Mien Nam', 'ngay' => '2026-04-30', 'mo_ta' => 'Nghi le toan quoc', 'trang_thai' => 'hoat_dong', 'created_at' => now()],
			['ten_ngay_nghi' => 'Quoc te Lao dong', 'ngay' => '2026-05-01', 'mo_ta' => 'Nghi le toan quoc', 'trang_thai' => 'hoat_dong', 'created_at' => now()],
			['ten_ngay_nghi' => 'Quoc khanh', 'ngay' => '2026-09-02', 'mo_ta' => 'Nghi le toan quoc', 'trang_thai' => 'hoat_dong', 'created_at' => now()],
		], ['ngay'], ['ten_ngay_nghi', 'mo_ta', 'trang_thai']);
	}
}
