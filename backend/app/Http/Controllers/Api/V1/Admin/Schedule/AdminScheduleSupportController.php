<?php

namespace App\Http\Controllers\Api\V1\Admin\Schedule;

use App\Http\Controllers\Controller;
use App\Resources\Admin\Schedule\DoctorResource;
use App\Resources\Admin\Schedule\RoomResource;
use App\Resources\Admin\Schedule\WorkTemplateResource;
use App\Resources\ApiResponse;
use App\Services\Admin\AdminScheduleService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminScheduleSupportController extends Controller
{
	public function __construct(private readonly AdminScheduleService $adminScheduleService)
	{
	}

	public function bacSi(Request $request): JsonResponse
	{
		try {
			$paginator = $this->adminScheduleService->getDoctors($request->all());

			return ApiResponse::paginated($paginator, DoctorResource::class, 'Lấy danh sách bác sĩ thành công.');
		} catch (\Throwable $throwable) {
			return ApiResponse::error('Không thể lấy danh sách bác sĩ.', null, 500);
		}
	}

	public function phongKham(Request $request): JsonResponse
	{
		try {
			$paginator = $this->adminScheduleService->getRooms($request->all());

			return ApiResponse::paginated($paginator, RoomResource::class, 'Lấy danh sách phòng khám thành công.');
		} catch (\Throwable $throwable) {
			return ApiResponse::error('Không thể lấy danh sách phòng khám.', null, 500);
		}
	}

	public function lichLamViec(Request $request): JsonResponse
	{
		try {
			$paginator = $this->adminScheduleService->getTemplates($request->all());

			return ApiResponse::paginated($paginator, WorkTemplateResource::class, 'Lấy danh sách mẫu ca thành công.');
		} catch (\Throwable $throwable) {
			return ApiResponse::error('Không thể lấy danh sách mẫu ca.', null, 500);
		}
	}
}
