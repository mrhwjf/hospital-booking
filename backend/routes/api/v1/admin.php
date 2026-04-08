<?php

use App\Enums\PermissionEnum;
use App\Http\Controllers\Api\V1\Admin\BacSiController;
use App\Http\Controllers\Api\V1\Admin\CauHinhHeThongController;
use App\Http\Controllers\Api\V1\Admin\NhanVienController;
use App\Http\Controllers\Api\V1\Admin\NguoiDungController;
use App\Http\Controllers\Api\V1\Admin\Schedule\AdminScheduleSupportController;
use App\Http\Controllers\Api\V1\Admin\Schedule\DoctorLeaveController;
use App\Http\Controllers\Api\V1\Admin\Schedule\DoctorWorkScheduleController;
use App\Http\Controllers\Api\V1\Admin\Schedule\HolidayController;
use App\Http\Controllers\Api\V1\Admin\VaiTroQuyenController;
use App\Models\BacSi;
use App\Models\BacSiNghi;
use App\Models\CauHinhHeThong;
use App\Models\LichLamViec;
use App\Models\LichLamViecBacSi;
use App\Models\NgayNghiLe;
use App\Models\NhanVien;
use App\Models\NguoiDung;
use App\Models\PhongKham;
use App\Models\Quyen;
use App\Models\VaiTro;
use Illuminate\Support\Facades\Route;

/*
|- -------------------------------------------------------------------------
| Admin API Routes
|- -------------------------------------------------------------------------
|
| Prefix: /api/v1
| Các route quản trị người dùng, lịch làm việc bác sĩ và báo cáo nội bộ.
|
*/

