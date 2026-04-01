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

        return response()->json([
            'success' => true,
            'data' => [
                'items' => VaiTroResource::collection($paginator->items()),
                'pagination' => [
                    'currentPage' => $paginator->currentPage(),
                    'pageSize' => $paginator->perPage(),
                    'totalItems' => $paginator->total(),
                    'totalPages' => $paginator->lastPage(),
                ],
            ],
            'message' => 'Lấy danh sách vai trò thành công.',
        ]);
    }

    public function chiTietVaiTro(ChiTietVaiTroRequest $request, int $id): JsonResponse
    {
        try {
            $vaiTro = $this->vaiTroQuyenService->layChiTietVaiTro($id);

            return response()->json([
                'success' => true,
                'data' => new VaiTroResource($vaiTro),
                'message' => 'Lấy chi tiết vai trò thành công.',
            ]);
        } catch (ModelNotFoundException) {
            return response()->json([
                'success' => false,
                'data' => null,
                'message' => 'Không tìm thấy vai trò.',
            ], 404);
        }
    }

    public function taoVaiTro(TaoVaiTroRequest $request): JsonResponse
    {
        $vaiTro = $this->vaiTroQuyenService->taoVaiTro($request->validated());

        return response()->json([
            'success' => true,
            'data' => new VaiTroResource($vaiTro),
            'message' => 'Tạo vai trò thành công.',
        ], 201);
    }

    public function capNhatVaiTro(CapNhatVaiTroRequest $request, int $id): JsonResponse
    {
        try {
            $vaiTro = $this->vaiTroQuyenService->capNhatVaiTro($id, $request->validated());

            return response()->json([
                'success' => true,
                'data' => new VaiTroResource($vaiTro),
                'message' => 'Cập nhật vai trò thành công.',
            ]);
        } catch (ModelNotFoundException) {
            return response()->json([
                'success' => false,
                'data' => null,
                'message' => 'Không tìm thấy vai trò.',
            ], 404);
        }
    }

    public function xoaVaiTro(XoaVaiTroRequest $request, int $id): JsonResponse
    {
        try {
            $this->vaiTroQuyenService->xoaVaiTro($id);

            return response()->json([
                'success' => true,
                'data' => ['id' => $id],
                'message' => 'Xóa vai trò thành công.',
            ]);
        } catch (\DomainException $exception) {
            return response()->json([
                'success' => false,
                'data' => null,
                'message' => $exception->getMessage(),
            ], 409);
        } catch (ModelNotFoundException) {
            return response()->json([
                'success' => false,
                'data' => null,
                'message' => 'Không tìm thấy vai trò.',
            ], 404);
        }
    }

    public function danhSachQuyen(DanhSachQuyenRequest $request): JsonResponse
    {
        $paginator = $this->vaiTroQuyenService->layDanhSachQuyen($request->validated());

        return response()->json([
            'success' => true,
            'data' => [
                'items' => QuyenResource::collection($paginator->items()),
                'pagination' => [
                    'currentPage' => $paginator->currentPage(),
                    'pageSize' => $paginator->perPage(),
                    'totalItems' => $paginator->total(),
                    'totalPages' => $paginator->lastPage(),
                ],
            ],
            'message' => 'Lấy danh sách quyền thành công.',
        ]);
    }

    public function taoQuyen(TaoQuyenRequest $request): JsonResponse
    {
        $quyen = $this->vaiTroQuyenService->taoQuyen($request->validated());

        return response()->json([
            'success' => true,
            'data' => new QuyenResource($quyen),
            'message' => 'Tạo quyền thành công.',
        ], 201);
    }

    public function capNhatQuyen(CapNhatQuyenRequest $request, int $id): JsonResponse
    {
        try {
            $quyen = $this->vaiTroQuyenService->capNhatQuyen($id, $request->validated());

            return response()->json([
                'success' => true,
                'data' => new QuyenResource($quyen),
                'message' => 'Cập nhật quyền thành công.',
            ]);
        } catch (ModelNotFoundException) {
            return response()->json([
                'success' => false,
                'data' => null,
                'message' => 'Không tìm thấy quyền.',
            ], 404);
        }
    }

    public function xoaQuyen(XoaQuyenRequest $request, int $id): JsonResponse
    {
        try {
            $this->vaiTroQuyenService->xoaQuyen($id);

            return response()->json([
                'success' => true,
                'data' => ['id' => $id],
                'message' => 'Xóa quyền thành công.',
            ]);
        } catch (ModelNotFoundException) {
            return response()->json([
                'success' => false,
                'data' => null,
                'message' => 'Không tìm thấy quyền.',
            ], 404);
        }
    }
}
