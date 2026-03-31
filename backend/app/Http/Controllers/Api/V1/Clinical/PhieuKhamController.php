<?php

namespace App\Http\Controllers\Api\V1\Clinical;

use App\Http\Controllers\Controller;
use App\Requests\Clinical\UpdatePhieuKhamRequest;
use App\Resources\Clinical\PhieuKhamResource;
use App\Services\ClinicalService;
use App\Models\PhieuKham;
use Illuminate\Http\Request;

class PhieuKhamController extends Controller
{
    public function __construct(private ClinicalService $clinicalService) {}

    public function show(int $id)
    {
        $phieuKham = $this->clinicalService->getPhieuKham($id);

        return response()->json([
            'success' => true,
            'data'    => new PhieuKhamResource($phieuKham),
        ]);
    }

    public function update(UpdatePhieuKhamRequest $request, int $id)
    {
        $phieuKham = $this->clinicalService->getPhieuKham($id);
        $phieuKham = $this->clinicalService->updatePhieuKham($phieuKham, $request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Cập nhật phiếu khám thành công',
            'data'    => new PhieuKhamResource($phieuKham),
        ]);
    }

    public function indexByDoctor(Request $request)
    {
        // Nếu có query parameter bac_si_id, sử dụng nó (dùng cho testing)
        // Nếu không, sử dụng bác sĩ từ user authenticated
        $doctor_id = $request->get('bac_si_id') ?? auth()->user()?->bacSi?->id;

        if (!$doctor_id) {
            return response()->json([
                'success' => false,
                'message' => 'Không xác định được bác sĩ hiện tại.',
                'error' => ['code' => 'UNAUTHORIZED'],
            ], 401);
        }

        $query = PhieuKham::query()
            ->where('bac_si_id', $doctor_id)
            ->with(['benhNhan', 'bacSi']);

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

        // Sắp xếp: Chờ kê đơn -> Đang khám -> Tiếp nhận -> Hoàn thành
        $trameThaiOrder = ['cho_ke_don' => 0, 'dang_kham' => 1, 'tiep_nhan' => 2, 'hoan_thanh' => 3];

        $phieuKhams = $query
            ->orderByRaw("FIELD(trang_thai, 'cho_ke_don', 'dang_kham', 'tiep_nhan', 'hoan_thanh')")
            ->orderBy('thoi_gian_tiep_nhan', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => PhieuKhamResource::collection($phieuKhams),
            'message' => 'Danh sách phiếu khám',
        ]);
    }
}


