<?php

namespace App\Resources\Admin\Schedule;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DoctorLeaveResource extends JsonResource
{
	public function toArray(Request $request): array
	{
		$cancellationSummary = $this->resource->getAttribute('thong_tin_huy_lich_hen');

		return [
			'id' => $this->id,
			'bac_si_id' => $this->bac_si_id,
			'ngay' => Carbon::parse($this->ngay)->format('Y-m-d'),
			'gio_bat_dau' => $this->gio_bat_dau,
			'gio_ket_thuc' => $this->gio_ket_thuc,
			'ly_do' => $this->ly_do,
			'trang_thai' => $this->trang_thai,
			'bac_si' => $this->whenLoaded('bacSi', function () {
				return [
					'id' => $this->bacSi?->id,
					'ma_bac_si' => $this->bacSi?->ma_bac_si,
					'ho_ten' => $this->bacSi?->ho_ten,
					'hoc_vi' => $this->bacSi?->hoc_vi,
					'trang_thai' => $this->bacSi?->trang_thai,
				];
			}),
			'thong_tin_huy_lich_hen' => $cancellationSummary,
			'created_at' => $this->created_at,
		];
	}
}
