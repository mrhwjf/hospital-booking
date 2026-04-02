<?php

use App\Http\Controllers\Api\V1\Patients\BenhNhanController;
use Illuminate\Support\Facades\Route;

// Authenticated routes
Route::prefix('patients')->middleware('auth.jwt')->group(function () {
    Route::get('/profile', [BenhNhanController::class, 'profile']);
    Route::patch('/profile', [BenhNhanController::class, 'updateProfile']);
});

// Test routes (no auth required)
Route::prefix('patients')->group(function () {
    /**
     * Test endpoint - Get patient profile without authentication
     * 
     * GET /api/v1/patients/test/{benhNhanId}
     * 
     * Auth: None (for testing/development only)
     */
    Route::get('/test/{benhNhanId}', [BenhNhanController::class, 'profileTest'])
        ->where('benhNhanId', '[0-9]+')
        ->name('patients.test');

    /**
     * Test endpoint - Update patient profile without authentication
     * 
     * PUT /api/v1/patients/update/{benhNhanId}
     * 
     * Auth: None (for testing/development only)
     */
    Route::put('/update/{benhNhanId}', [BenhNhanController::class, 'updateProfileTest'])
        ->where('benhNhanId', '[0-9]+')
        ->name('patients.update.test');
});
