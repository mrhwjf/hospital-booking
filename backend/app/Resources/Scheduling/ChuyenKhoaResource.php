<?php

namespace App\Resources\Scheduling;

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
			'mo_ta' => $this->mo_ta,
			'hinh_anh' => $this->hinh_anh,
			'vi_tri' => $this->vi_tri,
			'so_dien_thoai' => $this->so_dien_thoai,
			'truong_khoa_id' => $this->truong_khoa_id,
			'thu_tu_hien_thi' => $this->thu_tu_hien_thi,
			'trang_thai' => $this->trang_thai,
		];
	}
}
