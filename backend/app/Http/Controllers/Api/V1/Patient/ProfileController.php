<?php

namespace App\Http\Controllers\Api\V1\Patient;

use App\Http\Controllers\Controller;
use App\Http\Requests\Patient\UpdatePatientProfileRequest;
use App\Resources\ApiResponse;
use App\Services\PatientProfileService;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

class ProfileController extends Controller
{
    public function __construct(
        private readonly PatientProfileService $patientProfileService,
    ) {
    }

    /**
     * Get current user's patient profile
     *
     */
    public function getProfile(Request $request): JsonResponse
    {
        $user = $request->user();
        if (!$user) {
            return ApiResponse::error('Bạn chưa đăng nhập.', null, 401);
        }

        try {
            $profile = $this->patientProfileService->getByUserId((int) $user->id);

            if (!$profile) {
                return ApiResponse::error('Hồ sơ bệnh nhân không tồn tại', null, 404);
            }

            $this->authorize('view', $profile);

            return ApiResponse::success($profile, 'Lấy thông tin hồ sơ thành công');
        } catch (AuthorizationException $exception) {
            return ApiResponse::error('Bạn không có quyền truy cập hồ sơ này.', null, 403);
        } catch (Throwable $exception) {
            return ApiResponse::error('Lỗi khi lấy thông tin hồ sơ', null, 500);
        }
    }

    /**
     * Update current user's patient profile
     *
     */
    public function updateProfile(UpdatePatientProfileRequest $request): JsonResponse
    {
        $user = $request->user();
        if (!$user) {
            return ApiResponse::error('Bạn chưa đăng nhập.', null, 401);
        }

        try {
            $currentProfile = $this->patientProfileService->getByUserId((int) $user->id);

            if (!$currentProfile) {
                return ApiResponse::error('Hồ sơ bệnh nhân không tồn tại', null, 404);
            }

            $this->authorize('update', $currentProfile);

            $profile = $this->patientProfileService->updateProfile((int) $user->id, $request->validated());

            if (!$profile) {
                return ApiResponse::error('Hồ sơ bệnh nhân không tồn tại', null, 404);
            }

            return ApiResponse::success($profile, 'Cập nhật hồ sơ thành công');
        } catch (AuthorizationException $exception) {
            return ApiResponse::error('Bạn không có quyền cập nhật hồ sơ này.', null, 403);
        } catch (Throwable $exception) {
            return ApiResponse::error('Lỗi khi cập nhật hồ sơ', null, 500);
        }
    }
}