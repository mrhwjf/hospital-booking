<?php

namespace App\Resources\Scheduling;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DichVuLichHenResource extends JsonResource
{
	public function toArray(Request $request): array
	{
		return [
			'id' => $this->id,
			'lich_hen_id' => $this->lich_hen_id,
			'dich_vu_id' => $this->dich_vu_id,
			'goi_kham_id' => $this->goi_kham_id,
			'so_luong' => $this->so_luong,
			'ghi_chu' => $this->ghi_chu,
			'dich_vu' => $this->whenLoaded('dichVu', fn() => new DichVuResource($this->dichVu)),
			'goi_kham' => $this->whenLoaded('goiKham', fn() => new GoiKhamResource($this->goiKham)),
		];
	}
}
