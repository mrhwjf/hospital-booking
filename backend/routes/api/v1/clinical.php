<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\Clinical\ChiDinhController;
use App\Http\Controllers\Api\V1\Clinical\PhieuKhamController;

Route::get('/phieu-kham/{id}', [PhieuKhamController::class, 'show']);
Route::put('/phieu-kham/{id}', [PhieuKhamController::class, 'update']);
Route::get('/dich-vu', [ChiDinhController::class, 'dichVuList']);
Route::get('/phieu-kham/{phieuKhamId}/chi-dinh', [ChiDinhController::class, 'index']);
Route::post('/phieu-kham/{phieuKhamId}/chi-dinh', [ChiDinhController::class, 'store']);