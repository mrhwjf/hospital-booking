<?php

use App\Http\Controllers\Api\V1\Scheduling\LichHenController;
use App\Http\Controllers\Api\V1\Scheduling\LichLamViecController;
use Illuminate\Support\Facades\Route;

Route::get('/chuyen-khoa', [LichLamViecController::class, 'chuyenKhoas']);
Route::get('/chuyen-khoa/{id}/bac-si', [LichLamViecController::class, 'bacSiTheoChuyenKhoa']);
Route::get('/bac-si/{id}/lich-lam-viec', [LichLamViecController::class, 'lichLamViecBacSi']);
Route::get('/dich-vu', [LichLamViecController::class, 'dichVus']);
Route::get('/goi-kham', [LichLamViecController::class, 'goiKhams']);

Route::post('/lich-hen', [LichHenController::class, 'store']);
Route::get('/lich-hen/{id}', [LichHenController::class, 'show']);
