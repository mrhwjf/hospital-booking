<?php

namespace App\Http\Controllers\Api\V1\Patients;

use App\Http\Controllers\Controller;
use App\Requests\Patients\CurrentPatientRequest;
use App\Resources\ApiResponse;
use App\Resources\Patients\BenhNhanProfileResource;
use App\Services\Patients\VisitHistoryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

class BenhNhanController extends Controller
{
    public function __construct(private readonly VisitHistoryService $visitHistoryService)
    {
    }

    public function me(CurrentPatientRequest $request): JsonResponse
    {
        try {
            $benhNhan = $this->visitHistoryService->getCurrentPatient(
                (int) $request->validated('benh_nhan_id')
            );

            return ApiResponse::success(
                new BenhNhanProfileResource($benhNhan),
                'Lấy thông tin bệnh nhân thành công.'
            );
        } catch (ValidationException $exception) {
            return ApiResponse::error(
                'Không thể lấy thông tin bệnh nhân.',
                [
                    'errors' => $exception->errors(),
                ],
                422,
            );
        } catch (\Throwable $throwable) {
            return ApiResponse::error('Không thể lấy thông tin bệnh nhân.', null, 500);
        }
    }
}
