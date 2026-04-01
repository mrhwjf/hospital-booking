<?php

namespace App\Resources\Patients;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TaiLieuHoSoResource extends JsonResource
{
	public function toArray(Request $request): array
	{
		return [
			'id' => $this->id,
			'ma_tai_lieu' => $this->ma_tai_lieu,
			'phieu_kham_id' => $this->phieu_kham_id,
			'loai_tai_lieu' => $this->loai_tai_lieu,
			'ten_tai_lieu' => $this->ten_tai_lieu,
			'ngay_tao' => $this->ngay_tao?->format('Y-m-d') ?? $this->ngay_tao,
			'ghi_chu' => $this->ghi_chu,
			'created_at' => $this->created_at?->format('Y-m-d H:i:s') ?? $this->created_at,
		];
	}
}
