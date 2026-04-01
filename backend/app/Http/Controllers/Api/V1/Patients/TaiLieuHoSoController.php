<?php

namespace App\Http\Controllers\Api\V1\Patients;

use App\Http\Controllers\Controller;
use App\Requests\Cloudinary\UploadMedicalDocumentRequest;
use App\Requests\Patients\CreateTaiLieuHoSoRequest;
use App\Requests\Patients\ListTaiLieuHoSoRequest;
use App\Requests\Patients\UpdateTaiLieuHoSoRequest;
use App\Resources\Patients\TaiLieuHoSoResource;
use App\Services\PatientService;
use Illuminate\Http\JsonResponse;
use InvalidArgumentException;

class TaiLieuHoSoController extends Controller
{
    public function __construct(private PatientService $patientService) {}

    public function index(ListTaiLieuHoSoRequest $request, int $benhNhanId): JsonResponse
    {
        $filters = $request->validated();

        $paginator = $this->patientService->getTaiLieuHoSoByBenhNhan($benhNhanId, $filters);
        $items = collect($paginator->items());

        return response()->json([
            'success' => true,
            'data' => $items
                ->map(fn ($item) => (new TaiLieuHoSoResource($item))->toArray($request))
                ->values(),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
                'last_page' => $paginator->lastPage(),
            ],
        ]);
    }

    public function store(CreateTaiLieuHoSoRequest $request, int $benhNhanId): JsonResponse
    {
        $item = $this->patientService->createTaiLieuHoSo($benhNhanId, $request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Đã tạo hồ sơ tài liệu thành công.',
            'data' => (new TaiLieuHoSoResource($item))->toArray($request),
        ], 201);
    }

    public function update(UpdateTaiLieuHoSoRequest $request, int $benhNhanId, int $taiLieuId): JsonResponse
    {
        $item = $this->patientService->updateTaiLieuHoSo($benhNhanId, $taiLieuId, $request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Đã cập nhật hồ sơ tài liệu thành công.',
            'data' => (new TaiLieuHoSoResource($item))->toArray($request),
        ]);
    }

    public function upload(UploadMedicalDocumentRequest $request, int $benhNhanId, int $taiLieuId): JsonResponse
    {
        $item = $this->patientService->uploadTaiLieuHoSoFile($benhNhanId, $taiLieuId, $request->file('tai_lieu'));

        return response()->json([
            'success' => true,
            'message' => 'Đã tải lên tài liệu thành công.',
            'data' => [
                'id' => $item->id,
                'file_public_id' => $item->file_public_id,
            ],
        ]);
    }

    public function signedUrl(int $benhNhanId, int $taiLieuId): JsonResponse
    {
        try {
            $url = $this->patientService->getTaiLieuSignedUrl($benhNhanId, $taiLieuId);
        } catch (InvalidArgumentException $exception) {
            return response()->json([
                'success' => false,
                'message' => $exception->getMessage(),
            ], 422);
        }

        return response()->json([
            'success' => true,
            'data' => ['url' => $url],
        ]);
    }

    public function destroy(int $benhNhanId, int $taiLieuId): JsonResponse
    {
        $this->patientService->deleteTaiLieuHoSo($benhNhanId, $taiLieuId);

        return response()->json([
            'success' => true,
            'message' => 'Đã xóa hồ sơ tài liệu thành công.',
        ]);
    }
}
