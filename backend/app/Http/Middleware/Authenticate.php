<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;

class Authenticate extends Middleware
{
	/**
	 * Get the path the user should be redirected to when they are not authenticated.
	 */
	protected function redirectTo($request): ?string
	{
		// For API calls we want to return a 401 JSON response (no redirect).
		if ($request->expectsJson() || $request->is('api/*')) {
			return null;
		}

		// For web routes, redirect to login if defined.
		return route('login');
	}
}
