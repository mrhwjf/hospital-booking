# Use Cases chính

## UC-01: Đặt lịch khám
- Tác nhân: Bệnh nhân, Nhân viên.
- Tiền điều kiện:
  - Bệnh nhân tồn tại.
  - Bác sĩ có lịch làm việc hợp lệ.
  - Khung giờ ở trạng thái `trong`.
  - Chọn ít nhất 1 mục dịch vụ/gói khám.
- Hậu điều kiện:
  - Tạo `lich_hen` và `dich_vu_lich_hen`.
  - Khung giờ chuyển `da_dat`.

## UC-02: Hủy lịch hẹn
- Tác nhân: Bệnh nhân, Nhân viên.
- Tiền điều kiện:
  - Lịch chưa hoàn tất/chưa hủy.
  - Còn trong thời gian được phép hủy.
- Hậu điều kiện:
  - `lich_hen.trang_thai = da_huy`.
  - `khung_gio_kham.trang_thai = trong`.

## UC-03: Đổi lịch hẹn
- Tác nhân: Bệnh nhân, Nhân viên.
- Tiền điều kiện:
  - Còn trong thời gian được phép đổi.
  - Khung giờ mới hợp lệ và còn trống.
- Hậu điều kiện:
  - Cập nhật khung giờ/ngày hẹn.
  - Mở khung cũ, khóa khung mới.

## UC-04: Check-in bệnh nhân
- Tác nhân: Nhân viên, Bác sĩ (nếu được phân quyền).
- Tiền điều kiện: Có lịch hẹn hợp lệ trong ngày.
- Hậu điều kiện:
  - Ghi `gio_den_thuc_te`.
  - Tạo `phieu_kham` trạng thái `tiep_nhan` nếu chưa có.

## UC-05: Khám bệnh và kê đơn
- Tác nhân: Bác sĩ.
- Tiền điều kiện: Có phiếu khám thuộc ca khám phụ trách.
- Hậu điều kiện:
  - Cập nhật chẩn đoán/ICD10.
  - Tạo chỉ định và đơn thuốc (nếu có).
  - Hoàn tất phiếu khám.

## UC-06: Quản lý tài liệu hồ sơ bệnh án
- Tác nhân: Bác sĩ, Bệnh nhân.
- Tiền điều kiện:
  - Bác sĩ chỉ thao tác trên ca khám phụ trách.
  - Bệnh nhân chỉ xem tài liệu của chính mình.
- Hậu điều kiện: Tài liệu được lưu và truy xuất đúng phân quyền.

## UC-07: Quản trị danh mục và phân quyền
- Tác nhân: Admin.
- Tiền điều kiện: Tài khoản admin hợp lệ.
- Hậu điều kiện: Danh mục, vai trò và quyền được cập nhật nhất quán.
