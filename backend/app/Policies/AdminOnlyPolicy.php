<?php

namespace App\Policies;

use App\Enums\PermissionEnum;
use App\Models\NguoiDung;

class AdminOnlyPolicy
{
	public function viewAny(NguoiDung $user): bool
	{
		return $this->canAccess($user);
	}

	public function view(NguoiDung $user, mixed $resource = null): bool
	{
		return $this->canAccess($user);
	}

	public function create(NguoiDung $user): bool
	{
		return $this->canAccess($user);
	}

	public function update(NguoiDung $user, mixed $resource = null): bool
	{
		return $this->canAccess($user);
	}

	public function delete(NguoiDung $user, mixed $resource = null): bool
	{
		return $this->canAccess($user);
	}

	protected function canAccess(NguoiDung $user): bool
	{
		return $user->hasPermission($this->requiredPermission());
	}

	protected function requiredPermission(): PermissionEnum
	{
		return PermissionEnum::QUAN_TRI_NGUOI_DUNG;
	}
}