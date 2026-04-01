<?php

namespace App\Http\Resources\Specialty;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SpecialtyResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->resource->id,
            'name' => $this->resource->ten_chuyen_khoa,
            'description' => $this->resource->mo_ta,
            'image' => $this->resource->hinh_anh,
        ];
    }
}
