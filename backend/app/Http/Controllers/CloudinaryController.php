<?php
namespace App\Http\Controllers;

use App\Services\CloudinaryService;

use App\Resources\ApiResponse;
use App\Resources\Cloudinary\AvatarResource;
use App\Resources\Cloudinary\MedicalDocumentResource;

use App\Requests\Cloudinary\UploadAvatarRequest;
use App\Requests\Cloudinary\UploadMedicalDocumentRequest;

class CloudinaryController extends Controller
{
	protected $cloudinaryService;

	public function __construct(CloudinaryService $cloudinaryService)
	{
		$this->cloudinaryService = $cloudinaryService;
	}

	public function uploadAvatar(UploadAvatarRequest $request, int $nguoiDungId)
	{
		$file = $request->file('hinh_anh');
		$result = $this->cloudinaryService->uploadAvatar($file, $nguoiDungId);

		return ApiResponse::success(new AvatarResource((object) $result), 'Tải lên hình ảnh đại diện thành công.');
	}

	public function deleteAvatar(string $publicId)
	{
		try {
			$this->cloudinaryService->delete($publicId);
			return ApiResponse::success(null, 'Xóa hình ảnh đại diện thành công.');
		} catch (\Exception $e) {
			return ApiResponse::error('Xóa hình ảnh đại diện thất bại: ' . $e->getMessage(), null, 500);
		}
	}

	public function uploadMedicalDocument(UploadMedicalDocumentRequest $request, int $phieuKhamId, int $taiLieuId)
	{
		$file = $request->file('tai_lieu');
		$result = $this->cloudinaryService->uploadMedicalDocument($file, $phieuKhamId, $taiLieuId);

		return ApiResponse::success(new MedicalDocumentResource((object) $result), 'Tải lên tài liệu y tế thành công.');
	}

	public function deleteMedicalDocument(string $publicId)
	{
		try {
			$this->cloudinaryService->delete($publicId, 'raw', 'private');
			return ApiResponse::success(null, 'Xóa tệp thành công.');
		} catch (\Exception $e) {
			return ApiResponse::error('Xóa tệp thất bại: ' . $e->getMessage(), null, 500);
		}
	}

	public function getSignedUrl(string $publicId)
	{
		try {
			$url = $this->cloudinaryService->getSignedUrl($publicId);
			return ApiResponse::success(['url' => $url], 'Lấy URL có chữ ký thành công.');
		} catch (\Exception $e) {
			return ApiResponse::error('Lấy URL có chữ ký thất bại: ' . $e->getMessage(), null, 500);
		}
	}
}