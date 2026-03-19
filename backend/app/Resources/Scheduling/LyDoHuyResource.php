<?php

namespace App\Resources\Scheduling;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LyDoHuyResource extends JsonResource
{
	public function toArray(Request $request): array
	{
		return [
			'id' => $this->id,
			'ma_ly_do' => $this->ma_ly_do,
			'ten_ly_do' => $this->ten_ly_do,
			'loai' => $this->loai,
			'trang_thai' => $this->trang_thai,
			'thu_tu' => $this->thu_tu,
		];
	}
}
