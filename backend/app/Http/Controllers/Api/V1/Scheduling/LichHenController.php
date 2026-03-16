<?php

namespace App\Http\Controllers\Api\V1\Scheduling;

use App\Http\Controllers\Controller;
use App\Requests\Scheduling\CancelLichHenRequest;
use App\Requests\Scheduling\CreateLichHenRequest;
use App\Requests\Scheduling\DoiLichHenRequest;
use App\Services\SchedulingService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class LichHenController extends Controller
{
    public function __construct(private readonly SchedulingService $schedulingService)
    {
    }

    public function store(CreateLichHenRequest $request): JsonResponse
    {
        try {
            $lichHen = $this->schedulingService->createLichHen($request->validated());

            return response()->json([
                'success' => true,
                'data' => $lichHen,
                'message' => 'Dat lich hen thanh cong.',
            ], 201);
        } catch (ValidationException $exception) {
            return response()->json([
                'success' => false,
                'data' => [
                    'errors' => $exception->errors(),
                ],
                'message' => 'Du lieu dat lich khong hop le.',
            ], 422);
        } catch (\Throwable $throwable) {
            return response()->json([
                'success' => false,
                'data' => null,
                'message' => $throwable->getMessage(),
            ], 500);
        }
    }

    public function index(Request $request): JsonResponse
    {
        try {
            $paginator = $this->schedulingService->getLichHensByBenhNhan($request->all());

            return $this->paginatedResponse($paginator, 'Lay danh sach lich hen thanh cong.');
        } catch (ValidationException $exception) {
            return response()->json([
                'success' => false,
                'data' => [
                    'errors' => $exception->errors(),
                ],
                'message' => 'Khong the lay danh sach lich hen.',
            ], 422);
        } catch (\Throwable $throwable) {
            return response()->json([
                'success' => false,
                'data' => null,
                'message' => 'Khong the lay danh sach lich hen. Vui long thu lai.',
            ], 500);
        }
    }

    public function lyDoHuysBenhNhan(): JsonResponse
    {
        try {
            $reasons = $this->schedulingService->getLyDoHuyBenhNhan();

            return response()->json([
                'success' => true,
                'data' => [
                    'items' => $reasons,
                ],
                'message' => 'Lay danh sach ly do huy thanh cong.',
            ]);
        } catch (\Throwable $throwable) {
            return response()->json([
                'success' => false,
                'data' => null,
                'message' => 'Khong the lay danh sach ly do huy.',
            ], 500);
        }
    }

    public function show(int $id): JsonResponse
    {
        try {
            $lichHen = $this->schedulingService->getLichHenById($id);

            return response()->json([
                'success' => true,
                'data' => $lichHen,
                'message' => 'Lay chi tiet lich hen thanh cong.',
            ]);
        } catch (ValidationException $exception) {
            return response()->json([
                'success' => false,
                'data' => [
                    'errors' => $exception->errors(),
                ],
                'message' => 'Khong tim thay lich hen.',
            ], 404);
        } catch (\Throwable $throwable) {
            return response()->json([
                'success' => false,
                'data' => null,
                'message' => 'Khong the lay chi tiet lich hen.',
            ], 500);
        }
    }

    public function huy(int $id, CancelLichHenRequest $request): JsonResponse
    {
        try {
            $lichHen = $this->schedulingService->cancelLichHen($id, $request->validated());

            return response()->json([
                'success' => true,
                'data' => $lichHen,
                'message' => 'Huy lich hen thanh cong.',
            ]);
        } catch (ValidationException $exception) {
            return response()->json([
                'success' => false,
                'data' => [
                    'errors' => $exception->errors(),
                ],
                'message' => 'Khong the huy lich hen.',
            ], 422);
        } catch (\Throwable $throwable) {
            return response()->json([
                'success' => false,
                'data' => null,
                'message' => 'Khong the huy lich hen. Vui long thu lai.',
            ], 500);
        }
    }

    public function doiLich(int $id, DoiLichHenRequest $request): JsonResponse
    {
        try {
            $lichHen = $this->schedulingService->doiLichHen($id, $request->validated());

            return response()->json([
                'success' => true,
                'data' => $lichHen,
                'message' => 'Doi lich hen thanh cong.',
            ]);
        } catch (ValidationException $exception) {
            return response()->json([
                'success' => false,
                'data' => [
                    'errors' => $exception->errors(),
                ],
                'message' => 'Khong the doi lich hen.',
            ], 422);
        } catch (\Throwable $throwable) {
            return response()->json([
                'success' => false,
                'data' => null,
                'message' => 'Khong the doi lich hen. Vui long thu lai.',
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
