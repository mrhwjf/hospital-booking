<?php

namespace App\Resources\Patients;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ChiTietDonThuocResource extends JsonResource
{
	public function toArray(Request $request): array
	{
		return [
			'id' => $this->id,
			'don_thuoc_id' => $this->don_thuoc_id,
			'thuoc_id' => $this->thuoc_id,
			'so_luong' => $this->so_luong,
			'lieu_dung' => $this->lieu_dung,
			'thoi_diem' => $this->thoi_diem,
			'so_ngay' => $this->so_ngay,
			'ghi_chu' => $this->ghi_chu,
			'thuoc' => $this->whenLoaded('thuoc', function () {
				return $this->thuoc ? [
					'id' => $this->thuoc->id,
					'ma_thuoc' => $this->thuoc->ma_thuoc,
					'ten_thuoc' => $this->thuoc->ten_thuoc,
					'don_vi' => $this->thuoc->don_vi,
					'ham_luong' => $this->thuoc->ham_luong,
					'duong_dung' => $this->thuoc->duong_dung,
				] : null;
			}),
		];
	}
}
