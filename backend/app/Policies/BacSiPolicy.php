<?php

namespace App\Policies;

use App\Enums\PermissionEnum;
use App\Models\BacSi;
use App\Models\NguoiDung;

class BacSiPolicy
{
	public function viewAny(NguoiDung $user): bool
	{
		return $user->hasPermission(PermissionEnum::BAC_SI_READ)
			&& ($this->isElevatedUser($user) || $this->resolveDoctorId($user) !== null);
	}

	public function view(NguoiDung $user, BacSi $bacSi): bool
	{
		if (!$user->hasPermission(PermissionEnum::BAC_SI_READ)) {
			return false;
		}

		if ($this->isElevatedUser($user)) {
			return true;
		}

		return $this->resolveDoctorId($user) === (int) $bacSi->id;
	}

	public function create(NguoiDung $user): bool
	{
		return $this->isElevatedUser($user);
	}

	public function update(NguoiDung $user, mixed $bacSi = null): bool
	{
		if ($this->isElevatedUser($user)) {
			return true;
		}

		if (!$bacSi instanceof BacSi) {
			return false;
		}

		return $this->resolveDoctorId($user) === (int) $bacSi->id;
	}

	public function delete(NguoiDung $user, mixed $bacSi = null): bool
	{
		return $this->isElevatedUser($user);
	}

	private function resolveDoctorId(NguoiDung $user): ?int
	{
		$doctorId = $user->bacSi?->id;

		if (empty($doctorId)) {
			return null;
		}

		return (int) $doctorId;
	}

	private function isElevatedUser(NguoiDung $user): bool
	{
		return $user->hasAnyPermissions([
			PermissionEnum::QUAN_TRI_HO_SO_NHAN_VIEN,
			PermissionEnum::NGHIEP_VU_QUAN_LY_LICH_HEN,
		]);
	}
}
