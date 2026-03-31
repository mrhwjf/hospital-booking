<?php

namespace App\Resources\Clinical;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DonThuocItemResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'thuoc_id' => $this->thuoc_id,
            'ma_thuoc' => $this->thuoc?->ma_thuoc,
            'ten_thuoc' => $this->thuoc?->ten_thuoc,
            'so_luong' => $this->so_luong,
            'lieu_dung' => $this->lieu_dung,
            'thoi_diem' => $this->thoi_diem,
            'so_ngay' => $this->so_ngay,
            'ghi_chu' => $this->ghi_chu,
        ];
    }
}


