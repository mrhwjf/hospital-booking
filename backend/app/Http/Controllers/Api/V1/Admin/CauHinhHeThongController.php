<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Requests\Admin\CapNhatCauHinhHeThongRequest;
use App\Requests\Admin\DanhSachCauHinhHeThongRequest;
use App\Resources\Admin\CauHinhHeThongResource;
use App\Resources\ApiResponse;
use App\Services\Admin\CauHinhHeThongService;
use Illuminate\Http\JsonResponse;

class CauHinhHeThongController extends Controller
{
    public function __construct(private readonly CauHinhHeThongService $cauHinhHeThongService)
    {
    }

    public function index(DanhSachCauHinhHeThongRequest $request): JsonResponse
    {
        $paginator = $this->cauHinhHeThongService->layDanhSach($request->validated());

        return ApiResponse::paginated($paginator, CauHinhHeThongResource::class, 'Lấy danh sách cấu hình hệ thống thành công.');
    }

    public function capNhatHangLoat(CapNhatCauHinhHeThongRequest $request): JsonResponse
    {
        $items = $this->cauHinhHeThongService->capNhatHangLoat($request->validated('items'));

        return ApiResponse::success([
            'items' => CauHinhHeThongResource::collection($items),
            'totalUpdated' => $items->count(),
        ], 'Cập nhật cấu hình hệ thống thành công.');
    }
}
