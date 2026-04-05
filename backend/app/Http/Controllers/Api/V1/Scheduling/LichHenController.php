<?php

namespace App\Http\Controllers\Api\V1\Scheduling;

use App\Http\Controllers\Controller;
use App\Models\LichHen;
use App\Requests\Scheduling\CancelLichHenRequest;
use App\Requests\Scheduling\CheckInLichHenRequest;
use App\Requests\Scheduling\CreateLichHenRequest;
use App\Requests\Scheduling\DoiLichHenRequest;
use App\Resources\ApiResponse;
use App\Resources\Scheduling\LichHenResource;
use App\Resources\Scheduling\LyDoHuyResource;
use App\Services\SchedulingService;
use Illuminate\Auth\Access\AuthorizationException;
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
            $payload = $request->validated();
            $this->authorize('create', LichHen::class);

            if ($this->isPatientActor($request)) {
                $patientId = $this->resolveAuthenticatedPatientId($request);
                if ($patientId === null) {
                    return ApiResponse::error('Bạn không có hồ sơ bệnh nhân hợp lệ.', null, 403);
                }

                if (!empty($payload['benh_nhan_id']) && (int) $payload['benh_nhan_id'] !== $patientId) {
                    return ApiResponse::error('Bạn không có quyền tạo lịch hẹn cho bệnh nhân khác.', null, 403);
                }

                $payload['benh_nhan_id'] = $patientId;
            }

            $lichHen = $this->schedulingService->createLichHen($payload);

            return ApiResponse::success(
                new LichHenResource($lichHen),
                'Đặt lịch hẹn thành công.',
                201,
            );
        } catch (AuthorizationException $exception) {
            return ApiResponse::error('Bạn không có quyền tạo lịch hẹn cho bệnh nhân này.', null, 403);
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
            $this->authorize('viewAny', LichHen::class);

            if ($this->isPatientActor($request)) {
                $patientId = $this->resolveAuthenticatedPatientId($request);
                if ($patientId === null) {
                    return ApiResponse::error('Bạn không có hồ sơ bệnh nhân hợp lệ.', null, 403);
                }

                if (!empty($filters['benh_nhan_id']) && (int) $filters['benh_nhan_id'] !== $patientId) {
                    return ApiResponse::error('Bạn không có quyền xem lịch hẹn của bệnh nhân khác.', null, 403);
                }

                $filters['benh_nhan_id'] = $patientId;
            }

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
        } catch (AuthorizationException $exception) {
            return ApiResponse::error('Bạn không có quyền truy cập danh sách lịch hẹn này.', null, 403);
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
            $this->authorizePatientAppointment($id, 'view');

            $lichHen = $this->schedulingService->getLichHenById($id);

            return ApiResponse::success(new LichHenResource($lichHen), 'Lấy chi tiết lịch hẹn thành công.');
        } catch (AuthorizationException $exception) {
            return ApiResponse::error('Bạn không có quyền truy cập lịch hẹn này.', null, 403);
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
            $this->authorizePatientAppointment($id, 'update');

            $lichHen = $this->schedulingService->cancelLichHen($id, $request->validated());

            return ApiResponse::success(new LichHenResource($lichHen), 'Hủy lịch hẹn thành công.');
        } catch (AuthorizationException $exception) {
            return ApiResponse::error('Bạn không có quyền hủy lịch hẹn này.', null, 403);
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
            $this->authorizePatientAppointment($id, 'update');

            $lichHen = $this->schedulingService->doiLichHen($id, $request->validated());

            return ApiResponse::success(new LichHenResource($lichHen), 'Đổi lịch hẹn thành công.');
        } catch (AuthorizationException $exception) {
            return ApiResponse::error('Bạn không có quyền đổi lịch hẹn này.', null, 403);
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
            $this->authorizePatientAppointment($id, 'update');

            $lichHen = $this->schedulingService->checkInLichHen($id, $request->validated());

            return ApiResponse::success(new LichHenResource($lichHen), 'Check-in bệnh nhân thành công.');
        } catch (AuthorizationException $exception) {
            return ApiResponse::error('Bạn không có quyền check-in lịch hẹn này.', null, 403);
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

    private function isPatientActor(Request $request): bool
    {
        $role = strtoupper((string) $request->user()?->vaiTro?->ma_vai_tro);

        return $role === 'BENHNHAN';
    }

    private function resolveAuthenticatedPatientId(Request $request): ?int
    {
        $patientId = $request->user()?->benhNhan?->id;

        if (empty($patientId)) {
            return null;
        }

        return (int) $patientId;
    }

    private function authorizePatientAppointment(int $lichHenId, string $ability): void
    {
        $lichHen = LichHen::query()->find($lichHenId);

        if ($lichHen === null) {
            throw ValidationException::withMessages([
                'id' => ['Lịch hẹn không tồn tại.'],
            ]);
        }

        $this->authorize($ability, $lichHen);
    }
}
