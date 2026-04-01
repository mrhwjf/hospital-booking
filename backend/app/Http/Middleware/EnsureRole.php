<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EnsureRole
{
	public function handle(Request $request, Closure $next, string ...$roles): mixed
	{
		$requiredRoles = collect($roles)
			->filter()
			->map(fn ($role) => mb_strtoupper(trim($role)))
			->values();

		if ($requiredRoles->isEmpty()) {
			return $next($request);
		}

		$currentRole = $this->resolveRole($request);

		if (!$currentRole) {
			return $this->forbiddenResponse(401, 'Bạn chưa đăng nhập hoặc chưa có vai trò hợp lệ.');
		}

		if (!$requiredRoles->contains($currentRole)) {
			return $this->forbiddenResponse(403, 'Bạn không có quyền truy cập tài nguyên này.');
		}

		return $next($request);
	}

	private function resolveRole(Request $request): ?string
	{
		$user = $request->user();
		if ($user && method_exists($user, 'vaiTro')) {
			$role = $user->vaiTro?->ma_vai_tro;
			if ($role) {
				return mb_strtoupper($role);
			}
		}

		$headerRole = $request->header('X-User-Role');
		if ($headerRole) {
			return mb_strtoupper(trim($headerRole));
		}

		return null;
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
