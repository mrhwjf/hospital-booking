<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Controller;
use App\Models\NguoiDung;
use App\Models\BenhNhan;
use App\Models\VaiTro;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    /**
     * Đăng nhập người dùng
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'mat_khau' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        // Eager load vaiTro relationship
        $user = NguoiDung::with('vaiTro')->where('email', $request->email)->first();

        if (!$user || !Hash::check($request->mat_khau, $user->mat_khau)) {
            return response()->json([
                'success' => false,
                'message' => 'Thông tin đăng nhập không chính xác'
            ], 401);
        }

        // Tạo token Sanctum
        $token = $user->createToken('api-token')->plainTextToken;

        // Lấy thông tin bệnh nhân nếu là bệnh nhân
        $benhNhan = null;
        if ($user->vaiTro?->ma_vai_tro === 'BENHNHAN') {
            $benhNhan = BenhNhan::where('nguoi_dung_id', $user->id)->first();
        }

        return response()->json([
            'success' => true,
            'token' => $token,
            'nguoi_dung' => [
                'id' => $user->id,
                'ho_ten' => $user->ho_ten,
                'email' => $user->email,
                'vai_tro' => $user->vaiTro?->ma_vai_tro,
                'benh_nhan_id' => $benhNhan?->id ?? null,
            ],
            'payload' => [
                'userId' => $user->id,
                'name' => $user->ho_ten,
                'role' => $user->vaiTro?->ma_vai_tro,
                'email' => $user->email,
            ]
        ], 200);
    }

    /**
     * Đăng ký tài khoản mới
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'ho_ten' => 'required|string|max:100',
            'email' => 'required|email|unique:nguoi_dung,email',
            'mat_khau' => 'required|string|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Lấy role BENHNHAN
            $vaiTroBenhNhan = VaiTro::where('ma_vai_tro', 'BENHNHAN')->first();
            if (!$vaiTroBenhNhan) {
                return response()->json([
                    'success' => false,
                    'message' => 'Vai trò bệnh nhân không tồn tại'
                ], 500);
            }

            $user = NguoiDung::create([
                'ho_ten' => $request->ho_ten,
                'email' => $request->email,
                'mat_khau' => Hash::make($request->mat_khau),
                'vai_tro_id' => $vaiTroBenhNhan->id,
            ]);

            // Tạo hồ sơ bệnh nhân
            $benhNhan = BenhNhan::create([
                'nguoi_dung_id' => $user->id,
                'ho_ten' => $user->ho_ten,
                'ma_benh_nhan' => 'BN' . str_pad($user->id, 4, '0', STR_PAD_LEFT),
                'trang_thai' => 'hoat_dong',
            ]);

            $token = $user->createToken('api-token')->plainTextToken;

            return response()->json([
                'success' => true,
                'token' => $token,
                'nguoi_dung' => [
                    'id' => $user->id,
                    'ho_ten' => $user->ho_ten,
                    'email' => $user->email,
                    'vai_tro' => 'BENHNHAN',
                    'benh_nhan_id' => $benhNhan->id,
                ],
                'payload' => [
                    'userId' => $user->id,
                    'name' => $user->ho_ten,
                    'role' => 'BENHNHAN',
                ]
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi tạo tài khoản',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Đăng xuất (hủy token phía server)
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout(Request $request)
    {
        $request->user()?->currentAccessToken()?->delete();

        return response()->json([
            'success' => true,
            'message' => 'Đăng xuất thành công'
        ]);
    }

    /**
     * Lấy thông tin người dùng hiện đang đăng nhập
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function me(Request $request)
    {
        $user = $request->user()->load('vaiTro');

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $user->id,
                'ho_ten' => $user->ho_ten,
                'email' => $user->email,
                'vai_tro' => $user->vaiTro?->ma_vai_tro,
            ]
        ]);
    }

    /**
     * Cập nhật thông tin tài khoản hiện tại
     */
    public function updateMe(Request $request)
    {
        $user = $request->user()->load('vaiTro');

        $validator = Validator::make($request->all(), [
            'email' => 'required|email|unique:nguoi_dung,email,' . $user->id,
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $user->email = $request->email;
        $user->save();

        // Đồng bộ email hồ sơ bệnh nhân nếu tài khoản là bệnh nhân
        if ($user->vaiTro?->ma_vai_tro === 'BENHNHAN') {
            $benhNhan = BenhNhan::where('nguoi_dung_id', $user->id)->first();
            if ($benhNhan) {
                $benhNhan->email = $user->email;
                $benhNhan->save();
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Cập nhật email thành công',
            'data' => [
                'id' => $user->id,
                'ho_ten' => $user->ho_ten,
                'email' => $user->email,
                'vai_tro' => $user->vaiTro?->ma_vai_tro,
            ]
        ]);
    }

    /**
     * Đổi mật khẩu cho tài khoản hiện tại
     */
    public function changePassword(Request $request)
    {
        $user = $request->user();

        $validator = Validator::make($request->all(), [
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:8|regex:/[A-Z]/|confirmed',
        ], [
            'new_password.regex' => 'Mật khẩu mới phải chứa ít nhất 1 chữ hoa',
            'new_password.confirmed' => 'Xác nhận mật khẩu không khớp',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        if (!Hash::check($request->current_password, $user->mat_khau)) {
            return response()->json([
                'success' => false,
                'message' => 'Mật khẩu hiện tại không chính xác',
            ], 422);
        }

        if (Hash::check($request->new_password, $user->mat_khau)) {
            return response()->json([
                'success' => false,
                'message' => 'Mật khẩu mới phải khác mật khẩu hiện tại',
            ], 422);
        }

        $user->mat_khau = Hash::make($request->new_password);
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Đổi mật khẩu thành công',
        ]);
    }
}
