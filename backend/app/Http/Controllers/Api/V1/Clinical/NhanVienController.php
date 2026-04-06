<?php

namespace App\Http\Controllers\Api\V1\Clinical;

use App\Http\Controllers\Controller;
use App\Resources\ApiResponse;
use App\Resources\Clinical\NhanVienProfileResource;
use App\Services\StaffProfileService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Auth\Access\AuthorizationException;
use Throwable;

class NhanVienController extends Controller
{
	public function __construct(
		private readonly StaffProfileService $staffProfileService,
	) {
	}
	public function me(Request $request): JsonResponse
	{
		$user = $request->user();
		if (!$user) {
			return ApiResponse::error('Bạn chưa đăng nhập.', null, 401);
		}

		try {
			$profile = $this->staffProfileService->getByUserId((int) $user->id);

			if (!$profile) {
				return ApiResponse::error('Hồ sơ nhân viên không tồn tại', null, 404);
			}

			$this->authorize('view', $profile);

			return ApiResponse::success(new NhanVienProfileResource($profile), 'Lấy thông tin hồ sơ nhân viên thành công');
		} catch (AuthorizationException $exception) {
			return ApiResponse::error('Bạn không có quyền truy cập hồ sơ này.', null, 403);
		} catch (Throwable $exception) {
			return ApiResponse::error('Lỗi khi lấy thông tin hồ sơ', null, 500);
		}
	}
}
