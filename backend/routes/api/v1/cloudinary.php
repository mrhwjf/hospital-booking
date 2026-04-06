<?php

use App\Http\Controllers\CloudinaryController;
use App\Models\NguoiDung;
use Illuminate\Support\Facades\Route;

Route::middleware('auth.jwt')->prefix('cloudinary')->group(function () {

	// Dùng cho quản lý avatar bác sĩ/nhân viên từ cổng admin
	Route::post('/avatar/{nguoiDungId}', [CloudinaryController::class, 'uploadAvatar'])
		->middleware(['role:ADMIN', 'can:update,' . NguoiDung::class]);
	Route::delete('/avatar/{publicId}', [CloudinaryController::class, 'deleteAvatar'])
		->middleware(['role:ADMIN', 'can:update,' . NguoiDung::class])
		->where('publicId', '.*');

	// NOTE: endpoint avatar dành cho bệnh nhân sẽ tách riêng trong phạm vi khác.

	Route::post(
		'/medical-document/{phieuKhamId}/{taiLieuId}',
		[CloudinaryController::class, 'uploadMedicalDocument']
	);

	Route::delete('/medical-document/{publicId}', [CloudinaryController::class, 'deleteMedicalDocument'])
		->where('publicId', '.*');

	Route::get('/medical-document/{publicId}/signed-url', [CloudinaryController::class, 'getSignedUrl'])
		->where('publicId', '.*');

});