<?php

namespace App\Policies;

use App\Models\NhanVien;
use App\Models\NguoiDung;

class NhanVienPolicy
{
	public function viewAny(NguoiDung $user): bool
	{
		return $this->isPrivilegedUser($user) || $this->resolveNhanVienId($user) !== null;
	}

	public function view(NguoiDung $user, NhanVien $nhanVien): bool
	{
		if ($this->isPrivilegedUser($user)) {
			return true;
		}

		return $this->resolveNhanVienId($user) === (int) $nhanVien->id;
	}

	public function create(NguoiDung $user): bool
	{
		return $this->isPrivilegedUser($user);
	}

	public function update(NguoiDung $user, mixed $nhanVien = null): bool
	{
		if ($this->isPrivilegedUser($user)) {
			return true;
		}

		if (!$nhanVien instanceof NhanVien) {
			return false;
		}

		return $this->resolveNhanVienId($user) === (int) $nhanVien->id;
	}

	public function delete(NguoiDung $user, mixed $nhanVien = null): bool
	{
		return $this->isPrivilegedUser($user);
	}

	private function resolveNhanVienId(NguoiDung $user): ?int
	{
		$nhanVienId = $user->nhanVien?->id;

		if (empty($nhanVienId)) {
			return null;
		}

		return (int) $nhanVienId;
	}

	private function isPrivilegedUser(NguoiDung $user): bool
	{
		$role = strtoupper((string) $user->vaiTro?->ma_vai_tro);

		return in_array($role, ['ADMIN'], true);
	}
}
