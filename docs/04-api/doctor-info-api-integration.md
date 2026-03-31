# Hướng dẫn Tích hợp API - Trang Thông tin Bác sĩ

## 📌 Giới thiệu
Tài liệu này hướng dẫn cách tích hợp trang **ThongTinBS** (Thông tin bác sĩ) với backend API Laravel.

---

## 🔗 API Endpoints cần thiết

### 1. **Lấy thông tin bác sĩ**
```
GET /api/bac-si/{id}
```

**Response:**
```json
{
  "id": 1,
  "ma_bac_si": "BS001",
  "ho_ten": "Nguyễn Văn A",
  "so_dien_thoai": "0123456789",
  "hoc_vi": "tien_si",
  "chung_chi_hanh_nghe": "Chứng chỉ hành nghề cấp A",
  "kinh_nghiem": 15,
  "gioi_thieu": "Bác sĩ chuyên khoa tim mạch...",
  "trang_thai": "hoat_dong",
  "created_at": "2026-03-01T10:00:00Z",
  "updated_at": "2026-03-24T10:00:00Z"
}
```

### 2. **Lấy chuyên khoa của bác sĩ**
```
GET /api/bac-si/{id}/chuyen-khoa
```

**Response:**
```json
[
  {
    "id": 1,
    "ten_chuyen_khoa": "Tim mạch",
    "ma_chuyen_khoa": "TM001",
    "mo_ta": "Chuyên khoa tim mạch",
    "la_chuyen_khoa_chinh": true,
    "ghi_chu": "Chuyên khoa chính"
  },
  {
    "id": 2,
    "ten_chuyen_khoa": "Huyết áp",
    "ma_chuyen_khoa": "HA001",
    "mo_ta": "Chuyên khoa huyết áp",
    "la_chuyen_khoa_chinh": false,
    "ghi_chu": null
  }
]
```

### 3. **Lấy lịch làm việc của bác sĩ**
```
GET /api/bac-si/{id}/lich-lam-viec?trang_thai=hoat_dong&startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
```

**Query Parameters:**
| Param | Type | Required | Mô tả |
|-------|------|----------|-------|
| `trang_thai` | string | No | Trạng thái: `hoat_dong`, `tam_ngung`, `huy` |
| `startDate` | date | No | Ngày bắt đầu (YYYY-MM-DD) |
| `endDate` | date | No | Ngày kết thúc (YYYY-MM-DD) |

**Response:**
```json
[
  {
    "id": 1,
    "bac_si_id": 1,
    "lich_lam_viec_id": 1,
    "phong_kham_id": 1,
    "ngay_lam_viec": "2026-03-25",
    "ghi_chu": null,
    "trang_thai": "hoat_dong",
    "created_at": "2026-03-24T10:00:00Z",
    "updated_at": "2026-03-24T10:00:00Z",
    "lich_lam_viec": {
      "id": 1,
      "ma_ca": "CA001",
      "ten_ca": "Ca sáng",
      "thu_trong_tuan": 2,
      "gio_bat_dau": "08:00:00",
      "gio_ket_thuc": "12:00:00",
      "thoi_luong_kham": 60,
      "trang_thai": "hoat_dong"
    },
    "phong_kham": {
      "id": 1,
      "ma_phong": "PK001",
      "ten_phong": "Phòng khám A",
      "trang_thai": "hoat_dong"
    }
  }
]
```

### 4. **Lấy ngày nghỉ lễ**
```
GET /api/ngay-nghi-le
```

**Response:**
```json
[
  {
    "id": 1,
    "ten_ngay_nghi": "Tết Nguyên Đán 2026",
    "ngay": "2026-02-17",
    "mo_ta": "Ngày Tết âm lịch",
    "trang_thai": "hoat_dong"
  }
]
```

---

## 🛠️ Cách cài đặt API trong Frontend

### Step 1: Thiết lập API URL
Tạo file `.env` hoặc `.env.local` ở thư mục `frontend/`:
```env
REACT_APP_API_URL=http://localhost:8000/api
```

### Step 2: Use Service Hook
```javascript
import { useBacSiInfo } from '../hooks/useBacSi';

function MyComponent() {
  const { bacSiInfo, chuyenKhoa, lichLamViec, loading, error } = 
    useBacSiInfo(bacSiId);

  if (loading) return <Spin />;
  if (error) return <div>Lỗi: {error}</div>;

  return (
    <div>
      <h1>{bacSiInfo.ho_ten}</h1>
      {/* ... */}
    </div>
  );
}
```

### Step 3: Sử dụng Component
```javascript
import ThongTinBSWithAPI from './ThongTinBS.example';

function App() {
  return <ThongTinBSWithAPI bacSiId={1} />;
}
```

