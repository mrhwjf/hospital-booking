<?php

use App\Http\Controllers\Api\V1\Dashboard\PatientDashboardController;
use Illuminate\Support\Facades\Route;

/**
 * Patient Dashboard Routes
 * 
 * Flow: Client → Route → GetPatientDashboardRequest (auth + validate) → Controller → Service → Model → PatientDashboardResource → JSON Response
 */
Route::middleware('auth.jwt')->prefix('dashboard')->group(function () {
    /**
     * Get patient dashboard overview
     * 
     * GET /api/v1/dashboard/patient
     * 
     * Auth: Bearer token (role: BENHNHAN)
     * 
     * Response:
     * - patient_info: Mã BN, nhóm máu, thông tin cơ bản
     * - upcoming_appointments: Lịch hẹn sắp tới
     * - recent_visit_history: Lịch sử khám gần đây
     * - health_profile: Tiền sử bệnh, dị ứng
     * - health_reminder: Nhắc nhở sức khỏe
     * 
     * Example:
     * curl -X GET "http://localhost:8000/api/v1/dashboard/patient" \
     *   -H "Authorization: Bearer {token}" \
     *   -H "Accept: application/json"
     */
    Route::get('/patient', [PatientDashboardController::class, 'overview'])
        ->name('dashboard.patient');
});

/**
 * Test Endpoints (No Authentication Required)
 */
Route::prefix('dashboard')->group(function () {
    /**
     * Test endpoint - Get patient dashboard data without authentication
     * 
     * GET /api/v1/dashboard/patient/test/{benhNhanId}
     * 
     * Auth: None (for testing/development only)
     * 
     * Example:
     * curl -X GET "http://localhost:8000/api/v1/dashboard/patient/test/1" \
     *   -H "Accept: application/json"
     */
    Route::get('/patient/test/{benhNhanId}', [PatientDashboardController::class, 'overviewTest'])
        ->name('dashboard.patient.test')
        ->whereNumber('benhNhanId');
});
