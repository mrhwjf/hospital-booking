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
			// Additional realistic static settings
			['khoa' => 'GIO_MO_CUA', 'gia_tri' => '07:00', 'mo_ta' => 'Giờ mở cửa tiếp nhận bệnh nhân', 'nhom' => 'chung'],
			['khoa' => 'GIO_DONG_CUA', 'gia_tri' => '20:00', 'mo_ta' => 'Giờ đóng cửa tiếp nhận bệnh nhân', 'nhom' => 'chung'],
			['khoa' => 'NGON_NGU_MAC_DINH', 'gia_tri' => 'vi', 'mo_ta' => 'Ngôn ngữ hiển thị mặc định', 'nhom' => 'chung'],
			['khoa' => 'MUI_GIO_HE_THONG', 'gia_tri' => 'Asia/Ho_Chi_Minh', 'mo_ta' => 'Múi giờ vận hành hệ thống', 'nhom' => 'chung'],
			['khoa' => 'THOI_GIAN_GIU_CHO_DAT_LICH', 'gia_tri' => '15', 'mo_ta' => 'Số phút giữ chỗ khi tạo lịch hẹn online', 'nhom' => 'lich_hen'],
			['khoa' => 'SO_LICH_TOI_DA_MOI_BENH_NHAN_MOT_NGAY', 'gia_tri' => '3', 'mo_ta' => 'Số lịch hẹn tối đa cho một bệnh nhân trong một ngày', 'nhom' => 'lich_hen'],
			['khoa' => 'THOI_GIAN_NHAC_LICH_TRUOC', 'gia_tri' => '120', 'mo_ta' => 'Số phút gửi nhắc lịch trước giờ hẹn', 'nhom' => 'lich_hen'],
			['khoa' => 'HO_TRO_CHECKIN_QR', 'gia_tri' => 'true', 'mo_ta' => 'Bật/tắt check-in bằng mã QR', 'nhom' => 'tiep_nhan'],
			['khoa' => 'SO_NGAY_LUU_LOG_TRUY_CAP', 'gia_tri' => '180', 'mo_ta' => 'Số ngày lưu log truy cập hệ thống', 'nhom' => 'bao_mat'],
			['khoa' => 'SO_LAN_DANG_NHAP_SAI_TOI_DA', 'gia_tri' => '5', 'mo_ta' => 'Số lần đăng nhập sai tối đa trước khi khóa tạm', 'nhom' => 'bao_mat'],
			['khoa' => 'THOI_GIAN_KHOA_TAM_DANG_NHAP', 'gia_tri' => '30', 'mo_ta' => 'Thời gian khóa tạm tài khoản (phút)', 'nhom' => 'bao_mat'],
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
