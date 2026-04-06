<?php

namespace App\Http\Controllers\Api\V1\Clinical;

use App\Http\Controllers\Controller;
use App\Requests\Clinical\UpdatePhieuKhamRequest;
use App\Resources\ApiResponse;
use App\Resources\Clinical\PhieuKhamResource;
use App\Services\ClinicalService;
use App\Models\PhieuKham;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class PhieuKhamController extends Controller
{
    public function __construct(private ClinicalService $clinicalService)
    {
    }

    public function show(int $id)
    {
        $phieuKham = $this->clinicalService->getPhieuKham($id);
        $this->authorize('view', $phieuKham);

        return ApiResponse::success(new PhieuKhamResource($phieuKham));
    }

    public function update(UpdatePhieuKhamRequest $request, int $id)
    {
        $phieuKham = $this->clinicalService->getPhieuKham($id);
        $this->authorize('update', $phieuKham);
        $phieuKham = $this->clinicalService->updatePhieuKham($phieuKham, $request->validated());

        return ApiResponse::success(new PhieuKhamResource($phieuKham), 'Cập nhật phiếu khám thành công');
    }

    public function indexByDoctor(Request $request)
    {
        $this->authorize('viewAny', PhieuKham::class);

        $authDoctorId = auth()->user()?->bacSi?->id;

        if (!$authDoctorId) {
            return ApiResponse::error(
                'Không xác định được bác sĩ hiện tại.',
                ['code' => 'UNAUTHORIZED'],
                Response::HTTP_UNAUTHORIZED
            );
        }

        $doctorIdFromQuery = $request->filled('bac_si_id') ? (int) $request->get('bac_si_id') : null;

        if ($doctorIdFromQuery !== null && $doctorIdFromQuery !== (int) $authDoctorId) {
            return ApiResponse::error(
                'Bạn không có quyền truy cập dữ liệu của bác sĩ khác.',
                ['code' => 'FORBIDDEN'],
                Response::HTTP_FORBIDDEN
            );
        }

        $doctorId = (int) $authDoctorId;

        $query = PhieuKham::query()
            ->where('bac_si_id', $doctorId)
            ->with(['benhNhan', 'bacSi']);

        if ($request->has('benh_nhan_id')) {
            $query->where('benh_nhan_id', (int) $request->get('benh_nhan_id'));
        }

        // Lọc theo trạng thái
        if ($request->has('trang_thai')) {
            $query->where('trang_thai', $request->get('trang_thai'));
        }

        // Lọc theo ngày
        if ($request->has('date')) {
            $query->whereDate('thoi_gian_tiep_nhan', $request->get('date'));
        }

        // Tìm kiếm theo tên bệnh nhân, mã bệnh nhân, hoặc mã phiếu khám
        if ($request->has('search')) {
            $search = '%' . $request->get('search') . '%';
            $query->where(function ($q) use ($search) {
                $q->whereHas('benhNhan', function ($subq) use ($search) {
                    $subq->where('ho_ten', 'like', $search)
                        ->orWhere('ma_benh_nhan', 'like', $search);
                })
                    ->orWhere('ma_phieu_kham', 'like', $search);
            });
        }

        $phieuKhams = $query
            ->orderByRaw("FIELD(trang_thai, 'cho_ke_don', 'dang_kham', 'tiep_nhan', 'hoan_thanh')")
            ->orderBy('thoi_gian_tiep_nhan', 'asc')
            ->get();

        return ApiResponse::success(PhieuKhamResource::collection($phieuKhams), 'Danh sách phiếu khám');
    }
}


