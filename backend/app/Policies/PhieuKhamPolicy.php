<?php

namespace App\Policies;

use App\Models\NguoiDung;
use App\Models\PhieuKham;

class PhieuKhamPolicy
{
    public function viewAny(NguoiDung $user): bool
    {
        return $this->isElevatedUser($user)
            || $this->resolvePatientId($user) !== null
            || $this->resolveDoctorId($user) !== null;
    }

    public function view(NguoiDung $user, PhieuKham $phieuKham): bool
    {
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
        return $this->isElevatedUser($user) || $this->resolveDoctorId($user) !== null;
    }

    public function update(NguoiDung $user, PhieuKham $phieuKham): bool
    {
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
        return $this->isElevatedUser($user);
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
        $role = strtoupper((string) $user->vaiTro?->ma_vai_tro);

        return in_array($role, ['ADMIN', 'BACSI'], true);
    }
}
