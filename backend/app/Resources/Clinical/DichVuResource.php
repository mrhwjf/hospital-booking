<?php

namespace App\Resources\Clinical;

use Illuminate\Http\Resources\Json\JsonResource;

class DichVuResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'ma_dich_vu' => $this->ma_dich_vu,
            'ten_dich_vu' => $this->ten_dich_vu,
            'chuyen_khoa_id' => $this->chuyen_khoa_id,
            'gia_dich_vu' => (int) $this->gia_dich_vu,
            'loai_dich_vu' => $this->loai_dich_vu,
            'trang_thai' => $this->trang_thai,
            'chuyen_khoa' => $this->whenLoaded('chuyenKhoa'),
        ];
    }
}