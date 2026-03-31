<?php

namespace App\Resources\Admin\Schedule;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RoomResource extends JsonResource
{
	public function toArray(Request $request): array
	{
		return [
			'id' => $this->id,
			'ma_phong' => $this->ma_phong,
			'ten_phong' => $this->ten_phong,
			'chuyen_khoa_id' => $this->chuyen_khoa_id,
			'chuyen_khoa' => $this->chuyenKhoa?->ten_chuyen_khoa,
			'vi_tri' => $this->vi_tri,
			'trang_thai' => $this->trang_thai,
		];
	}
}
