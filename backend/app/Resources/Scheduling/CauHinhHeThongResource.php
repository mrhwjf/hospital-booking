<?php

namespace App\Resources\Scheduling;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CauHinhHeThongResource extends JsonResource
{
	public function toArray(Request $request): array
	{
		return [
			'khoa' => $this->khoa,
			'gia_tri' => $this->gia_tri,
			'mo_ta' => $this->mo_ta,
			'nhom' => $this->nhom,
		];
	}
}
