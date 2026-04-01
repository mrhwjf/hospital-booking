# Guide: Test Patient Dashboard API on Frontend

## 📋 Tổng quan

Hướng dẫn này giúp bạn test **Patient Dashboard API** trên Frontend React. API được thiết kế theo đúng **Laravel API Flow**:

```
Route → Request Validation → Controller → Service → Model → Resource → JSON Response
```

---

## 🔗 API Flow Architecture

```
┌─────────────────────────────────────────────────────────────┐
│ CLIENT (Frontend React)                                      │
└─────────────────┬───────────────────────────────────────────┘
                  │ GET /api/v1/dashboard/patient
                  │ Header: Authorization: Bearer {token}
                  ▼
┌─────────────────────────────────────────────────────────────┐
│ ROUTE (backend/routes/api/v1/dashboard.php)                 │
│ - Kiểm tra auth:sanctum middleware                          │
│ - Chuyển request đến Controller                             │
└─────────────────┬───────────────────────────────────────────┘
                  ▼
┌─────────────────────────────────────────────────────────────┐
│ REQUEST (GetPatientDashboardRequest)                        │
│ - Validate authorization (user phải là BENHNHAN)           │
│ - Throw 403 nếu không phải bệnh nhân                       │
└─────────────────┬───────────────────────────────────────────┘
                  ▼
┌─────────────────────────────────────────────────────────────┐
│ CONTROLLER (PatientDashboardController)                     │
│ - Nhận request đã validate                                  │
│ - Gọi Service để lấy business logic                        │
│ - Return Resource                                           │
└─────────────────┬───────────────────────────────────────────┘
                  ▼
┌─────────────────────────────────────────────────────────────┐
│ SERVICE (PatientDashboardService)                           │
│ - Xử lý business logic                                      │
│ - Query models (BenhNhan, LichHen, PhieuKham)             │
│ - Return data array                                         │
└─────────────────┬───────────────────────────────────────────┘
                  ▼
┌─────────────────────────────────────────────────────────────┐
│ RESOURCE (PatientDashboardResource)                         │
│ - Format data thành JSON structure                          │
│ - Thêm meta (timestamp)                                     │
└─────────────────┬───────────────────────────────────────────┘
                  ▼
┌─────────────────────────────────────────────────────────────┐
│ RESPONSE JSON                                               │
│ {                                                            │
│   "data": {                                                  │
│     "patient_info": {...},                                 │
│     "upcoming_appointments": [...],                        │
│     "recent_visit_history": [...],                        │
│     "health_profile": {...},                              │
│     "health_reminder": {...}                              │
│   },                                                         │
│   "meta": { "timestamp": "2026-03-18T10:30:00Z" }          │
│ }                                                            │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 File Structure

**Backend:**
```
backend/
├── routes/api/v1/
│   └── dashboard.php                    ← Route definition
├── app/Http/
│   ├── Controllers/Api/V1/Dashboard/
│   │   └── PatientDashboardController.php   ← Controller
│   ├── Requests/Dashboard/
│   │   └── GetPatientDashboardRequest.php   ← Request validation
│   └── Resources/Dashboard/
│       └── PatientDashboardResource.php     ← Response formatter
└── app/Services/
    └── Dashboard/
        └── PatientDashboardService.php      ← Business logic
```

**Frontend:**
```
frontend/src/
├── api/
│   └── dashboardApi.js                 ← API client
├── hooks/
│   └── usePatientDashboard.js          ← React Hook (optional)
└── features/patients/pages/
    └── Tongquan.jsx                    ← Component
```

---

## 🚀 Implementation Steps

### 1️⃣ Frontend API Client

File: `frontend/src/api/dashboardApi.js`

```javascript
import httpClient from './httpClient';

export const getPatientDashboard = () => {
  return httpClient.get('/dashboard/patient');
};
```

✅ **Done!** File đã được tạo.

---

### 2️⃣ Create Custom Hook (Optional)

File: `frontend/src/hooks/usePatientDashboard.js`

```javascript
import { useEffect, useState } from 'react';
import { getPatientDashboard } from '../api/dashboardApi';

/**
 * Hook để fetch patient dashboard data
 * 
 * Usage:
 * const { data, loading, error } = usePatientDashboard();
 */
