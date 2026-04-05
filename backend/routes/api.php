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

Route::middleware('auth.jwt')->get('/user', function (Request $request) {
    return $request->user();
});

Route::prefix('v1')->group(function () {
    require base_path('routes/api/v1/auth.php');
    require base_path('routes/api/v1/admin.php');
    require base_path('routes/api/v1/patients.php');
    require base_path('routes/api/v1/profile.php');
    require base_path('routes/api/v1/dashboard.php');
    require base_path('routes/api/v1/clinical.php');
    require base_path('routes/api/v1/reports.php');
    require base_path('routes/api/v1/scheduling.php');
    require base_path('routes/api/v1/cloudinary.php');
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
