# Cloudinary Upload API

## Mục tiêu
Cung cấp endpoint upload ảnh/tài liệu lên Cloudinary, dùng cho:
- Ảnh đại diện người dùng.
- Tài liệu hồ sơ bệnh án.

## Endpoint đề xuất
- `POST /api/v1/uploads/cloudinary`

## Auth
- Bắt buộc Bearer token.
- Quyền:
  - Bệnh nhân: upload avatar của chính mình.
  - Bác sĩ: upload tài liệu hồ sơ bệnh án theo phiếu khám phụ trách.
  - Nhân viên: không có quyền upload tài liệu hồ sơ bệnh án.

## Request (multipart/form-data)
- `file`: bắt buộc.
- `folder`: tùy chọn (`avatars`, `medical-docs`, ...).
- `resource_type`: tùy chọn (`image`, `raw`, `auto`).

## Response mẫu
```json
{
  "data": {
    "public_id": "medical-docs/pk-2026-0001/report-01",
    "url": "https://res.cloudinary.com/<cloud>/image/upload/v.../report-01.png",
    "secure_url": "https://res.cloudinary.com/<cloud>/image/upload/v.../report-01.png",
    "format": "png",
    "bytes": 248192
  }
}
```

## Giới hạn khuyến nghị
- Định dạng: pdf, png, jpg, jpeg.
- Kích thước tối đa: 10MB.
- Quét tên file và loại MIME trước khi upload.
