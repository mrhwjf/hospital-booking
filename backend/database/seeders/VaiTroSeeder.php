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
				'ten_vai_tro' => 'Quản trị hệ thống',
				'mo_ta' => 'Quản lý toàn bộ nghiệp vụ, cấu hình và báo cáo hệ thống.',
				'trang_thai' => 'hoat_dong',
				'created_at' => now(),
				'updated_at' => now(),
			],
			[
				'ma_vai_tro' => 'BACSI',
				'ten_vai_tro' => 'Bác sĩ',
				'mo_ta' => 'Khám bệnh, chỉ định dịch vụ và kê đơn thuốc cho bệnh nhân.',
				'trang_thai' => 'hoat_dong',
				'created_at' => now(),
				'updated_at' => now(),
			],
			[
				'ma_vai_tro' => 'NHANVIEN',
				'ten_vai_tro' => 'Nhân viên',
				'mo_ta' => 'Tiếp nhận, quản lý lịch hẹn và hỗ trợ bệnh nhân tại quầy.',
				'trang_thai' => 'hoat_dong',
				'created_at' => now(),
				'updated_at' => now(),
			],
			[
				'ma_vai_tro' => 'BENHNHAN',
				'ten_vai_tro' => 'Bệnh nhân',
				'mo_ta' => 'Đặt lịch khám, theo dõi lịch hẹn và lịch sử khám bệnh.',
				'trang_thai' => 'hoat_dong',
				'created_at' => now(),
				'updated_at' => now(),
			],
		], ['ma_vai_tro'], ['ten_vai_tro', 'mo_ta', 'trang_thai', 'updated_at']);
	}
}
