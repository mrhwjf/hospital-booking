<?php

namespace App\Policies;

use App\Enums\PermissionEnum;

class NguoiDungPolicy extends AdminOnlyPolicy
{
	protected function requiredPermission(): PermissionEnum
	{
		return PermissionEnum::QUAN_TRI_NGUOI_DUNG;
	}
}