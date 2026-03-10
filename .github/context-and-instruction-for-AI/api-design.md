AI_INSTRUCTIONS=[
  - Language: Vietnamese
  - Clear hierarchy
  - Consistent naming conventions (snake_case keys, kebab-case URLs)
  - Use standard HTTP methods (GET/POST/PATCH/DELETE)
  - Proper versioning in endpoints (/api/v1)
  - Clear request/response payloads with examples
  - Error handling and status codes
  - Authentication + authorization (RBAC + permissions)
]

AI_RESPONSE=

# API Design (v1) — Hospital Booking System

Base URL: `/api/v1`

## 1) Quy ước chung

- **URL**: kebab-case, danh từ số nhiều. Ví dụ: `/lich-hen`, `/phieu-kham`.
- **JSON keys**: snake_case, ưu tiên trùng tên cột DB (ví dụ: `gio_den_thuc_te`, `ma_icd10_chinh`).
- **Ngày/giờ**:
  - `DATE`: `YYYY-MM-DD`
  - `TIME`: `HH:mm:ss`
  - `TIMESTAMP`: ISO-8601
- **Phân trang**: `page`, `per_page` (default 20, max 100)
  - Response: `data` + `meta` + `links`

### 1.1 Success response envelope (chuẩn hoá)

Để frontend dễ xử lý, tất cả response thành công nên theo 1 trong 3 dạng:

1) **Single resource**

```json
{
  "data": { "id": 1 }
}
```

2) **List (pagination)**

```json
{
  "data": [],
  "meta": { "page": 1, "per_page": 20, "total": 0 },
  "links": { "self": "...", "next": null, "prev": null }
}
```

3) **Action result** (cancel/check-in/transition)

```json
{
  "data": { "success": true },
  "message": "OK"
}
```

## 2) Chuẩn lỗi & status code

### 2.1 Error shape (bắt buộc)

`{ "error": { "code": "...", "message": "...", "details": { ... }, "trace_id": "..." } }`

### 2.2 Status code quy ước

- `200` OK, `201` Created
- `401` Unauthorized, `403` Forbidden
- `404` Not Found
- `422` Validation error (sai format, thiếu field, enum không hợp lệ)
- `400` Business rule (quá giờ hủy/đổi, ngày nghỉ, vi phạm policy)
- `409` Conflict (khung giờ vừa bị đặt/khóa)

## 3) Authentication & Authorization (RBAC)

- Auth: Bearer token: `Authorization: Bearer <access_token>`
- Role: `ADMIN`, `BACSI`, `NHANVIEN`, `BENHNHAN`
- Permission (seed): `QUAN_LY_NGUOI_DUNG`, `QUAN_LY_BAC_SI`, `QUAN_LY_CHUYEN_KHOA`, `QUAN_LY_LICH_HEN`, `XEM_BAO_CAO`, `CAU_HINH_HE_THONG`, `XEM_NHAT_KY`, `DAT_LICH_KHAM`, `KHAM_BENH`, `KE_DON_THUOC`
- Quy tắc tài liệu hồ sơ bệnh án (`tai_lieu_ho_so`): `BACSI` được tạo/cập nhật metadata/xóa mềm theo phạm vi phiếu khám phụ trách; `BENHNHAN` chỉ được xem/tải tài liệu của chính mình; `NHANVIEN` luôn nhận `403` cho nhóm API này.

### 3.1 Auth endpoints

- `POST /auth/login`
  - Request body:

```json
{
  "email": "bn@example.com",
  "mat_khau": "..."
}
```

  - Response body:

```json
{
  "data": {
    "access_token": "...",
    "token_type": "Bearer",
    "expires_in": 3600,
    "user": {
      "id": 10,
      "email": "bn@example.com",
      "vai_tro": "BENHNHAN",
      "trang_thai": "hoat_dong",
      "permissions": ["DAT_LICH_KHAM"],
      "hinh_anh": null
    }
  }
}
```

- `POST /auth/logout`
  - Request body: rỗng
  - Response body:

```json
{ "data": { "success": true }, "message": "Đăng xuất thành công" }
```

- `GET /auth/me`
  - Response body:

```json
{
  "data": {
    "id": 10,
    "email": "bn@example.com",
    "vai_tro": "BENHNHAN",
    "trang_thai": "hoat_dong",
    "permissions": ["DAT_LICH_KHAM"],
    "hinh_anh": null
  }
}
```

## 4) Enum + rule nguồn sự thật (theo schema.sql)

- `lich_hen.trang_thai`: `dang_cho`, `da_thanh_toan`, `da_xac_nhan`, `da_hoan_tat`, `da_huy`, `khong_den`
- `khung_gio_kham.trang_thai`: `trong`, `da_dat`, `khoa`
- `phieu_kham.trang_thai`: `tiep_nhan`, `dang_kham`, `cho_ke_don`, `hoan_thanh`
- `phieu_kham.tinh_trang`: `nhe`, `trung_binh`, `nang`
- `chi_dinh.trang_thai`: `cho_thuc_hien`, `da_hoan_thanh`, `huy`
- `don_thuoc.trang_thai`: `moi_tao`, `da_cap`, `huy`
- `chi_tiet_don_thuoc.thoi_diem`: `truoc_an`, `sau_an`, `trong_an`, `khong_lien_quan`

### 4.1 Ràng buộc nghiệp vụ bắt buộc

- Khi tạo `lich_hen`: bệnh nhân có thể chọn **nhiều** dịch vụ đơn lẻ và/hoặc **nhiều** gói khám.
  - Các mục được lưu ở bảng liên kết `dich_vu_lich_hen`.
  - Mỗi item phải có đúng 1 trong 2: `dich_vu_id` hoặc `goi_kham_id`.
  - Lịch hẹn hợp lệ khi có **ít nhất 1** item.
