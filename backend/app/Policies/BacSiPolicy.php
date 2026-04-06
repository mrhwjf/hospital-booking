<?php

namespace App\Policies;

use App\Models\BacSi;
use App\Models\NguoiDung;

class BacSiPolicy
{
	public function viewAny(NguoiDung $user): bool
	{
		return $this->isElevatedUser($user) || $this->resolveDoctorId($user) !== null;
	}

	public function view(NguoiDung $user, BacSi $bacSi): bool
	{
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
		$role = strtoupper((string) $user->vaiTro?->ma_vai_tro);

		return in_array($role, ['ADMIN', 'NHANVIEN'], true);
	}
}
