<?php

namespace App\Http\Controllers\Api\V1\Clinical;

use App\Http\Controllers\Controller;
use App\Resources\ApiResponse;
use App\Resources\Clinical\ThongTinBacSiStaticResource;
use App\Resources\Clinical\ThongTinBacSiWeeklyResource;
use App\Services\ThongTinBacSiService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

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
        $doctorId = $this->resolveDoctorId($request);

        if ($doctorId === null) {
            return $this->unauthorizedResponse();
        }

        $profile = $this->thongTinBacSiService->getStaticInfo($doctorId);

        return ApiResponse::success(new ThongTinBacSiStaticResource($profile), 'Thông tin bác sĩ');
    }

    /**
     * GET /api/v1/bac-si/lich-lam-viec
     */
    public function showWeekly(Request $request): JsonResponse
    {
        $doctorId = $this->resolveDoctorId($request);

        if ($doctorId === null) {
            return $this->unauthorizedResponse();
        }

        $weekOffset = (int) $request->input('week_offset', 0);
        $weeklyData = $this->thongTinBacSiService->getWeeklySchedule($doctorId, $weekOffset);

        return ApiResponse::success(new ThongTinBacSiWeeklyResource($weeklyData), 'Lịch làm việc bác sĩ');
    }

    private function resolveDoctorId(Request $request): ?int
    {
        if ($request->filled('bac_si_id')) {
            return (int) $request->input('bac_si_id');
        }

        return auth()->user()?->bacSi?->id;
    }

    private function unauthorizedResponse(): JsonResponse
    {
        return ApiResponse::error('Không xác định được bác sĩ hiện tại.', ['code' => 'UNAUTHORIZED'], 401);
    }
}