- Hủy/đổi lịch phải tuân theo cấu hình `cau_hinh_he_thong`:
  - `THOI_GIAN_HUY_TOI_THIEU` (giờ)
  - `THOI_GIAN_DOI_TOI_THIEU` (giờ)
  - `SO_NGAY_DAT_TRUOC_TOI_DA` (ngày)
- Với `phieu_kham.ma_icd10_chinh`:
  - Nếu gửi lên thì phải tồn tại trong danh mục `icd10.ma_icd10`.
  - Cho phép `NULL` khi bác sĩ nhập chẩn đoán tự do hoặc chưa chọn mã ICD-10.

### 4.2 Hiệu ứng trigger (ảnh hưởng API)

- Tạo lịch hẹn → slot chuyển `da_dat`.
- Chuyển lịch hẹn sang `da_huy` → slot mở lại `trong`.
- Check-in lần đầu (`gio_den_thuc_te` NULL → NOT NULL) → tự tạo `phieu_kham` trạng thái `tiep_nhan`.

## 5) Public catalog (không cần đăng nhập)

- `GET /chuyen-khoa?q=&trang_thai=&page=&per_page=`
  - Request body: rỗng
  - Response body (list):

```json
{
  "data": [
    {
      "id": 1,
      "ma_chuyen_khoa": "CK001",
      "ten_chuyen_khoa": "Nội tổng quát",
      "mo_ta": null,
      "hinh_anh": null,
      "vi_tri": "Tầng 1",
      "so_dien_thoai": "028-1234-5678",
      "truong_khoa_id": null,
      "thu_tu_hien_thi": 0,
      "trang_thai": "hoat_dong"
    }
  ],
  "meta": { "page": 1, "per_page": 20, "total": 1 },
  "links": { "self": "...", "next": null, "prev": null }
}
```

- `GET /bac-si?q=&chuyen_khoa_id=&trang_thai=&page=&per_page=`
  - Request body: rỗng
  - Response body (list):

```json
{
  "data": [
    {
      "id": 12,
      "ma_bac_si": "BS001",
      "ho_ten": "BS. Trần B",
      "so_dien_thoai": "090...",
      "hoc_vi": "bac_si",
      "kinh_nghiem": 5,
      "gioi_thieu": null,
      "trang_thai": "hoat_dong",
      "chuyen_khoa": [
        { "chuyen_khoa_id": 3, "la_chuyen_khoa_chinh": true }
      ]
    }
  ],
  "meta": { "page": 1, "per_page": 20, "total": 1 },
  "links": { "self": "...", "next": null, "prev": null }
}
```

- `GET /dich-vu?q=&chuyen_khoa_id=&loai_dich_vu=&trang_thai=&page=&per_page=`
  - Request body: rỗng
  - Response body (list):

```json
{
  "data": [
    {
      "id": 5,
      "ma_dich_vu": "DV001",
      "ten_dich_vu": "Khám nội tổng quát",
      "chuyen_khoa_id": 3,
      "gia_dich_vu": 200000,
      "thoi_gian_du_kien": 30,
      "yeu_cau_dac_biet": null,
      "loai_dich_vu": "kham_benh",
      "trang_thai": "hoat_dong"
    }
  ],
  "meta": { "page": 1, "per_page": 20, "total": 1 },
  "links": { "self": "...", "next": null, "prev": null }
}
```

- `GET /goi-kham?q=&trang_thai=&page=&per_page=`
  - Request body: rỗng
  - Response body (list):

```json
{
  "data": [
    {
      "id": 2,
      "ma_goi_kham": "GK001",
      "ten_goi_kham": "Gói khám tổng quát",
      "gia_goi_kham": 500000,
      "thoi_gian_du_kien": 90,
      "trang_thai": "hoat_dong"
    }
  ],
  "meta": { "page": 1, "per_page": 20, "total": 1 },
  "links": { "self": "...", "next": null, "prev": null }
}
```

- `GET /goi-kham/{id}` (kèm danh sách dịch vụ trong gói)
  - Request body: rỗng
  - Response body (single):

```json
{
  "data": {
    "id": 2,
    "ma_goi_kham": "GK001",
    "ten_goi_kham": "Gói khám tổng quát",
    "mo_ta": null,
    "gia_goi_kham": 500000,
    "thoi_gian_du_kien": 90,
    "trang_thai": "hoat_dong",
    "dich_vu": [
      { "dich_vu_id": 5, "thu_tu_hien_thi": 1 }
    ]
  }
}
```

- `GET /icd10?q=&nhom_chuong=&page=&per_page=`
  - Request body: rỗng
  - Response body (list):

```json
{
  "data": [
    {
      "ma_icd10": "R51",
      "ten_chan_doan": "Đau đầu",
      "nhom_chuong": "XVIII",
      "trang_thai": "hoat_dong"
    }
  ],
  "meta": { "page": 1, "per_page": 20, "total": 1 },
  "links": { "self": "...", "next": null, "prev": null }
}
```

## 6) Patient (BENHNHAN)

### 6.1 Đăng ký & hồ sơ

- `POST /benh-nhan/register`
  - Request body:

```json
{
  "email": "bn@example.com",
  "mat_khau": "...",
  "ho_ten": "Nguyễn Văn A",
  "ngay_sinh": "2000-01-01",
  "gioi_tinh": "nam",
  "so_dien_thoai": "0900000000",
  "dia_chi": "123 Đường ABC",
  "so_cccd": "012345678901",
  "nhom_mau": "O+"
}
```

  - Response body:

```json
{
  "data": {
    "benh_nhan": {
      "id": 1,
      "ma_benh_nhan": "BN000001",
      "ho_ten": "Nguyễn Văn A",
      "so_dien_thoai": "0900000000"
    }
  }
}
```

- `GET /benh-nhan/me`
  - Request body: rỗng
  - Response body:

