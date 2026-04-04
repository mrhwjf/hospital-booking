<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class QuyenSeeder extends Seeder
{
    public function run(): void
    {
        $quyen = [
            ['ma_quyen' => 'quan_tri:nguoi_dung', 'ten_quyen' => 'Quản trị người dùng', 'mo_ta' => 'Quản lý tài khoản người dùng.', 'nhom_quyen' => 'quan_tri'],
            ['ma_quyen' => 'quan_tri:vai_tro', 'ten_quyen' => 'Quản trị vai trò', 'mo_ta' => 'Quản lý vai trò và quyền hệ thống.', 'nhom_quyen' => 'quan_tri'],
            ['ma_quyen' => 'quan_tri:cau_hinh', 'ten_quyen' => 'Quản trị cấu hình', 'mo_ta' => 'Quản lý cấu hình hệ thống.', 'nhom_quyen' => 'quan_tri'],
            ['ma_quyen' => 'quan_tri:bao_cao', 'ten_quyen' => 'Quản trị báo cáo', 'mo_ta' => 'Xem báo cáo và thống kê hệ thống.', 'nhom_quyen' => 'quan_tri'],
            ['ma_quyen' => 'quan_tri:lich_lam_viec', 'ten_quyen' => 'Quản trị lịch làm việc', 'mo_ta' => 'Quản lý lịch làm việc bác sĩ.', 'nhom_quyen' => 'quan_tri'],
            ['ma_quyen' => 'quan_tri:ho_so_nhan_vien', 'ten_quyen' => 'Quản trị hồ sơ nhân viên', 'mo_ta' => 'Quản lý hồ sơ nhân viên và bác sĩ.', 'nhom_quyen' => 'quan_tri'],

            ['ma_quyen' => 'nguoi_dung:read', 'ten_quyen' => 'Xem tài khoản', 'mo_ta' => 'Xem thông tin tài khoản người dùng.', 'nhom_quyen' => 'khac'],
            ['ma_quyen' => 'nguoi_dung:change_password', 'ten_quyen' => 'Đổi mật khẩu', 'mo_ta' => 'Cập nhật mật khẩu tài khoản.', 'nhom_quyen' => 'khac'],
            ['ma_quyen' => 'nguoi_dung:change_email', 'ten_quyen' => 'Đổi email', 'mo_ta' => 'Cập nhật email tài khoản.', 'nhom_quyen' => 'khac'],
            ['ma_quyen' => 'nguoi_dung:avatar', 'ten_quyen' => 'Cập nhật avatar', 'mo_ta' => 'Cập nhật ảnh đại diện.', 'nhom_quyen' => 'khac'],
            ['ma_quyen' => 'nguoi_dung:vai_tro', 'ten_quyen' => 'Gán vai trò người dùng', 'mo_ta' => 'Gán vai trò cho tài khoản.', 'nhom_quyen' => 'quan_tri'],
            ['ma_quyen' => 'nguoi_dung:trang_thai', 'ten_quyen' => 'Cập nhật trạng thái người dùng', 'mo_ta' => 'Khóa/mở trạng thái tài khoản.', 'nhom_quyen' => 'quan_tri'],

            ['ma_quyen' => 'benh_nhan:create', 'ten_quyen' => 'Tạo bệnh nhân', 'mo_ta' => 'Tạo hồ sơ bệnh nhân.', 'nhom_quyen' => 'nguoi_dung'],
            ['ma_quyen' => 'benh_nhan:read', 'ten_quyen' => 'Xem bệnh nhân', 'mo_ta' => 'Xem hồ sơ bệnh nhân.', 'nhom_quyen' => 'nguoi_dung'],
            ['ma_quyen' => 'benh_nhan:update', 'ten_quyen' => 'Cập nhật bệnh nhân', 'mo_ta' => 'Cập nhật hồ sơ bệnh nhân.', 'nhom_quyen' => 'nguoi_dung'],
            ['ma_quyen' => 'benh_nhan:delete', 'ten_quyen' => 'Xóa bệnh nhân', 'mo_ta' => 'Xóa hồ sơ bệnh nhân.', 'nhom_quyen' => 'nguoi_dung'],

            ['ma_quyen' => 'bac_si:read', 'ten_quyen' => 'Xem bác sĩ', 'mo_ta' => 'Xem danh sách và thông tin bác sĩ.', 'nhom_quyen' => 'khac'],
            ['ma_quyen' => 'nhan_vien:read', 'ten_quyen' => 'Xem nhân viên', 'mo_ta' => 'Xem thông tin nhân viên.', 'nhom_quyen' => 'khac'],

            ['ma_quyen' => 'ngay_nghi_le:read', 'ten_quyen' => 'Xem ngày nghỉ lễ', 'mo_ta' => 'Xem danh sách ngày nghỉ lễ.', 'nhom_quyen' => 'khac'],
            ['ma_quyen' => 'bac_si_nghi:read', 'ten_quyen' => 'Xem lịch nghỉ bác sĩ', 'mo_ta' => 'Xem lịch nghỉ của bác sĩ.', 'nhom_quyen' => 'khac'],
            ['ma_quyen' => 'lich_lam_viec:read', 'ten_quyen' => 'Xem mẫu lịch làm việc', 'mo_ta' => 'Xem mẫu lịch làm việc.', 'nhom_quyen' => 'khac'],
            ['ma_quyen' => 'lich_lam_viec_bac_si:read', 'ten_quyen' => 'Xem lịch làm việc bác sĩ', 'mo_ta' => 'Xem lịch làm việc được phân công.', 'nhom_quyen' => 'khac'],

            ['ma_quyen' => 'lich_hen:create', 'ten_quyen' => 'Tạo lịch hẹn', 'mo_ta' => 'Tạo lịch hẹn khám.', 'nhom_quyen' => 'le_tan'],
            ['ma_quyen' => 'lich_hen:read', 'ten_quyen' => 'Xem lịch hẹn', 'mo_ta' => 'Xem danh sách lịch hẹn.', 'nhom_quyen' => 'le_tan'],
            ['ma_quyen' => 'lich_hen:update', 'ten_quyen' => 'Cập nhật lịch hẹn', 'mo_ta' => 'Cập nhật thông tin lịch hẹn.', 'nhom_quyen' => 'le_tan'],
            ['ma_quyen' => 'lich_hen:delete', 'ten_quyen' => 'Xóa lịch hẹn', 'mo_ta' => 'Xóa lịch hẹn.', 'nhom_quyen' => 'le_tan'],
            ['ma_quyen' => 'lich_hen:dat_lich', 'ten_quyen' => 'Đặt lịch khám', 'mo_ta' => 'Đặt lịch khám cho bệnh nhân.', 'nhom_quyen' => 'le_tan'],
            ['ma_quyen' => 'lich_hen:huy_lich', 'ten_quyen' => 'Hủy lịch khám', 'mo_ta' => 'Hủy lịch hẹn khám.', 'nhom_quyen' => 'le_tan'],
            ['ma_quyen' => 'lich_hen:sua_lich', 'ten_quyen' => 'Sửa lịch khám', 'mo_ta' => 'Đổi lịch hẹn khám.', 'nhom_quyen' => 'le_tan'],
            ['ma_quyen' => 'lich_hen:lich_su', 'ten_quyen' => 'Xem lịch sử lịch hẹn', 'mo_ta' => 'Xem lịch sử thay đổi lịch hẹn.', 'nhom_quyen' => 'le_tan'],
            ['ma_quyen' => 'lich_hen:checkin', 'ten_quyen' => 'Check-in lịch hẹn', 'mo_ta' => 'Tiếp nhận bệnh nhân đến khám.', 'nhom_quyen' => 'le_tan'],

            ['ma_quyen' => 'phieu_kham:create', 'ten_quyen' => 'Tạo phiếu khám', 'mo_ta' => 'Tạo phiếu khám mới.', 'nhom_quyen' => 'bac_si'],
            ['ma_quyen' => 'phieu_kham:read', 'ten_quyen' => 'Xem phiếu khám', 'mo_ta' => 'Xem thông tin phiếu khám.', 'nhom_quyen' => 'bac_si'],
            ['ma_quyen' => 'phieu_kham:update', 'ten_quyen' => 'Cập nhật phiếu khám', 'mo_ta' => 'Cập nhật kết quả khám.', 'nhom_quyen' => 'bac_si'],
            ['ma_quyen' => 'phieu_kham:delete', 'ten_quyen' => 'Xóa phiếu khám', 'mo_ta' => 'Xóa phiếu khám.', 'nhom_quyen' => 'bac_si'],
            ['ma_quyen' => 'phieu_kham:trang_thai', 'ten_quyen' => 'Cập nhật trạng thái phiếu khám', 'mo_ta' => 'Cập nhật trạng thái khám bệnh.', 'nhom_quyen' => 'bac_si'],

            ['ma_quyen' => 'chi_dinh:create', 'ten_quyen' => 'Tạo chỉ định', 'mo_ta' => 'Tạo chỉ định dịch vụ/gói khám.', 'nhom_quyen' => 'bac_si'],
            ['ma_quyen' => 'chi_dinh:read', 'ten_quyen' => 'Xem chỉ định', 'mo_ta' => 'Xem danh sách chỉ định.', 'nhom_quyen' => 'bac_si'],
            ['ma_quyen' => 'chi_dinh:update', 'ten_quyen' => 'Cập nhật chỉ định', 'mo_ta' => 'Cập nhật chỉ định.', 'nhom_quyen' => 'bac_si'],
            ['ma_quyen' => 'chi_dinh:delete', 'ten_quyen' => 'Xóa chỉ định', 'mo_ta' => 'Xóa chỉ định.', 'nhom_quyen' => 'bac_si'],
            ['ma_quyen' => 'chi_dinh:trang_thai', 'ten_quyen' => 'Cập nhật trạng thái chỉ định', 'mo_ta' => 'Cập nhật trạng thái thực hiện chỉ định.', 'nhom_quyen' => 'bac_si'],

            ['ma_quyen' => 'don_thuoc:create', 'ten_quyen' => 'Tạo đơn thuốc', 'mo_ta' => 'Tạo đơn thuốc mới.', 'nhom_quyen' => 'bac_si'],
            ['ma_quyen' => 'don_thuoc:read', 'ten_quyen' => 'Xem đơn thuốc', 'mo_ta' => 'Xem đơn thuốc.', 'nhom_quyen' => 'bac_si'],
            ['ma_quyen' => 'don_thuoc:update', 'ten_quyen' => 'Cập nhật đơn thuốc', 'mo_ta' => 'Cập nhật đơn thuốc.', 'nhom_quyen' => 'bac_si'],
            ['ma_quyen' => 'don_thuoc:delete', 'ten_quyen' => 'Xóa đơn thuốc', 'mo_ta' => 'Xóa đơn thuốc.', 'nhom_quyen' => 'bac_si'],

            ['ma_quyen' => 'tai_lieu_ho_so:create', 'ten_quyen' => 'Tạo tài liệu hồ sơ', 'mo_ta' => 'Tạo tài liệu hồ sơ khám bệnh.', 'nhom_quyen' => 'bac_si'],
            ['ma_quyen' => 'tai_lieu_ho_so:read', 'ten_quyen' => 'Xem tài liệu hồ sơ', 'mo_ta' => 'Xem tài liệu hồ sơ khám bệnh.', 'nhom_quyen' => 'bac_si'],
            ['ma_quyen' => 'tai_lieu_ho_so:update', 'ten_quyen' => 'Cập nhật tài liệu hồ sơ', 'mo_ta' => 'Cập nhật thông tin tài liệu hồ sơ.', 'nhom_quyen' => 'bac_si'],
            ['ma_quyen' => 'tai_lieu_ho_so:delete', 'ten_quyen' => 'Xóa tài liệu hồ sơ', 'mo_ta' => 'Xóa tài liệu hồ sơ.', 'nhom_quyen' => 'bac_si'],
            ['ma_quyen' => 'tai_lieu_ho_so:update_file', 'ten_quyen' => 'Cập nhật file tài liệu hồ sơ', 'mo_ta' => 'Cập nhật file tài liệu hồ sơ trên Cloudinary.', 'nhom_quyen' => 'bac_si'],
            ['ma_quyen' => 'tai_lieu_ho_so:read_file', 'ten_quyen' => 'Xem file tài liệu hồ sơ', 'mo_ta' => 'Xem file tài liệu hồ sơ.', 'nhom_quyen' => 'bac_si'],
            ['ma_quyen' => 'tai_lieu_ho_so:delete_file', 'ten_quyen' => 'Xóa file tài liệu hồ sơ', 'mo_ta' => 'Xóa file tài liệu hồ sơ.', 'nhom_quyen' => 'bac_si'],

            ['ma_quyen' => 'nghiep_vu:dat_lich', 'ten_quyen' => 'Nghiệp vụ đặt lịch', 'mo_ta' => 'Thao tác nghiệp vụ đặt lịch khám.', 'nhom_quyen' => 'nguoi_dung'],
            ['ma_quyen' => 'nghiep_vu:kham_benh', 'ten_quyen' => 'Nghiệp vụ khám bệnh', 'mo_ta' => 'Thao tác nghiệp vụ khám bệnh.', 'nhom_quyen' => 'bac_si'],
            ['ma_quyen' => 'nghiep_vu:quan_ly_lich_hen', 'ten_quyen' => 'Nghiệp vụ quản lý lịch hẹn', 'mo_ta' => 'Thao tác nghiệp vụ quản lý lịch hẹn.', 'nhom_quyen' => 'le_tan'],
        ];

        $rows = array_map(function (array $item) {
            $item['created_at'] = now();

            return $item;
        }, $quyen);

        // Remove legacy permission codes from previous schema versions (e.g. QUAN_LY_*).
        DB::table('quyen')
            ->where('ma_quyen', 'not like', '%:%')
            ->delete();

        DB::table('quyen')->upsert($rows, ['ma_quyen'], ['ten_quyen', 'mo_ta', 'nhom_quyen']);
    }
}