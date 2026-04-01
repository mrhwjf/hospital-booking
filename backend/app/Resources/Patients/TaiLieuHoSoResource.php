<?php

namespace App\Resources\Patients;

use Illuminate\Http\Resources\Json\JsonResource;

class TaiLieuHoSoResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'ma_tai_lieu' => $this->ma_tai_lieu,
            'phieu_kham_id' => $this->phieu_kham_id,
            'loai_tai_lieu' => $this->loai_tai_lieu,
            'ten_tai_lieu' => $this->ten_tai_lieu,
            'file_public_id' => $this->file_public_id,
            'ngay_tao' => $this->ngay_tao?->toDateString(),
            'ghi_chu' => $this->ghi_chu,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,

            'phieu_kham' => $this->whenLoaded('phieuKham', fn() => [
                'id' => $this->phieuKham->id,
                'ma_phieu_kham' => $this->phieuKham->ma_phieu_kham,
                'chan_doan' => $this->phieuKham->chan_doan,
                'thoi_gian_tiep_nhan' => $this->phieuKham->thoi_gian_tiep_nhan,
            ]),

            'benh_nhan' => $this->whenLoaded('phieuKham', fn() => $this->phieuKham->benhNhan ? [
                'id' => $this->phieuKham->benhNhan->id,
                'ma_benh_nhan' => $this->phieuKham->benhNhan->ma_benh_nhan,
                'ho_ten' => $this->phieuKham->benhNhan->ho_ten,
            ] : null),
        ];
    }
}