```json
{
  "data": {
    "id": 1,
    "ma_benh_nhan": "BN000001",
    "nguoi_dung_id": 10,
    "ho_ten": "Nguyễn Văn A",
    "ngay_sinh": "2000-01-01",
    "gioi_tinh": "nam",
    "so_dien_thoai": "0900000000",
    "email": "bn@example.com",
    "so_cccd": "012345678901",
    "dia_chi": "123 Đường ABC",
    "nhom_mau": "O+",
    "tien_su_di_ung": null,
    "tien_su_benh": null,
    "trang_thai": "hoat_dong",
    "hinh_anh": null
  }
}
```

- `PATCH /benh-nhan/me`
  - Request body (cho phép cập nhật một phần):

```json
{
  "ho_ten": "Nguyễn Văn A",
  "so_dien_thoai": "0900000000",
  "dia_chi": "123 Đường ABC",
  "nhom_mau": "O+",
  "tien_su_di_ung": "Dị ứng penicillin",
  "tien_su_benh": "Tăng huyết áp"
}
```

  - Response body:

```json
{ "data": { "success": true }, "message": "Cập nhật hồ sơ thành công" }
```

- `POST /nguoi-dung/me/avatar`
  - Request body: multipart/form-data (field: `file`)
  - Response body:

```json
{ "data": { "hinh_anh": "https://.../avatar.png" } }
```

### 6.2 Slot trống theo bác sĩ/ngày

- `GET /bac-si/{bac_si_id}/slots?ngay=YYYY-MM-DD`
  - Request body: rỗng
  - Ghi chú:
    - Nguồn dữ liệu: `khung_gio_kham` (lọc `trong`) theo `lich_lam_viec_bac_si` của bác sĩ trong ngày.
    - Nếu ngày là ngày nghỉ lễ hoặc bác sĩ nghỉ: trả về `is_holiday=true` hoặc `is_doctor_off=true` và `slots=[]`.
  - Response body:

```json
{
  "data": {
    "bac_si_id": 12,
    "ngay": "2026-02-01",
    "is_holiday": false,
    "is_doctor_off": false,
    "slots": [
      { "id": 1001, "gio_bat_dau": "08:00:00", "gio_ket_thuc": "08:30:00", "trang_thai": "trong" }
    ]
  }
}
```

### 6.3 Đặt lịch

- `POST /lich-hen` (yêu cầu login)
  - Request body (items: nhiều dịch vụ/gói khám):

```json
{
  "benh_nhan_id": null,
  "bac_si_id": 12,
  "chuyen_khoa_id": 3,
  "khung_gio_id": 1001,
  "ngay_hen": "2026-02-01",
  "items": [
    { "dich_vu_id": 5, "so_luong": 1 },
    { "goi_kham_id": 2, "so_luong": 1 }
  ],
  "ly_do_kham": "Đau đầu",
  "ghi_chu": ""
}
```

  - Ghi chú: với bệnh nhân tự đặt, server tự suy ra `benh_nhan_id` từ token (bỏ qua `benh_nhan_id` nếu client gửi).
  - Response body:

```json
{
  "data": {
    "id": 9001,
    "ma_lich_hen": "LH20260130001",
    "benh_nhan_id": 1,
    "bac_si_id": 12,
    "chuyen_khoa_id": 3,
    "khung_gio_id": 1001,
    "ngay_hen": "2026-02-01",
    "items": [
      {
        "dich_vu_id": 5,
        "goi_kham_id": null,
        "so_luong": 1
      },
      {
        "dich_vu_id": null,
        "goi_kham_id": 2,
        "so_luong": 1
      }
    ],
    "trang_thai": "dang_cho",
    "gio_den_thuc_te": null
  }
}
```

  - Lỗi thường gặp:
    - `409`: slot vừa bị đặt
    - `422`: items rỗng hoặc item không hợp lệ (không đúng 1 trong 2 `dich_vu_id`/`goi_kham_id`)

### 6.4 Lịch sử / chi tiết / hủy / đổi

- `GET /lich-hen?mine=true&tu_ngay=&den_ngay=&trang_thai=&page=&per_page=`
  - Request body: rỗng
  - Response body (list):

```json
{
  "data": [
    {
      "id": 9001,
      "ma_lich_hen": "LH20260130001",
      "ngay_hen": "2026-02-01",
      "bac_si_id": 12,
      "chuyen_khoa_id": 3,
      "khung_gio_id": 1001,
      "items_summary": {
        "so_dich_vu": 1,
        "so_goi_kham": 1
      },
      "trang_thai": "dang_cho"
    }
  ],
  "meta": { "page": 1, "per_page": 20, "total": 1 },
  "links": { "self": "...", "next": null, "prev": null }
}
```

- `GET /lich-hen/{id}`
  - Request body: rỗng
  - Response body:

```json
{
  "data": {
    "id": 9001,
    "ma_lich_hen": "LH20260130001",
    "benh_nhan_id": 1,
    "bac_si_id": 12,
    "chuyen_khoa_id": 3,
    "khung_gio_id": 1001,
    "ngay_hen": "2026-02-01",
    "items": [
      { "dich_vu_id": 5, "goi_kham_id": null, "so_luong": 1 },
      { "dich_vu_id": null, "goi_kham_id": 2, "so_luong": 1 }
    ],
    "ly_do_kham": "Đau đầu",
    "trang_thai": "dang_cho",
    "gio_den_thuc_te": null,
    "nguoi_tiep_nhan_id": null,
    "ly_do_huy_id": null,
    "ly_do_huy_khac": null,
    "ghi_chu": "",
    "ghi_chu_noi_bo": null
  }
}
```

- `POST /lich-hen/{id}/cancel` request: `{ ly_do_huy_id, ly_do_huy_khac? }`
  - Request body:

```json
{ "ly_do_huy_id": 1, "ly_do_huy_khac": null }
```

  - Response body:

```json
{ "data": { "id": 9001, "trang_thai": "da_huy" }, "message": "Hủy lịch thành công" }
```

- `POST /lich-hen/{id}/reschedule` request: `{ ngay_hen_moi, khung_gio_id_moi, bac_si_id_moi?, ly_do? }`
  - Request body:

```json
{
  "ngay_hen_moi": "2026-02-05",
  "khung_gio_id_moi": 2001,
  "bac_si_id_moi": 12,
  "ly_do": "Đổi lịch cá nhân"
}
```

  - Response body:

```json
{
  "data": {
    "id": 9001,
    "ngay_hen": "2026-02-05",
    "khung_gio_id": 2001
  },
  "message": "Đổi lịch thành công"
}
```

### 6.5 Tài liệu hồ sơ bệnh án (bệnh nhân)

- `GET /benh-nhan/me/tai-lieu-ho-so?tu_ngay=&den_ngay=&loai_tai_lieu=&page=&per_page=`
  - Request body: rỗng
  - Response body (list):

```json
{
  "data": [
    {
      "id": 90001,
      "ma_tai_lieu": "TL20260130001",
      "phieu_kham_id": 3001,
      "loai_tai_lieu": "ket_qua_xet_nghiem",
      "ten_tai_lieu": "KQ xét nghiệm máu",
      "file_name": "kq_xn.pdf",
      "file_url": "https://.../kq_xn.pdf",
      "ngay_tao": "2026-02-01",
      "bac_si_id": 12
    }
  ],
  "meta": { "page": 1, "per_page": 20, "total": 1 },
  "links": { "self": "...", "next": null, "prev": null }
}
```

- `GET /benh-nhan/me/tai-lieu-ho-so/{id}`
  - Request body: rỗng
  - Response body:

```json
{
  "data": {
    "id": 90001,
    "ma_tai_lieu": "TL20260130001",
    "phieu_kham_id": 3001,
    "loai_tai_lieu": "ket_qua_xet_nghiem",
    "ten_tai_lieu": "KQ xét nghiệm máu",
    "file_name": "kq_xn.pdf",
    "file_url": "https://.../kq_xn.pdf",
    "ngay_tao": "2026-02-01",
    "ghi_chu": null
  }
}
```

  - Lỗi thường gặp:
    - `403`: tài liệu không thuộc bệnh nhân đăng nhập
    - `404`: không tồn tại tài liệu hoặc đã bị ẩn/xóa mềm

## 7) Staff (NHANVIEN)

**Giới hạn quyền:** Nhân viên không có endpoint truy cập `tai_lieu_ho_so` (xem/tải/sửa/xóa). Mọi truy cập trái quyền trả về `403`.

- `POST /benh-nhan` (tạo walk-in, `nguoi_dung_id = null`)
  - Request body:

```json
{
  "ho_ten": "Nguyễn Văn C",
  "ngay_sinh": "1990-05-20",
  "gioi_tinh": "nu",
  "so_dien_thoai": "0911111111",
  "email": null,
  "so_cccd": null,
  "dia_chi": "...",
  "nguoi_lien_he": "Nguyễn Văn D",
  "sdt_nguoi_lien_he": "0909999999",
  "nhom_mau": null,
  "tien_su_di_ung": null,
  "tien_su_benh": null,
  "ghi_chu": ""
}
```

  - Response body:

```json
{
  "data": {
    "id": 2,
    "ma_benh_nhan": "BN000002",
    "nguoi_dung_id": null
  }
}
```

- `GET /benh-nhan?q=`
  - Request body: rỗng
  - Response body (list):

```json
{
  "data": [
    { "id": 1, "ma_benh_nhan": "BN000001", "ho_ten": "Nguyễn Văn A", "so_dien_thoai": "0900000000" }
  ],
  "meta": { "page": 1, "per_page": 20, "total": 1 },
  "links": { "self": "...", "next": null, "prev": null }
}
```

- `GET /lich-hen?ngay=YYYY-MM-DD&bac_si_id=&trang_thai=`
  - Request body: rỗng
  - Response body (list):

```json
{
  "data": [
    {
      "id": 9001,
      "ma_lich_hen": "LH20260130001",
      "benh_nhan_id": 1,
      "bac_si_id": 12,
      "chuyen_khoa_id": 3,
      "khung_gio_id": 1001,
      "ngay_hen": "2026-02-01",
      "trang_thai": "da_xac_nhan",
      "gio_den_thuc_te": null
    }
  ],
  "meta": { "page": 1, "per_page": 20, "total": 1 },
  "links": { "self": "...", "next": null, "prev": null }
}
```

### 7.1 Check-in

- `POST /lich-hen/{id}/check-in`
  - Request body:

```json
{ "gio_den_thuc_te": "08:10:00" }
```

  - Response body:

```json
{
  "data": {
    "id": 9001,
    "gio_den_thuc_te": "08:10:00",
    "nguoi_tiep_nhan_id": 20
  },
  "message": "Check-in thành công"
}
```

  - Side-effect: set `nguoi_tiep_nhan_id = auth_user.id` và trigger tạo `phieu_kham` (nếu lần đầu)

### 7.2 Xác nhận lịch hẹn

- `POST /lich-hen/{id}/confirm` (đổi `trang_thai` → `da_xac_nhan` nếu hợp lệ)
  - Request body: rỗng
  - Response body:

```json
{ "data": { "id": 9001, "trang_thai": "da_xac_nhan" }, "message": "Đã xác nhận lịch hẹn" }
```

## 8) Doctor (BACSI)

### 8.1 Lịch làm việc & sinh slot

- `POST /lich-lam-viec` (Admin quản lý ca template)
  - Request body:

