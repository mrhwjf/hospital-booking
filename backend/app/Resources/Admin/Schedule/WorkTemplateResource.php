<?php

namespace App\Resources\Admin\Schedule;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class WorkTemplateResource extends JsonResource
{
	public function toArray(Request $request): array
	{
		return [
			'id' => $this->id,
			'ma_ca' => $this->ma_ca,
			'ten_ca' => $this->ten_ca,
			'thu_trong_tuan' => $this->thu_trong_tuan,
			'gio_bat_dau' => $this->gio_bat_dau,
			'gio_ket_thuc' => $this->gio_ket_thuc,
			'thoi_luong_kham' => $this->thoi_luong_kham,
			'ghi_chu' => $this->ghi_chu,
			'trang_thai' => $this->trang_thai,
			'created_at' => $this->created_at,
			'updated_at' => $this->updated_at,
		];
	}
}
