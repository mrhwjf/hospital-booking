<?php

namespace App\Policies;

use App\Enums\PermissionEnum;

class VaiTroPolicy extends AdminOnlyPolicy
{
	protected function requiredPermission(): PermissionEnum
	{
		return PermissionEnum::QUAN_TRI_VAI_TRO;
	}
}