Route::middleware('auth.jwt')->group(function () {
	Route::middleware('permission:' . PermissionEnum::QUAN_TRI_LICH_LAM_VIEC->value)->group(function () {
		// Quản lý lịch làm việc bác sĩ
		Route::prefix('quan-ly-lich-lam-viec')->group(function () {
			Route::get('/bac-si', [AdminScheduleSupportController::class, 'bacSi'])
				->middleware('can:viewAny,' . BacSi::class);
			Route::get('/phong-kham', [AdminScheduleSupportController::class, 'phongKham'])
				->middleware('can:viewAny,' . PhongKham::class);
			Route::get('/mau-ca', [AdminScheduleSupportController::class, 'lichLamViec'])
				->middleware('can:viewAny,' . LichLamViec::class);

			Route::get('/bac-si/{id}', [DoctorWorkScheduleController::class, 'doctorSchedule'])
				->middleware('can:viewAny,' . BacSi::class);
			Route::get('/phan-cong', [DoctorWorkScheduleController::class, 'assignedSchedules'])
				->middleware('can:viewAny,' . LichLamViecBacSi::class);
			Route::post('/mau-ca', [DoctorWorkScheduleController::class, 'storeTemplate'])
				->middleware('can:create,' . LichLamViec::class);
			Route::patch('/mau-ca/{id}', [DoctorWorkScheduleController::class, 'updateTemplate'])
				->middleware('can:update,' . LichLamViec::class);
			Route::patch('/mau-ca/{id}/huy', [DoctorWorkScheduleController::class, 'softDeleteTemplate'])
				->middleware('can:delete,' . LichLamViec::class);
			Route::post('/xem-truoc-phan-cong', [DoctorWorkScheduleController::class, 'previewAssignment'])
				->middleware('can:create,' . LichLamViecBacSi::class);
			Route::post('/phan-cong', [DoctorWorkScheduleController::class, 'storeAssignment'])
				->middleware('can:create,' . LichLamViecBacSi::class);
			Route::patch('/phan-cong/{id}', [DoctorWorkScheduleController::class, 'updateAssignment'])
				->middleware('can:update,' . LichLamViecBacSi::class);
			Route::patch('/phan-cong/{id}/huy', [DoctorWorkScheduleController::class, 'softDeleteAssignment'])
				->middleware('can:delete,' . LichLamViecBacSi::class);
		});

		Route::prefix('quan-ly-nghi-bac-si')->group(function () {
			Route::get('/', [DoctorLeaveController::class, 'index'])
				->middleware('can:viewAny,' . BacSiNghi::class);
			Route::post('/', [DoctorLeaveController::class, 'store'])
				->middleware('can:create,' . BacSiNghi::class);
			Route::patch('/{id}', [DoctorLeaveController::class, 'update'])
				->middleware('can:update,' . BacSiNghi::class);
			Route::patch('/{id}/huy', [DoctorLeaveController::class, 'softDelete'])
				->middleware('can:delete,' . BacSiNghi::class);
		});

		Route::prefix('quan-ly-ngay-nghi-le')->group(function () {
			Route::get('/', [HolidayController::class, 'index'])
				->middleware('can:viewAny,' . NgayNghiLe::class);
			Route::post('/', [HolidayController::class, 'store'])
				->middleware('can:create,' . NgayNghiLe::class);
			Route::patch('/{id}', [HolidayController::class, 'update'])
				->middleware('can:update,' . NgayNghiLe::class);
			Route::patch('/{id}/huy', [HolidayController::class, 'softDelete'])
				->middleware('can:delete,' . NgayNghiLe::class);
		});
	});

	Route::middleware('permission:' . PermissionEnum::QUAN_TRI_NGUOI_DUNG->value)->group(function () {
		// Người dùng CRUD
		Route::get('/nguoi-dung', [NguoiDungController::class, 'index'])
			->middleware('can:viewAny,' . NguoiDung::class);
		Route::get('/nguoi-dung/tai-khoan-chua-lien-ket', [NguoiDungController::class, 'taiKhoanChuaLienKet'])
			->middleware('can:viewAny,' . NguoiDung::class);
		Route::post('/nguoi-dung', [NguoiDungController::class, 'store'])
			->middleware('can:create,' . NguoiDung::class);
		Route::get('/nguoi-dung/{id}', [NguoiDungController::class, 'show'])
			->middleware('can:viewAny,' . NguoiDung::class)
			->where('id', '[0-9]+');
		Route::patch('/nguoi-dung/{id}', [NguoiDungController::class, 'update'])
			->middleware('can:update,' . NguoiDung::class)
			->where('id', '[0-9]+');
		Route::patch('/nguoi-dung/{id}/reset-password', [NguoiDungController::class, 'resetPassword'])
			->middleware('can:update,' . NguoiDung::class)
			->where('id', '[0-9]+');
		Route::patch('/nguoi-dung/{id}/toggle-lock', [NguoiDungController::class, 'toggleLock'])
			->middleware('can:update,' . NguoiDung::class)
			->where('id', '[0-9]+');
	});

	Route::middleware('permission:' . PermissionEnum::QUAN_TRI_HO_SO_NHAN_VIEN->value)->group(function () {
		// Hồ sơ bác sĩ CRUD + tìm kiếm, lọc
		Route::get('/bac-si', [BacSiController::class, 'index'])
			->middleware('can:viewAny,' . BacSi::class);
		Route::get('/bac-si/tai-khoan', [BacSiController::class, 'danhSachTaiKhoanBacSi'])
			->middleware('can:viewAny,' . NguoiDung::class);
		Route::post('/bac-si', [BacSiController::class, 'store'])
			->middleware('can:create,' . BacSi::class);
		Route::get('/bac-si/{id}', [BacSiController::class, 'show'])
			->middleware('can:viewAny,' . BacSi::class)
			->where('id', '[0-9]+');
		Route::put('/bac-si/{id}', [BacSiController::class, 'update'])
			->middleware('can:update,' . BacSi::class)
			->where('id', '[0-9]+');
		Route::delete('/bac-si/{id}', [BacSiController::class, 'destroy'])
			->middleware('can:delete,' . BacSi::class)
			->where('id', '[0-9]+');

		// Hồ sơ nhân viên CRUD + tìm kiếm, lọc
		Route::get('/nhan-vien', [NhanVienController::class, 'index'])
			->middleware('can:viewAny,' . NhanVien::class);
		Route::get('/nhan-vien/tai-khoan', [NhanVienController::class, 'danhSachTaiKhoanNhanVien'])
			->middleware('can:viewAny,' . NguoiDung::class);
		Route::post('/nhan-vien', [NhanVienController::class, 'store'])
			->middleware('can:create,' . NhanVien::class);
		Route::get('/nhan-vien/{id}', [NhanVienController::class, 'show'])
			->middleware('can:viewAny,' . NhanVien::class)
			->where('id', '[0-9]+');
		Route::put('/nhan-vien/{id}', [NhanVienController::class, 'update'])
			->middleware('can:update,' . NhanVien::class)
			->where('id', '[0-9]+');
		Route::delete('/nhan-vien/{id}', [NhanVienController::class, 'destroy'])
			->middleware('can:delete,' . NhanVien::class)
			->where('id', '[0-9]+');

		// Danh mục phục vụ UI hồ sơ bác sĩ
		Route::get('/danh-muc/chuyen-khoa', [BacSiController::class, 'danhSachChuyenKhoa'])
			->middleware('can:viewAny,' . BacSi::class);
	});

	Route::middleware('permission:' . PermissionEnum::QUAN_TRI_VAI_TRO->value)->group(function () {
		// Vai trò và phân quyền
		Route::get('/vai-tro', [VaiTroQuyenController::class, 'danhSachVaiTro'])
			->middleware('can:viewAny,' . VaiTro::class);
		Route::get('/vai-tro/{id}', [VaiTroQuyenController::class, 'chiTietVaiTro'])
			->middleware('can:viewAny,' . VaiTro::class)
			->where('id', '[0-9]+');
		Route::post('/vai-tro', [VaiTroQuyenController::class, 'taoVaiTro'])
			->middleware('can:create,' . VaiTro::class);
		Route::patch('/vai-tro/{id}', [VaiTroQuyenController::class, 'capNhatVaiTro'])
			->middleware('can:update,' . VaiTro::class)
			->where('id', '[0-9]+');
		Route::delete('/vai-tro/{id}', [VaiTroQuyenController::class, 'xoaVaiTro'])
			->middleware('can:delete,' . VaiTro::class)
			->where('id', '[0-9]+');

		Route::get('/quyen', [VaiTroQuyenController::class, 'danhSachQuyen'])
			->middleware('can:viewAny,' . Quyen::class);
		Route::post('/quyen', [VaiTroQuyenController::class, 'taoQuyen'])
			->middleware('can:create,' . Quyen::class);
		Route::patch('/quyen/{id}', [VaiTroQuyenController::class, 'capNhatQuyen'])
			->middleware('can:update,' . Quyen::class)
			->where('id', '[0-9]+');
		Route::delete('/quyen/{id}', [VaiTroQuyenController::class, 'xoaQuyen'])
			->middleware('can:delete,' . Quyen::class)
			->where('id', '[0-9]+');
	});

	Route::middleware('permission:' . PermissionEnum::QUAN_TRI_CAU_HINH->value)->group(function () {
		// Cấu hình hệ thống
		Route::get('/cau-hinh-he-thong', [CauHinhHeThongController::class, 'index'])
			->middleware('can:viewAny,' . CauHinhHeThong::class);
		Route::put('/cau-hinh-he-thong', [CauHinhHeThongController::class, 'capNhatHangLoat'])
			->middleware('can:update,' . CauHinhHeThong::class);
	});
});
