<?php

use App\Http\Controllers\Api\V1\Patient\ProfileController;
use Illuminate\Support\Facades\Route;

Route::prefix('patient-profile')->group(function () {
    Route::get('/', [ProfileController::class, 'getProfile']);
    Route::put('/', [ProfileController::class, 'updateProfile']);
});
