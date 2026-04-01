<?php

namespace App\Http\Controllers\Api\V1\Clinical;

use App\Http\Controllers\Controller;
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

        return response()->json([
            'success' => true,
            'data' => new ThongTinBacSiStaticResource($profile),
            'message' => 'Thông tin bác sĩ',
        ]);
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

        return response()->json([
            'success' => true,
            'data' => new ThongTinBacSiWeeklyResource($weeklyData),
            'message' => 'Lịch làm việc bác sĩ',
        ]);
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
        return response()->json([
            'success' => false,
            'message' => 'Không xác định được bác sĩ hiện tại.',
            'error' => ['code' => 'UNAUTHORIZED'],
        ], 401);
    }
}
