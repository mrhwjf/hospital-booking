<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Controller;
use App\Services\AuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function __construct(private readonly AuthService $authService) {}

    /**
     * POST /api/v1/auth/register
     * Chỉ cho phép tạo tài khoản bệnh nhân.
     */
    public function register(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'ho_ten'        => 'required|string|max:100',
            'email'         => 'required|email|unique:nguoi_dung,email',
            'mat_khau'      => 'required|string|min:8|confirmed',
            'so_dien_thoai' => 'required|string|max:15',
            'ngay_sinh'     => 'required|date|before:today',
            'gioi_tinh'     => 'required|in:nam,nu,khac',
            'so_cccd'       => 'nullable|string|size:12|unique:benh_nhan,so_cccd',
        ]);

        try {
            $result = $this->authService->dangKyBenhNhan($validated);

            return response()->json([
                'message'    => 'Đăng ký thành công.',
                'token'      => $result['token'],
                'nguoi_dung' => $result['nguoi_dung'],
            ], 201);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Đăng ký thất bại. Vui lòng thử lại.',
            ], 500);
        }
    }

    /**
     * POST /api/v1/auth/login
     */
    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'email'    => 'required|email',
            'mat_khau' => 'required|string',
        ]);

        try {
            $result = $this->authService->login($request->email, $request->mat_khau);

            return response()->json([
                'message'    => 'Đăng nhập thành công.',
                'token'      => $result['token'],
                'nguoi_dung' => $result['nguoi_dung'],
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => $e->errors()['email'][0] ?? 'Đăng nhập thất bại.',
                'errors'  => $e->errors(),
            ], 422);
        }
    }

    /**
     * POST /api/v1/auth/logout  (cần token)
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Đã đăng xuất.']);
    }

    /**
     * GET /api/v1/auth/me  (cần token)
     */
    public function me(Request $request): JsonResponse
    {
        $user = $request->user()->load('vaiTro', 'benhNhan');

        return response()->json(['nguoi_dung' => $user]);
    }
}
