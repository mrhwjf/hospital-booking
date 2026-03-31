<?php

namespace App\Http\Controllers\Api\V1\Admin\Schedule;

use App\Http\Controllers\Controller;
use App\Requests\Admin\Schedule\StoreHolidayRequest;
use App\Requests\Admin\Schedule\UpdateHolidayRequest;
use App\Resources\Admin\Schedule\HolidayResource;
use App\Resources\ApiResponse;
use App\Services\Admin\AdminScheduleService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class HolidayController extends Controller
{
	public function __construct(private readonly AdminScheduleService $adminScheduleService)
	{
	}

	public function index(Request $request): JsonResponse
	{
		try {
			$paginator = $this->adminScheduleService->getHolidays($request->all());

			return ApiResponse::paginated($paginator, HolidayResource::class, 'Lấy danh sách ngày nghỉ lễ thành công.');
		} catch (ValidationException $exception) {
			return ApiResponse::error('Không thể lấy danh sách ngày nghỉ lễ.', ['errors' => $exception->errors()], 422);
		} catch (\Throwable $throwable) {
			return ApiResponse::error('Không thể lấy danh sách ngày nghỉ lễ.', null, 500);
		}
	}

	public function store(StoreHolidayRequest $request): JsonResponse
	{
		try {
			$holiday = $this->adminScheduleService->createHoliday($request->validated());

			return ApiResponse::success(new HolidayResource($holiday), 'Tạo ngày nghỉ lễ thành công.', 201);
		} catch (ValidationException $exception) {
			return ApiResponse::error('Không thể tạo ngày nghỉ lễ.', ['errors' => $exception->errors()], 422);
		} catch (\Throwable $throwable) {
			return ApiResponse::error('Không thể tạo ngày nghỉ lễ.', null, 500);
		}
	}

	public function update(int $id, UpdateHolidayRequest $request): JsonResponse
	{
		try {
			$holiday = $this->adminScheduleService->updateHoliday($id, $request->validated());

			return ApiResponse::success(new HolidayResource($holiday), 'Cập nhật ngày nghỉ lễ thành công.');
		} catch (ValidationException $exception) {
			return ApiResponse::error('Không thể cập nhật ngày nghỉ lễ.', ['errors' => $exception->errors()], 422);
		} catch (\Throwable $throwable) {
			return ApiResponse::error('Không thể cập nhật ngày nghỉ lễ.', null, 500);
		}
	}

	public function softDelete(int $id): JsonResponse
	{
		try {
			$holiday = $this->adminScheduleService->softDeleteHoliday($id);

			return ApiResponse::success(new HolidayResource($holiday), 'Hủy ngày nghỉ lễ thành công.');
		} catch (ValidationException $exception) {
			return ApiResponse::error('Không thể hủy ngày nghỉ lễ.', ['errors' => $exception->errors()], 422);
		} catch (\Throwable $throwable) {
			return ApiResponse::error('Không thể hủy ngày nghỉ lễ.', null, 500);
		}
	}
}
