<?php

use App\Http\Controllers\Api\V1\Clinical\NhanVienController;
use Illuminate\Support\Facades\Route;

Route::prefix('nhan-vien')->group(function () {
	Route::get('/me', [NhanVienController::class, 'me']);
});
