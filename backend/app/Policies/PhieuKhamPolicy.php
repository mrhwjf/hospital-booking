<?php

namespace App\Policies;

use App\Enums\PermissionEnum;
use App\Models\NguoiDung;
use App\Models\PhieuKham;

class PhieuKhamPolicy
{
    public function viewAny(NguoiDung $user): bool
    {
        return $user->hasPermission(PermissionEnum::PHIEU_KHAM_READ)
            && (
                $this->isElevatedUser($user)
                || $this->resolvePatientId($user) !== null
                || $this->resolveDoctorId($user) !== null
            );
    }

    public function view(NguoiDung $user, PhieuKham $phieuKham): bool
    {
        if (!$user->hasPermission(PermissionEnum::PHIEU_KHAM_READ)) {
            return false;
        }

        if ($this->isElevatedUser($user)) {
            return true;
        }

        $patientId = $this->resolvePatientId($user);

        if ($patientId !== null && $patientId === (int) $phieuKham->benh_nhan_id) {
            return true;
        }

        return $this->resolveDoctorId($user) === (int) $phieuKham->bac_si_id;
    }

    public function create(NguoiDung $user): bool
    {
        return $user->hasPermission(PermissionEnum::PHIEU_KHAM_CREATE);
    }

    public function update(NguoiDung $user, PhieuKham $phieuKham): bool
    {
        if (!$user->hasPermission(PermissionEnum::PHIEU_KHAM_UPDATE)) {
            return false;
        }

        if ($this->isElevatedUser($user)) {
            return true;
        }

        $patientId = $this->resolvePatientId($user);

        if ($patientId !== null && $patientId === (int) $phieuKham->benh_nhan_id) {
            return true;
        }

        return $this->resolveDoctorId($user) === (int) $phieuKham->bac_si_id;
    }

    public function delete(NguoiDung $user, PhieuKham $phieuKham): bool
    {
        return $user->hasPermission(PermissionEnum::PHIEU_KHAM_DELETE);
    }

    private function resolvePatientId(NguoiDung $user): ?int
    {
        $patientId = $user->benhNhan?->id;

        if (empty($patientId)) {
            return null;
        }

        return (int) $patientId;
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
            PermissionEnum::QUAN_TRI_NGUOI_DUNG,
            PermissionEnum::NGHIEP_VU_KHAM_BENH,
        ]);
    }
}
