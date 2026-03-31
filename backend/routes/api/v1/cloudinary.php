<?php

use App\Http\Controllers\CloudinaryController;
use Illuminate\Support\Facades\Route;

Route::prefix('cloudinary')->group(function () {

	// Used for managing doctor and staff avatars
	Route::post('/avatar/{nguoiDungId}', [CloudinaryController::class, 'uploadAvatar']);
	Route::delete('/avatar/{publicId}', [CloudinaryController::class, 'deleteAvatar'])
		->where('publicId', '.*');

	//note: a separate endpoint for patient's avatar will be implemented in the future

	Route::post(
		'/medical-document/{phieuKhamId}/{taiLieuId}',
		[CloudinaryController::class, 'uploadMedicalDocument']
	);

	Route::delete('/medical-document/{publicId}', [CloudinaryController::class, 'deleteMedicalDocument'])
		->where('publicId', '.*');

	Route::get('/medical-document/{publicId}/signed-url', [CloudinaryController::class, 'getSignedUrl'])
		->where('publicId', '.*');

});