# Yêu cầu phi chức năng

## Hiệu năng
- NFR-01: 95% request API phản hồi < 1000ms trong môi trường local demo.
- NFR-02: Danh sách có phân trang, mặc định `per_page=20`, tối đa 100.

## Bảo mật
- NFR-03: API bảo vệ bằng Bearer token.
- NFR-04: RBAC bắt buộc cho endpoint nghiệp vụ theo vai trò.
- NFR-05: Mật khẩu lưu dưới dạng hash, không lưu plain-text.
- NFR-06: Nhân viên không được truy cập tài liệu hồ sơ bệnh án.

## Toàn vẹn dữ liệu
- NFR-07: Dùng khóa ngoại và unique key theo thiết kế schema.
- NFR-08: Trạng thái lịch hẹn/khung giờ phải đồng bộ theo trigger hoặc service transaction.
- NFR-09: Các enum nghiệp vụ phải đồng nhất giữa DB, API, FE.

## Khả dụng và trải nghiệm
- NFR-10: Giao diện tiếng Việt, dễ hiểu cho người không chuyên kỹ thuật.
- NFR-11: Responsive: mobile-first cho bệnh nhân, desktop-first cho staff/doctor/admin.
- NFR-12: Thao tác nguy hiểm cần xác nhận (hủy lịch, xóa bản ghi quan trọng).

## Bảo trì
- NFR-13: Cấu trúc thư mục theo domain để dễ phân công nhóm.
- NFR-14: Tài liệu `docs/` là nguồn tham chiếu chính khi code review.
- NFR-15: Mọi thay đổi nghiệp vụ quan trọng phải cập nhật tài liệu liên quan trước hoặc cùng PR.

## Kiểm thử và chất lượng
- NFR-16: Có test plan, test cases và UAT checklist.
- NFR-17: Lỗi API phải trả về chuẩn thống nhất (`error.code`, `message`, `trace_id`).
- NFR-18: Tối thiểu bao phủ luồng chính: đăng nhập, đặt lịch, check-in, phiếu khám, hủy/đổi lịch.
