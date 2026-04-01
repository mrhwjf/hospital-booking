# API Testing Guide - Patient Dashboard

## 📋 Mục đích

Hướng dẫn chi tiết cách **test Patient Dashboard API** bằng Postman hoặc cURL để xác nhận API hoạt động đúng trước khi integrate vào Frontend.

---

## 📌 Điều kiện cần thiết

### Backend
- ✅ Laravel development server đang chạy
- ✅ Database có user bệnh nhân test
- ✅ Sanctum token đã setup

### Frontend
- ✅ Node/npm installed
- ✅ React project configured

### Tools (chọn 1)
- **Postman** (GUI) - dễ dùng
- **cURL** (Command line) - tốc độ
- **Insomnia** - alternative
- **Browser DevTools** - built-in

---

## 🔐 Step 1: Lấy Authentication Token

### Cách 1: Qua Postman

**1. Tạo request POST login**
```
POST http://localhost:8000/api/login
Content-Type: application/json

{
  "email": "patient@example.com",
  "password": "password"
}
```

**2. Response sẽ trả token:**
```json
{
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "Bearer"
  },
  "message": "Login successful"
}
```

**3. Copy `access_token` để dùng trong test**

### Cách 2: Qua cURL

```bash
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "patient@example.com",
    "password": "password"
  }'
```

### Cách 3: Import Postman Collection

File: `docs/04-api/postman-collection.json` (nếu có)

---

## 🧪 Step 2: Test API Endpoint

### Test 1: GET Dashboard (Happy Path)

**Method:** `GET`  
**URL:** `http://localhost:8000/api/v1/dashboard/patient`  
**Headers:**
```
Authorization: Bearer {access_token}
Accept: application/json
Content-Type: application/json
```

#### Postman
1. Method → `GET`
2. URL → `http://localhost:8000/api/v1/dashboard/patient`
3. Tab "Headers" → Add:
   - Key: `Authorization`, Value: `Bearer {token}`
   - Key: `Accept`, Value: `application/json`
4. Click "Send"

#### cURL
```bash
curl -X GET http://localhost:8000/api/v1/dashboard/patient \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Accept: application/json"
```

**Expected Response (200 OK):**
```json
{
  "data": {
    "patient_info": {
      "id": 1,
      "ma_benh_nhan": "BN000001",
      "ho_ten": "Nguyễn Văn A",
      "ngay_sinh": "1990-05-15",
      "tuoi": 33,
      "gioi_tinh": "nam",
      "nhom_mau": "O+",
      "so_dien_thoai": "0912345678",
      "email": "patient@example.com",
      "dia_chi": "TP HCM"
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
      "tien_su_benh": "Cao huyết áp",
      "tien_su_di_ung": "Hải sản",
      "nhom_mau": "O+",
      "ghi_chu": "Cần theo dõi huyết áp",
      "nguoi_lien_he": "Nguyễn Thị B",
      "sdt_nguoi_lien_he": "0987654321"
    },
    "health_reminder": {
      "title": "Nhắc nhở sức khỏe",
      "message": "Uống ít nhất 2 lít nước mỗi ngày",
      "icon": "heart_check_fill"
    }
  },
  "meta": {
    "timestamp": "2026-03-18T10:30:00Z"
  }
}
```

**Checklist:**
- [ ] Status code: 200
- [ ] Response có `data` field
- [ ] `data.patient_info` không null
- [ ] `data.upcoming_appointments` là array
- [ ] `data.recent_visit_history` là array
- [ ] `data.health_profile` là object
- [ ] `data.health_reminder` là object
- [ ] `meta.timestamp` là ISO 8601 format

---

### Test 2: Kiểm tra Data Structure

**Validate patient_info:**
```javascript
// Copy vào browser console
const response = {...}; // từ response trên
const { patient_info } = response.data;

// Kiểm tra required fields
console.assert(patient_info.id, 'Có id?');
console.assert(patient_info.ma_benh_nhan, 'Có ma_benh_nhan?');
console.assert(patient_info.ho_ten, 'Có ho_ten?');
console.assert(patient_info.ngay_sinh, 'Có ngay_sinh?');
console.assert(patient_info.tuoi, 'Có tuoi?');
console.assert(patient_info.nhom_mau, 'Có nhom_mau?');
```

**Validate upcoming_appointments:**
```javascript
const { upcoming_appointments } = response.data;

console.assert(Array.isArray(upcoming_appointments), 'Is array?');
if (upcoming_appointments.length > 0) {
  const appt = upcoming_appointments[0];
  console.assert(appt.id, 'Có id?');
  console.assert(appt.ngay_hen, 'Có ngay_hen?');
  console.assert(appt.gio_hen, 'Có gio_hen?');
  console.assert(appt.bac_si.ho_ten, 'Có bac_si.ho_ten?');
  console.assert(appt.chuyen_khoa.ten_chuyen_khoa, 'Có chuyen_khoa.ten_chuyen_khoa?');
}
```

---

### Test 3: Error Cases

#### Test 3.1: Không có token (401 Unauthorized)

**cURL:**
```bash
curl -X GET http://localhost:8000/api/v1/dashboard/patient \
  -H "Accept: application/json"
```

