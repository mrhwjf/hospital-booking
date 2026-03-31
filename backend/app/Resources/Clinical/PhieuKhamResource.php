<?php

namespace App\Resources\Clinical;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PhieuKhamResource extends JsonResource
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
            'ma_phieu_kham' => $this->ma_phieu_kham,
            'trang_thai' => $this->trang_thai,
            'thoi_gian_tiep_nhan' => $this->thoi_gian_tiep_nhan ? $this->thoi_gian_tiep_nhan->format('Y-m-d H:i') : null,
            'benh_nhan' => [
                'ma' => $this->benhNhan?->ma_benh_nhan,
                'ten' => $this->benhNhan?->ho_ten,
                'gioi_tinh' => $this->benhNhan?->gioi_tinh,
                'tuoi' => $this->benhNhan ? \Carbon\Carbon::parse($this->benhNhan->ngay_sinh)->age : null,
                'sdt' => $this->benhNhan?->so_dien_thoai,
            ],
            'bac_si' => [
                'ma' => $this->bacSi?->ma_bac_si,
                'ten' => $this->bacSi ? 'BS. ' . $this->bacSi->ho_ten : null,
            ],
            'chan_doan' => $this->chan_doan ?? 'Chưa khám',
            'ma_icd10' => $this->ma_icd10_chinh,
        ];
    }
}
