<?php

namespace App\Http\Controllers\Api\V1\Patients;

use App\Http\Controllers\Controller;
use App\Models\BenhNhan;
use App\Resources\ApiResponse;
use App\Resources\Patients\LichSuPhieuKhamResource;
use App\Services\PatientService;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;

class LichSuPhieuKhamController extends Controller
{
    public function __construct(private PatientService $patientService)
    {
    }

    public function index(Request $request, int $benhNhanId)
    {
        try {
            $benhNhan = BenhNhan::query()->findOrFail($benhNhanId);
            $this->authorize('view', $benhNhan);

            $filters = $request->only(['tu_ngay', 'den_ngay', 'per_page', 'bac_si_id', 'trang_thai']);

            $paginator = $this->patientService->getLichSuPhieuKham($benhNhanId, $filters);

            return ApiResponse::paginated($paginator, LichSuPhieuKhamResource::class);
        } catch (AuthorizationException $exception) {
            return ApiResponse::error('Bạn không có quyền truy cập lịch sử phiếu khám này.', null, 403);
        } catch (ModelNotFoundException $exception) {
            return ApiResponse::error('Không tìm thấy bệnh nhân.', null, 404);
        }
    }
}
