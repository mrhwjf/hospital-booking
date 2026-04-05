<?php

namespace App\Http\Controllers\Api\V1\Patients;

use App\Http\Controllers\Controller;
use App\Models\BenhNhan;
use App\Requests\Cloudinary\UploadMedicalDocumentRequest;
use App\Requests\Patients\CreateTaiLieuHoSoRequest;
use App\Requests\Patients\ListTaiLieuHoSoRequest;
use App\Requests\Patients\UpdateTaiLieuHoSoRequest;
use App\Resources\ApiResponse;
use App\Resources\Patients\TaiLieuHoSoResource;
use App\Services\PatientService;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use InvalidArgumentException;

class TaiLieuHoSoController extends Controller
{
    public function __construct(private PatientService $patientService)
    {
    }

    public function index(ListTaiLieuHoSoRequest $request, int $benhNhanId): JsonResponse
    {
        try {
            $this->authorizePatientScope($benhNhanId);

            $filters = $request->validated();
            $paginator = $this->patientService->getTaiLieuHoSoByBenhNhan($benhNhanId, $filters);

            return ApiResponse::paginated($paginator, TaiLieuHoSoResource::class);
        } catch (AuthorizationException $exception) {
            return ApiResponse::error('Bạn không có quyền truy cập tài liệu hồ sơ của bệnh nhân này.', null, 403);
        } catch (ModelNotFoundException $exception) {
            return ApiResponse::error('Không tìm thấy bệnh nhân.', null, 404);
        }
    }

    public function store(CreateTaiLieuHoSoRequest $request, int $benhNhanId): JsonResponse
    {
        try {
            $this->authorizePatientScope($benhNhanId);
            $item = $this->patientService->createTaiLieuHoSo($benhNhanId, $request->validated());

            return ApiResponse::success(new TaiLieuHoSoResource($item), 'Đã tạo hồ sơ tài liệu thành công.', 201);
        } catch (AuthorizationException $exception) {
            return ApiResponse::error('Bạn không có quyền tạo tài liệu cho bệnh nhân này.', null, 403);
        } catch (ModelNotFoundException $exception) {
            return ApiResponse::error('Không tìm thấy bệnh nhân.', null, 404);
        }
    }

    public function update(UpdateTaiLieuHoSoRequest $request, int $benhNhanId, int $taiLieuId): JsonResponse
    {
        try {
            $this->authorizePatientScope($benhNhanId);
            $item = $this->patientService->updateTaiLieuHoSo($benhNhanId, $taiLieuId, $request->validated());

            return ApiResponse::success(new TaiLieuHoSoResource($item), 'Đã cập nhật hồ sơ tài liệu thành công.');
        } catch (AuthorizationException $exception) {
            return ApiResponse::error('Bạn không có quyền cập nhật tài liệu của bệnh nhân này.', null, 403);
        } catch (ModelNotFoundException $exception) {
            return ApiResponse::error('Không tìm thấy bệnh nhân hoặc tài liệu hồ sơ.', null, 404);
        }
    }

    public function upload(UploadMedicalDocumentRequest $request, int $benhNhanId, int $taiLieuId): JsonResponse
    {
        try {
            $this->authorizePatientScope($benhNhanId);
            $item = $this->patientService->uploadTaiLieuHoSoFile($benhNhanId, $taiLieuId, $request->file('tai_lieu'));

            return ApiResponse::success([
                'id' => $item->id,
                'file_public_id' => $item->file_public_id,
            ], 'Đã tải lên tài liệu thành công.');
        } catch (AuthorizationException $exception) {
            return ApiResponse::error('Bạn không có quyền tải lên tài liệu cho bệnh nhân này.', null, 403);
        } catch (ModelNotFoundException $exception) {
            return ApiResponse::error('Không tìm thấy bệnh nhân hoặc tài liệu hồ sơ.', null, 404);
        }
    }

    public function signedUrl(int $benhNhanId, int $taiLieuId): JsonResponse
    {
        try {
            $this->authorizePatientScope($benhNhanId);
            $url = $this->patientService->getTaiLieuSignedUrl($benhNhanId, $taiLieuId);
        } catch (AuthorizationException $exception) {
            return ApiResponse::error('Bạn không có quyền truy cập tài liệu của bệnh nhân này.', null, 403);
        } catch (ModelNotFoundException $exception) {
            return ApiResponse::error('Không tìm thấy bệnh nhân hoặc tài liệu hồ sơ.', null, 404);
        } catch (InvalidArgumentException $exception) {
            return ApiResponse::error($exception->getMessage(), null, 422);
        }

        return ApiResponse::success(['url' => $url]);
    }

    public function destroy(int $benhNhanId, int $taiLieuId): JsonResponse
    {
        try {
            $this->authorizePatientScope($benhNhanId);
            $this->patientService->deleteTaiLieuHoSo($benhNhanId, $taiLieuId);

            return ApiResponse::success(null, 'Đã xóa hồ sơ tài liệu thành công.');
        } catch (AuthorizationException $exception) {
            return ApiResponse::error('Bạn không có quyền xóa tài liệu của bệnh nhân này.', null, 403);
        } catch (ModelNotFoundException $exception) {
            return ApiResponse::error('Không tìm thấy bệnh nhân hoặc tài liệu hồ sơ.', null, 404);
        }
    }

    private function authorizePatientScope(int $benhNhanId): void
    {
        $benhNhan = BenhNhan::query()->findOrFail($benhNhanId);
        $this->authorize('view', $benhNhan);
    }
}
