# Phân loại biểu mẫu

## Loại biểu mẫu

| Loại biểu mẫu | Ghi chú |
|---------------|---------|
| **CRUD** | Biểu mẫu dùng để tạo (Create), xem (Read), cập nhật (Update), xóa (Delete) dữ liệu.<br><br>Thường áp dụng cho các dữ liệu nền tảng như: tài khoản người dùng, bác sĩ, khoa, dịch vụ y tế, ca khám, lịch làm việc. Chủ yếu phục vụ Admin, Nhân viên y tế, đôi khi là Bác sĩ. |
| **Transaction** | Biểu mẫu phục vụ nghiệp vụ phát sinh theo luồng xử lý, không chỉ đơn thuần là CRUD.<br><br>Ví dụ: đặt lịch khám, xác nhận lịch hẹn, hủy/đổi lịch, tiếp nhận bệnh nhân, hoàn tất ca khám. Thường có ràng buộc trạng thái, thời gian, quy tắc nghiệp vụ. Phục vụ Bệnh nhân, Nhân viên lễ tân, Bác sĩ. |
| **Report** | Biểu mẫu dùng để tổng hợp, thống kê, phân tích dữ liệu. Chỉ đọc dữ liệu (Read-only), không thay đổi dữ liệu gốc.<br><br>Ví dụ: báo cáo số lượng ca khám theo ngày/tháng, danh sách bệnh nhân đã khám, hiệu suất bác sĩ, lịch sử đặt lịch. Thường có bộ lọc (thời gian, bác sĩ, khoa) và chức năng xuất file (PDF/Excel). |

## Danh sách biểu mẫu của đồ án

| STT | Tên biểu mẫu (Form Name) | Đối tượng sử dụng | Loại form | Ngữ cảnh sử dụng | Ghi chú |
|-----|-------------------------|-------------------|-----------|------------------|---------|
| 1 | Biểu mẫu Đăng ký Bệnh nhân | Bệnh nhân | CRUD | Đăng ký tài khoản mới | Tạo hồ sơ bệnh nhân |
| 2 | Biểu mẫu Đăng nhập Bệnh nhân | Bệnh nhân | Transaction | Đăng nhập hệ thống | Xác thực người dùng |
| 3 | Biểu mẫu Cập nhật Hồ sơ Bệnh nhân | Bệnh nhân | CRUD | Cập nhật thông tin cá nhân | Không chỉnh sửa ID |
| 4 | Biểu mẫu Đổi Mật khẩu | Bệnh nhân | Transaction | Đổi mật khẩu | Áp dụng cho mọi role |
| 5 | Biểu mẫu Đặt lịch khám | Bệnh nhân | Transaction | Đặt lịch khám | Chọn bác sĩ / khoa / thời gian |
| 6 | Biểu mẫu Thay đổi lịch khám | Bệnh nhân | Transaction | Đổi lịch khám | Trước thời điểm khám |
| 7 | Biểu mẫu Hủy lịch khám | Bệnh nhân | Transaction | Hủy lịch khám | Có điều kiện |
| 8 | Chế độ Xem Lịch sử Khám | Bệnh nhân | Report | Xem lịch sử khám | Read-only |
| 9 | Biểu mẫu Tạo mới Bệnh nhân | Nhân viên / Lễ tân | CRUD | Tạo hồ sơ bệnh nhân | Trường hợp walk-in |
| 10 | Biểu mẫu Cập nhật Bệnh nhân | Nhân viên / Lễ tân | CRUD | Cập nhật hồ sơ bệnh nhân | |
| 11 | Biểu mẫu Tìm kiếm Bệnh nhân | Nhân viên / Lễ tân | Report | Tìm kiếm bệnh nhân | Theo tên / mã |
| 12 | Biểu mẫu Tạo Lịch hẹn | Nhân viên / Lễ tân | Transaction | Đặt lịch hộ bệnh nhân | |
| 13 | Biểu mẫu Cập nhật Lịch hẹn | Nhân viên / Lễ tân | Transaction | Chỉnh sửa lịch khám | |
| 14 | Biểu mẫu Hủy Lịch hẹn | Nhân viên / Lễ tân | Transaction | Hủy lịch | |
| 15 | Lịch hẹn Khám hàng ngày | Nhân viên / Lễ tân | Report | Xem lịch theo ngày | Theo bác sĩ |
| 16 | Biểu mẫu Check-in Bệnh nhân | Nhân viên / Lễ tân | Transaction | Xác nhận bệnh nhân đến | Cập nhật trạng thái |
| 17 | Thiết lập Thời gian làm việc | Bác sĩ | CRUD | Khai báo lịch làm việc | Giờ khám |
| 18 | Xem Lịch làm việc | Bác sĩ | Report | Xem lịch khám | Theo ngày |
| 19 | Xem Chi tiết Lịch hẹn | Bác sĩ | Report | Xem chi tiết lịch hẹn | Read-only |
| 20 | Phiếu Khám bệnh | Bác sĩ | Transaction | Khám bệnh | Ghi nhận kết quả |
| 21 | Phiếu Chỉ định dịch vụ | Bác sĩ | Transaction | Chỉ định dịch vụ | Tạo các dòng `chi_dinh` |
| 22 | Biểu mẫu Chẩn đoán & Ghi chú | Bác sĩ | CRUD | Ghi chẩn đoán | |
| 23 | Biểu mẫu Kê đơn thuốc | Bác sĩ | Transaction | Kê đơn thuốc | |
| 24 | Xem Tiền sử Bệnh lý | Bác sĩ | Report | Xem tiền sử bệnh | |
| 25 | Quản lý Tài khoản Nhân viên | Admin | CRUD | Quản lý nhân viên | |
| 26 | Quản lý Tài khoản Bác sĩ | Admin | CRUD | Quản lý bác sĩ | |
| 27 | Biểu mẫu Vai trò & Quyền | Admin | CRUD | Phân quyền hệ thống | RBAC |
| 28 | Biểu mẫu Quản lý Chuyên khoa | Admin | CRUD | Quản lý khoa | |
| 29 | Biểu mẫu Quản lý Dịch vụ | Admin | CRUD | Quản lý dịch vụ khám | |
| 30 | Phân bổ Bác sĩ – Chuyên khoa | Admin | Transaction | Gán bác sĩ vào khoa | |
| 31 | Biểu mẫu Quản lý Phòng | Admin | CRUD | Quản lý phòng khám | |
| 32 | Xem Nhật ký Hoạt động | Admin | Report | Theo dõi hoạt động | Read-only |
| 33 | Báo cáo Thống kê Lịch hẹn | Admin | Report | Thống kê lịch khám | |
| 34 | Báo cáo Tải công việc Bác sĩ | Admin | Report | Thống kê tải bác sĩ | |
| 35 | Chế độ Xem Tài liệu Hồ sơ bệnh án | Bệnh nhân | Report | Xem/tải tài liệu của chính mình | Không cho phép chỉnh sửa |
| 36 | Biểu mẫu Quản lý Tài liệu Hồ sơ bệnh án | Bác sĩ | Transaction | Tải lên/cập nhật metadata tài liệu | Gắn theo `phieu_kham` |

