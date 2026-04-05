<?php

use App\Http\Controllers\Api\V1\Patients\BenhNhanController;
use App\Http\Controllers\Api\V1\Patients\LichSuKhamController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\Patients\LichSuPhieuKhamController;
use App\Http\Controllers\Api\V1\Patients\TaiLieuHoSoController;
use App\Http\Controllers\Api\V1\Patient\ProfileController;

Route::middleware(['auth.jwt', 'role:BENHNHAN'])->group(function () {
    Route::prefix('benh-nhan')->group(function () {
        Route::get('/me', [BenhNhanController::class, 'me']);
        Route::get('/profile', [ProfileController::class, 'getProfile']);
        Route::put('/profile', [ProfileController::class, 'updateProfile']);
        Route::patch('/profile', [ProfileController::class, 'updateProfile']);

        Route::get('/lich-su-kham', [LichSuKhamController::class, 'index']);
        Route::get('/lich-su-kham/{id}', [LichSuKhamController::class, 'show']);
        Route::get('/lich-su-kham/{id}/chi-dinh', [LichSuKhamController::class, 'chiDinh']);
        Route::get('/lich-su-kham/{id}/don-thuoc', [LichSuKhamController::class, 'donThuoc']);
        Route::get('/lich-su-kham/{id}/tai-lieu', [LichSuKhamController::class, 'taiLieu']);
        Route::get('/lich-su-kham/{id}/tai-lieu/{taiLieuId}/signed-url', [LichSuKhamController::class, 'taiLieuSignedUrl']);
    });

    // Canonical family for patient-scoped resources.
    Route::prefix('benh-nhan/{benhNhanId}')->group(function () {
        Route::get('/lich-su-phieu-kham', [LichSuPhieuKhamController::class, 'index']);
        Route::get('/tai-lieu-ho-so', [TaiLieuHoSoController::class, 'index']);
        Route::post('/tai-lieu-ho-so', [TaiLieuHoSoController::class, 'store']);
        Route::put('/tai-lieu-ho-so/{taiLieuId}', [TaiLieuHoSoController::class, 'update']);
        Route::post('/tai-lieu-ho-so/{taiLieuId}/upload', [TaiLieuHoSoController::class, 'upload']);
        Route::get('/tai-lieu-ho-so/{taiLieuId}/signed-url', [TaiLieuHoSoController::class, 'signedUrl']);
        Route::delete('/tai-lieu-ho-so/{taiLieuId}', [TaiLieuHoSoController::class, 'destroy']);
    });

    // Backward compatibility aliases (to be removed after frontend migration completes).
    Route::get('/patients/profile', [ProfileController::class, 'getProfile']);
    Route::put('/patients/profile', [ProfileController::class, 'updateProfile']);
    Route::patch('/patients/profile', [ProfileController::class, 'updateProfile']);

    Route::get('/patients/{benhNhanId}/lich-su-phieu-kham', [LichSuPhieuKhamController::class, 'index']);
    Route::get('/patients/{benhNhanId}/tai-lieu-ho-so', [TaiLieuHoSoController::class, 'index']);
    Route::post('/patients/{benhNhanId}/tai-lieu-ho-so', [TaiLieuHoSoController::class, 'store']);
    Route::put('/patients/{benhNhanId}/tai-lieu-ho-so/{taiLieuId}', [TaiLieuHoSoController::class, 'update']);
    Route::post('/patients/{benhNhanId}/tai-lieu-ho-so/{taiLieuId}/upload', [TaiLieuHoSoController::class, 'upload']);
    Route::get('/patients/{benhNhanId}/tai-lieu-ho-so/{taiLieuId}/signed-url', [TaiLieuHoSoController::class, 'signedUrl']);
    Route::delete('/patients/{benhNhanId}/tai-lieu-ho-so/{taiLieuId}', [TaiLieuHoSoController::class, 'destroy']);
});
