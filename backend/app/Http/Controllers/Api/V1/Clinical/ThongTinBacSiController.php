<?php

namespace App\Http\Controllers\Api\V1\Clinical;

use App\Http\Controllers\Controller;
use App\Models\BacSi;
use App\Resources\ApiResponse;
use App\Resources\Clinical\ThongTinBacSiStaticResource;
use App\Resources\Clinical\ThongTinBacSiWeeklyResource;
use App\Services\ThongTinBacSiService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ThongTinBacSiController extends Controller
{
    public function __construct(private readonly ThongTinBacSiService $thongTinBacSiService)
    {
    }

    /**
     * GET /api/v1/bac-si/thong-tin
     */
    public function showStatic(Request $request): JsonResponse
    {
        [$doctor, $errorResponse] = $this->resolveDoctorContext($request);

        if ($errorResponse !== null) {
            return $errorResponse;
        }

        $profile = $this->thongTinBacSiService->getStaticInfo((int) $doctor->id);

        return ApiResponse::success(new ThongTinBacSiStaticResource($profile), 'Thông tin bác sĩ');
    }

    /**
     * GET /api/v1/bac-si/lich-lam-viec
     */
    public function showWeekly(Request $request): JsonResponse
    {
        [$doctor, $errorResponse] = $this->resolveDoctorContext($request);

        if ($errorResponse !== null) {
            return $errorResponse;
        }

        $weekOffset = (int) $request->input('week_offset', 0);
        $weeklyData = $this->thongTinBacSiService->getWeeklySchedule((int) $doctor->id, $weekOffset);

        return ApiResponse::success(new ThongTinBacSiWeeklyResource($weeklyData), 'Lịch làm việc bác sĩ');
    }

    /**
     * @return array{0: BacSi|null, 1: JsonResponse|null}
     */
    private function resolveDoctorContext(Request $request): array
    {
        $authDoctorId = (int) ($request->user()?->bacSi?->id ?? 0);

        if ($authDoctorId <= 0) {
            return [null, $this->unauthorizedResponse()];
        }

        if ($request->filled('bac_si_id')) {
            $doctorIdFromQuery = (int) $request->input('bac_si_id');

            if ($doctorIdFromQuery !== $authDoctorId) {
                return [null, $this->forbiddenResponse()];
            }
        }

        $doctor = BacSi::query()->find($authDoctorId);

        if ($doctor === null) {
            return [null, $this->notFoundDoctorResponse()];
        }

        $this->authorize('view', $doctor);

        return [$doctor, null];
    }

    private function unauthorizedResponse(): JsonResponse
    {
        return ApiResponse::error(
            'Không xác định được bác sĩ hiện tại.',
            ['code' => 'UNAUTHORIZED'],
            Response::HTTP_UNAUTHORIZED
        );
    }

    private function forbiddenResponse(): JsonResponse
    {
        return ApiResponse::error(
            'Bạn không có quyền truy cập dữ liệu của bác sĩ khác.',
            ['code' => 'FORBIDDEN'],
            Response::HTTP_FORBIDDEN
        );
    }

    private function notFoundDoctorResponse(): JsonResponse
    {
        return ApiResponse::error(
            'Không tìm thấy thông tin bác sĩ.',
            ['code' => 'NOT_FOUND'],
            Response::HTTP_NOT_FOUND
        );
    }
}