---

# Chi tiết cấu trúc từng biểu mẫu

## Nhóm 1: Biểu mẫu dành cho Bệnh nhân

### 1. Biểu mẫu Đăng ký Bệnh nhân

**Mô tả:** Cho phép bệnh nhân tạo tài khoản mới để sử dụng hệ thống đặt lịch khám.

| Tên trường | Ý nghĩa | Kiểu nhập liệu | Ràng buộc / Validation |
|------------|---------|----------------|------------------------|
| `ho_ten` | Họ và tên đầy đủ | Text | Bắt buộc, 2-100 ký tự, chỉ chữ cái và khoảng trắng |
| `email` | Địa chỉ email | Email | Bắt buộc, định dạng email hợp lệ, duy nhất trong hệ thống |
| `mat_khau` | Mật khẩu đăng nhập | Password | Bắt buộc, tối thiểu 8 ký tự, có chữ hoa, chữ thường và số |
| `xac_nhan_mat_khau` | Xác nhận mật khẩu | Password | Bắt buộc, phải trùng với `mat_khau` |
| `so_dien_thoai` | Số điện thoại liên hệ | Tel | Bắt buộc, 10-11 số, bắt đầu bằng 0 |
| `ngay_sinh` | Ngày tháng năm sinh | Date | Bắt buộc, không được lớn hơn ngày hiện tại, tuổi >= 0 |
| `gioi_tinh` | Giới tính | Select | Bắt buộc, giá trị: Nam / Nữ / Khác |
| `dia_chi` | Địa chỉ thường trú | Textarea | Tùy chọn, tối đa 255 ký tự |
| `so_cccd` | Số CCCD | Text | Tùy chọn, 12 số, duy nhất (nếu có) |
| `nhom_mau` | Nhóm máu | Select | Tùy chọn: A+/A-/B+/B-/AB+/AB-/O+/O- |

---

### 2. Biểu mẫu Đăng nhập Bệnh nhân

**Mô tả:** Xác thực người dùng để truy cập vào hệ thống.

| Tên trường | Ý nghĩa | Kiểu nhập liệu | Ràng buộc / Validation |
|------------|---------|----------------|------------------------|
| `email` | Email đăng ký | Email | Bắt buộc, định dạng email hợp lệ |
| `mat_khau` | Mật khẩu | Password | Bắt buộc |
| `ghi_nho` | Ghi nhớ đăng nhập | Checkbox | Tùy chọn, mặc định: không chọn |

---

### 3. Biểu mẫu Cập nhật Hồ sơ Bệnh nhân

**Mô tả:** Cho phép bệnh nhân chỉnh sửa thông tin cá nhân đã đăng ký.

| Tên trường | Ý nghĩa | Kiểu nhập liệu | Ràng buộc / Validation |
|------------|---------|----------------|------------------------|
| `ma_benh_nhan` | Mã bệnh nhân | Text (readonly) | Chỉ đọc, không cho phép sửa |
| `ho_ten` | Họ và tên | Text | Bắt buộc, 2-100 ký tự |
| `so_dien_thoai` | Số điện thoại | Tel | Bắt buộc, 10-11 số |
| `ngay_sinh` | Ngày sinh | Date | Bắt buộc, không lớn hơn ngày hiện tại |
| `gioi_tinh` | Giới tính | Select | Bắt buộc |
| `dia_chi` | Địa chỉ | Textarea | Tùy chọn, tối đa 255 ký tự |
| `so_cccd` | Số CCCD | Text | Tùy chọn, 12 số, duy nhất (nếu có) |
| `nhom_mau` | Nhóm máu | Select | Tùy chọn: A+/A-/B+/B-/AB+/AB-/O+/O- |
| `tien_su_di_ung` | Tiền sử dị ứng | Textarea | Tùy chọn |
| `tien_su_benh` | Tiền sử bệnh mãn tính | Textarea | Tùy chọn |
| `hinh_anh` | Ảnh đại diện (tài khoản) | File Upload | Tùy chọn, lưu vào `nguoi_dung.hinh_anh`, định dạng JPG/PNG, tối đa 2MB |

---

### 4. Biểu mẫu Đổi Mật khẩu

**Mô tả:** Cho phép người dùng thay đổi mật khẩu đăng nhập (áp dụng cho tất cả vai trò).

| Tên trường | Ý nghĩa | Kiểu nhập liệu | Ràng buộc / Validation |
|------------|---------|----------------|------------------------|
| `mat_khau_cu` | Mật khẩu hiện tại | Password | Bắt buộc, phải đúng với mật khẩu trong hệ thống |
| `mat_khau_moi` | Mật khẩu mới | Password | Bắt buộc, tối thiểu 8 ký tự, có chữ hoa, chữ thường và số |
| `xac_nhan_mat_khau_moi` | Xác nhận mật khẩu mới | Password | Bắt buộc, phải trùng với `mat_khau_moi` |

---

### 5. Biểu mẫu Đặt lịch khám

**Mô tả:** Cho phép bệnh nhân chọn bác sĩ, chuyên khoa và thời gian để đặt lịch khám.

| Tên trường | Ý nghĩa | Kiểu nhập liệu | Ràng buộc / Validation |
|------------|---------|----------------|------------------------|
| `chuyen_khoa` | Chuyên khoa khám | Select | Bắt buộc, chọn từ danh sách chuyên khoa đang hoạt động |
| `bac_si` | Bác sĩ khám | Select | Bắt buộc, lọc theo chuyên khoa đã chọn |
| `ngay_kham` | Ngày muốn khám | Date | Bắt buộc, >= ngày hiện tại, không quá 30 ngày |
| `khung_gio` | Khung giờ khám | Select | Bắt buộc, chỉ hiển thị khung giờ còn trống |
| `dich_vu_ids` | Dịch vụ khám | Multi-select | Tùy chọn, có thể chọn nhiều |
| `goi_kham_ids` | Gói khám | Multi-select | Tùy chọn, có thể chọn nhiều |
| `ly_do_kham` | Lý do / Triệu chứng | Textarea | Tùy chọn, tối đa 500 ký tự |
| `ghi_chu` | Ghi chú thêm | Textarea | Tùy chọn, tối đa 255 ký tự |

