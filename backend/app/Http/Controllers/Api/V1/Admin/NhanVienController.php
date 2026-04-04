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
use App\Resources\ApiResponse;
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

        return ApiResponse::paginated($paginator, NhanVienResource::class, 'Lấy danh sách hồ sơ nhân viên thành công.');
    }

    public function show(ChiTietNhanVienRequest $request, int $id): JsonResponse
    {
        try {
            $nhanVien = $this->nhanVienService->layChiTiet($id);

            return ApiResponse::success(new NhanVienResource($nhanVien), 'Lấy chi tiết nhân viên thành công.');
        } catch (ModelNotFoundException) {
            return ApiResponse::error('Không tìm thấy hồ sơ nhân viên.', null, 404);
        }
    }

    public function store(TaoNhanVienRequest $request): JsonResponse
    {
        try {
            $nhanVien = $this->nhanVienService->tao($request->validated());

            return ApiResponse::success(new NhanVienResource($nhanVien), 'Tạo hồ sơ nhân viên thành công.', 201);
        } catch (\DomainException $exception) {
            return ApiResponse::error($exception->getMessage(), null, 400);
        } catch (ModelNotFoundException $exception) {
            return ApiResponse::error($exception->getMessage() ?: 'Không tìm thấy tài khoản nhân viên đã chọn.', null, 404);
        }
    }

    public function update(CapNhatNhanVienRequest $request, int $id): JsonResponse
    {
        try {
            $nhanVien = $this->nhanVienService->capNhat($id, $request->validated());

            return ApiResponse::success(new NhanVienResource($nhanVien), 'Cập nhật hồ sơ nhân viên thành công.');
        } catch (ModelNotFoundException) {
            return ApiResponse::error('Không tìm thấy hồ sơ nhân viên.', null, 404);
        }
    }

    public function destroy(XoaNhanVienRequest $request, int $id): JsonResponse
    {
        try {
            $this->nhanVienService->xoa($id);

            return ApiResponse::success(['id' => $id], 'Xóa hồ sơ nhân viên thành công.');
        } catch (ModelNotFoundException) {
            return ApiResponse::error('Không tìm thấy hồ sơ nhân viên.', null, 404);
        } catch (Throwable) {
            return ApiResponse::error('Không thể xóa nhân viên vì dữ liệu đang được sử dụng ở nghiệp vụ khác.', null, 409);
        }
    }

    public function danhSachTaiKhoanNhanVien(DanhSachTaiKhoanNhanVienRequest $request): JsonResponse
    {
        $paginator = $this->nhanVienService->layDanhSachTaiKhoanNhanVien($request->validated());

        return ApiResponse::paginated($paginator, NguoiDungResource::class, 'Lấy danh sách tài khoản nhân viên thành công.');
    }
}
