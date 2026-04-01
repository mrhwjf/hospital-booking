<?php

use App\Http\Controllers\Api\V1\Reports\BaoCaoDoanhThuController;
use App\Http\Controllers\Api\V1\Reports\BaoCaoLichHenController;
use Illuminate\Support\Facades\Route;

Route::middleware(['role:ADMIN'])->group(function () {
	Route::get('/bao-cao/dashboard-admin', [BaoCaoLichHenController::class, 'dashboardAdmin']);
	Route::get('/bao-cao/lich-hen', [BaoCaoLichHenController::class, 'index']);
	Route::get('/bao-cao/doanh-thu', [BaoCaoDoanhThuController::class, 'index']);
});