**Ràng buộc DB liên quan:** Các dịch vụ/gói khám được lưu trong bảng liên kết `dich_vu_lich_hen`.
Yêu cầu: phải chọn **ít nhất 1** mục (dịch vụ đơn lẻ hoặc gói khám). Với mỗi mục, hệ thống lưu đúng 1 trong 2 cột `dich_vu_id` hoặc `goi_kham_id`.

---

### 6. Biểu mẫu Thay đổi lịch khám

**Mô tả:** Cho phép bệnh nhân đổi ngày/giờ của lịch khám đã đặt.

| Tên trường | Ý nghĩa | Kiểu nhập liệu | Ràng buộc / Validation |
|------------|---------|----------------|------------------------|
| `ma_lich_hen` | Mã lịch hẹn | Text (readonly) | Chỉ đọc |
| `bac_si_hien_tai` | Bác sĩ hiện tại | Text (readonly) | Chỉ đọc |
| `ngay_kham_cu` | Ngày khám cũ | Text (readonly) | Chỉ đọc |
| `gio_kham_cu` | Giờ khám cũ | Text (readonly) | Chỉ đọc |
| `ngay_kham_moi` | Ngày khám mới | Date | Bắt buộc, >= ngày hiện tại + 1 |
| `khung_gio_moi` | Khung giờ mới | Select | Bắt buộc, khung giờ còn trống |
| `bac_si_moi` | Bác sĩ mới | Select | Tùy chọn (nếu cho phép đổi bác sĩ); khi đổi bác sĩ phải chọn lại khung giờ hợp lệ |
| `ly_do_doi` | Lý do đổi lịch | Textarea | Tùy chọn, tối đa 255 ký tự |

**Điều kiện:** Chỉ cho phép đổi lịch trước thời điểm khám tối thiểu `THOI_GIAN_DOI_TOI_THIEU` giờ (mặc định 24, đọc từ `cau_hinh_he_thong`).

---

### 7. Biểu mẫu Hủy lịch khám

**Mô tả:** Cho phép bệnh nhân hủy lịch khám đã đặt.

| Tên trường | Ý nghĩa | Kiểu nhập liệu | Ràng buộc / Validation |
|------------|---------|----------------|------------------------|
| `ma_lich_hen` | Mã lịch hẹn | Text (readonly) | Chỉ đọc |
| `thong_tin_lich` | Thông tin lịch hẹn | Display | Hiển thị: bác sĩ, ngày, giờ, chuyên khoa |
| `ly_do_huy_id` | Lý do hủy | Select | Bắt buộc, chọn từ danh mục `ly_do_huy` (lọc `loai = 'benh_nhan'`) |
| `ly_do_huy_khac` | Lý do khác | Textarea | Chỉ bắt buộc khi chọn lý do “khác” |
| `xac_nhan_huy` | Xác nhận hủy | Checkbox | Bắt buộc phải tick để xác nhận |

**Điều kiện:** Chỉ cho phép hủy trước thời điểm khám tối thiểu `THOI_GIAN_HUY_TOI_THIEU` giờ (mặc định 12, đọc từ `cau_hinh_he_thong`).

---

### 8. Chế độ Xem Lịch sử Khám

**Mô tả:** Hiển thị danh sách các lần khám đã thực hiện của bệnh nhân (chỉ đọc).

| Tên trường | Ý nghĩa | Kiểu nhập liệu | Ràng buộc / Validation |
|------------|---------|----------------|------------------------|
| `tu_ngay` | Lọc từ ngày | Date | Tùy chọn, <= `den_ngay` |
| `den_ngay` | Lọc đến ngày | Date | Tùy chọn, >= `tu_ngay` |
| `trang_thai` | Lọc theo trạng thái | Select | Tùy chọn: Tất cả / Đang chờ / Đã thanh toán / Đã xác nhận / Đã hoàn tất / Đã hủy / Không đến |

**Các cột hiển thị:**
- Mã lịch hẹn
- Ngày khám
- Giờ khám
- Bác sĩ
- Chuyên khoa
- Trạng thái
- Chẩn đoán (nếu có)

---

### 8A. Chế độ Xem Tài liệu Hồ sơ bệnh án

**Mô tả:** Bệnh nhân xem và tải xuống tài liệu hồ sơ bệnh án do bác sĩ phát hành, chỉ trong phạm vi hồ sơ của chính mình (read-only).

| Tên trường | Ý nghĩa | Kiểu nhập liệu | Ràng buộc / Validation |
|------------|---------|----------------|------------------------|
| `tu_ngay` | Lọc từ ngày tạo tài liệu | Date | Tùy chọn, <= `den_ngay` |
| `den_ngay` | Lọc đến ngày tạo tài liệu | Date | Tùy chọn, >= `tu_ngay` |
| `loai_tai_lieu` | Loại tài liệu | Select | Tùy chọn: KQ xét nghiệm / Chẩn đoán hình ảnh / Đơn tư vấn / Khác |
| `tu_khoa` | Từ khóa tên tài liệu | Text | Tùy chọn |

**Các cột hiển thị:**
- Mã tài liệu
- Tên tài liệu
- Loại tài liệu
- Ngày tạo
- Bác sĩ phụ trách
- Trạng thái file (còn hiệu lực/đã ẩn)
- Thao tác (Xem, Tải xuống)

**Ràng buộc phân quyền:**
- Bệnh nhân chỉ xem được tài liệu gắn với `benh_nhan_id` của chính mình.
- Không có thao tác tạo/sửa/xóa từ phía bệnh nhân.

---

## Nhóm 2: Biểu mẫu dành cho Nhân viên / Lễ tân

**Giới hạn quyền:** Nhân viên/Lễ tân không có biểu mẫu truy cập tài liệu hồ sơ bệnh án (`tai_lieu_ho_so`).

### 9. Biểu mẫu Tạo mới Bệnh nhân

**Mô tả:** Nhân viên tạo hồ sơ bệnh nhân cho trường hợp đến khám trực tiếp (walk-in).

