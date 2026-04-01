<?php

namespace App\Http\Resources\Doctor;

use App\Models\BacSiChuyenKhoa;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DoctorResource extends JsonResource
{
    private ?string $hospitalName = null;

    public function withHospitalName(?string $hospitalName): self
    {
        $this->hospitalName = $hospitalName;

        return $this;
    }

    public function toArray(Request $request): array
    {
        $mainSpecialty = $this->resource->bacSiChuyenKhoas
            ->firstWhere('la_chuyen_khoa_chinh', true)
            ?? $this->resource->bacSiChuyenKhoas->first();

        $specialties = $this->resource->bacSiChuyenKhoas
            ->map(function (BacSiChuyenKhoa $item): array {
                return [
                    'id' => $item->chuyenKhoa?->id,
                    'name' => $item->chuyenKhoa?->ten_chuyen_khoa,
                    'description' => $item->chuyenKhoa?->mo_ta,
                    'location' => $item->chuyenKhoa?->vi_tri,
                    'phone' => $item->chuyenKhoa?->so_dien_thoai,
                    'is_main' => (bool) $item->la_chuyen_khoa_chinh,
                ];
            })
            ->filter(fn (array $item): bool => !empty($item['id']) && !empty($item['name']))
            ->values();

        $statusMap = [
            'hoat_dong' => 'Đang hoạt động',
            'tam_nghi' => 'Tạm nghỉ',
            'nghi_viec' => 'Đã nghỉ việc',
        ];

        return [
            'id' => $this->resource->id,
            'code' => $this->resource->ma_bac_si,
            'name' => $this->resource->ho_ten,
            'avatar' => $this->resource->nguoiDung?->hinh_anh,
            'email' => $this->resource->nguoiDung?->email,
            'phone' => $this->resource->so_dien_thoai,
            'degree' => $this->resource->hoc_vi,
            'practice_certificate' => $this->resource->chung_chi_hanh_nghe,
            'status' => $this->resource->trang_thai,
            'status_label' => $statusMap[$this->resource->trang_thai] ?? $this->resource->trang_thai,
            'specialty' => $mainSpecialty?->chuyenKhoa?->ten_chuyen_khoa,
            'specialty_id' => $mainSpecialty?->chuyenKhoa?->id,
            'specialty_details' => [
                'id' => $mainSpecialty?->chuyenKhoa?->id,
                'name' => $mainSpecialty?->chuyenKhoa?->ten_chuyen_khoa,
                'description' => $mainSpecialty?->chuyenKhoa?->mo_ta,
                'location' => $mainSpecialty?->chuyenKhoa?->vi_tri,
                'phone' => $mainSpecialty?->chuyenKhoa?->so_dien_thoai,
            ],
            'specialties' => $specialties,
            'experience' => $this->resource->kinh_nghiem,
            'description' => $this->resource->gioi_thieu,
            'hospital_clinic' => $this->hospitalName,
            'rating' => null,
            'stats' => [
                'specialty_count' => $specialties->count(),
                'years_experience' => $this->resource->kinh_nghiem,
            ],
        ];
    }
}
