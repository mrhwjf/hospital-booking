<?php

namespace App\Policies;

use App\Models\NguoiDung;
use App\Models\TaiLieuHoSo;

class TaiLieuHoSoPolicy
{
    public function viewAny(NguoiDung $user): bool
    {
        return $this->isPrivilegedUser($user) || $this->resolvePatientId($user) !== null;
    }

    public function view(NguoiDung $user, TaiLieuHoSo $taiLieuHoSo): bool
    {
        if ($this->isPrivilegedUser($user)) {
            return true;
        }

        return $this->resolvePatientId($user) === (int) $taiLieuHoSo->phieuKham?->benh_nhan_id;
    }

    public function create(NguoiDung $user): bool
    {
        return $this->isPrivilegedUser($user) || $this->resolvePatientId($user) !== null;
    }

    public function update(NguoiDung $user, TaiLieuHoSo $taiLieuHoSo): bool
    {
        if ($this->isPrivilegedUser($user)) {
            return true;
        }

        return $this->resolvePatientId($user) === (int) $taiLieuHoSo->phieuKham?->benh_nhan_id;
    }

    public function delete(NguoiDung $user, TaiLieuHoSo $taiLieuHoSo): bool
    {
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
        $role = strtoupper((string) $user->vaiTro?->ma_vai_tro);

        return in_array($role, ['ADMIN', 'NHANVIEN', 'BACSI'], true);
    }
}