| Tên trường | Ý nghĩa | Kiểu nhập liệu | Ràng buộc / Validation |
|------------|---------|----------------|------------------------|
| `ho_ten` | Họ và tên | Text | Bắt buộc, 2-100 ký tự |
| `so_dien_thoai` | Số điện thoại | Tel | Bắt buộc, 10-11 số |
| `email` | Email | Email | Tùy chọn, định dạng email hợp lệ |
| `ngay_sinh` | Ngày sinh | Date | Bắt buộc |
| `gioi_tinh` | Giới tính | Select | Bắt buộc |
| `dia_chi` | Địa chỉ | Textarea | Tùy chọn |
| `so_cccd` | Số CCCD | Text | Tùy chọn, 12 số, duy nhất (nếu có) |
| `nguoi_lien_he` | Người liên hệ khẩn | Text | Tùy chọn |
| `sdt_nguoi_lien_he` | SĐT người liên hệ | Tel | Tùy chọn |
| `nhom_mau` | Nhóm máu | Select | Tùy chọn: A+/A-/B+/B-/AB+/AB-/O+/O- |
| `tien_su_di_ung` | Tiền sử dị ứng | Textarea | Tùy chọn |
| `tien_su_benh` | Tiền sử bệnh mãn tính | Textarea | Tùy chọn |
| `ghi_chu` | Ghi chú | Textarea | Tùy chọn |

**Ghi chú (walk-in):** Trường hợp đến khám trực tiếp có thể tạo bệnh nhân với `nguoi_dung_id = NULL`.

---

### 10. Biểu mẫu Cập nhật Bệnh nhân

**Mô tả:** Nhân viên chỉnh sửa thông tin hồ sơ bệnh nhân.

| Tên trường | Ý nghĩa | Kiểu nhập liệu | Ràng buộc / Validation |
|------------|---------|----------------|------------------------|
| `ma_benh_nhan` | Mã bệnh nhân | Text (readonly) | Chỉ đọc |
| `ho_ten` | Họ và tên | Text | Bắt buộc, 2-100 ký tự |
| `so_dien_thoai` | Số điện thoại | Tel | Bắt buộc, 10-11 số |
| `email` | Email | Email | Tùy chọn |
| `ngay_sinh` | Ngày sinh | Date | Bắt buộc |
| `gioi_tinh` | Giới tính | Select | Bắt buộc |
| `dia_chi` | Địa chỉ | Textarea | Tùy chọn |
| `so_cccd` | Số CCCD | Text | Tùy chọn, 12 số, duy nhất (nếu có) |
| `nhom_mau` | Nhóm máu | Select | Tùy chọn |
| `tien_su_di_ung` | Tiền sử dị ứng | Textarea | Tùy chọn |
| `tien_su_benh` | Tiền sử bệnh mãn tính | Textarea | Tùy chọn |
| `trang_thai` | Trạng thái hồ sơ | Select | Hoạt động / Khóa |
| `ghi_chu` | Ghi chú | Textarea | Tùy chọn |

---

### 11. Biểu mẫu Tìm kiếm Bệnh nhân

**Mô tả:** Tìm kiếm bệnh nhân theo nhiều tiêu chí.

| Tên trường | Ý nghĩa | Kiểu nhập liệu | Ràng buộc / Validation |
|------------|---------|----------------|------------------------|
| `tu_khoa` | Từ khóa tìm kiếm | Text | Tùy chọn, tìm theo tên hoặc mã |
| `so_dien_thoai` | Số điện thoại | Tel | Tùy chọn |
| `so_cccd` | Số CCCD | Text | Tùy chọn |
| `ngay_sinh` | Ngày sinh | Date | Tùy chọn |

**Các cột kết quả:**
- Mã bệnh nhân
- Họ tên
- Số điện thoại
- Ngày sinh
- Giới tính
- Địa chỉ

---

### 12. Biểu mẫu Tạo Lịch hẹn

**Mô tả:** Nhân viên đặt lịch khám hộ bệnh nhân tại quầy.

| Tên trường | Ý nghĩa | Kiểu nhập liệu | Ràng buộc / Validation |
|------------|---------|----------------|------------------------|
| `benh_nhan` | Bệnh nhân | Search/Select | Bắt buộc, tìm kiếm và chọn từ danh sách |
| `chuyen_khoa` | Chuyên khoa | Select | Bắt buộc |
| `bac_si` | Bác sĩ | Select | Bắt buộc, lọc theo chuyên khoa |
| `ngay_kham` | Ngày khám | Date | Bắt buộc, >= ngày hiện tại |
| `khung_gio` | Khung giờ | Select | Bắt buộc, khung giờ còn trống |
| `dich_vu_ids` | Dịch vụ khám | Multi-select | Tùy chọn, có thể chọn nhiều |
| `goi_kham_ids` | Gói khám | Multi-select | Tùy chọn, có thể chọn nhiều |
| `ly_do_kham` | Lý do khám | Textarea | Tùy chọn |
| `ghi_chu` | Ghi chú cho lịch hẹn | Textarea | Tùy chọn (bệnh nhân có thể xem) |
| `ghi_chu_noi_bo` | Ghi chú nội bộ | Textarea | Tùy chọn (chỉ nhân viên thấy) |

**Ràng buộc nghiệp vụ:** Khi tạo lịch hẹn hệ thống sẽ khóa khung giờ (`khung_gio_kham.trang_thai` → `da_dat`).

---

### 13. Biểu mẫu Cập nhật Lịch hẹn

**Mô tả:** Nhân viên chỉnh sửa thông tin lịch hẹn khám.

| Tên trường | Ý nghĩa | Kiểu nhập liệu | Ràng buộc / Validation |
|------------|---------|----------------|------------------------|
| `ma_lich_hen` | Mã lịch hẹn | Text (readonly) | Chỉ đọc |
| `benh_nhan` | Bệnh nhân | Text (readonly) | Chỉ đọc |
| `chuyen_khoa` | Chuyên khoa | Select | Bắt buộc |
| `bac_si` | Bác sĩ | Select | Bắt buộc |
| `ngay_kham` | Ngày khám | Date | Bắt buộc |
| `khung_gio` | Khung giờ | Select | Bắt buộc |
| `trang_thai` | Trạng thái | Select | Đang chờ / Đã thanh toán / Đã xác nhận / Đã hoàn tất / Đã hủy / Không đến |
| `gio_den_thuc_te` | Giờ đến thực tế | Time | Chỉ cập nhật qua thao tác check-in (map `lich_hen.gio_den_thuc_te`) |
| `ly_do_kham` | Lý do khám | Textarea | Tùy chọn |
| `ghi_chu` | Ghi chú | Textarea | Tùy chọn |
| `ghi_chu_noi_bo` | Ghi chú nội bộ | Textarea | Tùy chọn |

---

### 14. Biểu mẫu Hủy Lịch hẹn

**Mô tả:** Nhân viên hủy lịch hẹn theo yêu cầu.

