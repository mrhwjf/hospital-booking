# Tổng quan dự án

## Tên dự án
Hệ thống đặt lịch khám bệnh ABC

## Mục tiêu
Xây dựng website đặt lịch khám bệnh phục vụ phạm vi đồ án đại học, giúp:
- Bệnh nhân đặt lịch khám nhanh chóng.
- Bác sĩ và nhân viên y tế quản lý lịch hiệu quả.
- Admin quản trị danh mục, phân quyền và cấu hình hệ thống.

## Phạm vi triển khai
- Kiến trúc: Monolithic (Frontend React + Backend Laravel + MySQL).
- Môi trường: Local (XAMPP/Apache + MySQL), phục vụ demo học thuật.
- Quản lý mã nguồn: GitHub.

## Thành phần chính
- Frontend: React + Vite.
- Backend: Laravel API.
- Database: MySQL.
- Tài liệu: thư mục `docs/` là nguồn tham chiếu chính cho đội dự án và AI agent.

## Vai trò người dùng
- Bệnh nhân (BENHNHAN).
- Bác sĩ (BACSI).
- Nhân viên/Lễ tân (NHANVIEN).
- Quản trị viên (ADMIN).

## Chức năng cốt lõi
- Đăng ký/đăng nhập và quản lý hồ sơ.
- Đặt lịch, đổi lịch, hủy lịch theo quy định.
- Check-in và tạo phiếu khám.
- Khám bệnh, chỉ định, kê đơn.
- Quản trị danh mục và phân quyền.

## Nguyên tắc tài liệu
- Ưu tiên tiếng Việt, thuật ngữ nhất quán.
- Cập nhật tài liệu cùng lúc với thay đổi nghiệp vụ/kỹ thuật.
- Khi tài liệu và code mâu thuẫn: xác nhận lại với nhóm trước khi triển khai.

---

## Cấu trúc thư mục và phân công
Phần này mô tả vai trò của từng thư mục để mọi thành viên hiểu rõ phạm vi sửa file, tránh can nhiễu.

### Thư mục gốc và chung
- `docs/`: nơi lưu tài liệu đặc tả, phân tích, API, cơ sở dữ liệu, kiểm thử, deployment. **Ý nghĩa**: là nguồn sự thật của yêu cầu nghiệp vụ và quy ước kỹ thuật trước khi code. **Nguyên tắc**: khi đổi logic nghiệp vụ, cập nhật tài liệu liên quan trước hoặc cùng PR code.
- `.github/workflows/`: cấu hình CI cho backend/frontend/docs. **Ý nghĩa**: đảm bảo code và tài liệu được kiểm tra tự động trước khi merge.
- Tệp gốc (`README.md`, `.gitignore`, `.editorconfig`, ...):
  - `README.md`: hướng dẫn chạy dự án và quy trình làm việc.
  - `.editorconfig`: thống nhất style cơ bản giữa các IDE.
  - `.gitignore`: loại bỏ file không nên commit.

### Backend (Laravel)
Toàn bộ mã nguồn Laravel cho API và xử lý nghiệp vụ.
- `routes/`: khai báo endpoint, tách theo module v1 (auth, patients, scheduling, clinical, admin, reports).
- `app/Http/Controllers/`: xử lý request/response theo từng domain.
- `app/Requests/`: validate đầu vào cho mỗi API.
- `app/Resources/`: chuẩn hoá JSON trả về.
- `app/Models/`: định nghĩa model Eloquent và quan hệ giữa bảng.
- `app/Services/`: chứa business logic có thể tái sử dụng, tránh để controller quá lớn.
- `app/Policies/` + `app/Http/Middleware/`: kiểm soát quyền truy cập theo vai trò/quyền.
- `database/migrations`, `seeders`, `factories`: quản lý schema, dữ liệu mẫu, dữ liệu test.
- `sql/`: script tổng hợp cho schema/triggers/views/events/seed theo thiết kế chuẩn.
- `tests/`: Feature theo module và Unit cho service/policy.

