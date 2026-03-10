# Wireframes (mô tả cấu trúc màn hình)

## Nguyên tắc chung
- Bệnh nhân: mobile-first.
- Staff/Doctor/Admin: desktop-first.
- Mọi form có trạng thái: mặc định, loading, lỗi, disabled.

## Màn hình chính cần có

## 1) Đăng nhập
- Khối form giữa màn hình.
- Trường: email, mật khẩu, ghi nhớ.
- CTA chính: Đăng nhập.

## 2) Đăng ký bệnh nhân
- Form nhiều trường, chia 1 cột mobile, 2 cột desktop.
- CTA chính: Tạo tài khoản.

## 3) Đặt lịch 4 bước
- B1: Chọn chuyên khoa/bác sĩ.
- B2: Chọn ngày khám.
- B3: Chọn khung giờ.
- B4: Chọn dịch vụ/gói khám + ghi chú.
- Màn xác nhận cuối hiển thị tóm tắt.

## 4) Danh sách lịch hẹn
- Mobile: card list.
- Desktop: table + filter.
- Hành động: Xem, Đổi lịch, Hủy lịch.

## 5) Check-in
- Thanh tìm kiếm mã lịch/SĐT.
- Panel thông tin bệnh nhân.
- Nút xác nhận check-in.

## 6) Phiếu khám
- Cột trái: thông tin bệnh nhân.
- Cột phải: form khám, chẩn đoán, ICD10.
- Nút: Lưu tạm, Hoàn tất khám.

## 7) Admin CRUD
- Header + nút Thêm mới.
- Filter bar.
- Bảng dữ liệu + phân trang.
- Drawer tạo/sửa.
