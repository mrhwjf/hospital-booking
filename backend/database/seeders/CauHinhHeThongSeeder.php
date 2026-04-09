<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CauHinhHeThongSeeder extends Seeder
{
	public function run(): void
	{
		$rows = [
			// Official values from data-seeding instruction
			['khoa' => 'THOI_GIAN_HUY_TOI_THIEU', 'gia_tri' => '12', 'mo_ta' => 'Số giờ tối thiểu trước khi khám để được hủy lịch', 'nhom' => 'lich_hen'],
			['khoa' => 'THOI_GIAN_DOI_TOI_THIEU', 'gia_tri' => '24', 'mo_ta' => 'Số giờ tối thiểu trước khi khám để được đổi lịch', 'nhom' => 'lich_hen'],
			['khoa' => 'THOI_GIAN_CHECKIN_SOM_NHAT', 'gia_tri' => '45', 'mo_ta' => 'Số phút cho phép check-in trước giờ hẹn', 'nhom' => 'lich_hen'],
			['khoa' => 'SO_NGAY_DAT_TRUOC_TOI_DA', 'gia_tri' => '30', 'mo_ta' => 'Số ngày tối đa có thể đặt lịch trước', 'nhom' => 'lich_hen'],
			['khoa' => 'THOI_LUONG_KHAM_MAC_DINH', 'gia_tri' => '60', 'mo_ta' => 'Thời lượng khám mặc định (phút)', 'nhom' => 'lich_hen'],
			['khoa' => 'TEN_BENH_VIEN', 'gia_tri' => 'Bệnh viện ABC', 'mo_ta' => 'Tên bệnh viện/phòng khám', 'nhom' => 'chung'],
			['khoa' => 'DIA_CHI', 'gia_tri' => '123 Đường ABC, Quận XYZ, TP.HCM', 'mo_ta' => 'Địa chỉ bệnh viện', 'nhom' => 'chung'],
			['khoa' => 'SO_DIEN_THOAI', 'gia_tri' => '028-1234-5678', 'mo_ta' => 'Số điện thoại liên hệ', 'nhom' => 'chung'],
			['khoa' => 'EMAIL', 'gia_tri' => 'contact@benhvienabc.com', 'mo_ta' => 'Email liên hệ', 'nhom' => 'chung'],
		];

		$rows = array_map(static function (array $row): array {
			$row['created_at'] = now();
			$row['updated_at'] = now();

			return $row;
		}, $rows);

		DB::table('cau_hinh_he_thong')->upsert(
			$rows,
			['khoa'],
			['gia_tri', 'mo_ta', 'nhom', 'updated_at']
		);
	}
}
