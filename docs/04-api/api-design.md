# API Design (v1) - Hệ thống đặt lịch khám bệnh ABC

Base URL: `/api/v1`

## Quy ước chung
- URL dùng kebab-case, danh từ số nhiều.
- JSON key dùng snake_case.
- Ngày: `YYYY-MM-DD`, giờ: `HH:mm:ss`, timestamp: ISO-8601.
- Phân trang: `page`, `per_page`.

## Chuẩn phản hồi thành công
- Single:
```json
{ "data": { "id": 1 } }
```
- List:
```json
{
  "data": [],
  "meta": { "page": 1, "per_page": 20, "total": 0 },
  "links": { "self": "...", "next": null, "prev": null }
}
```

## Nhóm endpoint chính

## 1) Auth
- `POST /auth/login`
- `POST /auth/logout`
- `GET /auth/me`

## 2) Public catalog
- `GET /chuyen-khoa`
- `GET /bac-si`
- `GET /dich-vu`
- `GET /goi-kham`
- `GET /icd10`

## 3) Patient
- `POST /benh-nhan/register`
- `GET /benh-nhan/me`
- `PATCH /benh-nhan/me`
- `POST /lich-hen`
- `GET /lich-hen?mine=true`
- `PATCH /lich-hen/{id}/huy`
- `PATCH /lich-hen/{id}/doi-lich`

## 4) Staff
- `POST /benh-nhan/walk-in`
- `POST /lich-hen/ho`
- `PATCH /lich-hen/{id}/check-in`

## 5) Doctor
- `GET /bac-si/lich-hom-nay`
- `GET /phieu-kham/{id}`
- `PATCH /phieu-kham/{id}`
- `POST /chi-dinh`
- `POST /don-thuoc`
- `POST /tai-lieu-ho-so/upload`

## 6) Admin
- `GET|POST|PATCH|DELETE /nguoi-dung`
- `GET|POST|PATCH|DELETE /vai-tro`
- `GET|POST|PATCH|DELETE /chuyen-khoa`
- `GET|POST|PATCH|DELETE /dich-vu`
- `GET|POST|PATCH|DELETE /goi-kham`
- `GET|POST|PATCH|DELETE /lich-lam-viec`
- `GET|PATCH /cau-hinh-he-thong`

## Ràng buộc nghiệp vụ quan trọng
- Tạo lịch phải có >= 1 item dịch vụ/gói khám.
- Mỗi item chỉ được có `dich_vu_id` hoặc `goi_kham_id`.
- Slot trạng thái `da_dat` hoặc `khoa` không được đặt.
- Hủy/đổi lịch tuân thủ cấu hình thời gian hệ thống.

## Gợi ý triển khai tài liệu API chi tiết
- Khi cập nhật endpoint mới: thêm ví dụ request/response và mã lỗi dự kiến.
- Đồng bộ với `postman-collection.json` sau mỗi thay đổi.
