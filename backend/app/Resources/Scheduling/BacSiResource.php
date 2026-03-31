<?php

namespace App\Resources\Scheduling;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BacSiResource extends JsonResource
{
	public function toArray(Request $request): array
	{
		return [
			'id' => $this->id,
			'ma_bac_si' => $this->ma_bac_si,
			'ho_ten' => $this->ho_ten,
			'so_dien_thoai' => $this->so_dien_thoai,
			'hoc_vi' => $this->hoc_vi,
			'chung_chi_hanh_nghe' => $this->chung_chi_hanh_nghe,
			'kinh_nghiem' => $this->kinh_nghiem,
			'gioi_thieu' => $this->gioi_thieu,
			'trang_thai' => $this->trang_thai,
			'bac_si_chuyen_khoas' => $this->whenLoaded('bacSiChuyenKhoas', function () {
				return collect($this->bacSiChuyenKhoas)->map(function ($item) {
					return [
						'id' => $item->id,
						'chuyen_khoa_id' => $item->chuyen_khoa_id,
						'chuyen_khoa' => $item->relationLoaded('chuyenKhoa')
							? new ChuyenKhoaResource($item->chuyenKhoa)
							: null,
					];
				})->values();
			}),
		];
	}
}
