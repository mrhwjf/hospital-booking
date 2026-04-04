<?php

namespace App\Http\Controllers\Api\V1\Patients;

use App\Http\Controllers\Controller;
use App\Requests\Cloudinary\UploadMedicalDocumentRequest;
use App\Requests\Patients\CreateTaiLieuHoSoRequest;
use App\Requests\Patients\ListTaiLieuHoSoRequest;
use App\Requests\Patients\UpdateTaiLieuHoSoRequest;
use App\Resources\ApiResponse;
use App\Resources\Patients\TaiLieuHoSoResource;
use App\Services\PatientService;
use Illuminate\Http\JsonResponse;
use InvalidArgumentException;

class TaiLieuHoSoController extends Controller
{
    public function __construct(private PatientService $patientService)
    {
    }

    public function index(ListTaiLieuHoSoRequest $request, int $benhNhanId): JsonResponse
    {
        $filters = $request->validated();

        $paginator = $this->patientService->getTaiLieuHoSoByBenhNhan($benhNhanId, $filters);

        return ApiResponse::paginated($paginator, TaiLieuHoSoResource::class);
    }

    public function store(CreateTaiLieuHoSoRequest $request, int $benhNhanId): JsonResponse
    {
        $item = $this->patientService->createTaiLieuHoSo($benhNhanId, $request->validated());

        return ApiResponse::success(new TaiLieuHoSoResource($item), 'Đã tạo hồ sơ tài liệu thành công.', 201);
    }

    public function update(UpdateTaiLieuHoSoRequest $request, int $benhNhanId, int $taiLieuId): JsonResponse
    {
        $item = $this->patientService->updateTaiLieuHoSo($benhNhanId, $taiLieuId, $request->validated());

        return ApiResponse::success(new TaiLieuHoSoResource($item), 'Đã cập nhật hồ sơ tài liệu thành công.');
    }

    public function upload(UploadMedicalDocumentRequest $request, int $benhNhanId, int $taiLieuId): JsonResponse
    {
        $item = $this->patientService->uploadTaiLieuHoSoFile($benhNhanId, $taiLieuId, $request->file('tai_lieu'));

        return ApiResponse::success([
            'id' => $item->id,
            'file_public_id' => $item->file_public_id,
        ], 'Đã tải lên tài liệu thành công.');
    }

    public function signedUrl(int $benhNhanId, int $taiLieuId): JsonResponse
    {
        try {
            $url = $this->patientService->getTaiLieuSignedUrl($benhNhanId, $taiLieuId);
        } catch (InvalidArgumentException $exception) {
            return ApiResponse::error($exception->getMessage(), null, 422);
        }

        return ApiResponse::success(['url' => $url]);
    }

    public function destroy(int $benhNhanId, int $taiLieuId): JsonResponse
    {
        $this->patientService->deleteTaiLieuHoSo($benhNhanId, $taiLieuId);

        return ApiResponse::success(null, 'Đã xóa hồ sơ tài liệu thành công.');
    }
}
