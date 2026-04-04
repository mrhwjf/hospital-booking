<?php

namespace App\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BacSiResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'ma_bac_si' => $this->ma_bac_si,
            'nguoi_dung_id' => $this->nguoi_dung_id,
            'email' => $this->whenLoaded('nguoiDung', fn() => $this->nguoiDung->email),
            'hinh_anh' => $this->whenLoaded('nguoiDung', fn() => $this->nguoiDung->hinh_anh),
            'ho_ten' => $this->ho_ten,
            'so_dien_thoai' => $this->so_dien_thoai,
            'hoc_vi' => $this->hoc_vi,
            'chung_chi_hanh_nghe' => $this->chung_chi_hanh_nghe,
            'kinh_nghiem' => $this->kinh_nghiem,
            'gioi_thieu' => $this->gioi_thieu,
            'trang_thai' => $this->trang_thai,
            'chuyen_khoa_chinh_id' => $this->whenLoaded('bacSiChuyenKhoas', function () {
                return optional($this->bacSiChuyenKhoas->firstWhere('la_chuyen_khoa_chinh', true))->chuyen_khoa_id;
            }),
            'chuyen_khoa' => $this->whenLoaded('bacSiChuyenKhoas', function () {
                return $this->bacSiChuyenKhoas->map(function ($item) {
                    return [
                        'id' => $item->chuyen_khoa_id,
                        'ma_chuyen_khoa' => $item->chuyenKhoa?->ma_chuyen_khoa,
                        'ten_chuyen_khoa' => $item->chuyenKhoa?->ten_chuyen_khoa,
                        'la_chuyen_khoa_chinh' => (bool) $item->la_chuyen_khoa_chinh,
                    ];
                })->values();
            }),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
