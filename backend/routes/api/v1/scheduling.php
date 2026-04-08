<?php

use App\Enums\PermissionEnum;
use App\Http\Controllers\Api\V1\Scheduling\LichHenController;
use App\Http\Controllers\Api\V1\Scheduling\LichLamViecController;
use Illuminate\Support\Facades\Route;

// Endpoints accessible by all authenticated users (patients, staff, admin) for fetching scheduling-related data.
Route::middleware('auth.jwt')->group(function () {
	Route::get('/chuyen-khoa', [LichLamViecController::class, 'chuyenKhoas']);
	Route::get('/chuyen-khoa/{id}/bac-si', [LichLamViecController::class, 'bacSiTheoChuyenKhoa']);
	Route::get('/bac-si/{id}/lich-lam-viec', [LichLamViecController::class, 'lichLamViecBacSi']);
	Route::get('/dich-vu', [LichLamViecController::class, 'dichVus']);
	Route::get('/goi-kham', [LichLamViecController::class, 'goiKhams']);
	Route::get('/cau-hinh-he-thong', [LichLamViecController::class, 'cauHinhHeThong']);
});

// Authenticated patient + staff appointment endpoints.
Route::middleware('auth.jwt')->group(function () {
	Route::post('/lich-hen', [LichHenController::class, 'store'])
		->middleware('permission:' . PermissionEnum::LICH_HEN_DAT_LICH->value);
	Route::get('/lich-hen', [LichHenController::class, 'index'])
		->middleware('permission:' . PermissionEnum::LICH_HEN_READ->value);
	Route::get('/lich-hen/{id}', [LichHenController::class, 'show'])
		->middleware('permission:' . PermissionEnum::LICH_HEN_READ->value);
	Route::patch('/lich-hen/{id}/huy', [LichHenController::class, 'huy'])
		->middleware('permission:' . PermissionEnum::LICH_HEN_HUY_LICH->value);
	Route::patch('/lich-hen/{id}/doi-lich', [LichHenController::class, 'doiLich'])
		->middleware('permission:' . PermissionEnum::LICH_HEN_SUA_LICH->value);
	Route::get('/ly-do-huy/benh-nhan', [LichHenController::class, 'lyDoHuysBenhNhan'])
		->middleware('permission:' . PermissionEnum::LICH_HEN_HUY_LICH->value);
});

// Receptionist/staff management endpoints.
Route::middleware(['auth.jwt', 'permission:' . PermissionEnum::NGHIEP_VU_QUAN_LY_LICH_HEN->value])->group(function () {
	Route::get('/benh-nhan', [LichLamViecController::class, 'benhNhans']);
	Route::get('/benh-nhan/{id}', [LichLamViecController::class, 'benhNhanShow']);
	Route::post('/benh-nhan', [LichLamViecController::class, 'benhNhanStore'])
		->middleware('permission:' . PermissionEnum::BENH_NHAN_CREATE->value);
	Route::post('/lich-hen/{id}/check-in', [LichHenController::class, 'checkIn'])
		->middleware('permission:' . PermissionEnum::LICH_HEN_CHECKIN->value);
});
