<?php

namespace App\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class NguoiDungResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                   => $this->id,
            'email'                => $this->email,
            'vai_tro_id'           => $this->vai_tro_id,
            'vai_tro'              => $this->whenLoaded('vaiTro', fn () => $this->vaiTro->ma_vai_tro),
            'ten_vai_tro'          => $this->whenLoaded('vaiTro', fn () => $this->vaiTro->ten_vai_tro),
            'hinh_anh'             => $this->hinh_anh,
            'trang_thai'           => $this->trang_thai,
            'bac_si_id'            => $this->whenLoaded('bacSi', fn () => $this->bacSi?->id),
            'co_ho_so_bac_si'      => $this->whenLoaded('bacSi', fn () => (bool) $this->bacSi),
            'nhan_vien_id'         => $this->whenLoaded('nhanVien', fn () => $this->nhanVien?->id),
            'co_ho_so_nhan_vien'   => $this->whenLoaded('nhanVien', fn () => (bool) $this->nhanVien),
            'lan_dang_nhap_cuoi'   => $this->lan_dang_nhap_cuoi?->toIso8601String(),
            'created_at'           => $this->created_at?->toIso8601String(),
            'updated_at'           => $this->updated_at?->toIso8601String(),
        ];
    }
}