```json
{
  "ma_ca": "CA_SANG",
  "ten_ca": "Ca sáng",
  "thu_trong_tuan": 1,
  "gio_bat_dau": "08:00:00",
  "gio_ket_thuc": "12:00:00",
  "thoi_luong_kham": 30,
  "ghi_chu": ""
}
```

  - Response body:

```json
{
  "data": {
    "id": 501,
    "ma_ca": "CA_SANG",
    "ten_ca": "Ca sáng",
    "thu_trong_tuan": 1,
    "gio_bat_dau": "08:00:00",
    "gio_ket_thuc": "12:00:00",
    "thoi_luong_kham": 30,
    "trang_thai": "hoat_dong"
  }
}
```

- `POST /bac-si/{bac_si_id}/lich-lam-viec` (gán ca template cho bác sĩ theo ngày)
  - Request body:

```json
{
  "ngay_lam_viec": "2026-02-01",
  "lich_lam_viec_id": 501,
  "phong_kham_id": 2,
  "ghi_chu": ""
}
```

  - Response body:

```json
{
  "data": {
    "id": 900,
    "bac_si_id": 12,
    "lich_lam_viec_id": 501,
    "phong_kham_id": 2,
    "ngay_lam_viec": "2026-02-01",
    "trang_thai": "hoat_dong"
  }
}
```

  - Ghi chú: endpoint này tạo bản ghi `lich_lam_viec_bac_si` (phân công ca theo ngày). Giờ bắt đầu/kết thúc và thời lượng slot được suy ra từ ca template (`lich_lam_viec`).

- `GET /lich-lam-viec-bac-si?bac_si_id=&tu_ngay=&den_ngay=&trang_thai=&page=&per_page=` (danh sách phân công ca theo ngày)
  - Request body: rỗng
  - Response body (list):

```json
{
  "data": [
    {
      "id": 900,
      "bac_si_id": 12,
      "ngay_lam_viec": "2026-02-01",
      "phong_kham_id": 2,
      "trang_thai": "hoat_dong",
      "ca": {
        "id": 501,
        "ma_ca": "CA_SANG",
        "ten_ca": "Ca sáng",
        "thu_trong_tuan": 1,
        "gio_bat_dau": "08:00:00",
        "gio_ket_thuc": "12:00:00",
        "thoi_luong_kham": 30,
        "trang_thai": "hoat_dong"
      }
    }
  ],
  "meta": { "page": 1, "per_page": 20, "total": 1 },
  "links": { "self": "...", "next": null, "prev": null }
}
```

- `POST /lich-lam-viec-bac-si/{id}/generate-slots`
  - Request body (optional):

```json
{ "overwrite": false }
```

  - Response body:

```json
{ "data": { "created": 8 }, "message": "Đã sinh khung giờ khám" }
```

  - Ghi chú: sinh các dòng `khung_gio_kham` với `lich_lam_viec_bac_si_id = {id}` theo `gio_bat_dau/gio_ket_thuc/thoi_luong_kham` của ca template.

- `GET /lich-lam-viec?thu_trong_tuan=&trang_thai=&page=&per_page=`
  - Request body: rỗng
  - Response body (list):

```json
{
  "data": [
    {
      "id": 501,
      "ma_ca": "CA_SANG",
      "ten_ca": "Ca sáng",
      "thu_trong_tuan": 1,
      "gio_bat_dau": "08:00:00",
      "gio_ket_thuc": "12:00:00",
      "thoi_luong_kham": 30,
      "trang_thai": "hoat_dong"
    }
  ],
  "meta": { "page": 1, "per_page": 20, "total": 1 },
  "links": { "self": "...", "next": null, "prev": null }
}
```

### 8.2 Phiếu khám

- `GET /phieu-kham?ngay=&trang_thai=&page=&per_page=`
  - Request body: rỗng
  - Response body (list):

```json
{
  "data": [
    {
      "id": 3001,
      "ma_phieu_kham": "PK20260130001",
      "lich_hen_id": 9001,
      "benh_nhan_id": 1,
      "bac_si_id": 12,
      "thoi_gian_tiep_nhan": "2026-01-30T08:10:00Z",
      "trang_thai": "tiep_nhan"
    }
  ],
  "meta": { "page": 1, "per_page": 20, "total": 1 },
  "links": { "self": "...", "next": null, "prev": null }
}
```

- `GET /phieu-kham/{id}`
  - Request body: rỗng
  - Response body:

```json
{
  "data": {
    "id": 3001,
    "ma_phieu_kham": "PK20260130001",
    "lich_hen_id": 9001,
    "benh_nhan_id": 1,
    "bac_si_id": 12,
    "mach": null,
    "nhiet_do": null,
    "huyet_ap": null,
    "can_nang": null,
    "chieu_cao": null,
    "trieu_chung": null,
    "ket_qua_kham": null,
    "chan_doan": null,
    "ma_icd10_chinh": null,
    "icd10": null,
    "tinh_trang": null,
    "huong_dieu_tri": null,
    "loi_dan": null,
    "hen_tai_kham": null,
    "ghi_chu_noi_bo": null,
    "trang_thai": "tiep_nhan"
  }
}
```

- `PATCH /phieu-kham/{id}` (sinh hiệu + chẩn đoán + hướng điều trị + lời dặn + hẹn tái khám)
  - Request body (partial update):

```json
{
  "mach": 80,
  "nhiet_do": 37.2,
  "huyet_ap": "120/80",
  "can_nang": 65.5,
  "chieu_cao": 170,
  "trieu_chung": "Đau đầu",
  "ket_qua_kham": "...",
  "chan_doan": "Đau đầu",
  "ma_icd10_chinh": "R51",
  "tinh_trang": "nhe",
  "huong_dieu_tri": "...",
  "loi_dan": "Nghỉ ngơi",
  "hen_tai_kham": "2026-02-15",
  "ghi_chu_noi_bo": ""
}
```

  - Validation bổ sung:
    - `422` nếu `ma_icd10_chinh` không tồn tại trong bảng `icd10`.

  - Response body:

