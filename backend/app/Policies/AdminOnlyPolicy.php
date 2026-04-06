<?php

namespace App\Policies;

use App\Models\NguoiDung;

class AdminOnlyPolicy
{
	public function viewAny(NguoiDung $user): bool
	{
		return $this->isAdmin($user);
	}

	public function view(NguoiDung $user, mixed $resource = null): bool
	{
		return $this->isAdmin($user);
	}

	public function create(NguoiDung $user): bool
	{
		return $this->isAdmin($user);
	}

	public function update(NguoiDung $user, mixed $resource = null): bool
	{
		return $this->isAdmin($user);
	}

	public function delete(NguoiDung $user, mixed $resource = null): bool
	{
		return $this->isAdmin($user);
	}

	protected function isAdmin(NguoiDung $user): bool
	{
		return strtoupper((string) $user->vaiTro?->ma_vai_tro) === 'ADMIN';
	}
}