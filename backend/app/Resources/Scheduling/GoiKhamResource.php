<?php

namespace App\Resources\Scheduling;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class GoiKhamResource extends JsonResource
{
	public function toArray(Request $request): array
	{
		return [
			'id' => $this->id,
			'ma_goi_kham' => $this->ma_goi_kham,
			'ten_goi_kham' => $this->ten_goi_kham,
			'mo_ta' => $this->mo_ta,
			'gia_goi_kham' => $this->gia_goi_kham,
			'trang_thai' => $this->trang_thai,
			'chi_tiet_goi_khams' => $this->whenLoaded('chiTietGoiKhams', function () {
				return collect($this->chiTietGoiKhams)->map(function ($item) {
					return [
						'id' => $item->id,
						'dich_vu_id' => $item->dich_vu_id,
						'so_luong_mac_dinh' => $item->so_luong_mac_dinh,
						'thu_tu_hien_thi' => $item->thu_tu_hien_thi,
						'dich_vu' => $item->relationLoaded('dichVu') ? new DichVuResource($item->dichVu) : null,
					];
				})->values();
			}),
		];
	}
}
