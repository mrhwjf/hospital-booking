<?php

namespace App\Http\Controllers\Api\V1\Scheduling;

use App\Http\Controllers\Controller;
use App\Services\SchedulingService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class LichLamViecController extends Controller
{
    public function __construct(private readonly SchedulingService $schedulingService)
    {
    }

    public function chuyenKhoas(Request $request): JsonResponse
    {
        $paginator = $this->schedulingService->getChuyenKhoas($request->all());

        return $this->paginatedResponse($paginator, 'Lay danh sach chuyen khoa thanh cong.');
    }

    public function bacSiTheoChuyenKhoa(int $id, Request $request): JsonResponse
    {
        try {
            $paginator = $this->schedulingService->getBacSisByChuyenKhoa($id, $request->all());

            return $this->paginatedResponse($paginator, 'Lay danh sach bac si theo chuyen khoa thanh cong.');
        } catch (ValidationException $exception) {
            return response()->json([
                'success' => false,
                'data' => [
                    'errors' => $exception->errors(),
                ],
                'message' => 'Chuyen khoa khong ton tai.',
            ], 404);
        }
    }

    public function lichLamViecBacSi(int $id, Request $request): JsonResponse
    {
        try {
            $data = $this->schedulingService->getLichLamViecBacSi($id, $request->all());

            return response()->json([
                'success' => true,
                'data' => $data,
                'message' => 'Lay lich lam viec bac si thanh cong.',
            ]);
        } catch (ValidationException $exception) {
            return response()->json([
                'success' => false,
                'data' => [
                    'errors' => $exception->errors(),
                ],
                'message' => 'Khong the lay lich lam viec bac si.',
            ], 422);
        }
    }

    public function dichVus(Request $request): JsonResponse
    {
        $paginator = $this->schedulingService->getDichVus($request->all());

        return $this->paginatedResponse($paginator, 'Lay danh sach dich vu thanh cong.');
    }

    public function goiKhams(Request $request): JsonResponse
    {
        $paginator = $this->schedulingService->getGoiKhams($request->all());

        return $this->paginatedResponse($paginator, 'Lay danh sach goi kham thanh cong.');
    }

    public function cauHinhHeThong(Request $request): JsonResponse
    {
        try {
            $data = $this->schedulingService->getCauHinhHeThong($request->all());

            return response()->json([
                'success' => true,
                'data' => $data,
                'message' => 'Lay cau hinh he thong thanh cong.',
            ]);
        } catch (\Throwable $throwable) {
            return response()->json([
                'success' => false,
                'data' => null,
                'message' => 'Khong the lay cau hinh he thong.',
            ], 500);
        }
    }

    private function paginatedResponse(LengthAwarePaginator $paginator, string $message): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => [
                'items' => $paginator->items(),
                'pagination' => [
                    'currentPage' => $paginator->currentPage(),
                    'pageSize' => $paginator->perPage(),
                    'totalItems' => $paginator->total(),
                    'totalPages' => $paginator->lastPage(),
                ],
            ],
            'message' => $message,
        ]);
    }
}
