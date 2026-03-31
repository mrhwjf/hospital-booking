<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\Patients\LichSuPhieuKhamController;
use App\Http\Controllers\Api\V1\Patients\TaiLieuHoSoController;

Route::get('/patients/{benhNhanId}/lich-su-phieu-kham', [LichSuPhieuKhamController::class, 'index']);
Route::get('/patients/{benhNhanId}/tai-lieu-ho-so', [TaiLieuHoSoController::class, 'index']);
Route::post('/patients/{benhNhanId}/tai-lieu-ho-so', [TaiLieuHoSoController::class, 'store']);
Route::put('/patients/{benhNhanId}/tai-lieu-ho-so/{taiLieuId}', [TaiLieuHoSoController::class, 'update']);
Route::post('/patients/{benhNhanId}/tai-lieu-ho-so/{taiLieuId}/upload', [TaiLieuHoSoController::class, 'upload']);
Route::get('/patients/{benhNhanId}/tai-lieu-ho-so/{taiLieuId}/signed-url', [TaiLieuHoSoController::class, 'signedUrl']);
Route::delete('/patients/{benhNhanId}/tai-lieu-ho-so/{taiLieuId}', [TaiLieuHoSoController::class, 'destroy']);
