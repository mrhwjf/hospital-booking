# Workflow diagrams (mô tả văn bản)

## 1) Luồng đặt lịch khám
1. Người dùng chọn chuyên khoa và bác sĩ.
2. Chọn ngày khám.
3. Hệ thống trả khung giờ trống.
4. Người dùng chọn khung giờ.
5. Người dùng chọn >= 1 dịch vụ/gói khám.
6. Xác nhận đặt lịch.
7. Hệ thống tạo lịch hẹn và khóa slot.

## 2) Luồng đổi lịch
1. Chọn lịch hẹn cần đổi.
2. Chọn ngày/slot mới.
3. Hệ thống kiểm tra quy định thời gian.
4. Cập nhật lịch hẹn, mở slot cũ, khóa slot mới.

## 3) Luồng hủy lịch
1. Chọn lịch hẹn cần hủy.
2. Chọn lý do hủy.
3. Hệ thống kiểm tra điều kiện hủy.
4. Cập nhật trạng thái `da_huy` và mở lại slot.

## 4) Luồng check-in
1. Nhân viên tra cứu lịch hẹn trong ngày.
2. Xác nhận danh tính bệnh nhân.
3. Ghi giờ đến thực tế.
4. Tạo phiếu khám nếu chưa có.

## 5) Luồng khám bệnh
1. Bác sĩ mở danh sách bệnh nhân theo ngày.
2. Mở phiếu khám tương ứng.
3. Nhập triệu chứng, kết quả khám, chẩn đoán.
4. Tạo chỉ định/kê đơn nếu cần.
5. Hoàn tất phiếu khám.

## 6) Luồng truy cập tài liệu hồ sơ bệnh án
1. Bác sĩ tải tài liệu lên theo phiếu khám.
2. Hệ thống lưu metadata + URL file.
3. Bệnh nhân đăng nhập và chỉ xem tài liệu của chính mình.
4. Nếu sai quyền thì trả 403.