**Expected Response (401):**
```json
{
  "message": "Unauthenticated."
}
```

#### Test 3.2: Token hết hạn (401)

**cURL:**
```bash
curl -X GET http://localhost:8000/api/v1/dashboard/patient \
  -H "Authorization: Bearer invalid_token_here" \
  -H "Accept: application/json"
```

**Expected Response (401):**
```json
{
  "message": "Unauthenticated."
}
```

#### Test 3.3: User không phải bệnh nhân (403 Forbidden)

**Scenario:** Login bằng admin/doctor account

**cURL:**
```bash
curl -X GET http://localhost:8000/api/v1/dashboard/patient \
  -H "Authorization: Bearer admin_token_here" \
  -H "Accept: application/json"
```

**Expected Response (403):**
```json
{
  "message": "Bạn không phải bệnh nhân"
}
```

#### Test 3.4: Database error (500)

**Scenario:** Database connection error

**Expected Response (500):**
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

## 🔍 Step 3: Performance Testing

### Test Response Time

```bash
# Đo thời gian response
time curl -X GET http://localhost:8000/api/v1/dashboard/patient \
  -H "Authorization: Bearer {token}" \
  -H "Accept: application/json"
```

**Expected:**
- First request (no cache): 200-400ms
- Cached request: 50ms

### Test Cache Hit

```bash
# Request 1 (cache miss)
curl -X GET http://localhost:8000/api/v1/dashboard/patient \
  -H "Authorization: Bearer {token}"

# Request 2 (cache hit) - phải nhanh hơn
curl -X GET http://localhost:8000/api/v1/dashboard/patient \
  -H "Authorization: Bearer {token}"
```

---

## 📊 Step 4: Postman Collection Setup

### Create Collection Locally

**1. Open Postman**

**2. Create new Collection: "Hospital Dashboard API"**

**3. Add Environment Variables:**
- `base_url`: `http://localhost:8000`
- `api_version`: `v1`
- `token`: `{{ paste_token_here }}`

**4. Add Requests:**

**Request 1: Login**
```
Method: POST
URL: {{base_url}}/api/login
Headers:
  Content-Type: application/json
Body (raw):
{
  "email": "patient@example.com",
  "password": "password"
}
```

**Request 2: Get Dashboard**
```
Method: GET
URL: {{base_url}}/api/{{api_version}}/dashboard/patient
Headers:
  Authorization: Bearer {{token}}
  Accept: application/json
```

**5. Add Pre-request Script to Login Request:**
```javascript
// Auto-extract token và store vào environment
const jsonData = pm.response.json();
pm.environment.set("token", jsonData.data.access_token);
```

---

## 🎯 Checklist Hoàn chỉnh

### Backend Setup
- [ ] Laravel server running
- [ ] Database migrations done
- [ ] Seeder data (test patient) added
- [ ] Sanctum configured
- [ ] Routes file updated

### Files Created
- [ ] `GetPatientDashboardRequest.php` ✅
- [ ] `PatientDashboardResource.php` ✅
- [ ] `PatientDashboardController.php` ✅
- [ ] `PatientDashboardService.php` ✅
- [ ] Route in `dashboard.php` ✅

### API Tests
- [ ] Happy path (200)
- [ ] No token (401)
- [ ] Invalid token (401)
- [ ] Not patient role (403)
- [ ] Response structure valid
- [ ] Data types correct
- [ ] Performance acceptable
- [ ] Cache working

### Frontend Integration
- [ ] API client created (`dashboardApi.js`)
- [ ] Hook created (`usePatientDashboard.js`) - optional
- [ ] Component updated (`Tongquan.jsx`)
- [ ] Data rendering correctly
- [ ] Error handling added
- [ ] Loading state managed
- [ ] No console errors

---

## 📝 Postman Collection JSON (Copy & Paste)

Tạo file `postman-collection.json`:

```json
{
  "info": {
    "name": "Hospital Dashboard API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "1. Login",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\"email\": \"patient@example.com\", \"password\": \"password\"}"
        },
        "url": {
          "raw": "http://localhost:8000/api/login",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8000",
          "path": ["api", "login"]
        }
      }
    },
    {
      "name": "2. Get Patient Dashboard",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{token}}"
          },
          {
            "key": "Accept",
            "value": "application/json"
          }
        ],
        "url": {
          "raw": "http://localhost:8000/api/v1/dashboard/patient",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8000",
          "path": ["api", "v1", "dashboard", "patient"]
        }
      }
    }
  ]
}
```

---

## 🚀 Quick Test Commands

### One-liner cURL Test

```bash
# 1. Login và extract token
TOKEN=$(curl -s -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"patient@example.com","password":"password"}' \
  | jq -r '.data.access_token')

# 2. Test dashboard API với token
curl -X GET http://localhost:8000/api/v1/dashboard/patient \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/json" | jq .
```

### Using jq to format JSON

```bash
# Pretty print response
curl ... | jq .

# Extract specific field
curl ... | jq '.data.patient_info.ma_benh_nhan'

# Validate response structure
curl ... | jq '.data | keys'
```

---

Đó rồi! Bây giờ bạn có thể test API chi tiết trước khi integrate vào Frontend. 🎉
