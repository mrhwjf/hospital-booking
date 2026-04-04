<?php

namespace App\Http\Controllers\Api\V1\Patients;

use App\Http\Controllers\Controller;
use App\Resources\ApiResponse;
use App\Resources\Patients\LichSuPhieuKhamResource;
use App\Services\PatientService;
use Illuminate\Http\Request;

class LichSuPhieuKhamController extends Controller
{
    public function __construct(private PatientService $patientService)
    {
    }

    public function index(Request $request, int $benhNhanId)
    {
        $filters = $request->only(['tu_ngay', 'den_ngay', 'per_page', 'bac_si_id', 'trang_thai']);

        $paginator = $this->patientService->getLichSuPhieuKham($benhNhanId, $filters);

        return ApiResponse::paginated($paginator, LichSuPhieuKhamResource::class);
    }
}
