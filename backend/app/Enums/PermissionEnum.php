<?php

namespace App\Enums;

enum PermissionEnum: string
{
	case QUAN_TRI_NGUOI_DUNG = 'quan_tri:nguoi_dung';
	case QUAN_TRI_VAI_TRO = 'quan_tri:vai_tro';
	case QUAN_TRI_CAU_HINH = 'quan_tri:cau_hinh';
	case QUAN_TRI_BAO_CAO = 'quan_tri:bao_cao';
	case QUAN_TRI_LICH_LAM_VIEC = 'quan_tri:lich_lam_viec';
	case QUAN_TRI_HO_SO_NHAN_VIEN = 'quan_tri:ho_so_nhan_vien';

	case NGUOI_DUNG_READ = 'nguoi_dung:read';
	case NGUOI_DUNG_CHANGE_PASSWORD = 'nguoi_dung:change_password';
	case NGUOI_DUNG_CHANGE_EMAIL = 'nguoi_dung:change_email';
	case NGUOI_DUNG_AVATAR = 'nguoi_dung:avatar';
	case NGUOI_DUNG_VAI_TRO = 'nguoi_dung:vai_tro';
	case NGUOI_DUNG_TRANG_THAI = 'nguoi_dung:trang_thai';

	case BENH_NHAN_CREATE = 'benh_nhan:create';
	case BENH_NHAN_READ = 'benh_nhan:read';
	case BENH_NHAN_UPDATE = 'benh_nhan:update';
	case BENH_NHAN_DELETE = 'benh_nhan:delete';

	case BAC_SI_READ = 'bac_si:read';
	case NHAN_VIEN_READ = 'nhan_vien:read';

	case NGAY_NGHI_LE_READ = 'ngay_nghi_le:read';
	case BAC_SI_NGHI_READ = 'bac_si_nghi:read';
	case LICH_LAM_VIEC_READ = 'lich_lam_viec:read';
	case LICH_LAM_VIEC_BAC_SI_READ = 'lich_lam_viec_bac_si:read';

	case LICH_HEN_CREATE = 'lich_hen:create';
	case LICH_HEN_READ = 'lich_hen:read';
	case LICH_HEN_UPDATE = 'lich_hen:update';
	case LICH_HEN_DELETE = 'lich_hen:delete';
	case LICH_HEN_DAT_LICH = 'lich_hen:dat_lich';
	case LICH_HEN_HUY_LICH = 'lich_hen:huy_lich';
	case LICH_HEN_SUA_LICH = 'lich_hen:sua_lich';
	case LICH_HEN_LICH_SU = 'lich_hen:lich_su';
	case LICH_HEN_CHECKIN = 'lich_hen:checkin';

	case PHIEU_KHAM_CREATE = 'phieu_kham:create';
	case PHIEU_KHAM_READ = 'phieu_kham:read';
	case PHIEU_KHAM_UPDATE = 'phieu_kham:update';
	case PHIEU_KHAM_DELETE = 'phieu_kham:delete';
	case PHIEU_KHAM_TRANG_THAI = 'phieu_kham:trang_thai';

	case CHI_DINH_CREATE = 'chi_dinh:create';
	case CHI_DINH_READ = 'chi_dinh:read';
	case CHI_DINH_UPDATE = 'chi_dinh:update';
	case CHI_DINH_DELETE = 'chi_dinh:delete';
	case CHI_DINH_TRANG_THAI = 'chi_dinh:trang_thai';

	case DON_THUOC_CREATE = 'don_thuoc:create';
	case DON_THUOC_READ = 'don_thuoc:read';
	case DON_THUOC_UPDATE = 'don_thuoc:update';
	case DON_THUOC_DELETE = 'don_thuoc:delete';

	case TAI_LIEU_HO_SO_CREATE = 'tai_lieu_ho_so:create';
	case TAI_LIEU_HO_SO_READ = 'tai_lieu_ho_so:read';
	case TAI_LIEU_HO_SO_UPDATE = 'tai_lieu_ho_so:update';
	case TAI_LIEU_HO_SO_DELETE = 'tai_lieu_ho_so:delete';
	case TAI_LIEU_HO_SO_UPDATE_FILE = 'tai_lieu_ho_so:update_file';
	case TAI_LIEU_HO_SO_READ_FILE = 'tai_lieu_ho_so:read_file';
	case TAI_LIEU_HO_SO_DELETE_FILE = 'tai_lieu_ho_so:delete_file';

