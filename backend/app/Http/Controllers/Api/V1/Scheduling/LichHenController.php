<?php

namespace App\Http\Controllers\Api\V1\Scheduling;

use App\Http\Controllers\Controller;
use App\Requests\Scheduling\CancelLichHenRequest;
use App\Requests\Scheduling\CheckInLichHenRequest;
use App\Requests\Scheduling\CreateLichHenRequest;
use App\Requests\Scheduling\DoiLichHenRequest;
use App\Resources\ApiResponse;
use App\Resources\Scheduling\LichHenResource;
use App\Resources\Scheduling\LyDoHuyResource;
use App\Services\SchedulingService;
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

            return ApiResponse::success(
                new LichHenResource($lichHen),
                'Đặt lịch hẹn thành công.',
                201,
            );
        } catch (ValidationException $exception) {
            return ApiResponse::error(
                'Dữ liệu đặt lịch không hợp lệ.',
                [
                    'errors' => $exception->errors(),
                ],
                422,
            );
        } catch (\Throwable $throwable) {
            return ApiResponse::error($throwable->getMessage(), null, 500);
        }
    }

    public function index(Request $request): JsonResponse
    {
        try {
            $filters = $request->all();
            $isPatientScoped = !empty($filters['benh_nhan_id']);

            $paginator = $isPatientScoped
                ? $this->schedulingService->getLichHensByBenhNhan($filters)
                : $this->schedulingService->getLichHensForReceptionist($filters);

            return ApiResponse::paginated(
                $paginator,
                LichHenResource::class,
                $isPatientScoped
                ? 'Lấy danh sách lịch hẹn thành công.'
                : 'Lấy danh sách lịch hẹn lễ tân thành công.',
            );
        } catch (ValidationException $exception) {
            return ApiResponse::error(
                'Không thể lấy danh sách lịch hẹn.',
                [
                    'errors' => $exception->errors(),
                ],
                422,
            );
        } catch (\Throwable $throwable) {
            return ApiResponse::error('Không thể lấy danh sách lịch hẹn. Vui lòng thử lại.', null, 500);
        }
    }

    public function lyDoHuysBenhNhan(): JsonResponse
    {
        try {
            $reasons = $this->schedulingService->getLyDoHuyBenhNhan();

            return ApiResponse::success([
                'items' => LyDoHuyResource::collection($reasons),
            ], 'Lấy danh sách lý do hủy thành công.');
        } catch (\Throwable $throwable) {
            return ApiResponse::error('Không thể lấy danh sách lý do hủy.', null, 500);
        }
    }

    public function show(int $id): JsonResponse
    {
        try {
            $lichHen = $this->schedulingService->getLichHenById($id);

            return ApiResponse::success(new LichHenResource($lichHen), 'Lấy chi tiết lịch hẹn thành công.');
        } catch (ValidationException $exception) {
            return ApiResponse::error(
                'Không tìm thấy lịch hẹn.',
                [
                    'errors' => $exception->errors(),
                ],
                404,
            );
        } catch (\Throwable $throwable) {
            return ApiResponse::error('Không thể lấy chi tiết lịch hẹn.', null, 500);
        }
    }

    public function huy(int $id, CancelLichHenRequest $request): JsonResponse
    {
        try {
            $lichHen = $this->schedulingService->cancelLichHen($id, $request->validated());

            return ApiResponse::success(new LichHenResource($lichHen), 'Hủy lịch hẹn thành công.');
        } catch (ValidationException $exception) {
            return ApiResponse::error(
                'Không thể hủy lịch hẹn.',
                [
                    'errors' => $exception->errors(),
                ],
                422,
            );
        } catch (\Throwable $throwable) {
            return ApiResponse::error('Không thể hủy lịch hẹn. Vui lòng thử lại.', null, 500);
        }
    }

    public function doiLich(int $id, DoiLichHenRequest $request): JsonResponse
    {
        try {
            $lichHen = $this->schedulingService->doiLichHen($id, $request->validated());

            return ApiResponse::success(new LichHenResource($lichHen), 'Đổi lịch hẹn thành công.');
        } catch (ValidationException $exception) {
            return ApiResponse::error(
                'Không thể đổi lịch hẹn.',
                [
                    'errors' => $exception->errors(),
                ],
                422,
            );
        } catch (\Throwable $throwable) {
            return ApiResponse::error('Không thể đổi lịch hẹn. Vui lòng thử lại.', null, 500);
        }
    }

    public function checkIn(int $id, CheckInLichHenRequest $request): JsonResponse
    {
        try {
            $lichHen = $this->schedulingService->checkInLichHen($id, $request->validated());

            return ApiResponse::success(new LichHenResource($lichHen), 'Check-in bệnh nhân thành công.');
        } catch (ValidationException $exception) {
            return ApiResponse::error(
                'Không thể check-in lịch hẹn.',
                [
                    'errors' => $exception->errors(),
                ],
                422,
            );
        } catch (\Throwable $throwable) {
            return ApiResponse::error('Không thể check-in lịch hẹn. Vui lòng thử lại.', null, 500);
        }
    }
}
