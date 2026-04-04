<?php

use App\Http\Controllers\Api\V1\Patients\BenhNhanController;
use App\Http\Controllers\Api\V1\Patients\LichSuKhamController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\Patients\LichSuPhieuKhamController;
use App\Http\Controllers\Api\V1\Patients\TaiLieuHoSoController;

Route::prefix('benh-nhan')->group(function () {
    Route::get('/me', [BenhNhanController::class, 'me']);

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
Route::get('/patients/{benhNhanId}/lich-su-phieu-kham', [LichSuPhieuKhamController::class, 'index']);
Route::get('/patients/{benhNhanId}/tai-lieu-ho-so', [TaiLieuHoSoController::class, 'index']);
Route::post('/patients/{benhNhanId}/tai-lieu-ho-so', [TaiLieuHoSoController::class, 'store']);
Route::put('/patients/{benhNhanId}/tai-lieu-ho-so/{taiLieuId}', [TaiLieuHoSoController::class, 'update']);
Route::post('/patients/{benhNhanId}/tai-lieu-ho-so/{taiLieuId}/upload', [TaiLieuHoSoController::class, 'upload']);
Route::get('/patients/{benhNhanId}/tai-lieu-ho-so/{taiLieuId}/signed-url', [TaiLieuHoSoController::class, 'signedUrl']);
Route::delete('/patients/{benhNhanId}/tai-lieu-ho-so/{taiLieuId}', [TaiLieuHoSoController::class, 'destroy']);

// CONTENT WILL BE USED IN FUTURE FOR FOR POST-MERGE REFACTORING

// use Illuminate\Support\Facades\Route;

// // Authenticated routes
// Route::prefix('patients')->middleware('auth.jwt')->group(function () {
//     Route::get('/profile', [BenhNhanController::class, 'profile']);
//     Route::patch('/profile', [BenhNhanController::class, 'updateProfile']);
// });

// // Test routes (no auth required)
// Route::prefix('patients')->group(function () {
//     /**
//      * Test endpoint - Get patient profile without authentication
//      * 
//      * GET /api/v1/patients/test/{benhNhanId}
//      * 
//      * Auth: None (for testing/development only)
//      */
//     Route::get('/test/{benhNhanId}', [BenhNhanController::class, 'profileTest'])
//         ->where('benhNhanId', '[0-9]+')
//         ->name('patients.test');

//     /**
//      * Test endpoint - Update patient profile without authentication
//      * 
//      * PUT /api/v1/patients/update/{benhNhanId}
//      * 
//      * Auth: None (for testing/development only)
//      */
//     Route::put('/update/{benhNhanId}', [BenhNhanController::class, 'updateProfileTest'])
//         ->where('benhNhanId', '[0-9]+')
//         ->name('patients.update.test');
// });
