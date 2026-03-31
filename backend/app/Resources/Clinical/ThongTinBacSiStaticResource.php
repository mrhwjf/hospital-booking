<?php

namespace App\Resources\Clinical;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ThongTinBacSiStaticResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $doctor = $this->resource['doctor'];
        $specialties = $this->resource['specialties'];

        return [
            'bac_si' => [
                'id' => $doctor->id,
                'ma_bac_si' => $doctor->ma_bac_si,
                'ho_ten' => $doctor->ho_ten,
                'so_dien_thoai' => $doctor->so_dien_thoai,
                'hoc_vi' => $doctor->hoc_vi,
                'chung_chi_hanh_nghe' => $doctor->chung_chi_hanh_nghe,
                'kinh_nghiem' => $doctor->kinh_nghiem,
                'gioi_thieu' => $doctor->gioi_thieu,
                'trang_thai' => $doctor->trang_thai,
            ],
            'chuyen_khoa' => $specialties
                ->filter(fn($specialty) => $specialty->chuyenKhoa !== null)
                ->map(function ($specialty) {
                    return [
                        'id' => $specialty->chuyen_khoa_id,
                        'ma_chuyen_khoa' => $specialty->chuyenKhoa->ma_chuyen_khoa,
                        'ten_chuyen_khoa' => $specialty->chuyenKhoa->ten_chuyen_khoa,
                        'la_chuyen_khoa_chinh' => $specialty->la_chuyen_khoa_chinh,
                    ];
                })
                ->values(),
        ];
    }
}
