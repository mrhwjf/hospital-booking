<?php

namespace App\Http\Middleware;

use Closure;
use App\Resources\ApiResponse;
use Illuminate\Http\Request;

class CheckPermission
{
	public function handle(Request $request, Closure $next, string ...$permissions): mixed
	{
		if (empty($permissions)) {
			return $next($request);
		}

		$user = $request->user();
		if (!$user || !method_exists($user, 'hasAllPermissions')) {
			return ApiResponse::error('Ban chua dang nhap hoac chua co quyen hop le.', null, 401);
		}

		if (!$user->hasAllPermissions($permissions)) {
			return ApiResponse::error('Forbidden', null, 403);
		}

		return $next($request);
	}
}
