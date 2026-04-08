<?php

namespace App\Policies;

use App\Enums\PermissionEnum;
use App\Models\BenhNhan;
use App\Models\NguoiDung;

class BenhNhanPolicy
{
    public function viewAny(NguoiDung $user): bool
    {
        return $user->hasPermission(PermissionEnum::BENH_NHAN_READ);
    }

    public function view(NguoiDung $user, BenhNhan $benhNhan): bool
    {
        return $user->hasPermission(PermissionEnum::BENH_NHAN_READ)
            && $this->canAccessPatient($user, $benhNhan);
    }

    public function create(NguoiDung $user): bool
    {
        return $user->hasPermission(PermissionEnum::BENH_NHAN_CREATE);
    }

    public function update(NguoiDung $user, BenhNhan $benhNhan): bool
    {
        return $user->hasPermission(PermissionEnum::BENH_NHAN_UPDATE)
            && $this->canAccessPatient($user, $benhNhan);
    }

    public function delete(NguoiDung $user, BenhNhan $benhNhan): bool
    {
        return $user->hasPermission(PermissionEnum::BENH_NHAN_DELETE);
    }

    private function resolvePatientId(NguoiDung $user): ?int
    {
        $patientId = $user->benhNhan?->id;

        if (empty($patientId)) {
            return null;
        }

        return (int) $patientId;
    }

    private function canAccessPatient(NguoiDung $user, BenhNhan $benhNhan): bool
    {
        if ($this->resolvePatientId($user) === (int) $benhNhan->id) {
            return true;
        }

        return $user->hasAnyPermissions([
            PermissionEnum::BENH_NHAN_CREATE,
            PermissionEnum::NGHIEP_VU_QUAN_LY_LICH_HEN,
            PermissionEnum::NGHIEP_VU_KHAM_BENH,
            PermissionEnum::QUAN_TRI_NGUOI_DUNG,
        ]);
    }
}
