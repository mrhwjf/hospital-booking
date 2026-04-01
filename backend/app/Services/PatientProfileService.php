<?php

namespace App\Services;

use App\Models\BenhNhan;

class PatientProfileService
{
    /**
     * Get patient profile by user ID
     *
     * @param int $userId
     * @return BenhNhan|null
     */
    public function getByUserId(int $userId)
    {
        return BenhNhan::where('nguoi_dung_id', $userId)->first();
    }

    /**
     * Update patient profile by user ID
     *
     * @param int $userId
     * @param array $data
     * @return BenhNhan|null
     */
    public function updateProfile(int $userId, array $data)
    {
        $benhNhan = BenhNhan::where('nguoi_dung_id', $userId)->first();

        if (!$benhNhan) {
            return null;
        }

        $benhNhan->update($data);

        return $benhNhan;
    }
}