| Tên trường | Ý nghĩa | Kiểu nhập liệu | Ràng buộc / Validation |
|------------|---------|----------------|------------------------|
| `ma_lich_hen` | Mã lịch hẹn | Text (readonly) | Chỉ đọc |
| `thong_tin_benh_nhan` | Thông tin bệnh nhân | Display | Hiển thị tên, SĐT |
| `thong_tin_lich` | Thông tin lịch hẹn | Display | Hiển thị ngày, giờ, bác sĩ |
| `nguoi_yeu_cau` | Người yêu cầu hủy | Select | Bắt buộc: Bệnh nhân / Bác sĩ / Hệ thống (dùng để lọc danh mục lý do) |
| `ly_do_huy_id` | Lý do hủy | Select | Bắt buộc, chọn từ `ly_do_huy` theo `loai` tương ứng |
| `ly_do_huy_khac` | Lý do khác | Textarea | Chỉ bắt buộc khi chọn lý do “khác” |
| `xac_nhan` | Xác nhận hủy | Checkbox | Bắt buộc |

**Hệ thống thực hiện:** cập nhật `lich_hen.trang_thai` → `da_huy` và mở lại khung giờ (`khung_gio_kham.trang_thai` → `trong`).

---

### 15. Lịch hẹn Khám hàng ngày

**Mô tả:** Xem danh sách lịch hẹn khám trong ngày (chỉ đọc).

| Tên trường | Ý nghĩa | Kiểu nhập liệu | Ràng buộc / Validation |
|------------|---------|----------------|------------------------|
| `ngay_xem` | Ngày xem lịch | Date | Mặc định: ngày hiện tại |
| `bac_si` | Lọc theo bác sĩ | Select | Tùy chọn: Tất cả / Chọn bác sĩ cụ thể |
| `chuyen_khoa` | Lọc theo chuyên khoa | Select | Tùy chọn |
| `trang_thai` | Lọc theo trạng thái | Select | Tùy chọn: Đang chờ / Đã thanh toán / Đã xác nhận / Đã hoàn tất / Đã hủy / Không đến |

**Các cột hiển thị:**
- STT
- Giờ khám
- Mã lịch hẹn
- Tên bệnh nhân
- SĐT
- Bác sĩ
- Chuyên khoa
- Dịch vụ/Gói khám
- Trạng thái
- Giờ đến thực tế (nếu đã check-in)
- Thao tác (Check-in, Sửa, Hủy)

---

### 16. Biểu mẫu Check-in Bệnh nhân

**Mô tả:** Xác nhận bệnh nhân đã đến khám, ghi nhận giờ đến thực tế và tạo phiếu khám (nếu chưa có).

| Tên trường | Ý nghĩa | Kiểu nhập liệu | Ràng buộc / Validation |
|------------|---------|----------------|------------------------|
| `ma_lich_hen` | Mã lịch hẹn | Text / Scan | Bắt buộc, nhập hoặc quét mã |
| `thong_tin_benh_nhan` | Thông tin bệnh nhân | Display | Hiển thị sau khi nhập mã |
| `xac_nhan_danh_tinh` | Xác nhận danh tính | Checkbox | Bắt buộc |
| `gio_den_thuc_te` | Giờ đến thực tế | Time | Tự động điền giờ hiện tại, có thể sửa (map `lich_hen.gio_den_thuc_te`) |
| `ghi_chu_noi_bo` | Ghi chú tiếp nhận | Textarea | Tùy chọn (map `lich_hen.ghi_chu_noi_bo`) |

**Hệ thống thực hiện:** set `lich_hen.nguoi_tiep_nhan_id`, tạo `phieu_kham` (nếu chưa có) với `trang_thai = tiep_nhan` và set `phieu_kham.thoi_gian_tiep_nhan`.

---

## Nhóm 3: Biểu mẫu dành cho Bác sĩ

### 17. Thiết lập Thời gian làm việc

**Mô tả:** Bác sĩ (hoặc admin) gán ca làm việc (template) cho bác sĩ theo ngày và sinh khung giờ khám.

| Tên trường | Ý nghĩa | Kiểu nhập liệu | Ràng buộc / Validation |
|------------|---------|----------------|------------------------|
| `ngay_lam_viec` | Ngày làm việc | Date | Bắt buộc |
| `ca_lam_viec_id` | Ca làm việc (template) | Select | Bắt buộc, chọn từ `lich_lam_viec` (theo thứ trong tuần) |
| `phong_kham_id` | Phòng khám | Select | Tùy chọn (nếu mô hình yêu cầu cố định phòng theo ca/ngày) |
| `ghi_chu` | Ghi chú | Textarea | Tùy chọn |

**Luồng hệ thống:** tạo bản ghi `lich_lam_viec_bac_si` → sinh các dòng `khung_gio_kham` theo `thoi_luong_kham` của ca template.

**Ghi chú triển khai:**
- Ca template (`lich_lam_viec`) là bảng tĩnh.
- Lịch bác sĩ theo ngày nằm ở `lich_lam_viec_bac_si`.
- Slot vẫn theo `khung_gio_kham` để tracking trạng thái `trong/da_dat/khoa`.

---

### 18. Xem Lịch làm việc

**Mô tả:** Bác sĩ xem lịch khám của mình theo ngày/tuần/tháng (chỉ đọc).

| Tên trường | Ý nghĩa | Kiểu nhập liệu | Ràng buộc / Validation |
|------------|---------|----------------|------------------------|
| `che_do_xem` | Chế độ xem | Toggle | Ngày / Tuần / Tháng |
| `ngay_xem` | Ngày/Tuần/Tháng xem | Date picker | Điều hướng lịch |

**Thông tin hiển thị:**
- Lịch dạng calendar với các slot thời gian
- Trạng thái từng khung giờ (Trống / Đã đặt / Khóa)

---

### 19. Xem Chi tiết Lịch hẹn

**Mô tả:** Bác sĩ xem thông tin chi tiết của một lịch hẹn cụ thể (chỉ đọc).

| Tên trường | Ý nghĩa | Kiểu nhập liệu | Ràng buộc / Validation |
|------------|---------|----------------|------------------------|

**Thông tin hiển thị:**
- Mã lịch hẹn
- Thông tin bệnh nhân (họ tên, tuổi, giới tính, SĐT)
- Ngày giờ khám
- Lý do khám / Triệu chứng
- Tiền sử bệnh (nếu có)
- Ghi chú của nhân viên tiếp nhận
- Trạng thái lịch hẹn

---

### 20. Phiếu Khám bệnh

**Mô tả:** Bác sĩ ghi nhận thông tin khi khám bệnh cho bệnh nhân.

