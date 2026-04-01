# Lưu trữ hồ sơ - Giải thích cấu trúc code

Tài liệu này mô tả toàn bộ folder/files đã tạo cho màn **Quản lí lưu trữ hồ sơ, tài liệu** (FE).

---

## 1) Mục tiêu module

Module này phục vụ các chức năng chính:
- Quản lí danh sách tài liệu hồ sơ bệnh án (lọc, tìm kiếm, xem liên kết bệnh nhân/phiếu khám).
- Thêm mới tài liệu bằng popup form.
- Thao tác theo từng dòng: **Chi tiết / Sửa / Xóa**.
- Thông báo thao tác dạng toast, tự ẩn sau ~5 giây.

---

## 2) Cấu trúc folder mới

```text
frontend/src/features/records/
├─ components/
│  ├─ DocumentDetailModal.jsx
│  ├─ DocumentFormModal.jsx
│  ├─ LinkedRecordPanel.jsx
│  ├─ RecordsTable.jsx
│  └─ RecordsToolbar.jsx
├─ data/
│  └─ recordsData.js
├─ pages/
│  └─ HoSoTaiLieuPage.jsx
└─ utils/
   └─ recordsUtils.js
```

---

## 3) Giải thích từng file

## A. Folder `data`

### `frontend/src/features/records/data/recordsData.js`
**Vai trò:** Nơi chứa dữ liệu tĩnh và hằng số dùng chung cho module.

**Thành phần chính:**
- `DOCUMENT_TYPE_OPTIONS`: danh sách loại tài liệu (`loai_tai_lieu`) + label + màu hiển thị.
- `PHIEU_KHAM_OPTIONS`: dữ liệu mẫu phiếu khám/bệnh nhân liên kết.
- `INITIAL_DOCUMENTS`: dữ liệu mẫu bảng tài liệu.
- `createEmptyForm(defaultPhieuKhamId)`: tạo state form rỗng chuẩn cho thêm/sửa.

**Lợi ích:**
- Tránh hard-code data ngay trong page.
- Dễ thay mock data hoặc chuyển sang API thật về sau.

---

## B. Folder `utils`

### `frontend/src/features/records/utils/recordsUtils.js`
**Vai trò:** Chứa hàm tiện ích thuần cho module.

**Thành phần chính:**
- `formatDate(value)`: format ngày theo `vi-VN`.
- `getDocumentTypeMeta(value)`: lấy metadata (label/màu) từ loại tài liệu.
- `buildDocumentView(document)`: hydrate tài liệu với dữ liệu liên kết `phieu_kham` + `benh_nhan`.

**Lợi ích:**
- Logic xử lý được tái sử dụng ở nhiều component.
- Giảm lặp code, giúp component gọn hơn.

---

## C. Folder `components`

### `frontend/src/features/records/components/RecordsToolbar.jsx`
**Vai trò:** Thanh công cụ phía trên bảng.

**Chức năng:**
- Input tìm kiếm theo từ khóa.
- Select lọc loại tài liệu.
- Nút `Đặt lại lọc`.
- Nút `Thêm tài liệu` mở popup form.
- Layout responsive để tránh tràn nút ra ngoài khung.

---

### `frontend/src/features/records/components/RecordsTable.jsx`
**Vai trò:** Bảng danh sách tài liệu.

**Chức năng:**
- Hiển thị các cột thông tin tài liệu.
- Chọn dòng để đồng bộ panel hồ sơ liên kết.
- Cột thao tác từng dòng:
  - `Chi tiết` → mở modal xem chi tiết.
  - `Sửa` → mở modal form edit.
  - `Xóa` → xóa có `Popconfirm` xác nhận.

---

### `frontend/src/features/records/components/DocumentFormModal.jsx`
**Vai trò:** Popup form dùng chung cho **Thêm mới** và **Sửa**.

**Chức năng:**
- Nhập đầy đủ các trường bám bảng `tai_lieu_ho_so`:
  - `ma_tai_lieu`
  - `phieu_kham_id`
  - `loai_tai_lieu`
  - `ten_tai_lieu`
  - `file_url`
  - `file_name`
  - `ngay_tao`
  - `ghi_chu`
- Upload file FE mock (không upload thật lên server).
- Nút hủy/lưu.

---

### `frontend/src/features/records/components/DocumentDetailModal.jsx`
**Vai trò:** Popup xem chi tiết tài liệu (read-only).

**Chức năng:**
- Hiển thị toàn bộ thông tin quan trọng của tài liệu bằng `Descriptions`.
- Hiển thị label loại tài liệu theo metadata màu.

---

### `frontend/src/features/records/components/LinkedRecordPanel.jsx`
**Vai trò:** Khối thông tin liên kết hồ sơ khi chọn tài liệu.

**Chức năng:**
- Hiển thị `PatientCard` bệnh nhân.
- Hiển thị tóm tắt hồ sơ liên kết: mã phiếu khám, ngày tạo, chẩn đoán/ngữ cảnh, link file.

---

## D. Folder `pages`

### `frontend/src/features/records/pages/HoSoTaiLieuPage.jsx`
**Vai trò:** Page container/orchestrator của module.

**Chức năng chính:**
- Quản lý toàn bộ state màn hình:
  - danh sách tài liệu
  - lọc/tìm kiếm
  - selected document
  - trạng thái modal (add/edit/detail)
  - state form và file upload
- Điều phối các action:
  - thêm mới tài liệu
  - sửa tài liệu
  - xóa tài liệu
  - mở chi tiết
- Dùng `message` (Ant Design) để toast thành công/lỗi và tự ẩn sau 5 giây.

**Ý nghĩa:**
- Tách page thành mô hình container + presentational components.
- Dễ mở rộng khi nối API thật.

---

## 4) File liên quan ngoài folder `records`

### `frontend/src/App.jsx`
- Đang mount trực tiếp `HoSoTaiLieuPage` để demo nhanh FE.
- Sau này có thể chuyển sang router thật khi tích hợp đầy đủ module.

---

## 5) Luồng dữ liệu hiện tại (FE)

1. Load page -> lấy `INITIAL_DOCUMENTS` làm dữ liệu ban đầu.
2. User tìm kiếm/lọc -> dữ liệu qua hydrate + filter.
3. User bấm `Thêm tài liệu` -> mở `DocumentFormModal` (mode add).
4. Submit form:
   - validate bắt buộc
   - thêm vào state list
   - toast thành công 5 giây
5. Từng dòng có thể:
   - `Chi tiết` -> `DocumentDetailModal`
   - `Sửa` -> `DocumentFormModal` (mode edit)
   - `Xóa` -> confirm + cập nhật list + toast

---

## 6) Gợi ý bước tiếp theo

- Tạo `recordService` để tách logic CRUD khỏi page.
- Nối API backend thật cho danh sách tài liệu + upload file.
- Đồng bộ route (`/staff/ho-so-tai-lieu`) thay vì render trực tiếp trong `App.jsx`.
- Bổ sung phân quyền hiển thị nút `Sửa/Xóa` theo vai trò.
