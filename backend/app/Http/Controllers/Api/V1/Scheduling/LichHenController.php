<?php

namespace App\Http\Controllers\Api\V1\Scheduling;

use App\Http\Controllers\Controller;
use App\Requests\Scheduling\CreateLichHenRequest;
use App\Services\SchedulingService;
use Illuminate\Http\JsonResponse;
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
                'message' => 'Khong the tao lich hen. Vui long thu lai.',
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
}
