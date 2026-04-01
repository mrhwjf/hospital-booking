<?php

namespace App\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class QuyenResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'ma_quyen' => $this->ma_quyen,
            'ten_quyen' => $this->ten_quyen,
            'mo_ta' => $this->mo_ta,
            'nhom_quyen' => $this->nhom_quyen,
            'so_vai_tro' => $this->whenCounted('vaiTros', fn () => (int) $this->vai_tros_count),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
