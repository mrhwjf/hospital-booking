<?php

use App\Http\Controllers\Api\V1\Admin\Schedule\AdminScheduleSupportController;
use App\Http\Controllers\Api\V1\Admin\Schedule\DoctorLeaveController;
use App\Http\Controllers\Api\V1\Admin\Schedule\DoctorWorkScheduleController;
use App\Http\Controllers\Api\V1\Admin\Schedule\HolidayController;
use Illuminate\Support\Facades\Route;

Route::get('/bac-si', [AdminScheduleSupportController::class, 'bacSi']);
Route::get('/phong-kham', [AdminScheduleSupportController::class, 'phongKham']);
Route::get('/lich-lam-viec', [AdminScheduleSupportController::class, 'lichLamViec']);

Route::prefix('quan-ly-lich-lam-viec')->group(function () {
	Route::get('/bac-si/{id}', [DoctorWorkScheduleController::class, 'doctorSchedule']);
	Route::get('/phan-cong', [DoctorWorkScheduleController::class, 'assignedSchedules']);
	Route::post('/mau-ca', [DoctorWorkScheduleController::class, 'storeTemplate']);
	Route::patch('/mau-ca/{id}', [DoctorWorkScheduleController::class, 'updateTemplate']);
	Route::patch('/mau-ca/{id}/huy', [DoctorWorkScheduleController::class, 'softDeleteTemplate']);
	Route::post('/xem-truoc-phan-cong', [DoctorWorkScheduleController::class, 'previewAssignment']);
	Route::post('/phan-cong', [DoctorWorkScheduleController::class, 'storeAssignment']);
	Route::patch('/phan-cong/{id}', [DoctorWorkScheduleController::class, 'updateAssignment']);
	Route::patch('/phan-cong/{id}/huy', [DoctorWorkScheduleController::class, 'softDeleteAssignment']);
});

Route::prefix('quan-ly-nghi-bac-si')->group(function () {
	Route::get('/', [DoctorLeaveController::class, 'index']);
	Route::post('/', [DoctorLeaveController::class, 'store']);
	Route::patch('/{id}', [DoctorLeaveController::class, 'update']);
	Route::patch('/{id}/huy', [DoctorLeaveController::class, 'softDelete']);
});

Route::prefix('quan-ly-ngay-nghi-le')->group(function () {
	Route::get('/', [HolidayController::class, 'index']);
	Route::post('/', [HolidayController::class, 'store']);
	Route::patch('/{id}', [HolidayController::class, 'update']);
	Route::patch('/{id}/huy', [HolidayController::class, 'softDelete']);
});
