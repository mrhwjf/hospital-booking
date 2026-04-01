<?php

use App\Http\Controllers\Api\V1\Patients\BenhNhanController;
use App\Http\Controllers\Api\V1\Patients\LichSuKhamController;
use Illuminate\Support\Facades\Route;

Route::prefix('benh-nhan')->group(function () {
	Route::get('/me', [BenhNhanController::class, 'me']);

	Route::get('/lich-su-kham', [LichSuKhamController::class, 'index']);
	Route::get('/lich-su-kham/{id}', [LichSuKhamController::class, 'show']);
	Route::get('/lich-su-kham/{id}/chi-dinh', [LichSuKhamController::class, 'chiDinh']);
	Route::get('/lich-su-kham/{id}/don-thuoc', [LichSuKhamController::class, 'donThuoc']);
	Route::get('/lich-su-kham/{id}/tai-lieu', [LichSuKhamController::class, 'taiLieu']);
	Route::get('/lich-su-kham/{id}/tai-lieu/{taiLieuId}/signed-url', [LichSuKhamController::class, 'taiLieuSignedUrl']);
});
