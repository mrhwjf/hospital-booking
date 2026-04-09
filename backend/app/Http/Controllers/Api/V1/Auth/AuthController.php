<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Mail\WelcomeMail;
use App\Http\Controllers\Controller;
use App\Models\NguoiDung;
use App\Models\BenhNhan;
use App\Models\VaiTro;
use App\Services\Auth\JwtService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use App\Services\CloudinaryService;
class AuthController extends Controller
{
    public function __construct(private JwtService $jwtService, private CloudinaryService $cloudinaryService)
    {
    }

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

        // Eager load role and inherited permissions
        $user = NguoiDung::with(['vaiTro.quyens', 'benhNhan'])->where('email', $request->email)->first();

        if ($user->trang_thai !== 'hoat_dong') {
            return response()->json([
                'success' => false,
                'message' => 'Tài khoản đã bị khóa hoặc tạm khóa'
            ], 403);
        }

        if (!$user || !Hash::check($request->mat_khau, $user->mat_khau)) {
            return response()->json([
                'success' => false,
                'message' => 'Thông tin đăng nhập không chính xác'
            ], 401);
        }

        // Tạo JWT token
        $token = $this->jwtService->createToken($user);

        $permissions = $user->permissions()->all();
        $benhNhan = $user->benhNhan;

        return response()->json([
            'success' => true,
            'token' => $token,
            'token_type' => 'Bearer',
            'expires_in' => ((int) config('jwt.ttl', 1440)) * 60,
            'nguoi_dung' => [
                'id' => $user->id,
                'ho_ten' => $user->ho_ten,
                'email' => $user->email,
                'vai_tro' => $user->vaiTro?->ma_vai_tro,
                'benh_nhan_id' => $benhNhan?->id ?? null,
                'permissions' => $permissions,
            ],
            'payload' => [
                'userId' => $user->id,
                'name' => $user->ho_ten,
                'role' => $user->vaiTro?->ma_vai_tro,
                'email' => $user->email,
                'permissions' => $permissions,
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
            'mat_khau' => 'required|string|min:6|confirmed',
            'so_dien_thoai' => 'required|string|max:15|unique:benh_nhan,so_dien_thoai',
            'ngay_sinh' => 'required|date|before_or_equal:today',
            'gioi_tinh' => 'required|in:nam,nu,khac,nữ,khác',
            'so_cccd' => 'nullable|string|max:12|unique:benh_nhan,so_cccd',
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

            $normalizedGender = $this->normalizeGender((string) $request->input('gioi_tinh', ''));
            $soCccd = trim((string) $request->input('so_cccd', ''));

            $result = DB::transaction(function () use ($request, $vaiTroBenhNhan, $normalizedGender, $soCccd) {

                $user = NguoiDung::create([
                    'ho_ten' => $request->ho_ten,
                    'email' => $request->email,
                    'mat_khau' => Hash::make($request->mat_khau),
                    'vai_tro_id' => $vaiTroBenhNhan->id,
                    'trang_thai' => 'hoat_dong',
                ]);

                $benhNhan = BenhNhan::create([
                    'nguoi_dung_id' => $user->id,
                    'ho_ten' => $user->ho_ten,
                    'ma_benh_nhan' => 'BN' . str_pad($user->id, 4, '0', STR_PAD_LEFT),
                    'ngay_sinh' => $request->ngay_sinh,
                    'gioi_tinh' => $normalizedGender,
                    'so_dien_thoai' => $request->so_dien_thoai,
                    'email' => $user->email,
                    'so_cccd' => $soCccd !== '' ? $soCccd : null,
                    'trang_thai' => 'hoat_dong',
                ]);

                $token = $this->jwtService->createToken($user);
                $user->load('vaiTro.quyens');
                $permissions = $user->permissions()->all();

                return [
                    'user' => $user,
                    'benh_nhan' => $benhNhan,
                    'token' => $token,
                    'permissions' => $permissions,
                ];
            });


            try {
                Mail::to($result['user']->email)->send(new WelcomeMail($result['user']->ho_ten));
            } catch (\Throwable $mailException) {
                Log::warning('Gửi welcome mail thất bại sau đăng ký', [
                    'email' => $result['user']->email,
                    'error' => $mailException->getMessage(),
                ]);
            }

            return response()->json([
                'success' => true,
                'token' => $result['token'],
                'token_type' => 'Bearer',
                'expires_in' => ((int) config('jwt.ttl', 1440)) * 60,
                'nguoi_dung' => [
                    'id' => $result['user']->id,
                    'ho_ten' => $result['user']->ho_ten,
                    'email' => $result['user']->email,
                    'vai_tro' => 'BENHNHAN',
                    'benh_nhan_id' => $result['benh_nhan']->id,
                    'permissions' => $result['permissions'],
                ],
                'payload' => [
                    'userId' => $result['user']->id,
                    'name' => $result['user']->ho_ten,
                    'role' => 'BENHNHAN',
                    'permissions' => $result['permissions'],
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
        return response()->json([
            'success' => true,
            'message' => 'Đăng xuất thành công. Vui lòng xóa token ở phía client.'
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
        $user = $request->user()->load('vaiTro.quyens');

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $user->id,
                'ho_ten' => $user->ho_ten,
                'hinh_anh' => $user->hinh_anh,
                'hinh_anh_public_id' => $user->hinh_anh_public_id,
                'email' => $user->email,
                'vai_tro' => $user->vaiTro?->ma_vai_tro,
                'permissions' => $user->permissions()->all(),
            ]
        ]);
    }

    /**
     * Cập nhật avatar tài khoản hiện tại
     */
    public function updateAvatar(Request $request)
    {
        $file = $request->file('avatar');
        if (!$file || !$file->isValid()) {

            return response()->json([
                'success' => false,
                'message' => 'Không có tệp hình ảnh hợp lệ được tải lên',
            ], 422);
        }
        $userId = $this->jwtService->decodeToken($request->bearerToken())['sub'] ?? null;
        $result = $this->cloudinaryService->uploadAvatar($file, $userId);
        $user = NguoiDung::find($userId);
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Người dùng không tồn tại',
            ], 404);
        }
        $user->hinh_anh = $result['url'] ?? null;
        $user->hinh_anh_public_id = $result['public_id'] ?? null;
        $user->save();
        return response()->json([
            'success' => true,
            'data' => [
                'url' => $user->hinh_anh,
                'public_id' => $user->hinh_anh_public_id,
            ]
        ]);
    }

    /**
     * Cập nhật thông tin tài khoản hiện tại
     */
    public function updateMe(Request $request)
    {
        $user = $request->user()->load('vaiTro.quyens');

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

        // Đồng bộ email hồ sơ bệnh nhân nếu tài khoản có liên kết hồ sơ bệnh nhân
        $benhNhan = $user->benhNhan()->first();
        if ($benhNhan) {
            $benhNhan->email = $user->email;
            $benhNhan->save();
        }

        return response()->json([
            'success' => true,
            'message' => 'Cập nhật email thành công',
            'data' => [
                'id' => $user->id,
                'ho_ten' => $user->ho_ten,
                'email' => $user->email,
                'vai_tro' => $user->vaiTro?->ma_vai_tro,
                'hinh_anh' => $user->hinh_anh,
                'hinh_anh_public_id' => $user->hinh_anh_public_id,
                'permissions' => $user->permissions()->all(),
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

    private function normalizeGender(string $rawGender): string
    {
        $gender = mb_strtolower(trim($rawGender));

        if ($gender === 'nu' || $gender === 'nữ') {
            return 'nữ';
        }

        if ($gender === 'khac' || $gender === 'khác') {
            return 'khác';
        }

        return 'nam';
    }
}
