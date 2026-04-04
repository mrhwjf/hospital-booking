<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Requests\Admin\CapNhatQuyenRequest;
use App\Requests\Admin\CapNhatVaiTroRequest;
use App\Requests\Admin\ChiTietVaiTroRequest;
use App\Requests\Admin\DanhSachQuyenRequest;
use App\Requests\Admin\DanhSachVaiTroRequest;
use App\Requests\Admin\TaoQuyenRequest;
use App\Requests\Admin\TaoVaiTroRequest;
use App\Requests\Admin\XoaQuyenRequest;
use App\Requests\Admin\XoaVaiTroRequest;
use App\Resources\ApiResponse;
use App\Resources\Admin\QuyenResource;
use App\Resources\Admin\VaiTroResource;
use App\Services\Admin\VaiTroQuyenService;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;

class VaiTroQuyenController extends Controller
{
    public function __construct(private readonly VaiTroQuyenService $vaiTroQuyenService)
    {
    }

    public function danhSachVaiTro(DanhSachVaiTroRequest $request): JsonResponse
    {
        $paginator = $this->vaiTroQuyenService->layDanhSachVaiTro($request->validated());

        return ApiResponse::paginated($paginator, VaiTroResource::class, 'Lấy danh sách vai trò thành công.');
    }

    public function chiTietVaiTro(ChiTietVaiTroRequest $request, int $id): JsonResponse
    {
        try {
            $vaiTro = $this->vaiTroQuyenService->layChiTietVaiTro($id);

            return ApiResponse::success(new VaiTroResource($vaiTro), 'Lấy chi tiết vai trò thành công.');
        } catch (ModelNotFoundException) {
            return ApiResponse::error('Không tìm thấy vai trò.', null, 404);
        }
    }

    public function taoVaiTro(TaoVaiTroRequest $request): JsonResponse
    {
        $vaiTro = $this->vaiTroQuyenService->taoVaiTro($request->validated());

        return ApiResponse::success(new VaiTroResource($vaiTro), 'Tạo vai trò thành công.', 201);
    }

    public function capNhatVaiTro(CapNhatVaiTroRequest $request, int $id): JsonResponse
    {
        try {
            $vaiTro = $this->vaiTroQuyenService->capNhatVaiTro($id, $request->validated());

            return ApiResponse::success(new VaiTroResource($vaiTro), 'Cập nhật vai trò thành công.');
        } catch (ModelNotFoundException) {
            return ApiResponse::error('Không tìm thấy vai trò.', null, 404);
        }
    }

    public function xoaVaiTro(XoaVaiTroRequest $request, int $id): JsonResponse
    {
        try {
            $this->vaiTroQuyenService->xoaVaiTro($id);

            return ApiResponse::success(['id' => $id], 'Xóa vai trò thành công.');
        } catch (\DomainException $exception) {
            return ApiResponse::error($exception->getMessage(), null, 409);
        } catch (ModelNotFoundException) {
            return ApiResponse::error('Không tìm thấy vai trò.', null, 404);
        }
    }

    public function danhSachQuyen(DanhSachQuyenRequest $request): JsonResponse
    {
        $paginator = $this->vaiTroQuyenService->layDanhSachQuyen($request->validated());

        return ApiResponse::paginated($paginator, QuyenResource::class, 'Lấy danh sách quyền thành công.');
    }

    public function taoQuyen(TaoQuyenRequest $request): JsonResponse
    {
        $quyen = $this->vaiTroQuyenService->taoQuyen($request->validated());

        return ApiResponse::success(new QuyenResource($quyen), 'Tạo quyền thành công.', 201);
    }

    public function capNhatQuyen(CapNhatQuyenRequest $request, int $id): JsonResponse
    {
        try {
            $quyen = $this->vaiTroQuyenService->capNhatQuyen($id, $request->validated());

            return ApiResponse::success(new QuyenResource($quyen), 'Cập nhật quyền thành công.');
        } catch (ModelNotFoundException) {
            return ApiResponse::error('Không tìm thấy quyền.', null, 404);
        }
    }

    public function xoaQuyen(XoaQuyenRequest $request, int $id): JsonResponse
    {
        try {
            $this->vaiTroQuyenService->xoaQuyen($id);

            return ApiResponse::success(['id' => $id], 'Xóa quyền thành công.');
        } catch (ModelNotFoundException) {
            return ApiResponse::error('Không tìm thấy quyền.', null, 404);
        }
    }
}
