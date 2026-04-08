<?php

namespace App\Policies;

use App\Enums\PermissionEnum;
use App\Models\NhanVien;
use App\Models\NguoiDung;

class NhanVienPolicy
{
	public function viewAny(NguoiDung $user): bool
	{
		return $user->hasPermission(PermissionEnum::NHAN_VIEN_READ)
			&& ($this->isPrivilegedUser($user) || $this->resolveNhanVienId($user) !== null);
	}

	public function view(NguoiDung $user, NhanVien $nhanVien): bool
	{
		if (!$user->hasPermission(PermissionEnum::NHAN_VIEN_READ)) {
			return false;
		}

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
		return $user->hasPermission(PermissionEnum::QUAN_TRI_HO_SO_NHAN_VIEN);
	}
}
