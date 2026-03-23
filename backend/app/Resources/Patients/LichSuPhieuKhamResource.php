<?php

namespace App\Resources\Patients;

use Illuminate\Http\Resources\Json\JsonResource;

class LichSuPhieuKhamResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id'                  => $this->id,
            'ma_phieu_kham'       => $this->ma_phieu_kham,
            'bac_si_id'           => $this->bac_si_id,
            'thoi_gian_tiep_nhan' => $this->thoi_gian_tiep_nhan,

            // Chẩn đoán
            'chan_doan'            => $this->chan_doan,
            'ma_icd10_chinh'      => $this->ma_icd10_chinh,
            'tinh_trang'          => $this->tinh_trang,

            // Điều trị
            'huong_dieu_tri'      => $this->huong_dieu_tri,
            'loi_dan'             => $this->loi_dan,
            'hen_tai_kham'        => $this->hen_tai_kham?->toDateString(),

            'trang_thai'          => $this->trang_thai,

            // Quan hệ
            'bac_si' => $this->whenLoaded('bacSi', fn () => [
                'id'           => $this->bacSi->id,
                'ho_ten'       => $this->bacSi->ho_ten,
                'hoc_vi'       => $this->bacSi->hoc_vi,
                'chuyen_khoas' => $this->bacSi->chuyenKhoas
                    ->map(fn ($ck) => [
                        'id'              => $ck->id,
                        'ten_chuyen_khoa' => $ck->ten_chuyen_khoa,
                    ])
                    ->values(),
            ]),
            'lich_hen' => $this->whenLoaded('lichHen', fn () => [
                'id'      => $this->lichHen->id,
                'ngay_hen' => $this->lichHen->ngay_hen?->toDateString(),
            ]),
            'icd10_chinh' => $this->whenLoaded('icd10Chinh', fn () => $this->icd10Chinh ? [
                'ma_icd10'      => $this->icd10Chinh->ma_icd10,
                'ten_chan_doan' => $this->icd10Chinh->ten_chan_doan,
            ] : null),

            'created_at' => $this->created_at,
        ];
    }
}
