<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Requests\Admin\CapNhatBacSiRequest;
use App\Requests\Admin\ChiTietBacSiRequest;
use App\Requests\Admin\DanhSachBacSiRequest;
use App\Requests\Admin\DanhSachChuyenKhoaRequest;
use App\Requests\Admin\DanhSachTaiKhoanBacSiRequest;
use App\Requests\Admin\TaoBacSiRequest;
use App\Requests\Admin\XoaBacSiRequest;
use App\Resources\Admin\BacSiResource;
use App\Resources\Admin\NguoiDungResource;
use App\Services\Admin\BacSiService;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Throwable;

class BacSiController extends Controller
{
    public function __construct(private readonly BacSiService $bacSiService)
    {
    }

    public function index(DanhSachBacSiRequest $request): JsonResponse
    {
        $paginator = $this->bacSiService->layDanhSach($request->validated());

        return response()->json([
            'success' => true,
            'data'    => [
                'items'      => BacSiResource::collection($paginator->items()),
                'pagination' => [
                    'currentPage' => $paginator->currentPage(),
                    'pageSize'    => $paginator->perPage(),
                    'totalItems'  => $paginator->total(),
                    'totalPages'  => $paginator->lastPage(),
                ],
            ],
            'message' => 'Lấy danh sách hồ sơ bác sĩ thành công.',
        ]);
    }

    public function show(ChiTietBacSiRequest $request, int $id): JsonResponse
    {
        try {
            $bacSi = $this->bacSiService->layChiTiet($id);

            return response()->json([
                'success' => true,
                'data'    => new BacSiResource($bacSi),
                'message' => 'Lấy chi tiết bác sĩ thành công.',
            ]);
        } catch (ModelNotFoundException) {
            return response()->json([
                'success' => false,
                'data'    => null,
                'message' => 'Không tìm thấy hồ sơ bác sĩ.',
            ], 404);
        }
    }

    public function store(TaoBacSiRequest $request): JsonResponse
    {
        $payload = $request->validated();

        if (!empty($payload['chuyen_khoa_chinh_id']) && !in_array($payload['chuyen_khoa_chinh_id'], $payload['chuyen_khoa_ids'], true)) {
            return response()->json([
                'success' => false,
                'data'    => null,
                'message' => 'Chuyên khoa chính phải thuộc danh sách chuyên khoa đã chọn.',
            ], 422);
        }

        try {
            $bacSi = $this->bacSiService->tao($payload);
        } catch (ModelNotFoundException $exception) {
            return response()->json([
                'success' => false,
                'data'    => null,
                'message' => $exception->getMessage() ?: 'Không thể tạo hồ sơ bác sĩ.',
            ], 400);
        }

        return response()->json([
            'success' => true,
            'data'    => new BacSiResource($bacSi),
            'message' => 'Tạo hồ sơ bác sĩ thành công.',
        ], 201);
    }

    public function update(CapNhatBacSiRequest $request, int $id): JsonResponse
    {
        $payload = $request->validated();

        if (
            array_key_exists('chuyen_khoa_chinh_id', $payload)
            && !empty($payload['chuyen_khoa_chinh_id'])
            && array_key_exists('chuyen_khoa_ids', $payload)
            && !in_array($payload['chuyen_khoa_chinh_id'], $payload['chuyen_khoa_ids'], true)
        ) {
            return response()->json([
                'success' => false,
                'data'    => null,
                'message' => 'Chuyên khoa chính phải thuộc danh sách chuyên khoa đã chọn.',
            ], 422);
        }

        try {
            $bacSi = $this->bacSiService->capNhat($id, $payload);

            return response()->json([
                'success' => true,
                'data'    => new BacSiResource($bacSi),
                'message' => 'Cập nhật hồ sơ bác sĩ thành công.',
            ]);
        } catch (ModelNotFoundException) {
            return response()->json([
                'success' => false,
                'data'    => null,
                'message' => 'Không tìm thấy hồ sơ bác sĩ.',
            ], 404);
        }
    }

    public function destroy(XoaBacSiRequest $request, int $id): JsonResponse
    {
        try {
            $this->bacSiService->xoa($id);

            return response()->json([
                'success' => true,
                'data'    => [
                    'id' => $id,
                ],
                'message' => 'Xóa hồ sơ bác sĩ thành công.',
            ]);
        } catch (ModelNotFoundException) {
            return response()->json([
                'success' => false,
                'data'    => null,
                'message' => 'Không tìm thấy hồ sơ bác sĩ.',
            ], 404);
        } catch (Throwable) {
            return response()->json([
                'success' => false,
                'data'    => null,
                'message' => 'Không thể xóa bác sĩ vì dữ liệu đang được sử dụng ở nghiệp vụ khác.',
            ], 409);
        }
    }

    public function danhSachChuyenKhoa(DanhSachChuyenKhoaRequest $request): JsonResponse
    {
        $paginator = $this->bacSiService->layDanhMucChuyenKhoa($request->validated());

        return response()->json([
            'success' => true,
            'data'    => [
                'items'      => $paginator->items(),
                'pagination' => [
                    'currentPage' => $paginator->currentPage(),
                    'pageSize'    => $paginator->perPage(),
                    'totalItems'  => $paginator->total(),
                    'totalPages'  => $paginator->lastPage(),
                ],
            ],
            'message' => 'Lấy danh mục chuyên khoa thành công.',
        ]);
    }

    public function danhSachTaiKhoanBacSi(DanhSachTaiKhoanBacSiRequest $request): JsonResponse
    {
        $paginator = $this->bacSiService->layDanhSachTaiKhoanBacSi($request->validated());

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
            'message' => 'Lấy danh sách tài khoản bác sĩ thành công.',
        ]);
    }
}
