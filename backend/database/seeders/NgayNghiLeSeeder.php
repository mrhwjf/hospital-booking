<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class NgayNghiLeSeeder extends Seeder
{
	public function run(): void
	{
		$rows = [
			['ten_ngay_nghi' => 'Tết Dương lịch', 'ngay' => '2026-01-01', 'mo_ta' => 'Nghỉ lễ toàn quốc.', 'trang_thai' => 'hoat_dong', 'created_at' => now()],
			['ten_ngay_nghi' => 'Nghỉ bù Tết Dương lịch', 'ngay' => '2026-01-02', 'mo_ta' => 'Nghỉ bù theo lịch điều hành.', 'trang_thai' => 'hoat_dong', 'created_at' => now()],
			['ten_ngay_nghi' => 'Tết Nguyên đán - Mùng 1', 'ngay' => '2026-02-16', 'mo_ta' => 'Nghỉ Tết Nguyên đán.', 'trang_thai' => 'hoat_dong', 'created_at' => now()],
			['ten_ngay_nghi' => 'Tết Nguyên đán - Mùng 2', 'ngay' => '2026-02-17', 'mo_ta' => 'Nghỉ Tết Nguyên đán.', 'trang_thai' => 'hoat_dong', 'created_at' => now()],
			['ten_ngay_nghi' => 'Tết Nguyên đán - Mùng 3', 'ngay' => '2026-02-18', 'mo_ta' => 'Nghỉ Tết Nguyên đán.', 'trang_thai' => 'hoat_dong', 'created_at' => now()],
			['ten_ngay_nghi' => 'Giỗ tổ Hùng Vương', 'ngay' => '2026-04-26', 'mo_ta' => 'Nghỉ lễ toàn quốc.', 'trang_thai' => 'hoat_dong', 'created_at' => now()],
			['ten_ngay_nghi' => 'Ngày Giải phóng miền Nam', 'ngay' => '2026-04-30', 'mo_ta' => 'Nghỉ lễ toàn quốc.', 'trang_thai' => 'hoat_dong', 'created_at' => now()],
			['ten_ngay_nghi' => 'Quốc tế Lao động', 'ngay' => '2026-05-01', 'mo_ta' => 'Nghỉ lễ toàn quốc.', 'trang_thai' => 'hoat_dong', 'created_at' => now()],
			['ten_ngay_nghi' => 'Quốc khánh', 'ngay' => '2026-09-02', 'mo_ta' => 'Nghỉ lễ toàn quốc.', 'trang_thai' => 'hoat_dong', 'created_at' => now()],
			['ten_ngay_nghi' => 'Nghỉ bù Quốc khánh', 'ngay' => '2026-09-03', 'mo_ta' => 'Nghỉ bù theo lịch điều hành.', 'trang_thai' => 'hoat_dong', 'created_at' => now()],
			['ten_ngay_nghi' => 'Tết Dương lịch', 'ngay' => '2027-01-01', 'mo_ta' => 'Nghỉ lễ toàn quốc.', 'trang_thai' => 'hoat_dong', 'created_at' => now()],
			['ten_ngay_nghi' => 'Quốc khánh', 'ngay' => '2027-09-02', 'mo_ta' => 'Nghỉ lễ toàn quốc.', 'trang_thai' => 'hoat_dong', 'created_at' => now()],
			['ten_ngay_nghi' => 'Ngày nghỉ kỹ thuật hệ thống', 'ngay' => '2027-12-31', 'mo_ta' => 'Ngày nghỉ nội bộ đã hủy áp dụng.', 'trang_thai' => 'huy', 'created_at' => now()],
		];

		DB::table('ngay_nghi_le')->upsert(
			$rows,
			['ngay'],
			['ten_ngay_nghi', 'mo_ta', 'trang_thai']
		);
	}
}