| Tên trường | Ý nghĩa | Kiểu nhập liệu | Ràng buộc / Validation |
|------------|---------|----------------|------------------------|
| `ma_phieu_kham` | Mã phiếu khám | Text (readonly) | Chỉ đọc |
| `ma_lich_hen` | Mã lịch hẹn | Text (readonly) | Chỉ đọc (có thể trống nếu walk-in) |
| `benh_nhan` | Thông tin bệnh nhân | Display | Hiển thị tên, tuổi, giới tính |
| `mach` | Mạch (lần/phút) | Number | Tùy chọn, 40-200 |
| `nhiet_do` | Nhiệt độ (°C) | Number | Tùy chọn, 35.0-42.0 |
| `huyet_ap` | Huyết áp | Text | Tùy chọn, định dạng: 120/80 |
| `can_nang` | Cân nặng (kg) | Number | Tùy chọn, 1-300 |
| `chieu_cao` | Chiều cao (cm) | Number | Tùy chọn, 50-250 |
| `trieu_chung` | Triệu chứng | Textarea | Bắt buộc |
| `ket_qua_kham` | Kết quả khám | Textarea | Bắt buộc |
| `hen_tai_kham` | Hẹn tái khám | Date | Tùy chọn |
| `trang_thai` | Trạng thái phiếu khám | Select | Tiếp nhận / Đang khám / Chờ kê đơn / Hoàn thành |

---

### 21. Phiếu Chỉ định dịch vụ

**Mô tả:** Bác sĩ tạo/cập nhật các chỉ định dịch vụ (xét nghiệm, chẩn đoán hình ảnh, …) cho một phiếu khám.

| Tên trường | Ý nghĩa | Kiểu nhập liệu | Ràng buộc / Validation |
|------------|---------|----------------|------------------------|
| `ma_phieu_kham` | Mã phiếu khám | Text (readonly) | Chỉ đọc |
| `ngay_chi_dinh` | Ngày chỉ định | Date | Bắt buộc (mặc định: ngày hiện tại) |
| `danh_sach_chi_dinh` | Danh sách chỉ định | Dynamic Table | Bắt buộc ít nhất 1 dòng |

**Chi tiết mỗi dòng chỉ định (map bảng `chi_dinh`):**

| Tên trường | Ý nghĩa | Kiểu nhập liệu | Ràng buộc / Validation |
|------------|---------|----------------|------------------------|
| `dich_vu` | Dịch vụ được chỉ định | Search/Select | Bắt buộc (map `chi_dinh.dich_vu_id`) |
| `so_luong` | Số lượng | Number | Tùy chọn, mặc định 1 (map `chi_dinh.so_luong`) |
| `ghi_chu` | Ghi chú cho chỉ định | Textarea | Tùy chọn (map `chi_dinh.ghi_chu`) |
| `trang_thai` | Trạng thái chỉ định | Select | Chờ thực hiện / Đã hoàn thành / Hủy (map `chi_dinh.trang_thai`) |

**Ghi chú:** Người tạo chỉ định là bác sĩ (map `chi_dinh.bac_si_id`).

---

### 22. Biểu mẫu Chẩn đoán & Ghi chú

**Mô tả:** Bác sĩ ghi nhận chẩn đoán bệnh cho bệnh nhân.

| Tên trường | Ý nghĩa | Kiểu nhập liệu | Ràng buộc / Validation |
|------------|---------|----------------|------------------------|
| `ma_phieu_kham` | Mã phiếu khám | Text (readonly) | Chỉ đọc |
| `chan_doan` | Chẩn đoán | Textarea | Bắt buộc; có thể nhập nhiều chẩn đoán, ngăn cách bằng dấu chấm phẩy |
| `ma_icd10_chinh` | Mã ICD-10 chẩn đoán chính | Search/Select | Tùy chọn, tra cứu từ bảng `icd10`, nếu nhập thì mã phải tồn tại |
| `tinh_trang` | Tình trạng bệnh | Select | Bắt buộc: Nhẹ / Trung bình / Nặng |
| `huong_dieu_tri` | Hướng điều trị | Textarea | Tùy chọn |
| `loi_dan` | Lời dặn bệnh nhân | Textarea | Tùy chọn |
| `ghi_chu_noi_bo` | Ghi chú nội bộ | Textarea | Tùy chọn, chỉ bác sĩ/nhân viên thấy |


---

### 23. Biểu mẫu Kê đơn thuốc

**Mô tả:** Bác sĩ kê đơn thuốc cho bệnh nhân sau khi khám.

| Tên trường | Ý nghĩa | Kiểu nhập liệu | Ràng buộc / Validation |
|------------|---------|----------------|------------------------|
| `ma_phieu_kham` | Mã phiếu khám | Text (readonly) | Chỉ đọc |
| `danh_sach_thuoc` | Danh sách thuốc | Dynamic Table | Bắt buộc ít nhất 1 dòng |

**Chi tiết mỗi dòng thuốc:**

| Tên trường | Ý nghĩa | Kiểu nhập liệu | Ràng buộc / Validation |
|------------|---------|----------------|------------------------|
| `ten_thuoc` | Tên thuốc | Search/Select | Bắt buộc, chọn từ danh mục thuốc |
| `don_vi` | Đơn vị | Display | Tự động theo thuốc (lấy từ `thuoc.don_vi`) |
| `duong_dung` | Đường dùng | Display | Tự động theo thuốc (lấy từ `thuoc.duong_dung`) |
| `so_luong` | Số lượng | Number | Bắt buộc, > 0 |
| `lieu_dung` | Liều dùng | Text | Bắt buộc, VD: "2 viên x 3 lần/ngày" |
| `thoi_diem` | Thời điểm uống | Select | Trước ăn / Sau ăn / Trong ăn / Không liên quan |
| `so_ngay` | Số ngày dùng | Number | Bắt buộc, > 0 |
| `ghi_chu_thuoc` | Ghi chú | Text | Tùy chọn |


---

### 24. Xem Tiền sử Bệnh lý

**Mô tả:** Bác sĩ xem lịch sử khám và điều trị của bệnh nhân (chỉ đọc).

| Tên trường | Ý nghĩa | Kiểu nhập liệu | Ràng buộc / Validation |
|------------|---------|----------------|------------------------|
| `ma_benh_nhan` | Mã bệnh nhân | Text | Bắt buộc để tìm kiếm |

**Thông tin hiển thị:**
- Thông tin cơ bản bệnh nhân
- Danh sách các lần khám trước
  - Ngày khám
  - Bác sĩ khám
  - Chẩn đoán
  - Đơn thuốc
  - Kết quả xét nghiệm (nếu có)
- Tiền sử dị ứng
- Tiền sử bệnh mãn tính

---

