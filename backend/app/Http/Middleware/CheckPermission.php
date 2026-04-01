<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CheckPermission
{
	public function handle(Request $request, Closure $next, string ...$permissions): mixed
	{
		if (empty($permissions)) {
			return $next($request);
		}

		$user = $request->user();
		if (!$user || !method_exists($user, 'vaiTro')) {
			return $this->forbiddenResponse(401, 'Bạn chưa đăng nhập hoặc chưa có quyền hợp lệ.');
		}

		$user->loadMissing('vaiTro.quyens');
		$availablePermissions = collect($user->vaiTro?->quyens ?? [])->pluck('ma_quyen')->all();

		$requiredPermissions = collect($permissions)
			->map(fn ($permission) => mb_strtoupper(trim($permission)))
			->values();

		$hasPermission = $requiredPermissions->every(function ($permission) use ($availablePermissions) {
			return in_array($permission, $availablePermissions, true);
		});

		if (!$hasPermission) {
			return $this->forbiddenResponse(403, 'Bạn không có quyền truy cập tài nguyên này.');
		}

		return $next($request);
	}

	private function forbiddenResponse(int $status, string $message): JsonResponse
	{
		return response()->json([
			'success' => false,
			'data'    => null,
			'message' => $message,
		], $status);
	}
}
