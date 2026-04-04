<?php

namespace App\Http\Controllers\Api\V1\Reports;

use App\Http\Controllers\Controller;
use App\Requests\Reports\BaoCaoDoanhThuRequest;
use App\Resources\ApiResponse;
use App\Resources\Reports\BaoCaoDoanhThuResource;
use App\Services\ReportService;
use Illuminate\Http\JsonResponse;

class BaoCaoDoanhThuController extends Controller
{
    public function __construct(private readonly ReportService $reportService)
    {
    }

    public function index(BaoCaoDoanhThuRequest $request): JsonResponse
    {
        $data = $this->reportService->layBaoCaoDoanhThu($request->validated());

        return ApiResponse::success(new BaoCaoDoanhThuResource($data), 'Lấy báo cáo doanh thu thành công.');
    }
}
