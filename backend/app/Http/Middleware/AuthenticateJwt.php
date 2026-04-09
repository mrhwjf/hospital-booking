<?php

namespace App\Http\Middleware;

use App\Models\NguoiDung;
use App\Services\Auth\JwtService;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthenticateJwt
{
    public function __construct(private JwtService $jwtService)
    {
    }

    public function handle(Request $request, Closure $next)
    {
        $token = $request->bearerToken();

        if (!$token) {
            return $this->unauthorized('Token không được cung cấp');
        }

        try {
            $payload = $this->jwtService->decodeToken($token);
            $userId = (int) ($payload['sub'] ?? 0);

            if ($userId <= 0) {
                return $this->unauthorized('Token không hợp lệ');
            }

            $user = NguoiDung::with('vaiTro')->find($userId);
            if (!$user) {
                return $this->unauthorized('Người dùng không tồn tại');
            }

            if ($user->trang_thai !== 'hoat_dong') {
                return $this->unauthorized('Tài khoản của bạn đã bị vô hiệu hóa');
            }

            Auth::setUser($user);
            $request->setUserResolver(static fn() => $user);

            return $next($request);
        } catch (\Throwable $exception) {
            return $this->unauthorized('Token không hợp lệ hoặc đã hết hạn');
        }
    }

    private function unauthorized(string $message)
    {
        return response()->json([
            'success' => false,
            'message' => $message,
        ], 401);
    }
}
