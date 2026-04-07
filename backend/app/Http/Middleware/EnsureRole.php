<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureRole
{
	public function handle(Request $request, Closure $next, string ...$roles): Response
	{
		if (in_array('public', $roles, true)) {
			return $next($request);
		}

		$user = $request->user();

		if (!$user || !$user->vaiTro) {
			return response()->json([
				'error' => [
					'code' => 'UNAUTHORIZED',
					'message' => 'Bạn chưa đăng nhập.',
				],
			], Response::HTTP_UNAUTHORIZED);
		}

		$currentRole = $user->vaiTro->ma_vai_tro;

		if (!in_array($currentRole, $roles, true)) {
			return response()->json([
				'error' => [
					'code' => 'FORBIDDEN',
					'message' => 'Bạn không có quyền truy cập tài nguyên này.',
				],
			], Response::HTTP_FORBIDDEN);
		}

		return $next($request);
	}
}
