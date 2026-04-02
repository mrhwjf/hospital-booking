<?php

use App\Http\Controllers\Api\V1\Auth\AuthController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function () {
    // Các route không cần đăng nhập
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login',    [AuthController::class, 'login']);

    // Các route yêu cầu JWT token
    Route::middleware('auth.jwt')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me',      [AuthController::class, 'me']);
        Route::patch('/me',    [AuthController::class, 'updateMe']);
        Route::post('/avatar', [AuthController::class, 'updateAvatar']);
        Route::patch('/change-password', [AuthController::class, 'changePassword']);
    });
});
