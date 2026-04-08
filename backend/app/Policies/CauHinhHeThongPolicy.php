<?php

namespace App\Policies;

use App\Enums\PermissionEnum;

class CauHinhHeThongPolicy extends AdminOnlyPolicy
{
	protected function requiredPermission(): PermissionEnum
	{
		return PermissionEnum::QUAN_TRI_CAU_HINH;
	}
}