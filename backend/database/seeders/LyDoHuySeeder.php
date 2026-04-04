<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LyDoHuySeeder extends Seeder
{
	public function run(): void
	{
		$seedData = [
			['BN_BAN_DOT_XUAT', 'Bận việc đột xuất', 'benh_nhan'],
			['BN_SUC_KHOE_YEU', 'Sức khỏe không cho phép di chuyển', 'benh_nhan'],
			['BN_DOI_LICH_KHAM', 'Muốn đổi sang ngày khám khác', 'benh_nhan'],
			['BN_KHONG_SAP_XEP', 'Không sắp xếp được thời gian', 'benh_nhan'],
			['BN_DA_KHAM_NOI_KHAC', 'Đã khám ở cơ sở khác', 'benh_nhan'],
			['BN_CHUA_DU_TIEN', 'Chưa sẵn sàng tài chính', 'benh_nhan'],
			['BN_YC_BAC_SI_KHAC', 'Muốn đổi bác sĩ phụ trách', 'benh_nhan'],
			['BN_LY_DO_KHAC', 'Lý do khác từ phía bệnh nhân', 'benh_nhan'],
			['BS_NGHI_PHEP', 'Bác sĩ nghỉ phép', 'bac_si'],
			['BS_HOI_NGHI', 'Bác sĩ tham gia hội nghị', 'bac_si'],
			['BS_CONG_TAC', 'Bác sĩ đi công tác', 'bac_si'],
			['BS_DIEU_DONG_CC', 'Bác sĩ được điều động xử lý ca cấp cứu', 'bac_si'],
			['BS_QUA_TAI_LICH', 'Lịch bác sĩ quá tải', 'bac_si'],
			['BS_LY_DO_KHAC', 'Lý do khác từ phía bác sĩ', 'bac_si'],
			['NV_NHAP_SAI_TT', 'Nhân viên nhập sai thông tin hẹn', 'he_thong'],
			['NV_TRUNG_LICH_TN', 'Trùng lịch tiếp nhận', 'he_thong'],
			['NV_KHONG_LIEN_HE', 'Không liên hệ được với bệnh nhân', 'he_thong'],
			['NV_NHAM_CHUYEN_KHOA', 'Sắp xếp nhầm chuyên khoa', 'he_thong'],
			['HT_BAO_TRI_HE_THONG', 'Hệ thống bảo trì định kỳ', 'he_thong'],
			['HT_SU_CO_KET_NOI', 'Sự cố kết nối hệ thống', 'he_thong'],
			['HT_LOI_DONG_BO', 'Lỗi đồng bộ lịch khám', 'he_thong'],
			['HT_PHONG_DONG_CUA', 'Phòng khám tạm thời đóng cửa', 'he_thong'],
			['HT_DICH_BENH', 'Điều chỉnh lịch do tình hình dịch bệnh', 'he_thong'],
			['HT_LY_DO_KHAC', 'Lý do hệ thống khác', 'he_thong'],
		];

		$rows = [];
		foreach ($seedData as $index => $item) {
			[$code, $name, $type] = $item;

			$rows[] = [
				'ma_ly_do' => $code,
				'ten_ly_do' => $name,
				'loai' => $type,
				'thu_tu' => $index + 1,
				'trang_thai' => 'hoat_dong',
				'created_at' => now(),
			];
		}

		DB::table('ly_do_huy')->upsert(
			$rows,
			['ma_ly_do'],
			['ten_ly_do', 'loai', 'thu_tu', 'trang_thai']
		);
	}
}
