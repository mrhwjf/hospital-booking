<?php

use App\Http\Controllers\Api\V1\Clinical\DonThuocController;
use App\Http\Controllers\Api\V1\Clinical\PhieuKhamController;
use App\Http\Controllers\Api\V1\Clinical\ThongTinBacSiController;
use Illuminate\Support\Facades\Route;

// Phiếu khám
Route::get('phieu-kham', [PhieuKhamController::class, 'indexByDoctor']);              // Lấy danh sách phiếu khám theo bác sĩ
Route::post('phieu-kham', [PhieuKhamController::class, 'store']);                      // Tạo phiếu khám mới
Route::get('phieu-kham/{id}', [PhieuKhamController::class, 'show']);                   // Lấy chi tiết phiếu khám
Route::put('phieu-kham/{id}', [PhieuKhamController::class, 'update']);                 // Cập nhật phiếu khám
Route::delete('phieu-kham/{id}', [PhieuKhamController::class, 'destroy']);             // Xóa phiếu khám

// Đơn thuốc
Route::get('phieu-kham/{phieu_kham_id}/don-thuoc', [DonThuocController::class, 'showByPhieuKham']); // Lấy đơn thuốc theo phiếu khám
Route::post('phieu-kham/{phieu_kham_id}/don-thuoc', [DonThuocController::class, 'store']);          // Tạo đơn thuốc mới cho phiếu khám
Route::post('don-thuoc/{don_thuoc_id}/items', [DonThuocController::class, 'storeItems']);           // Thêm thuốc vào đơn thuốc
Route::put('don-thuoc/{don_thuoc_id}/items', [DonThuocController::class, 'updateItems']);           // Cập nhật thuốc trong đơn thuốc
Route::delete('don-thuoc/{id}', [DonThuocController::class, 'destroy']);                            // Xóa đơn thuốc
Route::get('thuoc', [DonThuocController::class, 'searchThuoc']);                                    // Tìm kiếm thuốc theo tên hoặc mã thuốc

// Thông tin bác sĩ
Route::get('bac-si/thong-tin', [ThongTinBacSiController::class, 'showStatic']);
Route::get('bac-si/lich-lam-viec', [ThongTinBacSiController::class, 'showWeekly']);
