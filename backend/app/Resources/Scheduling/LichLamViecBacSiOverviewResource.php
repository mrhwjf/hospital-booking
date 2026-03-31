<?php

namespace App\Resources\Scheduling;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LichLamViecBacSiOverviewResource extends JsonResource
{
	public function toArray(Request $request): array
	{
		$resource = is_array($this->resource) ? $this->resource : [];

		return [
			'bac_si' => $resource['bac_si'] ?? null,
			'tu_ngay' => $resource['tu_ngay'] ?? null,
			'den_ngay' => $resource['den_ngay'] ?? null,
			'items' => LichLamViecBacSiItemResource::collection($resource['items'] ?? [])->resolve($request),
		];
	}
}
