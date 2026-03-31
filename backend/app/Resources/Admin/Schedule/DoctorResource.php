<?php

namespace App\Resources\Admin\Schedule;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DoctorResource extends JsonResource
{
	public function toArray(Request $request): array
	{
		return [
			'id' => $this->id,
			'ma_bac_si' => $this->ma_bac_si,
			'ho_ten' => $this->ho_ten,
			'hoc_vi' => $this->hoc_vi,
			'so_dien_thoai' => $this->so_dien_thoai,
			'trang_thai' => $this->trang_thai,
			'chuyen_khoa' => $this->whenLoaded('bacSiChuyenKhoas', function () {
				return collect($this->bacSiChuyenKhoas)
					->map(fn($item) => $item->chuyenKhoa?->ten_chuyen_khoa)
					->filter()
					->values();
			}),
		];
	}
}
