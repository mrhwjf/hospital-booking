<?php

use App\Http\Controllers\Api\V1\Clinical\NhanVienController;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\V1\Clinical\ChiDinhController;
use App\Http\Controllers\Api\V1\Clinical\PhieuKhamController;
use App\Http\Controllers\Api\V1\Clinical\DonThuocController;
use App\Http\Controllers\Api\V1\Clinical\ThongTinBacSiController;

Route::prefix('nhan-vien')->group(function () {
	Route::get('/me', [NhanVienController::class, 'me']);
});

// Phiếu khám
Route::get('/phieu-kham', [PhieuKhamController::class, 'indexByDoctor']);
Route::get('/phieu-kham/{id}', [PhieuKhamController::class, 'show']);
Route::put('/phieu-kham/{id}', [PhieuKhamController::class, 'update']);

// Chỉ định
// Dùng namespace /clinical để tránh xung đột với scheduling /dich-vu.
Route::get('/clinical/dich-vu', [ChiDinhController::class, 'dichVuList']);
Route::get('/phieu-kham/{phieuKhamId}/chi-dinh', [ChiDinhController::class, 'index']);
Route::post('/phieu-kham/{phieuKhamId}/chi-dinh', [ChiDinhController::class, 'store']);

// Đơn thuốc
Route::get('/phieu-kham/{phieu_kham_id}/don-thuoc', [DonThuocController::class, 'showByPhieuKham']);
Route::post('/phieu-kham/{phieu_kham_id}/don-thuoc', [DonThuocController::class, 'store']);
Route::post('/don-thuoc/{don_thuoc_id}/items', [DonThuocController::class, 'storeItems']);
Route::put('/don-thuoc/{don_thuoc_id}/items', [DonThuocController::class, 'updateItems']);
Route::delete('/don-thuoc/{id}', [DonThuocController::class, 'destroy']);
Route::get('/thuoc', [DonThuocController::class, 'searchThuoc']);

// Thông tin bác sĩ
Route::get('/bac-si/thong-tin', [ThongTinBacSiController::class, 'showStatic']);
Route::get('/bac-si/lich-lam-viec', [ThongTinBacSiController::class, 'showWeekly']);
