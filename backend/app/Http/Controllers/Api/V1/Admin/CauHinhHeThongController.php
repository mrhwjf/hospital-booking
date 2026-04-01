<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Requests\Admin\CapNhatCauHinhHeThongRequest;
use App\Requests\Admin\DanhSachCauHinhHeThongRequest;
use App\Resources\Admin\CauHinhHeThongResource;
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

        return response()->json([
            'success' => true,
            'data' => [
                'items' => CauHinhHeThongResource::collection($paginator->items()),
                'pagination' => [
                    'currentPage' => $paginator->currentPage(),
                    'pageSize' => $paginator->perPage(),
                    'totalItems' => $paginator->total(),
                    'totalPages' => $paginator->lastPage(),
                ],
            ],
            'message' => 'Lấy danh sách cấu hình hệ thống thành công.',
        ]);
    }

    public function capNhatHangLoat(CapNhatCauHinhHeThongRequest $request): JsonResponse
    {
        $items = $this->cauHinhHeThongService->capNhatHangLoat($request->validated('items'));

        return response()->json([
            'success' => true,
            'data' => [
                'items' => CauHinhHeThongResource::collection($items),
                'totalUpdated' => $items->count(),
            ],
            'message' => 'Cập nhật cấu hình hệ thống thành công.',
        ]);
    }
}
