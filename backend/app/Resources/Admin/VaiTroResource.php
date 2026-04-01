<?php

namespace App\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VaiTroResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'ma_vai_tro' => $this->ma_vai_tro,
            'ten_vai_tro' => $this->ten_vai_tro,
            'mo_ta' => $this->mo_ta,
            'trang_thai' => $this->trang_thai,
            'so_tai_khoan' => $this->whenCounted('nguoiDungs', fn () => (int) $this->nguoi_dungs_count),
            'quyens' => $this->whenLoaded('quyens', function () {
                return $this->quyens->map(function ($quyen) {
                    return [
                        'id' => $quyen->id,
                        'ma_quyen' => $quyen->ma_quyen,
                        'ten_quyen' => $quyen->ten_quyen,
                        'nhom_quyen' => $quyen->nhom_quyen,
                    ];
                })->values();
            }),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
