<?php

namespace App\Http\Controllers\Api\V1\Patients;

use App\Http\Controllers\Controller;
use App\Resources\Patients\LichSuPhieuKhamResource;
use App\Services\PatientService;
use Illuminate\Http\Request;

class LichSuPhieuKhamController extends Controller
{
    public function __construct(private PatientService $patientService) {}

    public function index(Request $request, int $benhNhanId)
    {
        $filters = $request->only(['tu_ngay', 'den_ngay', 'per_page', 'bac_si_id', 'trang_thai']);

        $paginator = $this->patientService->getLichSuPhieuKham($benhNhanId, $filters);

        return response()->json([
            'success' => true,
            'data'    => $paginator->getCollection()
                ->map(fn ($item) => (new LichSuPhieuKhamResource($item))->toArray($request))
                ->values(),
            'meta'    => [
                'current_page' => $paginator->currentPage(),
                'per_page'     => $paginator->perPage(),
                'total'        => $paginator->total(),
                'last_page'    => $paginator->lastPage(),
            ],
        ]);
    }
}
