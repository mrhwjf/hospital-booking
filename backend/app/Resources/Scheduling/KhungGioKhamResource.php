<?php

namespace App\Resources\Scheduling;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class KhungGioKhamResource extends JsonResource
{
	public function toArray(Request $request): array
	{
		if (is_array($this->resource)) {
			return [
				'id' => $this->resource['id'] ?? null,
				'slot_key' => $this->resource['slot_key'] ?? ($this->resource['id'] ?? null),
				'lich_lam_viec_bac_si_id' => $this->resource['lich_lam_viec_bac_si_id'] ?? null,
				'gio_bat_dau' => $this->resource['gio_bat_dau'] ?? null,
				'gio_ket_thuc' => $this->resource['gio_ket_thuc'] ?? null,
				'trang_thai' => $this->resource['trang_thai'] ?? null,
				'phong_kham' => $this->resource['phong_kham'] ?? null,
				'exists_in_db' => $this->resource['exists_in_db'] ?? null,
				'ngay_lam_viec' => $this->resource['ngay_lam_viec'] ?? null,
			];
		}

		$room = $this->resource->relationLoaded('lichLamViecBacSi')
			? $this->lichLamViecBacSi?->phongKham
			: null;

		return [
			'id' => $this->id,
			'slot_key' => $this->id,
			'lich_lam_viec_bac_si_id' => $this->lich_lam_viec_bac_si_id,
			'gio_bat_dau' => $this->gio_bat_dau,
			'gio_ket_thuc' => $this->gio_ket_thuc,
			'trang_thai' => $this->trang_thai,
			'phong_kham' => $room ? [
				'id' => $room->id,
				'ma_phong' => $room->ma_phong,
				'ten_phong' => $room->ten_phong,
			] : null,
		];
	}
}
