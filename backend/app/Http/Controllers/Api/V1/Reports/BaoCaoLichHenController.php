<?php

namespace App\Http\Controllers\Api\V1\Reports;

use App\Http\Controllers\Controller;
use App\Requests\Reports\BaoCaoLichHenRequest;
use App\Requests\Reports\DashboardAdminRequest;
use App\Resources\ApiResponse;
use App\Resources\Reports\BaoCaoLichHenResource;
use App\Resources\Reports\DashboardAdminResource;
use App\Services\ReportService;
use Illuminate\Http\JsonResponse;

class BaoCaoLichHenController extends Controller
{
    public function __construct(private readonly ReportService $reportService)
    {
    }

    public function dashboardAdmin(DashboardAdminRequest $request): JsonResponse
    {
        $data = $this->reportService->layDashboardAdmin($request->validated('moc_phan_tich'));

        return ApiResponse::success(new DashboardAdminResource($data), 'Lấy dashboard quản trị thành công.');
    }

    public function index(BaoCaoLichHenRequest $request): JsonResponse
    {
        $data = $this->reportService->layBaoCaoLichHen($request->validated());

        return ApiResponse::success(new BaoCaoLichHenResource($data), 'Lấy báo cáo lịch hẹn thành công.');
    }
}
