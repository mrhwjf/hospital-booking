<?php

namespace App\Resources\Admin\Schedule;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class HolidayResource extends JsonResource
{
	public function toArray(Request $request): array
	{
		$cancellationSummary = $this->resource->getAttribute('thong_tin_huy_lich_hen');

		return [
			'id' => $this->id,
			'ten_ngay_nghi' => $this->ten_ngay_nghi,
			'ngay' => Carbon::parse($this->ngay)->format('Y-m-d'),
			'mo_ta' => $this->mo_ta,
			'trang_thai' => $this->trang_thai,
			'thong_tin_huy_lich_hen' => $cancellationSummary,
			'created_at' => $this->created_at,
		];
	}
}
