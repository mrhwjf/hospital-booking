<?php

namespace App\Http\Controllers\Api\V1\Clinical;

use App\Http\Controllers\Controller;
use App\Requests\Clinical\StoreDonThuocRequest;
use App\Requests\Clinical\StoreDonThuocItemsRequest;
use App\Requests\Clinical\UpdateDonThuocItemsRequest;
use App\Requests\Clinical\SearchThuocRequest;
use App\Models\DonThuoc;
use App\Models\PhieuKham;
use App\Resources\ApiResponse;
use App\Resources\Clinical\DonThuocResource;
use App\Services\ClinicalService;
use Illuminate\Validation\ValidationException;

class DonThuocController extends Controller
{
    public function __construct(private readonly ClinicalService $clinicalService)
    {
    }
    // Tạo đơn thuốc mới cho một phiếu khám
    public function store(StoreDonThuocRequest $request, int $phieu_kham_id)
    {
        $this->authorizePhieuKhamAccess($phieu_kham_id, 'update');

        try {
            $payload = $request->validated();
            $donThuoc = $this->clinicalService->createPrescription($phieu_kham_id, $payload);

            return ApiResponse::success(new DonThuocResource($donThuoc), 'Đã tạo đơn thuốc mới cho phiếu khám', 201);
        } catch (ValidationException $e) {
            return ApiResponse::error($e->getMessage(), ['code' => 'BUSINESS_RULE_VIOLATION'], 409);
        }
    }


    // Thêm thuốc vào đơn thuốc
    public function storeItems(StoreDonThuocItemsRequest $request, int $don_thuoc_id)
    {
        $this->authorizeDonThuocAccess($don_thuoc_id, 'update');

        try {
            $payload = $request->validated();
            $result = $this->clinicalService->addItemsToPrescription($don_thuoc_id, $payload['items']);

            return ApiResponse::success($result, 'Đã thêm thuốc vào đơn', 201);
        } catch (ValidationException $e) {
            return ApiResponse::error($e->getMessage(), ['code' => 'NOT_FOUND'], 404);
        }
    }

    // Sửa danh sách thuốc trong đơn thuốc (thay toàn bộ danh sách)
    public function updateItems(UpdateDonThuocItemsRequest $request, int $don_thuoc_id)
    {
        $this->authorizeDonThuocAccess($don_thuoc_id, 'update');

        try {
            $payload = $request->validated();
            $result = $this->clinicalService->updatePrescriptionItems($don_thuoc_id, $payload['items']);

            return ApiResponse::success($result, 'Đã cập nhật danh sách thuốc trong đơn');
        } catch (ValidationException $e) {
            return ApiResponse::error($e->getMessage(), ['code' => 'NOT_FOUND'], 404);
        }
    }

    // Xóa đơn thuốc
    public function destroy(int $id)
    {
        $this->authorizeDonThuocAccess($id, 'update');

        try {
            $deletedData = $this->clinicalService->deletePrescription($id);

            return ApiResponse::success($deletedData, 'Đã xóa đơn thuốc');
        } catch (ValidationException $e) {
            return ApiResponse::error($e->getMessage(), ['code' => 'NOT_FOUND'], 404);
        }
    }

    // Lấy đơn thuốc theo phiếu khám
    public function showByPhieuKham(int $phieu_kham_id)
    {
        $this->authorizePhieuKhamAccess($phieu_kham_id, 'view');

        try {
            $donThuoc = $this->clinicalService->getPrescriptionByPhieuKham($phieu_kham_id);

            if (!$donThuoc) {
                return ApiResponse::error('Phiếu khám chưa có đơn thuốc.', ['code' => 'NOT_FOUND'], 404);
            }

            return ApiResponse::success(new DonThuocResource($donThuoc), 'Chi tiết đơn thuốc');
        } catch (ValidationException $e) {
            return ApiResponse::error($e->getMessage(), ['code' => 'NOT_FOUND'], 404);
        }
    }

    // Tìm kiếm thuốc theo tên hoặc mã thuốc
    public function searchThuoc(SearchThuocRequest $request)
    {
        $validated = $request->validated();
        $medicines = $this->clinicalService->searchMedicines($validated);

        return ApiResponse::success($medicines->items(), 'Danh sách thuốc');
    }

    private function authorizePhieuKhamAccess(int $phieuKhamId, string $ability): PhieuKham
    {
        $phieuKham = PhieuKham::query()->findOrFail($phieuKhamId);
        $this->authorize($ability, $phieuKham);

        return $phieuKham;
    }

    private function authorizeDonThuocAccess(int $donThuocId, string $ability): DonThuoc
    {
        $donThuoc = DonThuoc::query()
            ->with(['phieuKham:id,bac_si_id'])
            ->findOrFail($donThuocId);

        $this->authorize($ability, $donThuoc->phieuKham);

        return $donThuoc;
    }
}
