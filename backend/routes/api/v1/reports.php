<?php

use App\Enums\PermissionEnum;
use App\Http\Controllers\Api\V1\Reports\BaoCaoDoanhThuController;
use App\Http\Controllers\Api\V1\Reports\BaoCaoLichHenController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth.jwt', 'permission:' . PermissionEnum::QUAN_TRI_BAO_CAO->value])->group(function () {
	Route::get('/bao-cao/dashboard-admin', [BaoCaoLichHenController::class, 'dashboardAdmin']);
	Route::get('/bao-cao/lich-hen', [BaoCaoLichHenController::class, 'index']);
	Route::get('/bao-cao/doanh-thu', [BaoCaoDoanhThuController::class, 'index']);
});
