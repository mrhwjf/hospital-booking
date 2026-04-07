<?php

namespace App\Http\Controllers\Api\V1\Clinical;

use App\Http\Controllers\Controller;
use App\Requests\Clinical\StoreChiDinhRequest;
use App\Models\PhieuKham;
use App\Resources\ApiResponse;
use App\Resources\Clinical\ChiDinhResource;
use App\Services\ClinicalService;
use Illuminate\Http\Request;

class ChiDinhController extends Controller
{
    public function __construct(private ClinicalService $clinicalService)
    {
    }

    public function dichVuList(Request $request)
    {
        $phieuKhamId = (int) $request->query('phieu_kham_id');
        $items = $this->clinicalService->getDichVuList($phieuKhamId > 0 ? $phieuKhamId : null);

        return ApiResponse::success($items->values());
    }

    public function index(int $phieuKhamId)
    {
        $phieuKham = PhieuKham::query()->findOrFail($phieuKhamId);
        $this->authorize('view', $phieuKham);

        $items = $this->clinicalService->getChiDinhList($phieuKhamId);

        return ApiResponse::success(
            $items
                ->map(fn($item) => (new ChiDinhResource($item))->toArray(request()))
                ->values()
        );
    }

    public function store(StoreChiDinhRequest $request, int $phieuKhamId)
    {
        $phieuKham = PhieuKham::query()->findOrFail($phieuKhamId);
        $this->authorize('update', $phieuKham);

        $items = $this->clinicalService->createChiDinh($phieuKhamId, $request->validated());

        return ApiResponse::success(
            $items
                ->map(fn($item) => (new ChiDinhResource($item))->toArray($request))
                ->values(),
            'Đã lưu phiếu chỉ định thành công'
        );
    }
}
