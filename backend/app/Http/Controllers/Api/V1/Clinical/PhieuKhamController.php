<?php

namespace App\Http\Controllers\Api\V1\Clinical;

use App\Http\Controllers\Controller;
use App\Requests\Clinical\UpdatePhieuKhamRequest;
use App\Resources\Clinical\PhieuKhamResource;
use App\Services\ClinicalService;

class PhieuKhamController extends Controller
{
    public function __construct(private ClinicalService $clinicalService) {}

    public function show(int $id)
    {
        $phieuKham = $this->clinicalService->getPhieuKham($id);

        return response()->json([
            'success' => true,
            'data'    => new PhieuKhamResource($phieuKham),
        ]);
    }

    public function update(UpdatePhieuKhamRequest $request, int $id)
    {
        $phieuKham = $this->clinicalService->getPhieuKham($id);
        $phieuKham = $this->clinicalService->updatePhieuKham($phieuKham, $request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Cập nhật phiếu khám thành công',
            'data'    => new PhieuKhamResource($phieuKham),
        ]);
    }
}
