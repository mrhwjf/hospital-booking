<?php

namespace App\Http\Controllers\Api\V1\Clinical;

use App\Http\Controllers\Controller;
use App\Requests\Clinical\StoreChiDinhRequest;
use App\Resources\ApiResponse;
use App\Resources\Clinical\ChiDinhResource;
use App\Resources\Clinical\DichVuResource;
use App\Services\ClinicalService;

class ChiDinhController extends Controller
{
    public function __construct(private ClinicalService $clinicalService)
    {
    }

    public function dichVuList()
    {
        $items = $this->clinicalService->getDichVuList();

        return ApiResponse::success(
            $items
                ->map(fn($item) => (new DichVuResource($item))->toArray(request()))
                ->values()
        );
    }

    public function index(int $phieuKhamId)
    {
        $items = $this->clinicalService->getChiDinhList($phieuKhamId);

        return ApiResponse::success(
            $items
                ->map(fn($item) => (new ChiDinhResource($item))->toArray(request()))
                ->values()
        );
    }

    public function store(StoreChiDinhRequest $request, int $phieuKhamId)
    {
        $items = $this->clinicalService->createChiDinh($phieuKhamId, $request->validated());

        return ApiResponse::success(
            $items
                ->map(fn($item) => (new ChiDinhResource($item))->toArray($request))
                ->values(),
            'Đã tạo phiếu chỉ định thành công',
            201
        );
    }
}
