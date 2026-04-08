<?php

use App\Enums\PermissionEnum;
use App\Http\Controllers\Api\V1\Patient\ProfileController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth.jwt', 'permission:' . PermissionEnum::NGHIEP_VU_DAT_LICH->value])->prefix('patient-profile')->group(function () {
    Route::get('/', [ProfileController::class, 'getProfile']);
    Route::put('/', [ProfileController::class, 'updateProfile']);
    Route::patch('/', [ProfileController::class, 'updateProfile']);
});
