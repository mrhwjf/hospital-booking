<?php

namespace App\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ChuyenKhoaResource extends JsonResource
{
	public function toArray(Request $request): array
	{
		return [
			'id' => $this->id,
			'ma_chuyen_khoa' => $this->ma_chuyen_khoa,
			'ten_chuyen_khoa' => $this->ten_chuyen_khoa,
			'trang_thai' => $this->trang_thai,
		];
	}
}
