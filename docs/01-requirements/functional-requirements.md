# Yêu cầu chức năng

## Nhóm xác thực và tài khoản
- FR-01: Người dùng đăng nhập bằng email/mật khẩu.
- FR-02: Bệnh nhân đăng ký tài khoản mới.
- FR-03: Người dùng cập nhật hồ sơ cá nhân.
- FR-04: Người dùng đổi mật khẩu.

## Nhóm bệnh nhân
- FR-05: Bệnh nhân xem chuyên khoa, bác sĩ, dịch vụ, gói khám.
- FR-06: Bệnh nhân xem khung giờ trống theo bác sĩ/ngày.
- FR-07: Bệnh nhân đặt lịch với 1 khung giờ và >= 1 mục dịch vụ/gói khám.
- FR-08: Bệnh nhân xem lịch sử lịch hẹn.
- FR-09: Bệnh nhân đổi lịch theo quy định thời gian.
- FR-10: Bệnh nhân hủy lịch theo quy định thời gian.
- FR-11: Bệnh nhân xem/tải tài liệu hồ sơ bệnh án của chính mình.

## Nhóm nhân viên/lễ tân
- FR-12: Nhân viên tạo bệnh nhân walk-in.
- FR-13: Nhân viên đặt lịch hộ bệnh nhân.
- FR-14: Nhân viên tra cứu lịch hẹn theo ngày/bác sĩ/trạng thái.
- FR-15: Nhân viên check-in bệnh nhân và ghi nhận giờ đến thực tế.

## Nhóm bác sĩ
- FR-16: Bác sĩ xem lịch làm việc và danh sách lịch hẹn theo ngày.
- FR-17: Bác sĩ cập nhật phiếu khám và chẩn đoán.
- FR-18: Bác sĩ tạo/cập nhật chỉ định dịch vụ.
- FR-19: Bác sĩ kê đơn thuốc.
- FR-20: Bác sĩ quản lý tài liệu hồ sơ bệnh án cho ca khám phụ trách.

## Nhóm admin
- FR-21: Admin quản lý người dùng, vai trò, quyền.
- FR-22: Admin quản lý chuyên khoa, phòng khám, bác sĩ.
- FR-23: Admin quản lý dịch vụ, gói khám, ca làm việc.
- FR-24: Admin cấu hình tham số hệ thống (hủy/đổi lịch, số ngày đặt trước).
- FR-25: Admin xem báo cáo và nhật ký hoạt động.

## Ràng buộc nghiệp vụ bắt buộc
- FR-26: Mỗi item trong `dich_vu_lich_hen` chỉ có `dich_vu_id` hoặc `goi_kham_id`.
- FR-27: Tạo lịch hẹn thành công thì `khung_gio_kham` chuyển `da_dat`.
- FR-28: Hủy lịch thành công thì `khung_gio_kham` mở lại `trong`.
- FR-29: Check-in lần đầu tạo `phieu_kham` trạng thái `tiep_nhan` nếu chưa có.
