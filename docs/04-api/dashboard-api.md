# API Tổng Quan Bệnh Nhân (Dashboard Patient)

Base URL: `/api/v1`

## 📱 Endpoint

**Request:** `GET /api/v1/dashboard/patient`  
**Auth:** Yêu cầu Bearer Token (role: BENHNHAN)  
**Method:** GET  
**Content-Type:** application/json

---

## 📤 Request

```bash
curl -X GET "http://localhost:8000/api/v1/dashboard/patient" \
  -H "Authorization: Bearer {access_token}" \
  -H "Accept: application/json"
```

---

## 📥 Response (200 OK)

```json
{
  "data": {
    "patient_info": {
      "id": 1,
      "ma_benh_nhan": "BN123456",
      "ho_ten": "Nguyễn Văn A",
      "ngay_sinh": "1990-05-15",
      "tuoi": 33,
      "gioi_tinh": "nam",
      "nhom_mau": "O+",
      "so_dien_thoai": "0912345678",
      "email": "patient@example.com",
      "dia_chi": "123 Đường ABC, TP HCM"
    },
    "upcoming_appointments": [
      {
        "id": 1,
        "ma_lich_hen": "LH20260318001",
        "ngay_hen": "2026-03-20",
        "gio_hen": "08:30:00",
        "gio_ket_thuc": "09:00:00",
        "bac_si": {
          "id": 5,
          "ho_ten": "BS. Lê Minh Thành",
          "ma_bac_si": "BS001"
        },
        "chuyen_khoa": {
          "id": 1,
          "ten_chuyen_khoa": "Chuyên khoa Nội"
        },
        "phong_kham": {
          "id": 1,
          "ma_phong": "P204",
          "ten_phong": "Phòng khám 204"
        },
        "dich_vu": [
          {
            "ten": "Khám Nội Tổng Quát",
            "gia": 500000
          }
        ],
        "trang_thai": "da_xac_nhan",
        "ly_do_kham": "Khám định kỳ"
      }
    ],
    "recent_visit_history": [
      {
        "id": 1,
        "ma_phieu_kham": "PK20260310001",
        "ngay_kham": "2026-03-10",
        "bac_si": {
          "ho_ten": "BS. Trần Hoa",
          "ma_bac_si": "BS002"
        },
        "chuyen_khoa": "Chuyên khoa Ngoại",
        "dich_vu": "Xét nghiệm máu",
        "chan_doan": "Thiếu máu nhẹ",
        "trang_thai": "hoan_thanh",
        "ly_do_kham": "Khám sàng lọc"
      }
    ],
    "health_profile": {
      "tien_su_benh": "Cao huyết áp, đau dạ dày mãn tính. Bệnh nhân từng điều trị nội trú năm 2022 và đang theo dõi định kỳ.",
      "tien_su_di_ung": "Hải sản, phấn hoa, một số loại thuốc kháng sinh.",
      "nhom_mau": "O+",
      "ghi_chu": "Bệnh nhân cần uống thuốc huyết áp hàng ngày",
      "nguoi_lien_he": "Nguyễn Thị B (Vợ)",
      "sdt_nguoi_lien_he": "0987654321"
    },
    "health_reminder": {
      "title": "Nhắc nhở sức khỏe",
      "message": "Uống ít nhất 2 lít nước mỗi ngày và đừng quên kiểm tra sức khỏe định kỳ.",
      "icon": "heart_check_fill"
    }
  },
  "meta": {
    "timestamp": "2026-03-18T10:30:00Z"
  }
}
```

---

## ⚠️ Error Responses

### 401 Unauthorized
```json
{
  "error": {
    "code": "UNAUTHENTICATED",
    "message": "Token hết hạn hoặc não hợp lệ",
    "trace_id": "abc123def456"
  }
}
```

### 403 Forbidden (Không phải bệnh nhân)
```json
{
  "error": {
    "code": "FORBIDDEN",
    "message": "Bạn không phải bệnh nhân",
    "trace_id": "abc123def456"
  }
}
```

### 500 Internal Server Error
```json
{
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "Không thể tải dữ liệu dashboard",
    "trace_id": "abc123def456"
  }
}
```

---

## 📊 Cấu Trúc Dữ Liệu

### patient_info
Thông tin cơ bản bệnh nhân hiển thị ở phần header