---

## 📝 Backend Implementation Guide

### Bước 1: Tạo Controllers

#### BacSiController.php
```php
<?php

namespace App\Http\Controllers;

use App\Models\BacSi;
use Illuminate\Http\JsonResponse;

class BacSiController extends Controller
{
    /**
     * Lấy thông tin bác sĩ
     */
    public function show($id): JsonResponse
    {
        $bacSi = BacSi::findOrFail($id);
        return response()->json($bacSi);
    }

    /**
     * Lấy chuyên khoa của bác sĩ
     */
    public function chuyenKhoa($id): JsonResponse
    {
        $bacSi = BacSi::findOrFail($id);
        $chuyenKhoa = $bacSi->chuyenKhoa()->get();
        return response()->json($chuyenKhoa);
    }

    /**
     * Lấy lịch làm việc của bác sĩ
     */
    public function lichLamViec($id): JsonResponse
    {
        $bacSi = BacSi::findOrFail($id);
        
        $query = $bacSi->lichLamViec();
        
        // Filter by trang_thai
        if (request('trang_thai')) {
            $query->where('trang_thai', request('trang_thai'));
        }
        
        // Filter by date range
        if (request('startDate')) {
            $query->whereDate('ngay_lam_viec', '>=', request('startDate'));
        }
        if (request('endDate')) {
            $query->whereDate('ngay_lam_viec', '<=', request('endDate'));
        }
        
        $lichLamViec = $query
            ->with(['lichLamViec', 'phongKham'])
            ->get();
        
        return response()->json($lichLamViec);
    }
}
```

### Bước 2: Thiết lập Routes

#### routes/api.php
```php
<?php

use App\Http\Controllers\BacSiController;
use Illuminate\Support\Facades\Route;

Route::prefix('bac-si')->group(function () {
    Route::get('{id}', [BacSiController::class, 'show']);
    Route::get('{id}/chuyen-khoa', [BacSiController::class, 'chuyenKhoa']);
    Route::get('{id}/lich-lam-viec', [BacSiController::class, 'lichLamViec']);
});

Route::get('/ngay-nghi-le', [NgayNghiLeController::class, 'index']);
```

### Bước 3: Model Relationships

#### App/Models/BacSi.php
```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BacSi extends Model
{
    protected $table = 'bac_si';

    protected $fillable = [
        'ma_bac_si',
        'ho_ten',
        'so_dien_thoai',
        'hoc_vi',
        'chung_chi_hanh_nghe',
        'kinh_nghiem',
        'gioi_thieu',
        'trang_thai',
    ];

    /**
     * Chuyên khoa của bác sĩ
     */
    public function chuyenKhoa(): BelongsToMany
    {
        return $this->belongsToMany(
            ChuyenKhoa::class,
            'bac_si_chuyen_khoa',
            'bac_si_id',
            'chuyen_khoa_id'
        )
        ->withPivot('la_chuyen_khoa_chinh', 'ghi_chu')
        ->withTimestamps();
    }

    /**
     * Lịch làm việc của bác sĩ
     */
    public function lichLamViec(): HasMany
    {
        return $this->hasMany(LichLamViecBacSi::class, 'bac_si_id');
    }
}
```

#### App/Models/LichLamViecBacSi.php
```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LichLamViecBacSi extends Model
{
    protected $table = 'lich_lam_viec_bac_si';

    /**
     * Lịch làm việc (Ca)
     */
    public function lichLamViec(): BelongsTo
    {
        return $this->belongsTo(LichLamViec::class, 'lich_lam_viec_id');
    }

    /**
     * Phòng khám
     */
    public function phongKham(): BelongsTo
    {
        return $this->belongsTo(PhongKham::class, 'phong_kham_id');
    }
}
```

---

## 🧪 Testing

### Postman Collection URLs:
```
GET http://localhost:8000/api/bac-si/1
GET http://localhost:8000/api/bac-si/1/chuyen-khoa
GET http://localhost:8000/api/bac-si/1/lich-lam-viec?trang_thai=hoat_dong
GET http://localhost:8000/api/ngay-nghi-le
```

---

## ⚠️ Error Handling

Frontend sẽ tự động handle các error:
- **404**: Bác sĩ không tìm thấy
- **500**: Lỗi server
- **Network Error**: Không kết nối được server

Tất cả error sẽ hiển thị message thân thiện cho người dùng.

---

## 📚 File tham khảo

- `frontend/src/features/clinical/services/bacSiService.js` - API Service
- `frontend/src/features/clinical/hooks/useBacSi.js` - Custom Hooks
- `frontend/src/features/clinical/pages/ThongTinBS.example.jsx` - Component với API
- `docs/08-workflow/doctor-info-page-design.md` - Design Document
