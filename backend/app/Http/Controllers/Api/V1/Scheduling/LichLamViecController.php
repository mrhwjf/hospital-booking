<?php

namespace App\Http\Controllers\Api\V1\Scheduling;

use App\Http\Controllers\Controller;
use App\Requests\Scheduling\CreateBenhNhanRequest;
use App\Resources\ApiResponse;
use App\Resources\Scheduling\BacSiResource;
use App\Resources\Scheduling\BenhNhanResource;
use App\Resources\Scheduling\CauHinhHeThongResource;
use App\Resources\Scheduling\ChuyenKhoaResource;
use App\Resources\Scheduling\DichVuResource;
use App\Resources\Scheduling\GoiKhamResource;
use App\Resources\Scheduling\LichLamViecBacSiOverviewResource;
use App\Services\SchedulingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class LichLamViecController extends Controller
{
    public function __construct(private readonly SchedulingService $schedulingService)
    {
    }

    public function chuyenKhoas(Request $request): JsonResponse
    {
        $paginator = $this->schedulingService->getChuyenKhoas($request->all());

        return ApiResponse::paginated($paginator, ChuyenKhoaResource::class, 'Lấy danh sách chuyên khoa thành công.');
    }

    public function bacSiTheoChuyenKhoa(int $id, Request $request): JsonResponse
    {
        try {
            $paginator = $this->schedulingService->getBacSisByChuyenKhoa($id, $request->all());

            return ApiResponse::paginated($paginator, BacSiResource::class, 'Lấy danh sách bác sĩ theo chuyên khoa thành công.');
        } catch (ValidationException $exception) {
            return ApiResponse::error(
                'Chuyên khoa không tồn tại.',
                [
                    'errors' => $exception->errors(),
                ],
                404,
            );
        }
    }

    public function lichLamViecBacSi(int $id, Request $request): JsonResponse
    {
        try {
            $data = $this->schedulingService->getLichLamViecBacSi($id, $request->all());

            return ApiResponse::success(new LichLamViecBacSiOverviewResource($data), 'Lấy lịch làm việc bác sĩ thành công.');
        } catch (ValidationException $exception) {
            return ApiResponse::error(
                'Không thể lấy lịch làm việc bác sĩ.',
                [
                    'errors' => $exception->errors(),
                ],
                422,
            );
        }
    }

    public function dichVus(Request $request): JsonResponse
    {
        $paginator = $this->schedulingService->getDichVus($request->all());

        return ApiResponse::paginated($paginator, DichVuResource::class, 'Lấy danh sách dịch vụ thành công.');
    }

    public function goiKhams(Request $request): JsonResponse
    {
        $paginator = $this->schedulingService->getGoiKhams($request->all());

        return ApiResponse::paginated($paginator, GoiKhamResource::class, 'Lấy danh sách gói khám thành công.');
    }

    public function cauHinhHeThong(Request $request): JsonResponse
    {
        try {
            $data = $this->schedulingService->getCauHinhHeThong($request->all());

            return ApiResponse::success([
                'items' => CauHinhHeThongResource::collection($data['items'] ?? []),
                'map' => $data['map'] ?? [],
            ], 'Lấy cấu hình hệ thống thành công.');
        } catch (\Throwable $throwable) {
            return ApiResponse::error('Không thể lấy cấu hình hệ thống.', null, 500);
        }
    }

    public function benhNhans(Request $request): JsonResponse
    {
        try {
            $paginator = $this->schedulingService->getBenhNhans($request->all());

            return ApiResponse::paginated($paginator, BenhNhanResource::class, 'Lấy danh sách bệnh nhân thành công.');
        } catch (\Throwable $throwable) {
            return ApiResponse::error('Không thể lấy danh sách bệnh nhân.', null, 500);
        }
    }

    public function benhNhanShow(int $id): JsonResponse
    {
        try {
            $benhNhan = $this->schedulingService->getBenhNhanById($id);

            return ApiResponse::success(new BenhNhanResource($benhNhan), 'Lấy thông tin bệnh nhân thành công.');
        } catch (ValidationException $exception) {
            return ApiResponse::error(
                'Không tìm thấy bệnh nhân.',
                [
                    'errors' => $exception->errors(),
                ],
                404,
            );
        } catch (\Throwable $throwable) {
            return ApiResponse::error('Không thể lấy thông tin bệnh nhân.', null, 500);
        }
    }

    public function benhNhanStore(CreateBenhNhanRequest $request): JsonResponse
    {
        try {
            $benhNhan = $this->schedulingService->createBenhNhan($request->validated());

            return ApiResponse::success(new BenhNhanResource($benhNhan), 'Tạo bệnh nhân thành công.', 201);
        } catch (ValidationException $exception) {
            return ApiResponse::error(
                'Dữ liệu bệnh nhân không hợp lệ.',
                [
                    'errors' => $exception->errors(),
                ],
                422,
            );
        } catch (\Throwable $throwable) {
            Log::error('Tạo bệnh nhân thất bại trong benhNhanStore.', [
                'exception' => $throwable->getMessage(),
            ]);

            return ApiResponse::error('Không thể tạo bệnh nhân.', null, 500);
        }
    }
}
