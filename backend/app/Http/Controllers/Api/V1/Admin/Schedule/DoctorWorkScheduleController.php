<?php

namespace App\Http\Controllers\Api\V1\Admin\Schedule;

use App\Http\Controllers\Controller;
use App\Requests\Admin\Schedule\AssignmentRequest;
use App\Requests\Admin\Schedule\StoreTemplateRequest;
use App\Requests\Admin\Schedule\UpdateAssignedShiftRequest;
use App\Requests\Admin\Schedule\UpdateTemplateRequest;
use App\Resources\Admin\Schedule\AssignedScheduleResource;
use App\Resources\Admin\Schedule\DoctorLeaveResource;
use App\Resources\Admin\Schedule\HolidayResource;
use App\Resources\Admin\Schedule\WorkTemplateResource;
use App\Resources\ApiResponse;
use App\Services\Admin\AdminScheduleService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class DoctorWorkScheduleController extends Controller
{
	public function __construct(private readonly AdminScheduleService $adminScheduleService)
	{
	}

	public function doctorSchedule(int $id, Request $request): JsonResponse
	{
		try {
			$overview = $this->adminScheduleService->getDoctorScheduleOverview($id, $request->all());

			return ApiResponse::success([
				'bac_si' => $overview['bac_si'],
				'tu_ngay' => $overview['tu_ngay'],
				'den_ngay' => $overview['den_ngay'],
				'items' => AssignedScheduleResource::collection($overview['items'])->resolve($request),
				'ngay_nghi_bac_si' => DoctorLeaveResource::collection($overview['ngay_nghi_bac_si'])->resolve($request),
				'ngay_nghi_le' => HolidayResource::collection($overview['ngay_nghi_le'])->resolve($request),
			], 'Lấy tổng quan lịch làm việc bác sĩ thành công.');
		} catch (ValidationException $exception) {
			return ApiResponse::error('Không thể lấy tổng quan lịch làm việc bác sĩ.', ['errors' => $exception->errors()], 422);
		} catch (\Throwable $throwable) {
			return ApiResponse::error('Không thể lấy tổng quan lịch làm việc bác sĩ.', null, 500);
		}
	}

	public function assignedSchedules(Request $request): JsonResponse
	{
		try {
			$paginator = $this->adminScheduleService->getAssignedSchedules($request->all());

			return ApiResponse::paginated($paginator, AssignedScheduleResource::class, 'Lấy danh sách phân công ca thành công.');
		} catch (ValidationException $exception) {
			return ApiResponse::error('Không thể lấy danh sách phân công ca.', ['errors' => $exception->errors()], 422);
		} catch (\Throwable $throwable) {
			return ApiResponse::error('Không thể lấy danh sách phân công ca.', null, 500);
		}
	}

	public function storeTemplate(StoreTemplateRequest $request): JsonResponse
	{
		try {
			$template = $this->adminScheduleService->createTemplate($request->validated());

			return ApiResponse::success(new WorkTemplateResource($template), 'Tạo mẫu ca làm việc thành công.', 201);
		} catch (ValidationException $exception) {
			return ApiResponse::error('Không thể tạo mẫu ca làm việc.', ['errors' => $exception->errors()], 422);
		} catch (\Throwable $throwable) {
			return ApiResponse::error('Không thể tạo mẫu ca làm việc.', null, 500);
		}
	}

	public function updateTemplate(int $id, UpdateTemplateRequest $request): JsonResponse
	{
		try {
			$template = $this->adminScheduleService->updateTemplate($id, $request->validated());

			return ApiResponse::success(new WorkTemplateResource($template), 'Cập nhật mẫu ca làm việc thành công.');
		} catch (ValidationException $exception) {
			return ApiResponse::error('Không thể cập nhật mẫu ca làm việc.', ['errors' => $exception->errors()], 422);
		} catch (\Throwable $throwable) {
			return ApiResponse::error('Không thể cập nhật mẫu ca làm việc.', null, 500);
		}
	}

	public function softDeleteTemplate(int $id): JsonResponse
	{
		try {
			$template = $this->adminScheduleService->softDeleteTemplate($id);

			return ApiResponse::success(new WorkTemplateResource($template), 'Hủy mẫu ca làm việc thành công.');
		} catch (ValidationException $exception) {
			return ApiResponse::error('Không thể hủy mẫu ca làm việc.', ['errors' => $exception->errors()], 422);
		} catch (\Throwable $throwable) {
			return ApiResponse::error('Không thể hủy mẫu ca làm việc.', null, 500);
		}
	}

	public function previewAssignment(AssignmentRequest $request): JsonResponse
	{
		try {
			$result = $this->adminScheduleService->previewAssignments($request->validated());

			return ApiResponse::success($result, 'Xem trước phân công ca thành công.');
		} catch (ValidationException $exception) {
			return ApiResponse::error('Không thể xem trước phân công ca.', ['errors' => $exception->errors()], 422);
		} catch (\Throwable $throwable) {
			return ApiResponse::error('Không thể xem trước phân công ca.', null, 500);
		}
	}

	public function storeAssignment(AssignmentRequest $request): JsonResponse
	{
		try {
			$result = $this->adminScheduleService->createAssignments($request->validated());

			if (!$result['saved']) {
				return ApiResponse::error('Không thể lưu phân công ca vì còn xung đột chặn.', $result, 422);
			}

			$result['created_items'] = AssignedScheduleResource::collection($result['created_items'])->resolve($request);

			return ApiResponse::success($result, 'Phân công ca làm việc thành công.', 201);
		} catch (ValidationException $exception) {
			return ApiResponse::error('Không thể lưu phân công ca.', ['errors' => $exception->errors()], 422);
		} catch (\Throwable $throwable) {
			return ApiResponse::error('Không thể lưu phân công ca.', null, 500);
		}
	}

	public function updateAssignment(int $id, UpdateAssignedShiftRequest $request): JsonResponse
	{
		try {
			$assignment = $this->adminScheduleService->updateAssignment($id, $request->validated());

			return ApiResponse::success(new AssignedScheduleResource($assignment), 'Cập nhật ca làm việc đã phân công thành công.');
		} catch (ValidationException $exception) {
			return ApiResponse::error('Không thể cập nhật ca làm việc đã phân công.', ['errors' => $exception->errors()], 422);
		} catch (\Throwable $throwable) {
			return ApiResponse::error('Không thể cập nhật ca làm việc đã phân công.', null, 500);
		}
	}

	public function softDeleteAssignment(int $id): JsonResponse
	{
		try {
			$assignment = $this->adminScheduleService->softDeleteAssignment($id);

			return ApiResponse::success(new AssignedScheduleResource($assignment), 'Hủy ca làm việc đã phân công thành công.');
		} catch (ValidationException $exception) {
			return ApiResponse::error('Không thể hủy ca làm việc đã phân công.', ['errors' => $exception->errors()], 422);
		} catch (\Throwable $throwable) {
			return ApiResponse::error('Không thể hủy ca làm việc đã phân công.', null, 500);
		}
	}
}