### 24A. Biểu mẫu Quản lý Tài liệu Hồ sơ bệnh án

**Mô tả:** Bác sĩ tải lên và quản lý metadata tài liệu hồ sơ bệnh án gắn với một phiếu khám cụ thể.

| Tên trường | Ý nghĩa | Kiểu nhập liệu | Ràng buộc / Validation |
|------------|---------|----------------|------------------------|
| `ma_phieu_kham` | Mã phiếu khám | Text (readonly) | Bắt buộc, chỉ đọc |
| `benh_nhan` | Thông tin bệnh nhân | Display | Chỉ đọc |
| `loai_tai_lieu` | Loại tài liệu | Select | Bắt buộc |
| `ten_tai_lieu` | Tên tài liệu | Text | Bắt buộc, 3-255 ký tự |
| `file_upload` | Tệp tài liệu | File Upload | Bắt buộc khi tạo mới; PDF/JPG/PNG; tối đa theo cấu hình hệ thống |
| `ngay_tao` | Ngày tạo tài liệu | Date | Bắt buộc, mặc định ngày hiện tại |
| `ghi_chu` | Ghi chú | Textarea | Tùy chọn |

**Các cột hiển thị danh sách tài liệu của phiếu khám:**
- Mã tài liệu
- Loại tài liệu
- Tên tài liệu
- Người tạo (bác sĩ)
- Ngày tạo
- Trạng thái
- Thao tác (Xem, Cập nhật metadata, Ẩn/Xóa mềm)

**Ràng buộc phân quyền:**
- Bác sĩ chỉ thao tác trên tài liệu của `phieu_kham` do mình phụ trách.
- Nhân viên/Lễ tân không có quyền xem/tải/sửa/xóa tài liệu hồ sơ bệnh án.

---

## Nhóm 4: Biểu mẫu dành cho Quản trị viên (Admin)

### 25. Quản lý Tài khoản Nhân viên

**Mô tả:** Admin quản lý thông tin tài khoản nhân viên y tế / lễ tân.

| Tên trường | Ý nghĩa | Kiểu nhập liệu | Ràng buộc / Validation |
|------------|---------|----------------|------------------------|
| `ma_nhan_vien` | Mã nhân viên | Text | Tự động sinh khi tạo mới, readonly khi sửa |
| `ho_ten` | Họ và tên | Text | Bắt buộc, 2-100 ký tự |
| `email` | Email đăng nhập | Email | Bắt buộc, duy nhất |
| `mat_khau` | Mật khẩu | Password | Bắt buộc khi tạo mới |
| `so_dien_thoai` | Số điện thoại | Tel | Bắt buộc |
| `chuc_vu` | Chức vụ | Select | Lễ tân / Nhân viên y tế / Điều dưỡng |
| `phong_ban` | Phòng ban | Text | Tùy chọn |
| `ngay_vao_lam` | Ngày vào làm | Date | Bắt buộc |
| `trang_thai` | Trạng thái | Select | Hoạt động / Tạm khóa / Nghỉ việc |
| `ghi_chu` | Ghi chú | Textarea | Tùy chọn |

---

### 26. Quản lý Tài khoản Bác sĩ

**Mô tả:** Admin quản lý thông tin tài khoản bác sĩ.

| Tên trường | Ý nghĩa | Kiểu nhập liệu | Ràng buộc / Validation |
|------------|---------|----------------|------------------------|
| `ma_bac_si` | Mã bác sĩ | Text | Tự động sinh, readonly |
| `ho_ten` | Họ và tên | Text | Bắt buộc |
| `email` | Email đăng nhập | Email | Bắt buộc, duy nhất |
| `mat_khau` | Mật khẩu | Password | Bắt buộc khi tạo mới |
| `so_dien_thoai` | Số điện thoại | Tel | Bắt buộc |
| `chuyen_khoa` | Chuyên khoa | Multi-select | Bắt buộc, chọn ít nhất 1 |
| `hoc_vi` | Học vị | Select | Bác sĩ / Thạc sĩ / Tiến sĩ / PGS / GS |
| `chung_chi_hanh_nghe` | Số chứng chỉ hành nghề | Text | Bắt buộc |
| `kinh_nghiem` | Số năm kinh nghiệm | Number | Tùy chọn |
| `gioi_thieu` | Giới thiệu | Textarea | Tùy chọn |
| `hinh_anh` | Ảnh đại diện (tài khoản) | File Upload | Tùy chọn, lưu vào `nguoi_dung.hinh_anh` |
| `trang_thai` | Trạng thái | Select | Hoạt động / Tạm nghỉ / Nghỉ việc |

---

### 27. Biểu mẫu Vai trò & Quyền

**Mô tả:** Admin thiết lập vai trò và phân quyền trong hệ thống (RBAC).

| Tên trường | Ý nghĩa | Kiểu nhập liệu | Ràng buộc / Validation |
|------------|---------|----------------|------------------------|
| `ma_vai_tro` | Mã vai trò | Text | Tự động sinh hoặc nhập |
| `ten_vai_tro` | Tên vai trò | Text | Bắt buộc, VD: Admin, Bác sĩ, Lễ tân |
| `mo_ta` | Mô tả vai trò | Textarea | Tùy chọn |
| `danh_sach_quyen` | Danh sách quyền | Checkbox Group | Bắt buộc chọn ít nhất 1 |

**Các quyền có thể cấp:**
- Quản lý người dùng
- Quản lý bác sĩ
- Quản lý chuyên khoa
- Quản lý lịch hẹn
- Đặt lịch khám
- Khám bệnh
- Kê đơn thuốc
- Quản lý tài liệu hồ sơ bệnh án (Bác sĩ)
- Xem tài liệu hồ sơ bệnh án của bản thân (Bệnh nhân)
- Xem báo cáo
- Cấu hình hệ thống
- Xem nhật ký

---

### 28. Biểu mẫu Quản lý Chuyên khoa

**Mô tả:** Admin quản lý danh sách các chuyên khoa trong bệnh viện.

| Tên trường | Ý nghĩa | Kiểu nhập liệu | Ràng buộc / Validation |
|------------|---------|----------------|------------------------|
| `ma_chuyen_khoa` | Mã chuyên khoa | Text | Tự động sinh |
| `ten_chuyen_khoa` | Tên chuyên khoa | Text | Bắt buộc, duy nhất |
| `mo_ta` | Mô tả | Textarea | Tùy chọn |
| `hinh_anh` | Hình ảnh đại diện | File Upload | Tùy chọn |
| `vi_tri` | Vị trí (tầng/khu) | Text | Tùy chọn |
| `so_dien_thoai` | SĐT liên hệ | Tel | Tùy chọn |
| `truong_khoa` | Trưởng khoa | Select | Tùy chọn, chọn từ danh sách bác sĩ |
| `trang_thai` | Trạng thái | Select | Hoạt động / Tạm ngưng |
| `thu_tu_hien_thi` | Thứ tự hiển thị | Number | Tùy chọn, để sắp xếp |

