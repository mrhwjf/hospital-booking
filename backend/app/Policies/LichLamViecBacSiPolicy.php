<?php

namespace App\Policies;

use App\Enums\PermissionEnum;

class LichLamViecBacSiPolicy extends AdminOnlyPolicy
{
	protected function requiredPermission(): PermissionEnum
	{
		return PermissionEnum::QUAN_TRI_LICH_LAM_VIEC;
	}
}