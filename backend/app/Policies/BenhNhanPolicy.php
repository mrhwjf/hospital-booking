<?php

namespace App\Policies;

use App\Models\BenhNhan;
use App\Models\NguoiDung;

class BenhNhanPolicy
{
    public function viewAny(NguoiDung $user): bool
    {
        return $this->isPrivilegedUser($user) || $this->resolvePatientId($user) !== null;
    }

    public function view(NguoiDung $user, BenhNhan $benhNhan): bool
    {
        if ($this->isPrivilegedUser($user)) {
            return true;
        }

        return $this->resolvePatientId($user) === (int) $benhNhan->id;
    }

    public function create(NguoiDung $user): bool
    {
        return $this->isPrivilegedUser($user);
    }

    public function update(NguoiDung $user, BenhNhan $benhNhan): bool
    {
        if ($this->isPrivilegedUser($user)) {
            return true;
        }

        return $this->resolvePatientId($user) === (int) $benhNhan->id;
    }

    public function delete(NguoiDung $user, BenhNhan $benhNhan): bool
    {
        return $this->isPrivilegedUser($user);
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
        $role = strtoupper((string) $user->vaiTro?->ma_vai_tro);

        return in_array($role, ['ADMIN', 'LETAN', 'NHANVIEN', 'BACSI'], true);
    }
}
