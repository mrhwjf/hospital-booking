<?php

namespace App\Http\Controllers\Api\V1\Admin\Schedule;

use App\Http\Controllers\Controller;
use App\Requests\Admin\Schedule\StoreDoctorLeaveRequest;
use App\Requests\Admin\Schedule\UpdateDoctorLeaveRequest;
use App\Resources\Admin\Schedule\DoctorLeaveResource;
use App\Resources\ApiResponse;
use App\Services\Admin\AdminScheduleService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class DoctorLeaveController extends Controller
{
	public function __construct(private readonly AdminScheduleService $adminScheduleService)
	{
	}

	public function index(Request $request): JsonResponse
	{
		try {
			$paginator = $this->adminScheduleService->getDoctorLeaves($request->all());

			return ApiResponse::paginated($paginator, DoctorLeaveResource::class, 'Lấy danh sách lịch nghỉ bác sĩ thành công.');
		} catch (ValidationException $exception) {
			return ApiResponse::error('Không thể lấy danh sách lịch nghỉ bác sĩ.', ['errors' => $exception->errors()], 422);
		} catch (\Throwable $throwable) {
			return ApiResponse::error('Không thể lấy danh sách lịch nghỉ bác sĩ.', null, 500);
		}
	}

	public function store(StoreDoctorLeaveRequest $request): JsonResponse
	{
		try {
			$leave = $this->adminScheduleService->createDoctorLeave($request->validated());

			return ApiResponse::success(new DoctorLeaveResource($leave), 'Tạo lịch nghỉ bác sĩ thành công.', 201);
		} catch (ValidationException $exception) {
			return ApiResponse::error('Không thể tạo lịch nghỉ bác sĩ.', ['errors' => $exception->errors()], 422);
		} catch (\Throwable $throwable) {
			return ApiResponse::error('Không thể tạo lịch nghỉ bác sĩ.', null, 500);
		}
	}

	public function update(int $id, UpdateDoctorLeaveRequest $request): JsonResponse
	{
		try {
			$leave = $this->adminScheduleService->updateDoctorLeave($id, $request->validated());

			return ApiResponse::success(new DoctorLeaveResource($leave), 'Cập nhật lịch nghỉ bác sĩ thành công.');
		} catch (ValidationException $exception) {
			return ApiResponse::error('Không thể cập nhật lịch nghỉ bác sĩ.', ['errors' => $exception->errors()], 422);
		} catch (\Throwable $throwable) {
			return ApiResponse::error('Không thể cập nhật lịch nghỉ bác sĩ.', null, 500);
		}
	}

	public function softDelete(int $id): JsonResponse
	{
		try {
			$leave = $this->adminScheduleService->softDeleteDoctorLeave($id);

			return ApiResponse::success(new DoctorLeaveResource($leave), 'Hủy lịch nghỉ bác sĩ thành công.');
		} catch (ValidationException $exception) {
			return ApiResponse::error('Không thể hủy lịch nghỉ bác sĩ.', ['errors' => $exception->errors()], 422);
		} catch (\Throwable $throwable) {
			return ApiResponse::error('Không thể hủy lịch nghỉ bác sĩ.', null, 500);
		}
	}
}
