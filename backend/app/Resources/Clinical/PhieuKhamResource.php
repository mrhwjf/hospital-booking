<?php

namespace App\Resources\Clinical;

use Illuminate\Http\Resources\Json\JsonResource;

class PhieuKhamResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id'                  => $this->id,
            'ma_phieu_kham'       => $this->ma_phieu_kham,
            'lich_hen_id'         => $this->lich_hen_id,
            'benh_nhan_id'        => $this->benh_nhan_id,
            'bac_si_id'           => $this->bac_si_id,
            'nguoi_tao_id'        => $this->nguoi_tao_id,
            'thoi_gian_tiep_nhan' => $this->thoi_gian_tiep_nhan,

            // Sinh hiệu
            'mach'                => $this->mach,
            'nhiet_do'            => $this->nhiet_do,
            'huyet_ap'            => $this->huyet_ap,
            'can_nang'            => $this->can_nang,
            'chieu_cao'           => $this->chieu_cao,

            // Lâm sàng
            'trieu_chung'         => $this->trieu_chung,
            'ket_qua_kham'        => $this->ket_qua_kham,
            'chan_doan'            => $this->chan_doan,
            'ma_icd10_chinh'      => $this->ma_icd10_chinh,
            'tinh_trang'          => $this->tinh_trang,

            // Điều trị / dặn dò
            'huong_dieu_tri'      => $this->huong_dieu_tri,
            'loi_dan'             => $this->loi_dan,
            'hen_tai_kham'        => $this->hen_tai_kham?->toDateString(),
            'ghi_chu_noi_bo'      => $this->ghi_chu_noi_bo,

            'trang_thai'          => $this->trang_thai,

            // Quan hệ (chỉ xuất khi đã được load)
            'benh_nhan'           => $this->whenLoaded('benhNhan'),
            'bac_si'              => $this->whenLoaded('bacSi'),
            'nguoi_tao'           => $this->whenLoaded('nguoiTao'),
            'icd10_chinh'         => $this->whenLoaded('icd10Chinh'),
            'lich_hen'            => $this->whenLoaded('lichHen'),
        ];
    }
}
