<?php

namespace App\Resources\Scheduling;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DichVuResource extends JsonResource
{
	public function toArray(Request $request): array
	{
		return [
			'id' => $this->id,
			'ma_dich_vu' => $this->ma_dich_vu,
			'chuyen_khoa_id' => $this->chuyen_khoa_id,
			'ten_dich_vu' => $this->ten_dich_vu,
			'mo_ta' => $this->mo_ta,
			'gia_dich_vu' => $this->gia_dich_vu,
			'trang_thai' => $this->trang_thai,
			'chuyen_khoa' => $this->whenLoaded('chuyenKhoa', fn() => new ChuyenKhoaResource($this->chuyenKhoa)),
		];
	}
}
