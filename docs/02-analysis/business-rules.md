# Business Rules

## BR-01: Quy tắc lịch hẹn
- Một lịch hẹn gắn với đúng một bệnh nhân, một bác sĩ, một chuyên khoa, một khung giờ.
- Một khung giờ chỉ phục vụ tối đa một lịch hẹn tại một thời điểm.
- Trạng thái lịch hẹn hợp lệ: `dang_cho`, `da_thanh_toan`, `da_xac_nhan`, `da_hoan_tat`, `da_huy`, `khong_den`.

## BR-02: Quy tắc chọn dịch vụ/gói khám
- Lịch hẹn phải có ít nhất một item.
- Mỗi item chỉ được chọn `dich_vu_id` hoặc `goi_kham_id`.
- `so_luong` mặc định 1 và phải > 0.

## BR-03: Quy tắc hủy/đổi lịch
- Tuân thủ cấu hình `THOI_GIAN_HUY_TOI_THIEU` và `THOI_GIAN_DOI_TOI_THIEU`.
- Tuân thủ giới hạn `SO_NGAY_DAT_TRUOC_TOI_DA`.
- Quá thời hạn thì chặn thao tác và trả thông báo rõ ràng.

## BR-04: Quy tắc ngày nghỉ
- Ngày nghỉ lễ hoặc ngày bác sĩ nghỉ: không cho đặt lịch.
- Slot khóa (`khoa`) không được chọn đặt lịch.

## BR-05: Quy tắc check-in
- Check-in chỉ áp dụng với lịch hẹn hợp lệ trong ngày.
- Check-in lần đầu tạo `phieu_kham` ở trạng thái `tiep_nhan`.

## BR-06: Quy tắc hồ sơ bệnh án
- Bác sĩ quản lý tài liệu thuộc phiếu khám của mình.
- Bệnh nhân chỉ xem/tải tài liệu của bản thân.
- Nhân viên không có quyền truy cập nhóm tài liệu hồ sơ bệnh án.

## BR-07: Quy tắc phân quyền
- Endpoint nghiệp vụ bắt buộc kiểm tra role + permission.
- Chức năng quản trị chỉ cho ADMIN.

## BR-08: Quy tắc mã hóa dữ liệu
- Mã nghiệp vụ (`ma_lich_hen`, `ma_phieu_kham`, `ma_benh_nhan`) phải duy nhất.
- Dữ liệu tham chiếu chéo phải qua khóa ngoại và transaction khi cập nhật trạng thái.