```json
{ "data": { "success": true }, "message": "Đã lưu phiếu khám" }
```

- `POST /phieu-kham/{id}/transition` body: `{ to: "tiep_nhan|dang_kham|cho_ke_don|hoan_thanh" }`
  - Request body:

```json
{ "to": "dang_kham" }
```

  - Response body:

```json
{ "data": { "id": 3001, "trang_thai": "dang_kham" }, "message": "Cập nhật trạng thái phiếu khám" }
```

### 8.3 Chỉ định dịch vụ

- `POST /phieu-kham/{phieu_kham_id}/chi-dinh` body: `{ items: [{ dich_vu_id, so_luong?, ngay_chi_dinh, ghi_chu? }] }`
  - Request body:

```json
{
  "items": [
    { "dich_vu_id": 10, "so_luong": 1, "ngay_chi_dinh": "2026-02-01", "ghi_chu": "Lấy máu buổi sáng" }
  ]
}
```

  - Response body:

```json
{ "data": { "created": 1 }, "message": "Đã tạo chỉ định" }
```

- `GET /phieu-kham/{phieu_kham_id}/chi-dinh`
  - Request body: rỗng
  - Response body (list):

```json
{
  "data": [
    {
      "id": 7001,
      "phieu_kham_id": 3001,
      "bac_si_id": 12,
      "dich_vu_id": 10,
      "so_luong": 1,
      "ngay_chi_dinh": "2026-02-01",
      "trang_thai": "cho_thuc_hien",
      "ghi_chu": "Lấy máu buổi sáng"
    }
  ]
}
```

- `PATCH /chi-dinh/{id}` (update `trang_thai`, `ghi_chu`)
  - Request body:

```json
{ "trang_thai": "da_hoan_thanh", "ghi_chu": "Đã có kết quả" }
```

  - Response body:

```json
{ "data": { "id": 7001, "trang_thai": "da_hoan_thanh" }, "message": "Cập nhật chỉ định" }
```

### 8.4 Kê đơn thuốc

- `POST /phieu-kham/{phieu_kham_id}/don-thuoc` body: `{ ngay_ke, ghi_chu? }`
  - Request body:

```json
{ "ngay_ke": "2026-02-01", "ghi_chu": "Uống đủ nước" }
```

  - Response body:

```json
{
  "data": {
    "id": 8001,
    "ma_don_thuoc": "DT20260130001",
    "phieu_kham_id": 3001,
    "ngay_ke": "2026-02-01",
    "trang_thai": "moi_tao"
  }
}
```

- `POST /don-thuoc/{don_thuoc_id}/items` body: `{ items: [{ thuoc_id, so_luong, lieu_dung, thoi_diem, so_ngay, ghi_chu? }] }`
  - Request body:

```json
{
  "items": [
    {
      "thuoc_id": 1,
      "so_luong": 10,
      "lieu_dung": "2 viên x 2 lần/ngày",
      "thoi_diem": "sau_an",
      "so_ngay": 5,
      "ghi_chu": null
    }
  ]
}
```

  - Response body:

```json
{ "data": { "created": 1 }, "message": "Đã thêm thuốc vào đơn" }
```

- `PATCH /don-thuoc/{id}` (update `trang_thai`: `moi_tao|da_cap|huy`)
  - Request body:

```json
{ "trang_thai": "da_cap" }
```

  - Response body:

```json
{ "data": { "id": 8001, "trang_thai": "da_cap" }, "message": "Cập nhật đơn thuốc" }
```

- `GET /thuoc?q=`
  - Request body: rỗng
  - Response body (list):

```json
{
  "data": [
    {
      "id": 1,
      "ma_thuoc": "T001",
      "ten_thuoc": "Paracetamol",
      "don_vi": "vien",
      "duong_dung": "uong",
      "trang_thai": "hoat_dong"
    }
  ],
  "meta": { "page": 1, "per_page": 20, "total": 1 },
  "links": { "self": "...", "next": null, "prev": null }
}
```

### 8.5 Tài liệu hồ sơ

- `POST /phieu-kham/{phieu_kham_id}/tai-lieu` body: `{ loai_tai_lieu, ten_tai_lieu, file_url, file_name, ngay_tao, ghi_chu? }`
  - Request body:

```json
{
  "loai_tai_lieu": "ket_qua_xet_nghiem",
  "ten_tai_lieu": "KQ xét nghiệm máu",
  "file_url": "https://.../kq_xn.pdf",
  "file_name": "kq_xn.pdf",
  "ngay_tao": "2026-02-01",
  "ghi_chu": null
}
```

  - Response body:

```json
{
  "data": {
    "id": 90001,
    "ma_tai_lieu": "TL20260130001",
    "phieu_kham_id": 3001,
    "loai_tai_lieu": "ket_qua_xet_nghiem",
    "ten_tai_lieu": "KQ xét nghiệm máu",
    "file_url": "https://.../kq_xn.pdf",
    "file_name": "kq_xn.pdf",
    "ngay_tao": "2026-02-01"
  }
}
```

- `GET /phieu-kham/{phieu_kham_id}/tai-lieu`
  - Request body: rỗng
  - Response body (list):

```json
{
  "data": [
    {
      "id": 90001,
      "ma_tai_lieu": "TL20260130001",
      "phieu_kham_id": 3001,
      "loai_tai_lieu": "ket_qua_xet_nghiem",
      "ten_tai_lieu": "KQ xét nghiệm máu",
      "file_name": "kq_xn.pdf",
      "file_url": "https://.../kq_xn.pdf",
      "ngay_tao": "2026-02-01",
      "ghi_chu": null
    }
  ]
}
```

- `PATCH /tai-lieu-ho-so/{id}` (cập nhật metadata)
  - Request body:

