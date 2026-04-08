<?php

namespace App\Requests\Concerns;

use Illuminate\Foundation\Auth\User as Authenticatable;

trait AuthorizesPolicyAbility
{
	protected function authorizeClassAbility(string $ability, string $modelClass): bool
	{
		$user = $this->user();
		if (!$user instanceof Authenticatable) {
			return false;
		}

		return (bool) $user->can($ability, $modelClass);
	}

	protected function authorizeModelAbility(string $ability, string $modelClass, string $routeParam): bool
	{
		$user = $this->user();
		if (!$user instanceof Authenticatable) {
			return false;
		}

		$modelId = (int) $this->route($routeParam);
		if ($modelId <= 0) {
			return false;
		}

		$model = $modelClass::query()->find($modelId);
		if (!$model) {
			return false;
		}

		return (bool) $user->can($ability, $model);
	}
}
