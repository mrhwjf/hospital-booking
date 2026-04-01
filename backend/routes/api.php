<?php

use App\Http\Controllers\Api\V1\Doctors\DoctorController;
use App\Http\Controllers\Api\V1\Services\ServiceController;
use App\Http\Controllers\Api\V1\Services\SpecialtyController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::prefix('doctors')->middleware('role:public')->group(function () {
    Route::get('/', [DoctorController::class, 'index'])->name('doctors.index');
    Route::get('/{id}', [DoctorController::class, 'show'])
        ->whereNumber('id')
        ->name('doctors.show');
});

Route::prefix('specialties')->middleware('role:public')->group(function () {
    Route::get('/', [SpecialtyController::class, 'index'])->name('specialties.index');
});

Route::prefix('services')->middleware('role:public')->group(function () {
    Route::get('/', [ServiceController::class, 'index'])->name('services.index');
    Route::get('/{id}', [ServiceController::class, 'show'])
        ->whereNumber('id')
        ->name('services.show');
});

Route::prefix('v1')->group(function () {
    require __DIR__ . '/api/v1/auth.php';
    require __DIR__ . '/api/v1/patients.php';
    require __DIR__ . '/api/v1/profile.php';
    require __DIR__ . '/api/v1/dashboard.php';
});