```json
{
  "ten_tai_lieu": "KQ xét nghiệm máu (đã xác nhận)",
  "ghi_chu": "Bản final"
}
```

  - Response body:

```json
{ "data": { "id": 90001, "ten_tai_lieu": "KQ xét nghiệm máu (đã xác nhận)" }, "message": "Cập nhật tài liệu thành công" }
```

- `DELETE /tai-lieu-ho-so/{id}` (xóa mềm/ẩn tài liệu)
  - Request body: rỗng
  - Response body:

```json
{ "data": { "id": 90001, "deleted": true }, "message": "Đã ẩn tài liệu" }
```

- RBAC bắt buộc cho nhóm 8.5:
  - `BACSI`: chỉ thao tác trên tài liệu thuộc `phieu_kham` do mình phụ trách.
  - `BENHNHAN`: chỉ dùng API mục `6.5` để xem/tải tài liệu của chính mình.
  - `NHANVIEN`: không có quyền truy cập, trả về `403`.

## 9) Admin

### 9.1 CRUD danh mục

- `/chuyen-khoa`, `/phong-kham`, `/dich-vu`, `/goi-kham`, `/thuoc`

Áp dụng chung cho các tài nguyên danh mục ở trên (yêu cầu quyền phù hợp).

- `GET /<resource>?page=&per_page=&q=&trang_thai=`
  - Request body: rỗng
  - Response body (list) — ví dụ `GET /chuyen-khoa`:

```json
{
  "data": [
    {
      "id": 1,
      "ma_chuyen_khoa": "CK001",
      "ten_chuyen_khoa": "Nội tổng quát",
      "mo_ta": null,
      "trang_thai": "hoat_dong"
    }
  ],
  "meta": { "page": 1, "per_page": 20, "total": 1 },
  "links": { "self": "...", "next": null, "prev": null }
}
```

- `POST /<resource>`
  - Request body — ví dụ `POST /chuyen-khoa`:

```json
{
  "ma_chuyen_khoa": "CK010",
  "ten_chuyen_khoa": "Tim mạch",
  "mo_ta": "",
  "trang_thai": "hoat_dong"
}
```

  - Response body:

```json
{
  "data": {
    "id": 10,
    "ma_chuyen_khoa": "CK010",
    "ten_chuyen_khoa": "Tim mạch",
    "mo_ta": "",
    "trang_thai": "hoat_dong"
  }
}
```

- `PATCH /<resource>/{id}`
  - Request body (partial):

```json
{ "ten_chuyen_khoa": "Tim mạch (sửa)", "trang_thai": "hoat_dong" }
```

  - Response body:

```json
{ "data": { "success": true }, "message": "Đã cập nhật" }
```

- `DELETE /<resource>/{id}`
  - Request body: rỗng
  - Response body:

```json
{ "data": { "success": true }, "message": "Đã xóa" }
```

Gói khám chi tiết:

- `POST /goi-kham/{id}/dich-vu` body: `{ dich_vu_id, thu_tu_hien_thi? }`
- `DELETE /goi-kham/{id}/dich-vu/{dich_vu_id}`

  - `POST /goi-kham/{id}/dich-vu`
    - Request body:

```json
{ "dich_vu_id": 10, "thu_tu_hien_thi": 1 }
```

    - Response body:

```json
{ "data": { "success": true }, "message": "Đã thêm dịch vụ vào gói" }
```

  - `DELETE /goi-kham/{id}/dich-vu/{dich_vu_id}`
    - Request body: rỗng
    - Response body:

```json
{ "data": { "success": true }, "message": "Đã xoá dịch vụ khỏi gói" }
```

### 9.2 Người dùng & RBAC

- `/nguoi-dung`, `/bac-si`, `/nhan-vien`, `/benh-nhan`
- `GET /vai-tro`, `GET /quyen`
- `PUT /vai-tro/{vai_tro_id}/quyen` body: `{ quyen_ids: [1,2,3] }`

- `GET /nguoi-dung?page=&per_page=&q=&vai_tro=&trang_thai=`
  - Request body: rỗng
  - Response body (list):

```json
{
  "data": [
    {
      "id": 10,
      "ho_ten": "Nguyễn Văn A",
      "email": "a@example.com",
      "so_dien_thoai": "0900000000",
      "vai_tro": "NHANVIEN",
      "trang_thai": "hoat_dong"
    }
  ],
  "meta": { "page": 1, "per_page": 20, "total": 1 },
  "links": { "self": "...", "next": null, "prev": null }
}
```

- `POST /nguoi-dung`
  - Request body:

```json
{
  "ho_ten": "Nguyễn Văn A",
  "email": "a@example.com",
  "so_dien_thoai": "0900000000",
  "mat_khau": "P@ssw0rd!",
  "vai_tro": "NHANVIEN",
  "trang_thai": "hoat_dong"
}
```

  - Response body:

```json
{
  "data": {
    "id": 11,
    "ho_ten": "Nguyễn Văn A",
    "email": "a@example.com",
    "so_dien_thoai": "0900000000",
    "vai_tro": "NHANVIEN",
    "trang_thai": "hoat_dong"
  }
}
```

- `PATCH /nguoi-dung/{id}`
  - Request body (partial):

```json
{ "ho_ten": "Nguyễn Văn A (sửa)", "trang_thai": "hoat_dong" }
```

  - Response body:

```json
{ "data": { "success": true }, "message": "Đã cập nhật người dùng" }
```

- `PATCH /nguoi-dung/{id}/reset-password`
  - Request body:

```json
{ "mat_khau_moi": "NewP@ssw0rd!" }
```

  - Response body:

```json
{ "data": { "success": true }, "message": "Đã đặt lại mật khẩu" }
```

- `GET /vai-tro`
  - Request body: rỗng
  - Response body:

