<?php

namespace App\Http\Controllers\Api\V1\Patient;

use App\Http\Controllers\Controller;
use App\Http\Requests\Patient\UpdatePatientProfileRequest;
use App\Services\PatientProfileService;

class ProfileController extends Controller
{
    protected $patientProfileService;

    public function __construct(PatientProfileService $patientProfileService)
    {
        $this->patientProfileService = $patientProfileService;
    }

    /**
     * Get current user's patient profile
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getProfile()
    {
        try {
            // TODO: Bỏ hardcode này sau khi test FE
            $userId = 1;
            $profile = $this->patientProfileService->getByUserId($userId);

            if (!$profile) {
                return response()->json([
                    'success' => false,
                    'data' => null,
                    'message' => 'Hồ sơ bệnh nhân không tồn tại'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $profile,
                'message' => 'Lấy thông tin hồ sơ thành công'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'data' => null,
                'message' => 'Lỗi khi lấy thông tin hồ sơ'
            ], 500);
        }
    }

    /**
     * Update current user's patient profile
     *
     * @param UpdatePatientProfileRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateProfile(UpdatePatientProfileRequest $request)
    {
        try {
            // TODO: Bỏ hardcode này sau khi test FE
            $userId = 1;
            $validatedData = $request->validated();

            $profile = $this->patientProfileService->updateProfile($userId, $validatedData);

            if (!$profile) {
                return response()->json([
                    'success' => false,
                    'data' => null,
                    'message' => 'Hồ sơ bệnh nhân không tồn tại'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $profile,
                'message' => 'Cập nhật hồ sơ thành công'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'data' => null,
                'message' => 'Lỗi khi cập nhật hồ sơ'
            ], 500);
        }
    }
}
