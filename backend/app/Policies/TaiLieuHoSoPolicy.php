<?php

namespace App\Policies;

use App\Enums\PermissionEnum;
use App\Models\NguoiDung;
use App\Models\TaiLieuHoSo;

class TaiLieuHoSoPolicy
{
    public function viewAny(NguoiDung $user): bool
    {
        return $user->hasPermission(PermissionEnum::TAI_LIEU_HO_SO_READ)
            && ($this->isPrivilegedUser($user) || $this->resolvePatientId($user) !== null);
    }

    public function view(NguoiDung $user, TaiLieuHoSo $taiLieuHoSo): bool
    {
        if (
            !$user->hasPermission(PermissionEnum::TAI_LIEU_HO_SO_READ)
            && !$user->hasPermission(PermissionEnum::TAI_LIEU_HO_SO_READ_FILE)
        ) {
            return false;
        }

        if ($this->isPrivilegedUser($user)) {
            return true;
        }

        return $this->resolvePatientId($user) === (int) $taiLieuHoSo->phieuKham?->benh_nhan_id;
    }

    public function create(NguoiDung $user): bool
    {
        return $user->hasPermission(PermissionEnum::TAI_LIEU_HO_SO_CREATE)
            || $user->hasPermission(PermissionEnum::TAI_LIEU_HO_SO_UPDATE_FILE);
    }

    public function update(NguoiDung $user, TaiLieuHoSo $taiLieuHoSo): bool
    {
        if (
            !$user->hasPermission(PermissionEnum::TAI_LIEU_HO_SO_UPDATE)
            && !$user->hasPermission(PermissionEnum::TAI_LIEU_HO_SO_UPDATE_FILE)
        ) {
            return false;
        }

        if ($this->isPrivilegedUser($user)) {
            return true;
        }

        return $this->resolvePatientId($user) === (int) $taiLieuHoSo->phieuKham?->benh_nhan_id;
    }

    public function delete(NguoiDung $user, TaiLieuHoSo $taiLieuHoSo): bool
    {
        if (
            !$user->hasPermission(PermissionEnum::TAI_LIEU_HO_SO_DELETE)
            && !$user->hasPermission(PermissionEnum::TAI_LIEU_HO_SO_DELETE_FILE)
        ) {
            return false;
        }

        if ($this->isPrivilegedUser($user)) {
            return true;
        }

        return $this->resolvePatientId($user) === (int) $taiLieuHoSo->phieuKham?->benh_nhan_id;
    }

    private function resolvePatientId(NguoiDung $user): ?int
    {
        $patientId = $user->benhNhan?->id;

        if (empty($patientId)) {
            return null;
        }

        return (int) $patientId;
    }

    private function isPrivilegedUser(NguoiDung $user): bool
    {
        return $user->hasAnyPermissions([
            PermissionEnum::QUAN_TRI_NGUOI_DUNG,
            PermissionEnum::NGHIEP_VU_QUAN_LY_LICH_HEN,
            PermissionEnum::NGHIEP_VU_KHAM_BENH,
            PermissionEnum::PHIEU_KHAM_CREATE,
        ]);
    }
}
