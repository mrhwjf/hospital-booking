<?php

use App\Http\Controllers\Api\V1\Scheduling\LichHenController;
use App\Http\Controllers\Api\V1\Scheduling\LichLamViecController;
use Illuminate\Support\Facades\Route;

// Public lookup endpoints used for search/filter UI.
Route::get('/chuyen-khoa', [LichLamViecController::class, 'chuyenKhoas']);
Route::get('/chuyen-khoa/{id}/bac-si', [LichLamViecController::class, 'bacSiTheoChuyenKhoa']);
Route::get('/bac-si/{id}/lich-lam-viec', [LichLamViecController::class, 'lichLamViecBacSi']);
Route::get('/dich-vu', [LichLamViecController::class, 'dichVus']);
Route::get('/goi-kham', [LichLamViecController::class, 'goiKhams']);
Route::get('/cau-hinh-he-thong', [LichLamViecController::class, 'cauHinhHeThong']);

// Authenticated patient + staff appointment endpoints.
Route::middleware(['auth.jwt', 'role:BENHNHAN,LETAN,NHANVIEN,ADMIN'])->group(function () {
	Route::post('/lich-hen', [LichHenController::class, 'store']);
	Route::get('/lich-hen', [LichHenController::class, 'index']);
	Route::get('/lich-hen/{id}', [LichHenController::class, 'show']);
	Route::patch('/lich-hen/{id}/huy', [LichHenController::class, 'huy']);
	Route::patch('/lich-hen/{id}/doi-lich', [LichHenController::class, 'doiLich']);
	Route::get('/ly-do-huy/benh-nhan', [LichHenController::class, 'lyDoHuysBenhNhan']);
});

// Receptionist/staff management endpoints.
Route::middleware(['auth.jwt', 'role:LETAN,NHANVIEN,ADMIN'])->group(function () {
	Route::get('/benh-nhan', [LichLamViecController::class, 'benhNhans']);
	Route::get('/benh-nhan/{id}', [LichLamViecController::class, 'benhNhanShow']);
	Route::post('/benh-nhan', [LichLamViecController::class, 'benhNhanStore']);
	Route::post('/lich-hen/{id}/check-in', [LichHenController::class, 'checkIn']);
});