### Frontend (React + Vite)
- `src/app/`: cấu hình app cấp cao (router, providers).
- `src/api/`: lớp gọi API, đồng bộ với route backend theo domain.
- `src/features/`: chia theo domain nghiệp vụ (auth/patients/scheduling/clinical/admin/reports).
- `src/components/`: component dùng chung (common) và layout theo role.
- `src/hooks/`: custom hooks dùng lại được.
- `src/utils/`: hàm tiện ích, constants, validator dùng chung.
- `src/styles/`: token và global style dùng xuyên suốt hệ thống.
- `tests/`: unit/integration test cho FE.
- `scripts/`: các script PowerShell để chuẩn hoá thao tác dev/test/lint/import schema.

**Ý nghĩa chung**: giảm sai khác lệnh giữa các máy, tăng tính lặp lại khi làm việc nhóm.

---

## Nguyên tắc phân công và quyền sửa
1. **Định vị file nhanh (cho thành viên mới):**
   - Nếu sửa nghiệp vụ đặt lịch/check-in/khám bệnh: tìm trong `backend/app/Services/` và `frontend/src/features/` cùng domain.
   - Nếu sửa dữ liệu trả về API: ưu tiên sửa trong `backend/app/Resources/` trước khi sửa FE.
   - Nếu sửa validate input: sửa ở `backend/app/Requests/` và đồng bộ validate FE (`frontend/src/utils/validators.js` hoặc form schema).
   - Nếu sửa route tổng hợp: chỉ người sở hữu file dùng chung (thành viên 6) cập nhật `backend/routes/api.php` và `frontend/src/app/router.jsx`.
   - Nếu thay đổi schema/triggers/views/events: cập nhật trong `backend/sql/` và tài liệu `docs/05-database/` để tránh lệch.

2. **Quy tắc phân quyền không xung đột:**
   - Mỗi thành viên sở hữu một domain và làm cả FE + BE trong domain đó.
   - Các file dùng chung chỉ có một thành viên phụ trách.
   - Không ai sửa file ngoài phạm vi sở hữu nếu chưa có yêu cầu PR tới người sở hữu.
   - Các file tổng hợp route chỉ được sửa bởi thành viên sở hữu phần dùng chung.
   - Các file trigger/view/event của DB chỉ được sửa bởi thành viên phụ trách DB/dùng chung.

3. **Phân công nhóm (6 thành viên, FE + BE theo domain):**
   - **Thành viên 1 – Domain: Xác Thực + Hồ Sơ**
     - (Paths...) …
   - **Thành viên 2 – Domain: Thông Tin Bệnh Nhân + Lịch Sử** …
   - **Thành viên 3 – Domain: Lịch Làm Việc + Đặt Lịch Hẹn** …
   - **Thành viên 4 – Domain: Quy Trình Lâm Sàng (Check-in + Khám Bệnh + Đơn Thuốc)** …
   - **Thành viên 5 – Domain: Quản Trị (Người Dùng, Vai Trò, Cấu Hình Danh Mục)** …
   - **Thành viên 6 – Domain: Báo Cáo + Nền Tảng Dùng Chung + Công Giữ Công DB** …

   *(Thông tin phân công chi tiết tương tự như đã mô tả trong tài liệu chính sách dự án.)*

4. **Phân công riêng cho Cloudinary:**
   - Thành viên chịu trách nhiệm chính: Thành viên 4.
   - Phạm vi: upload tài liệu khám bệnh, lưu `file_url` vào hồ sơ, xử lý validate/bao lỗi upload trên cả BE và FE.
   - Nguyên tắc bảo mật: sử dụng biến môi trường (`CLOUDINARY_*`), không hard-code khoá.

5. **Danh sách thư viện FE/BE và chính sách đồng bộ phiên bản:**
   - (Tóm tắt các thư viện và lý do, như đã liệt kê trong yêu cầu; giữ nguyên nội dung.)
   - Nguyên tắc chốt version để tránh lệch môi trường: commit lock files, không merge PR thiếu cập nhật.
   - Quy tắc tăng version: patch/minor nếu không phá vỡ API nội bộ, major cần RFC trước.
   - Checklist khi thêm/sửa thư viện: cập nhật `package.json`/`composer.json`, lock file, tài liệu, chạy test script.

---

*Ghi chú:* cấu trúc và quy tắc trên giúp mỗi thành viên biết rõ phạm vi của mình (ví dụ: nếu bạn là thành viên 2, chỉ tập trung vào giao diện profile bệnh nhân và không ảnh hưởng folder khác).
