<?php

namespace App\Http\Controllers\Api\V1\Dashboard;

use App\Http\Controllers\Controller;
use App\Http\Requests\Dashboard\GetPatientDashboardRequest;
use App\Http\Resources\Dashboard\PatientDashboardResource;
use App\Services\Dashboard\PatientDashboardService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

/**
 * Patient Dashboard Controller
 * 
 * Handles patient dashboard requests
 * Flow: Route → GetPatientDashboardRequest → Controller → Service → Model → PatientDashboardResource
 */
class PatientDashboardController extends Controller
{
    protected PatientDashboardService $dashboardService;

    public function __construct(PatientDashboardService $dashboardService)
    {
        $this->dashboardService = $dashboardService;
    }

    /**
     * Get patient dashboard overview
     * 
     * Endpoint: GET /api/v1/dashboard/patient
     * Auth: Bearer token (role: BENHNHAN)
     * 
     * Response includes:
     * - patient_info: Mã BN, nhóm máu, thông tin cơ bản
     * - upcoming_appointments: Lịch hẹn sắp tới
     * - recent_visit_history: Lịch sử khám gần đây
     * - health_profile: Tiền sử bệnh, dị ứng
     * - health_reminder: Nhắc nhở sức khỏe
     * 
     * @param GetPatientDashboardRequest $request - Validates auth + patient role
     * @return \Illuminate\Http\Resources\Json\JsonResource
     */
    public function overview(GetPatientDashboardRequest $request): JsonResponse
    {
        try {
            $user = $request->user();
            $benh_nhan = $user->benhNhan;

            // Get dashboard data from service
            $data = $this->dashboardService->getDashboardData($benh_nhan->id);

            // Return formatted resource
            return (new PatientDashboardResource($data))->response();
        } catch (\Exception $e) {
            Log::error('Patient dashboard error:', ['exception' => $e]);

            return response()->json([
                'error' => [
                    'code' => 'INTERNAL_ERROR',
                    'message' => 'Không thể tải dữ liệu dashboard',
                    'trace_id' => uniqid()
                ]
            ], 500);
        }
    }

    /**
     * Test endpoint - Get patient dashboard data without authentication
     * 
     * Endpoint: GET /api/v1/dashboard/patient/test/{benhNhanId}
     * Auth: None (for testing only)
     * 
     * @param int $benhNhanId - Patient ID from first patient in seeder
     * @return \Illuminate\Http\Resources\Json\JsonResource
     */
    public function overviewTest(int $benhNhanId): JsonResponse
    {
        try {
            // Get dashboard data from service
            $data = $this->dashboardService->getDashboardData($benhNhanId);

            // Return formatted resource
            return (new PatientDashboardResource($data))->response();
        } catch (\Exception $e) {
            Log::error('Patient dashboard test error:', ['exception' => $e]);

            return response()->json([
                'error' => [
                    'code' => 'INTERNAL_ERROR',
                    'message' => 'Không thể tải dữ liệu dashboard',
                    'trace_id' => uniqid()
                ]
            ], 500);
        }
    }
}