	case NGHIEP_VU_DAT_LICH = 'nghiep_vu:dat_lich';
	case NGHIEP_VU_KHAM_BENH = 'nghiep_vu:kham_benh';
	case NGHIEP_VU_QUAN_LY_LICH_HEN = 'nghiep_vu:quan_ly_lich_hen';

	public static function values(): array
	{
		return array_map(static fn(self $permission) => $permission->value, self::cases());
	}

	public static function rows(): array
	{
		return array_map(static function (self $permission): array {
			return [
				'ma_quyen' => $permission->value,
				'ten_quyen' => $permission->label(),
				'mo_ta' => $permission->description(),
				'nhom_quyen' => $permission->group(),
			];
		}, self::cases());
	}

	public function label(): string
	{
		return self::meta()[$this->value]['ten_quyen'];
	}

	public function description(): string
	{
		return self::meta()[$this->value]['mo_ta'];
	}

	public function group(): string
	{
		return self::meta()[$this->value]['nhom_quyen'];
	}

	private static function meta(): array
	{
		return [
			self::QUAN_TRI_NGUOI_DUNG->value => ['ten_quyen' => 'Quan tri nguoi dung', 'mo_ta' => 'Quan ly tai khoan nguoi dung.', 'nhom_quyen' => 'quan_tri'],
			self::QUAN_TRI_VAI_TRO->value => ['ten_quyen' => 'Quan tri vai tro', 'mo_ta' => 'Quan ly vai tro va quyen he thong.', 'nhom_quyen' => 'quan_tri'],
			self::QUAN_TRI_CAU_HINH->value => ['ten_quyen' => 'Quan tri cau hinh', 'mo_ta' => 'Quan ly cau hinh he thong.', 'nhom_quyen' => 'quan_tri'],
			self::QUAN_TRI_BAO_CAO->value => ['ten_quyen' => 'Quan tri bao cao', 'mo_ta' => 'Xem bao cao va thong ke he thong.', 'nhom_quyen' => 'quan_tri'],
			self::QUAN_TRI_LICH_LAM_VIEC->value => ['ten_quyen' => 'Quan tri lich lam viec', 'mo_ta' => 'Quan ly lich lam viec bac si.', 'nhom_quyen' => 'quan_tri'],
			self::QUAN_TRI_HO_SO_NHAN_VIEN->value => ['ten_quyen' => 'Quan tri ho so nhan vien', 'mo_ta' => 'Quan ly ho so nhan vien va bac si.', 'nhom_quyen' => 'quan_tri'],

			self::NGUOI_DUNG_READ->value => ['ten_quyen' => 'Xem tai khoan', 'mo_ta' => 'Xem thong tin tai khoan nguoi dung.', 'nhom_quyen' => 'khac'],
			self::NGUOI_DUNG_CHANGE_PASSWORD->value => ['ten_quyen' => 'Doi mat khau', 'mo_ta' => 'Cap nhat mat khau tai khoan.', 'nhom_quyen' => 'khac'],
			self::NGUOI_DUNG_CHANGE_EMAIL->value => ['ten_quyen' => 'Doi email', 'mo_ta' => 'Cap nhat email tai khoan.', 'nhom_quyen' => 'khac'],
			self::NGUOI_DUNG_AVATAR->value => ['ten_quyen' => 'Cap nhat avatar', 'mo_ta' => 'Cap nhat anh dai dien.', 'nhom_quyen' => 'khac'],
			self::NGUOI_DUNG_VAI_TRO->value => ['ten_quyen' => 'Gan vai tro nguoi dung', 'mo_ta' => 'Gan vai tro cho tai khoan.', 'nhom_quyen' => 'quan_tri'],
			self::NGUOI_DUNG_TRANG_THAI->value => ['ten_quyen' => 'Cap nhat trang thai nguoi dung', 'mo_ta' => 'Khoa/mo trang thai tai khoan.', 'nhom_quyen' => 'quan_tri'],

			self::BENH_NHAN_CREATE->value => ['ten_quyen' => 'Tao benh nhan', 'mo_ta' => 'Tao ho so benh nhan.', 'nhom_quyen' => 'nguoi_dung'],
			self::BENH_NHAN_READ->value => ['ten_quyen' => 'Xem benh nhan', 'mo_ta' => 'Xem ho so benh nhan.', 'nhom_quyen' => 'nguoi_dung'],
			self::BENH_NHAN_UPDATE->value => ['ten_quyen' => 'Cap nhat benh nhan', 'mo_ta' => 'Cap nhat ho so benh nhan.', 'nhom_quyen' => 'nguoi_dung'],
			self::BENH_NHAN_DELETE->value => ['ten_quyen' => 'Xoa benh nhan', 'mo_ta' => 'Xoa ho so benh nhan.', 'nhom_quyen' => 'nguoi_dung'],

			self::BAC_SI_READ->value => ['ten_quyen' => 'Xem bac si', 'mo_ta' => 'Xem danh sach va thong tin bac si.', 'nhom_quyen' => 'khac'],
			self::NHAN_VIEN_READ->value => ['ten_quyen' => 'Xem nhan vien', 'mo_ta' => 'Xem thong tin nhan vien.', 'nhom_quyen' => 'khac'],

			self::NGAY_NGHI_LE_READ->value => ['ten_quyen' => 'Xem ngay nghi le', 'mo_ta' => 'Xem danh sach ngay nghi le.', 'nhom_quyen' => 'khac'],
			self::BAC_SI_NGHI_READ->value => ['ten_quyen' => 'Xem lich nghi bac si', 'mo_ta' => 'Xem lich nghi cua bac si.', 'nhom_quyen' => 'khac'],
			self::LICH_LAM_VIEC_READ->value => ['ten_quyen' => 'Xem mau lich lam viec', 'mo_ta' => 'Xem mau lich lam viec.', 'nhom_quyen' => 'khac'],
			self::LICH_LAM_VIEC_BAC_SI_READ->value => ['ten_quyen' => 'Xem lich lam viec bac si', 'mo_ta' => 'Xem lich lam viec duoc phan cong.', 'nhom_quyen' => 'khac'],

			self::LICH_HEN_CREATE->value => ['ten_quyen' => 'Tao lich hen', 'mo_ta' => 'Tao lich hen kham.', 'nhom_quyen' => 'le_tan'],
			self::LICH_HEN_READ->value => ['ten_quyen' => 'Xem lich hen', 'mo_ta' => 'Xem danh sach lich hen.', 'nhom_quyen' => 'le_tan'],
			self::LICH_HEN_UPDATE->value => ['ten_quyen' => 'Cap nhat lich hen', 'mo_ta' => 'Cap nhat thong tin lich hen.', 'nhom_quyen' => 'le_tan'],
			self::LICH_HEN_DELETE->value => ['ten_quyen' => 'Xoa lich hen', 'mo_ta' => 'Xoa lich hen.', 'nhom_quyen' => 'le_tan'],
			self::LICH_HEN_DAT_LICH->value => ['ten_quyen' => 'Dat lich kham', 'mo_ta' => 'Dat lich kham cho benh nhan.', 'nhom_quyen' => 'le_tan'],
			self::LICH_HEN_HUY_LICH->value => ['ten_quyen' => 'Huy lich kham', 'mo_ta' => 'Huy lich hen kham.', 'nhom_quyen' => 'le_tan'],
			self::LICH_HEN_SUA_LICH->value => ['ten_quyen' => 'Sua lich kham', 'mo_ta' => 'Doi lich hen kham.', 'nhom_quyen' => 'le_tan'],
			self::LICH_HEN_LICH_SU->value => ['ten_quyen' => 'Xem lich su lich hen', 'mo_ta' => 'Xem lich su thay doi lich hen.', 'nhom_quyen' => 'le_tan'],
			self::LICH_HEN_CHECKIN->value => ['ten_quyen' => 'Check-in lich hen', 'mo_ta' => 'Tiep nhan benh nhan den kham.', 'nhom_quyen' => 'le_tan'],

			self::PHIEU_KHAM_CREATE->value => ['ten_quyen' => 'Tao phieu kham', 'mo_ta' => 'Tao phieu kham moi.', 'nhom_quyen' => 'bac_si'],
			self::PHIEU_KHAM_READ->value => ['ten_quyen' => 'Xem phieu kham', 'mo_ta' => 'Xem thong tin phieu kham.', 'nhom_quyen' => 'bac_si'],
			self::PHIEU_KHAM_UPDATE->value => ['ten_quyen' => 'Cap nhat phieu kham', 'mo_ta' => 'Cap nhat ket qua kham.', 'nhom_quyen' => 'bac_si'],
			self::PHIEU_KHAM_DELETE->value => ['ten_quyen' => 'Xoa phieu kham', 'mo_ta' => 'Xoa phieu kham.', 'nhom_quyen' => 'bac_si'],
			self::PHIEU_KHAM_TRANG_THAI->value => ['ten_quyen' => 'Cap nhat trang thai phieu kham', 'mo_ta' => 'Cap nhat trang thai kham benh.', 'nhom_quyen' => 'bac_si'],

			self::CHI_DINH_CREATE->value => ['ten_quyen' => 'Tao chi dinh', 'mo_ta' => 'Tao chi dinh dich vu/goi kham.', 'nhom_quyen' => 'bac_si'],
			self::CHI_DINH_READ->value => ['ten_quyen' => 'Xem chi dinh', 'mo_ta' => 'Xem danh sach chi dinh.', 'nhom_quyen' => 'bac_si'],
			self::CHI_DINH_UPDATE->value => ['ten_quyen' => 'Cap nhat chi dinh', 'mo_ta' => 'Cap nhat chi dinh.', 'nhom_quyen' => 'bac_si'],
			self::CHI_DINH_DELETE->value => ['ten_quyen' => 'Xoa chi dinh', 'mo_ta' => 'Xoa chi dinh.', 'nhom_quyen' => 'bac_si'],
			self::CHI_DINH_TRANG_THAI->value => ['ten_quyen' => 'Cap nhat trang thai chi dinh', 'mo_ta' => 'Cap nhat trang thai thuc hien chi dinh.', 'nhom_quyen' => 'bac_si'],

			self::DON_THUOC_CREATE->value => ['ten_quyen' => 'Tao don thuoc', 'mo_ta' => 'Tao don thuoc moi.', 'nhom_quyen' => 'bac_si'],
			self::DON_THUOC_READ->value => ['ten_quyen' => 'Xem don thuoc', 'mo_ta' => 'Xem don thuoc.', 'nhom_quyen' => 'bac_si'],
			self::DON_THUOC_UPDATE->value => ['ten_quyen' => 'Cap nhat don thuoc', 'mo_ta' => 'Cap nhat don thuoc.', 'nhom_quyen' => 'bac_si'],
			self::DON_THUOC_DELETE->value => ['ten_quyen' => 'Xoa don thuoc', 'mo_ta' => 'Xoa don thuoc.', 'nhom_quyen' => 'bac_si'],

			self::TAI_LIEU_HO_SO_CREATE->value => ['ten_quyen' => 'Tao tai lieu ho so', 'mo_ta' => 'Tao tai lieu ho so kham benh.', 'nhom_quyen' => 'bac_si'],
			self::TAI_LIEU_HO_SO_READ->value => ['ten_quyen' => 'Xem tai lieu ho so', 'mo_ta' => 'Xem tai lieu ho so kham benh.', 'nhom_quyen' => 'bac_si'],
			self::TAI_LIEU_HO_SO_UPDATE->value => ['ten_quyen' => 'Cap nhat tai lieu ho so', 'mo_ta' => 'Cap nhat thong tin tai lieu ho so.', 'nhom_quyen' => 'bac_si'],
			self::TAI_LIEU_HO_SO_DELETE->value => ['ten_quyen' => 'Xoa tai lieu ho so', 'mo_ta' => 'Xoa tai lieu ho so.', 'nhom_quyen' => 'bac_si'],
			self::TAI_LIEU_HO_SO_UPDATE_FILE->value => ['ten_quyen' => 'Cap nhat file tai lieu ho so', 'mo_ta' => 'Cap nhat file tai lieu ho so tren Cloudinary.', 'nhom_quyen' => 'bac_si'],
			self::TAI_LIEU_HO_SO_READ_FILE->value => ['ten_quyen' => 'Xem file tai lieu ho so', 'mo_ta' => 'Xem file tai lieu ho so.', 'nhom_quyen' => 'bac_si'],
			self::TAI_LIEU_HO_SO_DELETE_FILE->value => ['ten_quyen' => 'Xoa file tai lieu ho so', 'mo_ta' => 'Xoa file tai lieu ho so.', 'nhom_quyen' => 'bac_si'],

			self::NGHIEP_VU_DAT_LICH->value => ['ten_quyen' => 'Nghiep vu dat lich', 'mo_ta' => 'Thao tac nghiep vu dat lich kham.', 'nhom_quyen' => 'nguoi_dung'],
			self::NGHIEP_VU_KHAM_BENH->value => ['ten_quyen' => 'Nghiep vu kham benh', 'mo_ta' => 'Thao tac nghiep vu kham benh.', 'nhom_quyen' => 'bac_si'],
			self::NGHIEP_VU_QUAN_LY_LICH_HEN->value => ['ten_quyen' => 'Nghiep vu quan ly lich hen', 'mo_ta' => 'Thao tac nghiep vu quan ly lich hen.', 'nhom_quyen' => 'le_tan'],
		];
	}
}
