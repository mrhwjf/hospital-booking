<?php

namespace App\Resources\Scheduling;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LichLamViecBacSiItemResource extends JsonResource
{
	public function toArray(Request $request): array
	{
		$resource = is_array($this->resource) ? $this->resource : [];

		return [
			'id' => $resource['id'] ?? null,
			'bac_si_id' => $resource['bac_si_id'] ?? null,
			'ngay_lam_viec' => $resource['ngay_lam_viec'] ?? null,
			'trang_thai' => $resource['trang_thai'] ?? null,
			'ca_lam_viec' => $resource['ca_lam_viec'] ?? null,
			'ngay_nghi_le' => $resource['ngay_nghi_le'] ?? null,
			'khung_gio' => collect($resource['khung_gio'] ?? [])->map(function ($slot) {
				return (new KhungGioKhamResource($slot))->resolve(request());
			})->values()->all(),
		];
	}
}
