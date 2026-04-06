<?php

namespace App\Services;

use App\Models\NhanVien;
use App\Models\BacSi;

class StaffProfileService
{
	/**
	 * Get staff profile by user ID
	 *
	 * @param int $userId
	 * @return NhanVien|BacSi|null
	 */
	public function getByUserId(int $userId)
	{
		return NhanVien::with('nguoiDung.vaiTro')
			->where('nguoi_dung_id', $userId)
			->first()
			?? BacSi::with('nguoiDung.vaiTro')
				->where('nguoi_dung_id', $userId)
				->first();
	}
}
