<?php

namespace App\Policies;

use App\Enums\PermissionEnum;

class QuyenPolicy extends AdminOnlyPolicy
{
	protected function requiredPermission(): PermissionEnum
	{
		return PermissionEnum::QUAN_TRI_VAI_TRO;
	}
}