```json
{
  "data": [
    { "id": 1, "ma_vai_tro": "ADMIN", "ten_vai_tro": "Quản trị", "trang_thai": "hoat_dong" },
    { "id": 2, "ma_vai_tro": "BACSI", "ten_vai_tro": "Bác sĩ", "trang_thai": "hoat_dong" },
    { "id": 3, "ma_vai_tro": "NHANVIEN", "ten_vai_tro": "Nhân viên", "trang_thai": "hoat_dong" },
    { "id": 4, "ma_vai_tro": "BENHNHAN", "ten_vai_tro": "Bệnh nhân", "trang_thai": "hoat_dong" }
  ]
}
```

- `GET /quyen`
  - Request body: rỗng
  - Response body:

```json
{
  "data": [
    { "id": 1, "ma_quyen": "QUAN_LY_NGUOI_DUNG", "ten_quyen": "Quản lý người dùng", "trang_thai": "hoat_dong" }
  ]
}
```

- `PUT /vai-tro/{vai_tro_id}/quyen`
  - Request body:

```json
{ "quyen_ids": [1, 2, 3] }
```

  - Response body:

```json
{ "data": { "success": true }, "message": "Đã cập nhật quyền cho vai trò" }
```

### 9.3 Cấu hình hệ thống

- `GET /cau-hinh?nhom=lich_hen`
- `PATCH /cau-hinh/{khoa}` body: `{ gia_tri: "..." }`

- `GET /cau-hinh?nhom=lich_hen`
  - Request body: rỗng
  - Response body:

```json
{
  "data": [
    { "khoa": "THOI_GIAN_HUY_TOI_THIEU", "gia_tri": "120" },
    { "khoa": "THOI_GIAN_DOI_TOI_THIEU", "gia_tri": "1440" },
    { "khoa": "SO_NGAY_DAT_TRUOC_TOI_DA", "gia_tri": "30" }
  ]
}
```

- `PATCH /cau-hinh/{khoa}`
  - Request body:

```json
{ "gia_tri": "180" }
```

  - Response body:

```json
{ "data": { "success": true }, "message": "Đã cập nhật cấu hình" }
```

### 9.4 Báo cáo

- `GET /reports/lich-hen/ngay`
- `GET /reports/bac-si`

- `GET /reports/lich-hen/ngay?tu_ngay=&den_ngay=`
  - Request body: rỗng
  - Response body:

```json
{
  "data": {
    "tu_ngay": "2026-02-01",
    "den_ngay": "2026-02-07",
    "tong": 120,
    "theo_trang_thai": {
      "dang_cho": 10,
      "da_thanh_toan": 20,
      "da_xac_nhan": 50,
      "da_hoan_tat": 30,
      "da_huy": 5,
      "khong_den": 5
    }
  }
}
```

- `GET /reports/bac-si?tu_ngay=&den_ngay=`
  - Request body: rỗng
  - Response body:

```json
{
  "data": {
    "tu_ngay": "2026-02-01",
    "den_ngay": "2026-02-07",
    "items": [
      {
        "bac_si_id": 12,
        "ho_ten": "BS. Trần B",
        "so_ca": 10,
        "so_lich_hen": 40,
        "so_da_hoan_tat": 30,
        "so_khong_den": 2
      }
    ]
  }
}
```

## 10) Thông báo

- `GET /thong-bao?da_doc=false&page=&per_page=`
- `POST /thong-bao/{id}/read`

- `GET /thong-bao?da_doc=&page=&per_page=`
  - Request body: rỗng
  - Response body (list):

```json
{
  "data": [
    {
      "id": 1,
      "tieu_de": "Nhắc lịch khám",
      "noi_dung": "Bạn có lịch hẹn ngày 2026-02-01 08:30",
      "da_doc": false,
      "created_at": "2026-01-31T10:00:00Z"
    }
  ],
  "meta": { "page": 1, "per_page": 20, "total": 1 },
  "links": { "self": "...", "next": null, "prev": null }
}
```

- `POST /thong-bao/{id}/read`
  - Request body: rỗng
  - Response body:

```json
{ "data": { "success": true }, "message": "Đã đánh dấu đã đọc" }
```

## 11) Tra cứu nhanh lịch hẹn (public-lite)

- `GET /lich-hen/lookup?ma_lich_hen=...&so_dien_thoai=...`

- `GET /lich-hen/lookup?ma_lich_hen=&so_dien_thoai=`
  - Request body: rỗng
  - Response body (nếu tìm thấy):

```json
{
  "data": {
    "id": 9001,
    "ma_lich_hen": "LH20260130001",
    "ngay_hen": "2026-02-01",
    "gio_hen": "08:30:00",
    "trang_thai": "da_xac_nhan",
    "benh_nhan": { "ho_ten": "Nguyễn Văn A", "so_dien_thoai": "0900000000" },
    "bac_si": { "id": 12, "ho_ten": "BS. Trần B" },
    "phong_kham": { "id": 2, "ten_phong": "Phòng 102" },
    "items_summary": {
      "so_dich_vu": 1,
      "so_goi_kham": 1
    }
  }
}
```

## 12) Mapping Forms → API (tóm tắt)

- Đặt lịch: `GET /bac-si/{id}/slots` + `POST /lich-hen`
- Hủy lịch: `POST /lich-hen/{id}/cancel`
- Đổi lịch: `POST /lich-hen/{id}/reschedule`
- Check-in: `POST /lich-hen/{id}/check-in` → `GET /phieu-kham?lich_hen_id=...` (tuỳ chọn implement)
- Phiếu khám: `GET/PATCH /phieu-kham/{id}`
- Danh mục ICD-10: `GET /icd10`
- Phiếu chỉ định: `POST /phieu-kham/{id}/chi-dinh`
- Kê đơn: `POST /phieu-kham/{id}/don-thuoc` + `POST /don-thuoc/{id}/items`