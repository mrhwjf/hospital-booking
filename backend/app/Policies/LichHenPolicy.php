<?php

namespace App\Policies;

use App\Enums\PermissionEnum;
use App\Models\LichHen;
use App\Models\NguoiDung;

class LichHenPolicy
{
    public function viewAny(NguoiDung $user): bool
    {
        return $user->hasPermission(PermissionEnum::LICH_HEN_READ)
            && ($this->isPrivilegedUser($user) || $this->resolvePatientId($user) !== null);
    }

    public function view(NguoiDung $user, LichHen $lichHen): bool
    {
        if (!$user->hasPermission(PermissionEnum::LICH_HEN_READ)) {
            return false;
        }

        if ($this->isPrivilegedUser($user)) {
            return true;
        }

        return $this->resolvePatientId($user) === (int) $lichHen->benh_nhan_id;
    }

    public function create(NguoiDung $user): bool
    {
        return $user->hasPermission(PermissionEnum::LICH_HEN_CREATE)
            || $user->hasPermission(PermissionEnum::LICH_HEN_DAT_LICH);
    }

    public function update(NguoiDung $user, LichHen $lichHen): bool
    {
        if (
            !($user->hasPermission(PermissionEnum::LICH_HEN_UPDATE)
                || $user->hasPermission(PermissionEnum::LICH_HEN_SUA_LICH)
                || $user->hasPermission(PermissionEnum::LICH_HEN_HUY_LICH))
        ) {
            return false;
        }

        if ($this->isPrivilegedUser($user)) {
            return true;
        }

        return $this->resolvePatientId($user) === (int) $lichHen->benh_nhan_id;
    }

    public function delete(NguoiDung $user, LichHen $lichHen): bool
    {
        if (
            !($user->hasPermission(PermissionEnum::LICH_HEN_DELETE)
                || $user->hasPermission(PermissionEnum::LICH_HEN_HUY_LICH))
        ) {
            return false;
        }

        if ($this->isPrivilegedUser($user)) {
            return true;
        }

        return $this->resolvePatientId($user) === (int) $lichHen->benh_nhan_id;
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
            PermissionEnum::LICH_HEN_CHECKIN,
        ]);
    }
}
