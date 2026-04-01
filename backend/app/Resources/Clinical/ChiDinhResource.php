<?php

namespace App\Resources\Clinical;

use Illuminate\Http\Resources\Json\JsonResource;

class ChiDinhResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'phieu_kham_id' => $this->phieu_kham_id,
            'bac_si_id' => $this->bac_si_id,
            'dich_vu_id' => $this->dich_vu_id,
            'so_luong' => $this->so_luong,
            'trang_thai' => $this->trang_thai,
            'ngay_chi_dinh' => $this->ngay_chi_dinh?->toDateString(),
            'ghi_chu' => $this->ghi_chu,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'bac_si' => $this->whenLoaded('bacSi'),
            'dich_vu' => $this->whenLoaded('dichVu'),
        ];
    }
}