| Field | Type | Mô tả |
|-------|------|-------|
| id | int | ID bệnh nhân |
| ma_benh_nhan | string | Mã bệnh nhân (BN123456) |
| ho_ten | string | Tên bệnh nhân |
| ngay_sinh | date | Ngày sinh (YYYY-MM-DD) |
| tuoi | int | Độ tuổi tính toán từ ngày sinh |
| gioi_tinh | string | nam/nữ/khác |
| nhom_mau | string | Nhóm máu (A+, O-, ...) |
| so_dien_thoai | string | Số điện thoại |
| email | string | Email |
| dia_chi | string | Địa chỉ |

### upcoming_appointments (Array)
Danh sách lịch hẹn sắp tới (tối đa 5)

| Field | Type | Mô tả |
|-------|------|-------|
| id | int | ID lịch hẹn |
| ma_lich_hen | string | Mã lịch hẹn |
| ngay_hen | date | Ngày hẹn |
| gio_hen | time | Giờ bắt đầu |
| gio_ket_thuc | time | Giờ kết thúc |
| bac_si | object | Thông tin bác sĩ (id, ho_ten, ma_bac_si) |
| chuyen_khoa | object | Chuyên khoa (id, ten_chuyen_khoa) |
| phong_kham | object | Phòng khám (id, ma_phong, ten_phong) |
| dich_vu | array | Danh sách dịch vụ/gói khám |
| trang_thai | string | Trạng thái (da_xac_nhan, dang_cho, ...) |
| ly_do_kham | string | Lý do khám |

### recent_visit_history (Array)
Lịch sử khám bệnh gần đây (tối đa 10)

| Field | Type | Mô tả |
|-------|------|-------|
| id | int | ID phiếu khám |
| ma_phieu_kham | string | Mã phiếu khám |
| ngay_kham | date | Ngày khám |
| bac_si | object | Bác sĩ khám |
| chuyen_khoa | string | Chuyên khoa |
| dich_vu | string | Dịch vụ sử dụng (cách nhau bằng phẩy) |
| chan_doan | string | Chẩn đoán |
| trang_thai | string | Trạng thái (hoan_thanh, dang_kham, ...) |
| ly_do_kham | string | Lý do khám |

### health_profile
Thông tin hồ sơ sức khỏe

| Field | Type | Mô tả |
|-------|------|-------|
| tien_su_benh | string | Tiền sử bệnh lý |
| tien_su_di_ung | string | Lịch sử dị ứng |
| nhom_mau | string | Nhóm máu |
| ghi_chu | string | Ghi chú y tế |
| nguoi_lien_he | string | Người liên hệ khẩn cấp |
| sdt_nguoi_lien_he | string | SĐT người liên hệ |

### health_reminder
Nhắc nhở sức khỏe định kỳ

| Field | Type | Mô tả |
|-------|------|-------|
| title | string | Tiêu đề nhắc nhở |
| message | string | Nội dung nhắc nhở |
| icon | string | Icon Material Symbols |

---

## 🔄 Caching

- **TTL**: 5 phút
- **Cache Key**: `dashboard:patient:{user_id}`
- **Invalidation**: Tự động khi có thay đổi lịch hẹn, phiếu khám

---

## 🎯 Mapping với Frontend (Tongquan.jsx)

| Frontend Component | API Field | Data |
|-------------------|-----------|------|
| Header | patient_info.ho_ten | Tên bệnh nhân |
| Mã bệnh nhân card | patient_info.ma_benh_nhan | BN123456 |
| Nhóm máu card | patient_info.nhom_mau | O+ |
| Lịch hẹn sắp tới | upcoming_appointments | Thẻ lịch hẹn |
| Lịch sử khám table | recent_visit_history | Danh sách bảng |
| Hồ sơ sức khỏe | health_profile | Tiền sử + Dị ứng |
| Nhắc nhở sức khỏe | health_reminder | Thông báo |

---

## ⚙️ Performance

- **Queries**: ~5-6 queries per request
- **Response Time**: 
  - Without cache: 200-400ms
  - With cache: 50ms
- **Database Indexes**: 
  - lich_hen: (benh_nhan_id, ngay_hen), (trang_thai)
  - phieu_kham: (benh_nhan_id, created_at)

---

## 📝 Ví dụ sử dụng với cURL

```bash
# Lấy dashboard bệnh nhân
curl -X GET "http://localhost:8000/api/v1/dashboard/patient" \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc..." \
  -H "Accept: application/json"

# Response
{
  "data": { ... },
  "meta": { "timestamp": "2026-03-18T10:30:00Z" }
}
```

---

## 📚 Tài liệu liên quan

- [API Design Standards](./api-design.md)
- [Error Handling](./error-standard.md)
- [Postman Collection](./postman-collection.json)

