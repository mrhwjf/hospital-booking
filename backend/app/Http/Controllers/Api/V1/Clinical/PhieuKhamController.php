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
use Illuminate\Validation\ValidationException;

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
            ->orderByRaw("FIELD(trang_thai, 'dang_kham', 'tiep_nhan', 'hoan_thanh')")
            ->orderBy('thoi_gian_tiep_nhan', 'asc')
            ->get();

        return ApiResponse::success(PhieuKhamResource::collection($phieuKhams), 'Danh sách phiếu khám');
    }

    public function complete(Request $request, int $id)
    {
        $phieuKham = $this->clinicalService->getPhieuKham($id);
        $this->authorize('update', $phieuKham);

        if ($phieuKham->trang_thai === 'hoan_thanh') {
            return ApiResponse::success(new PhieuKhamResource($phieuKham), 'Phiếu khám đã ở trạng thái hoàn thành.');
        }

        if ($phieuKham->trang_thai !== 'dang_kham') {
            throw ValidationException::withMessages([
                'trang_thai' => ['Chỉ có thể hoàn tất khi phiếu khám đang ở trạng thái đang khám.'],
            ]);
        }

        $completed = $this->clinicalService->completePhieuKham($phieuKham);

        return ApiResponse::success(new PhieuKhamResource($completed), 'Hoàn tất khám thành công.');
    }

    public function start(Request $request, int $id)
    {
        $phieuKham = $this->clinicalService->getPhieuKham($id);
        $this->authorize('update', $phieuKham);

        if ($phieuKham->trang_thai === 'hoan_thanh') {
            throw ValidationException::withMessages([
                'trang_thai' => ['Không thể bắt đầu khám lại khi phiếu đã hoàn thành.'],
            ]);
        }

        if ($phieuKham->trang_thai === 'dang_kham') {
            return ApiResponse::success(new PhieuKhamResource($phieuKham), 'Phiếu khám đang ở trạng thái đang khám.');
        }

        $started = $this->clinicalService->startPhieuKham($phieuKham);

        return ApiResponse::success(new PhieuKhamResource($started), 'Đã chuyển phiếu khám sang trạng thái đang khám.');
    }

    public function icd10List(Request $request)
    {
        $query = trim((string) $request->query('q', ''));
        $limit = (int) $request->query('limit', 30);

        $items = $this->clinicalService->searchIcd10($query, $limit)
            ->map(fn($row) => [
                'ma_icd10' => $row->ma_icd10,
                'ten_chan_doan' => $row->ten_chan_doan,
                'nhom_chuong' => $row->nhom_chuong,
                'label' => trim(($row->nhom_chuong ? $row->nhom_chuong . ' - ' : '') . $row->ma_icd10 . ' - ' . $row->ten_chan_doan),
            ])
            ->values();

        return ApiResponse::success($items);
    }
}


