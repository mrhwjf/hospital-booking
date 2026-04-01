<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Requests\Admin\CapNhatNhanVienRequest;
use App\Requests\Admin\ChiTietNhanVienRequest;
use App\Requests\Admin\DanhSachNhanVienRequest;
use App\Requests\Admin\DanhSachTaiKhoanNhanVienRequest;
use App\Requests\Admin\TaoNhanVienRequest;
use App\Requests\Admin\XoaNhanVienRequest;
use App\Resources\Admin\NguoiDungResource;
use App\Resources\Admin\NhanVienResource;
use App\Services\Admin\NhanVienService;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Throwable;

class NhanVienController extends Controller
{
    public function __construct(private readonly NhanVienService $nhanVienService)
    {
    }

    public function index(DanhSachNhanVienRequest $request): JsonResponse
    {
        $paginator = $this->nhanVienService->layDanhSach($request->validated());

        return response()->json([
            'success' => true,
            'data'    => [
                'items'      => NhanVienResource::collection($paginator->items()),
                'pagination' => [
                    'currentPage' => $paginator->currentPage(),
                    'pageSize'    => $paginator->perPage(),
                    'totalItems'  => $paginator->total(),
                    'totalPages'  => $paginator->lastPage(),
                ],
            ],
            'message' => 'Lấy danh sách hồ sơ nhân viên thành công.',
        ]);
    }

    public function show(ChiTietNhanVienRequest $request, int $id): JsonResponse
    {
        try {
            $nhanVien = $this->nhanVienService->layChiTiet($id);

            return response()->json([
                'success' => true,
                'data'    => new NhanVienResource($nhanVien),
                'message' => 'Lấy chi tiết nhân viên thành công.',
            ]);
        } catch (ModelNotFoundException) {
            return response()->json([
                'success' => false,
                'data'    => null,
                'message' => 'Không tìm thấy hồ sơ nhân viên.',
            ], 404);
        }
    }

    public function store(TaoNhanVienRequest $request): JsonResponse
    {
        try {
            $nhanVien = $this->nhanVienService->tao($request->validated());

            return response()->json([
                'success' => true,
                'data'    => new NhanVienResource($nhanVien),
                'message' => 'Tạo hồ sơ nhân viên thành công.',
            ], 201);
        } catch (\DomainException $exception) {
            return response()->json([
                'success' => false,
                'data'    => null,
                'message' => $exception->getMessage(),
            ], 400);
        } catch (ModelNotFoundException $exception) {
            return response()->json([
                'success' => false,
                'data'    => null,
                'message' => $exception->getMessage() ?: 'Không tìm thấy tài khoản nhân viên đã chọn.',
            ], 404);
        }
    }

    public function update(CapNhatNhanVienRequest $request, int $id): JsonResponse
    {
        try {
            $nhanVien = $this->nhanVienService->capNhat($id, $request->validated());

            return response()->json([
                'success' => true,
                'data'    => new NhanVienResource($nhanVien),
                'message' => 'Cập nhật hồ sơ nhân viên thành công.',
            ]);
        } catch (ModelNotFoundException) {
            return response()->json([
                'success' => false,
                'data'    => null,
                'message' => 'Không tìm thấy hồ sơ nhân viên.',
            ], 404);
        }
    }

    public function destroy(XoaNhanVienRequest $request, int $id): JsonResponse
    {
        try {
            $this->nhanVienService->xoa($id);

            return response()->json([
                'success' => true,
                'data'    => [
                    'id' => $id,
                ],
                'message' => 'Xóa hồ sơ nhân viên thành công.',
            ]);
        } catch (ModelNotFoundException) {
            return response()->json([
                'success' => false,
                'data'    => null,
                'message' => 'Không tìm thấy hồ sơ nhân viên.',
            ], 404);
        } catch (Throwable) {
            return response()->json([
                'success' => false,
                'data'    => null,
                'message' => 'Không thể xóa nhân viên vì dữ liệu đang được sử dụng ở nghiệp vụ khác.',
            ], 409);
        }
    }

    public function danhSachTaiKhoanNhanVien(DanhSachTaiKhoanNhanVienRequest $request): JsonResponse
    {
        $paginator = $this->nhanVienService->layDanhSachTaiKhoanNhanVien($request->validated());

        return response()->json([
            'success' => true,
            'data'    => [
                'items' => NguoiDungResource::collection($paginator->items()),
                'pagination' => [
                    'currentPage' => $paginator->currentPage(),
                    'pageSize'    => $paginator->perPage(),
                    'totalItems'  => $paginator->total(),
                    'totalPages'  => $paginator->lastPage(),
                ],
            ],
            'message' => 'Lấy danh sách tài khoản nhân viên thành công.',
        ]);
    }
}