---

### 29. Biểu mẫu Quản lý Dịch vụ

**Mô tả:** Admin quản lý danh sách các dịch vụ khám chữa bệnh.

| Tên trường | Ý nghĩa | Kiểu nhập liệu | Ràng buộc / Validation |
|------------|---------|----------------|------------------------|
| `ma_dich_vu` | Mã dịch vụ | Text | Tự động sinh |
| `ten_dich_vu` | Tên dịch vụ | Text | Bắt buộc |
| `chuyen_khoa` | Thuộc chuyên khoa | Select | Bắt buộc |
| `mo_ta` | Mô tả dịch vụ | Textarea | Tùy chọn |
| `gia_dich_vu` | Giá dịch vụ (VNĐ) | Number | Bắt buộc, >= 0 |
| `thoi_gian_du_kien` | Thời gian dự kiến (phút) | Number | Tùy chọn |
| `yeu_cau_dac_biet` | Yêu cầu đặc biệt | Textarea | Tùy chọn, VD: nhịn ăn trước khi khám |
| `loai_dich_vu` | Loại dịch vụ | Select | Bắt buộc: Khám bệnh / Xét nghiệm / Chẩn đoán hình ảnh / Thủ thuật / Phẫu thuật / Khác |
| `trang_thai` | Trạng thái | Select | Hoạt động / Tạm ngưng |

---

### 30. Phân bổ Bác sĩ – Chuyên khoa

**Mô tả:** Admin gán bác sĩ vào các chuyên khoa phụ trách.

| Tên trường | Ý nghĩa | Kiểu nhập liệu | Ràng buộc / Validation |
|------------|---------|----------------|------------------------|
| `bac_si` | Chọn bác sĩ | Select | Bắt buộc |
| `chuyen_khoa` | Chuyên khoa được gán | Multi-select | Bắt buộc, chọn ít nhất 1 |
| `chuyen_khoa_chinh` | Chuyên khoa chính | Radio | Bắt buộc chọn 1 trong các chuyên khoa đã gán |
| `ghi_chu` | Ghi chú | Textarea | Tùy chọn |

---

### 31. Biểu mẫu Quản lý Phòng

**Mô tả:** Admin quản lý danh sách phòng khám trong bệnh viện.

| Tên trường | Ý nghĩa | Kiểu nhập liệu | Ràng buộc / Validation |
|------------|---------|----------------|------------------------|
| `ma_phong` | Mã phòng | Text | Tự động sinh |
| `ten_phong` | Tên phòng | Text | Bắt buộc, VD: Phòng khám 101 |
| `chuyen_khoa` | Thuộc chuyên khoa | Select | Tùy chọn |
| `vi_tri` | Vị trí | Text | Bắt buộc, VD: Tầng 1, Khu A |
| `trang_thiet_bi` | Trang thiết bị | Textarea | Tùy chọn |
| `trang_thai` | Trạng thái | Select | Hoạt động / Bảo trì / Ngưng sử dụng |
| `ghi_chu` | Ghi chú | Textarea | Tùy chọn |

---

### 32. Xem Nhật ký Hoạt động

**Mô tả:** Admin xem log các hoạt động trong hệ thống (chỉ đọc).

| Tên trường | Ý nghĩa | Kiểu nhập liệu | Ràng buộc / Validation |
|------------|---------|----------------|------------------------|
| `tu_ngay` | Lọc từ ngày | Date | Tùy chọn |
| `den_ngay` | Lọc đến ngày | Date | Tùy chọn |
| `nguoi_dung` | Lọc theo người dùng | Select | Tùy chọn |
| `loai_hanh_dong` | Lọc theo loại hành động | Select | Tùy chọn: Đăng nhập / Tạo / Sửa / Xóa |
| `doi_tuong` | Lọc theo đối tượng | Select | Tùy chọn: Lịch hẹn / Bệnh nhân / Bác sĩ |

**Các cột hiển thị:**
- Thời gian
- Người thực hiện
- Loại hành động
- Đối tượng
- Chi tiết
- Địa chỉ IP

---

### 33. Báo cáo Thống kê Lịch hẹn

**Mô tả:** Báo cáo thống kê số lượng lịch hẹn theo các tiêu chí.

| Tên trường | Ý nghĩa | Kiểu nhập liệu | Ràng buộc / Validation |
|------------|---------|----------------|------------------------|
| `tu_ngay` | Từ ngày | Date | Bắt buộc |
| `den_ngay` | Đến ngày | Date | Bắt buộc, >= `tu_ngay` |
| `nhom_theo` | Nhóm thống kê theo | Select | Ngày / Tuần / Tháng / Bác sĩ / Chuyên khoa |
| `chuyen_khoa` | Lọc chuyên khoa | Multi-select | Tùy chọn |
| `bac_si` | Lọc bác sĩ | Multi-select | Tùy chọn |
| `trang_thai` | Lọc trạng thái | Multi-select | Tùy chọn |

**Thông tin hiển thị:**
- Biểu đồ cột/đường theo thời gian
- Bảng chi tiết số liệu
- Tổng số lịch hẹn
- Phân bổ theo trạng thái (Đang chờ / Đã thanh toán / Đã xác nhận / Đã hoàn tất / Đã hủy / Không đến)
- Tỷ lệ hoàn thành
- Nút xuất báo cáo (PDF/Excel)

---

### 34. Báo cáo Tải công việc Bác sĩ

**Mô tả:** Báo cáo thống kê khối lượng công việc của bác sĩ.

| Tên trường | Ý nghĩa | Kiểu nhập liệu | Ràng buộc / Validation |
|------------|---------|----------------|------------------------|
| `tu_ngay` | Từ ngày | Date | Bắt buộc |
| `den_ngay` | Đến ngày | Date | Bắt buộc |
| `chuyen_khoa` | Lọc chuyên khoa | Select | Tùy chọn |
| `bac_si` | Lọc bác sĩ | Multi-select | Tùy chọn |

**Thông tin hiển thị:**
- Bảng xếp hạng bác sĩ theo số ca khám
- Số ca khám trung bình/ngày
- Số giờ làm việc
- Tỷ lệ bệnh nhân vắng mặt
- So sánh giữa các bác sĩ
- Biểu đồ phân bổ công việc
- Nút xuất báo cáo (PDF/Excel)