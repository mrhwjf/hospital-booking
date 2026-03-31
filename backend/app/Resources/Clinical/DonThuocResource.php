<?php

namespace App\Resources\Clinical;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DonThuocResource extends JsonResource
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
            'ma_don_thuoc' => $this->ma_don_thuoc,
            'phieu_kham_id' => $this->phieu_kham_id,
            'ngay_ke' => optional($this->ngay_ke)->toDateString(),
            'ghi_chu' => $this->ghi_chu,
            'trang_thai' => $this->trang_thai,
            'items' => $this->when(
                $this->relationLoaded('chiTietDonThuocs'),
                fn () => DonThuocItemResource::collection($this->chiTietDonThuocs)->resolve()
            ),
        ];
    }
}
