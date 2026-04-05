<?php

namespace App\Http\Controllers\Api\V1\Patients;

use App\Http\Controllers\Controller;
use App\Requests\Patients\CurrentPatientRequest;
use App\Resources\ApiResponse;
use App\Resources\Patients\BenhNhanProfileResource;
use App\Services\Patients\VisitHistoryService;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;
use App\Models\BenhNhan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class BenhNhanController extends Controller
{
    public function __construct(private readonly VisitHistoryService $visitHistoryService)
    {
    }

    public function me(CurrentPatientRequest $request): JsonResponse
    {
        try {
            $benhNhan = $this->visitHistoryService->getCurrentPatient(
                (int) $request->validated('benh_nhan_id')
            );
            $this->authorize('view', $benhNhan);

            return ApiResponse::success(
                new BenhNhanProfileResource($benhNhan),
                'Lấy thông tin bệnh nhân thành công.'
            );
        } catch (AuthorizationException $exception) {
            return ApiResponse::error('Bạn không có quyền truy cập hồ sơ bệnh nhân này.', null, 403);
        } catch (ValidationException $exception) {
            return ApiResponse::error(
                'Không thể lấy thông tin bệnh nhân.',
                [
                    'errors' => $exception->errors(),
                ],
                422,
            );
        } catch (\Throwable $throwable) {
            return ApiResponse::error('Không thể lấy thông tin bệnh nhân.', null, 500);

        }
    }

    /**
     * Lấy thông tin hồ sơ bệnh nhân
     */
    public function profile()
    {
        $user = Auth::user();
        $benhNhan = BenhNhan::where('nguoi_dung_id', $user->id)->first();

        if (!$benhNhan) {
            return response()->json(['message' => 'Patient profile not found'], 404);
        }

        return response()->json($benhNhan);
    }

    /**
     * Cập nhật thông tin hồ sơ bệnh nhân
     */
    public function updateProfile(Request $request)
    {
        $user = Auth::user();
        $benhNhan = BenhNhan::where('nguoi_dung_id', $user->id)->first();

        if (!$benhNhan) {
            return response()->json(['message' => 'Patient profile not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'ho_ten' => 'required|string|max:100',
            'ngay_sinh' => 'required|date',
            'gioi_tinh' => 'required|in:nam,nu,khac',
            'so_dien_thoai' => 'required|string|max:15',
            'email' => 'nullable|email|max:255',
            'so_cccd' => 'nullable|string|max:12|unique:benh_nhan,so_cccd,' . $benhNhan->id,
            'dia_chi' => 'nullable|string',
            'nguoi_lien_he' => 'nullable|string|max:100',
            'sdt_nguoi_lien_he' => 'nullable|string|max:15',
            'nhom_mau' => 'nullable|in:A+,A-,B+,B-,AB+,AB-,O+,O-',
            'tien_su_di_ung' => 'nullable|string',
            'tien_su_benh' => 'nullable|string',
            'ghi_chu' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $benhNhan->update($request->only([
            'ho_ten',
            'ngay_sinh',
            'gioi_tinh',
            'so_dien_thoai',
            'email',
            'so_cccd',
            'dia_chi',
            'nguoi_lien_he',
            'sdt_nguoi_lien_he',
            'nhom_mau',
            'tien_su_di_ung',
            'tien_su_benh',
            'ghi_chu'
        ]));

        return response()->json($benhNhan);
    }

    /**
     * Test endpoint - Get patient profile without authentication
     * 
     * Endpoint: GET /api/v1/patients/test/{benhNhanId}
     * Auth: None (for testing only)
     * 
     * @param int $benhNhanId - Patient ID
     * @return \Illuminate\Http\JsonResponse
     */
    public function profileTest(int $benhNhanId)
    {
        try {
            $benhNhan = BenhNhan::findOrFail($benhNhanId);

            return response()->json([
                'data' => $benhNhan,
                'meta' => [
                    'timestamp' => now()->toIso8601String()
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => [
                    'code' => 'NOT_FOUND',
                    'message' => 'Không tìm thấy hồ sơ bệnh nhân'
                ]
            ], 404);
        }
    }

    /**
     * Test endpoint - Update patient profile without authentication
     * 
     * Endpoint: PUT /api/v1/patients/update/{benhNhanId}
     * Auth: None (for testing only)
     * 
     * @param \Illuminate\Http\Request $request - Request data
     * @param int $benhNhanId - Patient ID
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateProfileTest(Request $request, int $benhNhanId)
    {
        try {
            $benhNhan = BenhNhan::findOrFail($benhNhanId);

            $validator = Validator::make($request->all(), [
                'ho_ten' => 'required|string|max:100',
                'ngay_sinh' => 'required|date',
                'gioi_tinh' => 'required|in:nam,nu,khac',
                'so_dien_thoai' => 'required|string|max:15',
                'email' => 'nullable|email|max:255',
                'so_cccd' => 'nullable|string|max:12|unique:benh_nhan,so_cccd,' . $benhNhan->id,
                'dia_chi' => 'nullable|string',
                'nguoi_lien_he' => 'nullable|string|max:100',
                'sdt_nguoi_lien_he' => 'nullable|string|max:15',
                'nhom_mau' => 'nullable|in:A+,A-,B+,B-,AB+,AB-,O+,O-',
                'tien_su_di_ung' => 'nullable|string',
                'tien_su_benh' => 'nullable|string',
                'ghi_chu' => 'nullable|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }

            $benhNhan->update($request->only([
                'ho_ten',
                'ngay_sinh',
                'gioi_tinh',
                'so_dien_thoai',
                'email',
                'so_cccd',
                'dia_chi',
                'nguoi_lien_he',
                'sdt_nguoi_lien_he',
                'nhom_mau',
                'tien_su_di_ung',
                'tien_su_benh',
                'ghi_chu'
            ]));

            return response()->json([
                'success' => true,
                'data' => $benhNhan,
                'message' => 'Cập nhật hồ sơ bệnh nhân thành công',
                'meta' => [
                    'timestamp' => now()->toIso8601String()
                ]
            ]);
        } catch (\Exception $e) {
            \Log::error('Update patient profile test error:', ['error' => $e->getMessage()]);

            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'ERROR',
                    'message' => 'Không thể cập nhật hồ sơ bệnh nhân'
                ]
            ], 500);
        }
    }
}
