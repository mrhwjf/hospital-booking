<?php

namespace App\Http\Controllers\Api\V1\Clinical;

use App\Http\Controllers\Controller;
use App\Models\PhieuKham;
use App\Resources\Clinical\PhieuKhamResource;
use Illuminate\Http\Request;

class PhieuKhamController extends Controller
{
    /**
     * Lấy danh sách phiếu khám theo bác sĩ hiện tại hoặc bác sĩ chỉ định
     * GET /api/v1/phieu-kham?bac_si_id=1
     */
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

    /**
     * Lấy chi tiết một phiếu khám
     * GET /api/v1/phieu-kham/{id}
     */
    public function show($id)
    {
        $phieuKham = PhieuKham::with(['benhNhan', 'bacSi', 'chiDinhs', 'taiLieuHoSos'])
            ->find($id);

        if (!$phieuKham) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy phiếu khám.',
                'error' => ['code' => 'NOT_FOUND'],
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => new PhieuKhamResource($phieuKham),
            'message' => 'Chi tiết phiếu khám',
        ]);
    }

    
    /**
     * Cập nhật phiếu khám
     * PUT /api/v1/phieu-kham/{id}
     */
    public function update(Request $request, $id)
    {
        $phieuKham = PhieuKham::find($id);

        if (!$phieuKham) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy phiếu khám.',
                'error' => ['code' => 'NOT_FOUND'],
            ], 404);
        }

        $payload = $request->validate([
            'mach' => ['nullable', 'integer', 'min:0'],
            'nhiet_do' => ['nullable', 'numeric', 'min:0'],
            'huyet_ap' => ['nullable', 'string'],
            'can_nang' => ['nullable', 'numeric', 'min:0'],
            'chieu_cao' => ['nullable', 'numeric', 'min:0'],
            'trieu_chung' => ['nullable', 'string'],
            'ket_qua_kham' => ['nullable', 'string'],
            'chan_doan' => ['nullable', 'string'],
            'ma_icd10_chinh' => ['nullable', 'string', 'exists:icd_10,ma_icd10'],
            'huong_dieu_tri' => ['nullable', 'string'],
            'loi_dan' => ['nullable', 'string'],
            'hen_tai_kham' => ['nullable', 'date_format:Y-m-d H:i:s'],
            'trang_thai' => ['nullable', 'in:tiep_nhan,dang_kham,cho_ke_don,hoan_thanh'],
        ]);

        $phieuKham->update($payload);

        return response()->json([
            'success' => true,
            'data' => new PhieuKhamResource($phieuKham->load(['benhNhan', 'bacSi'])),
            'message' => 'Đã cập nhật phiếu khám',
        ]);
    }
}