# Chuẩn lỗi API

## Error envelope
```json
{
  "error": {
    "code": "BUSINESS_RULE_VIOLATION",
    "message": "Không thể hủy lịch vì đã quá thời hạn cho phép.",
    "details": {
      "appointment_id": 9001,
      "required_hours": 12
    },
    "trace_id": "c8a1d845-2dc0-4d1f-a8eb-1f9f9c4ea6f7"
  }
}
```

## Mã HTTP sử dụng
- `400`: Vi phạm nghiệp vụ.
- `401`: Chưa xác thực.
- `403`: Không đủ quyền.
- `404`: Không tìm thấy dữ liệu.
- `409`: Xung đột trạng thái (slot vừa bị đặt).
- `422`: Validation lỗi.
- `500`: Lỗi hệ thống.

## Mã lỗi chuẩn đề xuất
- `VALIDATION_ERROR`
- `UNAUTHENTICATED`
- `FORBIDDEN`
- `NOT_FOUND`
- `BUSINESS_RULE_VIOLATION`
- `SLOT_CONFLICT`
- `INTERNAL_ERROR`

## Quy tắc hiển thị lỗi cho FE
- Luôn hiển thị `message` cho người dùng.
- Gắn `trace_id` trong log để truy vết.
- Với lỗi form, ánh xạ `details.field_errors` theo từng input.
