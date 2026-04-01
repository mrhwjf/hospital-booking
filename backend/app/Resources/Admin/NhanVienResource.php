<?php

namespace App\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class NhanVienResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'             => $this->id,
            'ma_nhan_vien'   => $this->ma_nhan_vien,
            'nguoi_dung_id'  => $this->nguoi_dung_id,
            'email'          => $this->whenLoaded('nguoiDung', fn () => $this->nguoiDung->email),
            'hinh_anh'       => $this->whenLoaded('nguoiDung', fn () => $this->nguoiDung->hinh_anh),
            'ho_ten'         => $this->ho_ten,
            'so_dien_thoai'  => $this->so_dien_thoai,
            'chuc_vu'        => $this->chuc_vu,
            'ngay_vao_lam'   => $this->ngay_vao_lam?->format('Y-m-d'),
            'trang_thai'     => $this->trang_thai,
            'ghi_chu'        => $this->ghi_chu,
            'created_at'     => $this->created_at?->toIso8601String(),
            'updated_at'     => $this->updated_at?->toIso8601String(),
        ];
    }
}