export const usePatientDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const response = await getPatientDashboard();
        setData(response.data);
        setError(null);
      } catch (err) {
        setError(err.message || 'Không thể tải dữ liệu dashboard');
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  return { data, loading, error };
};
```

---

### 3️⃣ Update Tongquan.jsx Component

File: `frontend/src/features/patients/pages/Tongquan.jsx`

**Cách 1: Dùng Hook**
```javascript
import { usePatientDashboard } from '../../../hooks/usePatientDashboard';

export default function Tongquan() {
  const { data, loading, error } = usePatientDashboard();

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>Lỗi: {error}</div>;

  const {
    patient_info,
    upcoming_appointments,
    recent_visit_history,
    health_profile,
    health_reminder
  } = data;

  return (
    <div>
      {/* Render patient_info */}
      <h1>{patient_info.ho_ten}</h1>
      <p>Mã BN: {patient_info.ma_benh_nhan}</p>
      <p>Nhóm máu: {patient_info.nhom_mau}</p>

      {/* Render upcoming_appointments */}
      <div>
        <h2>Lịch hẹn sắp tới</h2>
        {upcoming_appointments.map(appt => (
          <div key={appt.id}>
            <p>{appt.ngay_hen} {appt.gio_hen}</p>
            <p>Bác sĩ: {appt.bac_si.ho_ten}</p>
            <p>Chuyên khoa: {appt.chuyen_khoa.ten_chuyen_khoa}</p>
          </div>
        ))}
      </div>

      {/* Render recent_visit_history */}
      <div>
        <h2>Lịch sử khám</h2>
        <table>
          <thead>
            <tr>
              <th>Ngày khám</th>
              <th>Bác sĩ</th>
              <th>Dịch vụ</th>
              <th>Chẩn đoán</th>
            </tr>
          </thead>
          <tbody>
            {recent_visit_history.map(visit => (
              <tr key={visit.id}>
                <td>{visit.ngay_kham}</td>
                <td>{visit.bac_si.ho_ten}</td>
                <td>{visit.dich_vu}</td>
                <td>{visit.chan_doan}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Render health_profile */}
      <div>
        <h2>Hồ sơ sức khỏe</h2>
        <p>Tiền sử bệnh: {health_profile.tien_su_benh}</p>
        <p>Dị ứng: {health_profile.tien_su_di_ung}</p>
      </div>

      {/* Render health_reminder */}
      <div>
        <h2>{health_reminder.title}</h2>
        <p>{health_reminder.message}</p>
      </div>
    </div>
  );
}
```

---

## 🧪 Test API Response

### Test 1: Kiểm tra xem API đã hoạt động chưa

**1. Mở browser DevTools**
- Nhấn `F12` → Tab `Network`

**2. Truy cập trang Dashboard**
- Đi tới trang `Tongquan` (dashboard bệnh nhân)

**3. Kiểm tra Request**
- Tìm request `GET /api/v1/dashboard/patient`
- Header phải có: `Authorization: Bearer {token}`

**Expected Response (200 OK):**
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
        "dich_vu": [...],
        "trang_thai": "da_xac_nhan",
        "ly_do_kham": "Khám định kỳ"
      }
    ],
    "recent_visit_history": [...],
    "health_profile": {...},
    "health_reminder": {...}
  },
  "meta": {
    "timestamp": "2026-03-18T10:30:00Z"
  }
}
```

---

### Test 2: Kiểm tra Error Cases

**Case 1: Không có token (401 Unauthenticated)**
```bash
curl -X GET "http://localhost:8000/api/v1/dashboard/patient"
```
Response:
```json
{
  "message": "Unauthenticated"
}
```

**Case 2: Token hết hạn (401)**
```bash
curl -X GET "http://localhost:8000/api/v1/dashboard/patient" \
  -H "Authorization: Bearer invalid_token"
```
Response:
```json
{
  "message": "Unauthenticated"
}
```

**Case 3: User không phải bệnh nhân (403 Forbidden)**

Khi login bằng account admin/doctor/staff:

```json
{
  "message": "Bạn không phải bệnh nhân"
}
```

---

### Test 3: Console Log API Response

**Trong Browser Console:**

```javascript
// Gọi API từ console
fetch('/api/v1/dashboard/patient', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
    'Accept': 'application/json'
  }
})
.then(res => res.json())
.then(data => {
  console.log('API Response:', data);
  console.log('Patient Info:', data.data.patient_info);
  console.log('Appointments:', data.data.upcoming_appointments);
  console.log('Timestamp:', data.meta.timestamp);
});
```

---

## 🐛 Debugging Tips

### 1. Check API Response Structure
```javascript
console.log('Full response:', response);
console.log('Data properties:', Object.keys(response.data));
console.log('Patient info keys:', Object.keys(response.data.patient_info));
```

### 2. Verify Data Types
```javascript
const { upcoming_appointments } = response.data;
console.log('Is array?', Array.isArray(upcoming_appointments));
console.log('Length:', upcoming_appointments.length);
console.log('First item:', upcoming_appointments[0]);
```

### 3. Check Timestamp Format
```javascript
const { timestamp } = response.meta;
console.log('Timestamp:', timestamp);
console.log('Parsed date:', new Date(timestamp));
```

### 4. Network Tab Inspection
- **Request Headers:**
  - `Authorization: Bearer ...`
  - `Accept: application/json`
  - `Content-Type: application/json`

- **Response Headers:**
  - `Content-Type: application/json`
  - `X-RateLimit-Limit: 60`
  - `X-RateLimit-Remaining: 59`

---

## 📊 Expected Data Flow Example

**Từ API Response sang Component:**

```javascript
const response = {
  data: {
    patient_info: {
      ma_benh_nhan: 'BN123456',
      ho_ten: 'Nguyễn Văn A',
      nhom_mau: 'O+'
    },
    upcoming_appointments: [
      {
        id: 1,
        ngay_hen: '2026-03-20',
        gio_hen: '08:30:00',
        bac_si: { ho_ten: 'BS. Lê Minh Thành' },
        chuyen_khoa: { ten_chuyen_khoa: 'Chuyên khoa Nội' }
      }
    ]
  }
};

// ✅ Render trong JSX
<div className="patient-card">
  <h1>{response.data.patient_info.ho_ten}</h1>
  <p>Mã BN: {response.data.patient_info.ma_benh_nhan}</p>
  <p>Nhóm máu: {response.data.patient_info.nhom_mau}</p>
</div>

<div className="appointments">
  {response.data.upcoming_appointments.map(appt => (
    <div key={appt.id}>
      <p>{appt.ngay_hen} {appt.gio_hen}</p>
      <p>BS: {appt.bac_si.ho_ten}</p>
    </div>
  ))}
</div>
```

---

## ✅ Verification Checklist

- [ ] API endpoint: `GET /api/v1/dashboard/patient`
- [ ] Auth header: `Authorization: Bearer {token}`
- [ ] Response status: `200 OK`
- [ ] Response has `data` field
- [ ] Response has `meta.timestamp`
- [ ] `patient_info` object not null
- [ ] `upcoming_appointments` is array (có thể trống)
- [ ] `recent_visit_history` is array (có thể trống)
- [ ] `health_profile` object not null
- [ ] `health_reminder` object not null
- [ ] Data hiển thị đúng trong component
- [ ] Không có error trong browser console
- [ ] Network request time < 500ms

---

## 📝 Summary

| Thành phần | File | Mục đích |
|-----------|------|---------|
| Route | `backend/routes/api/v1/dashboard.php` | Định nghĩa endpoint |
| Request | `backend/app/Http/Requests/Dashboard/GetPatientDashboardRequest.php` | Validate authorization |
| Controller | `backend/app/Http/Controllers/Api/V1/Dashboard/PatientDashboardController.php` | Xử lý request |
| Service | `backend/app/Services/Dashboard/PatientDashboardService.php` | Business logic |
| Resource | `backend/app/Http/Resources/Dashboard/PatientDashboardResource.php` | Format response JSON |
| API Client | `frontend/src/api/dashboardApi.js` | Gọi API từ frontend |
| Hook | `frontend/src/hooks/usePatientDashboard.js` | Fetch data (optional) |
| Component | `frontend/src/features/patients/pages/Tongquan.jsx` | Hiển thị dữ liệu |

---

Đó rồi! Tất cả API đã sẵn sàng test. 🚀
