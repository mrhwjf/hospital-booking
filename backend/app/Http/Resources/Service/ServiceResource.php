<?php

namespace App\Http\Resources\Service;

use App\Models\DichVu;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ServiceResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $fullDescription = trim((string) ($this->resource->mo_ta ?? ''));
        $lines = preg_split('/\r\n|\r|\n/', $fullDescription) ?: [];
        $lines = array_values(array_filter(array_map('trim', $lines), fn (string $line): bool => $line !== ''));

        $shortLines = array_slice($lines, 0, 3);
        $descriptionShort = implode(PHP_EOL, $shortLines);

        if (count($lines) > 3) {
            $descriptionShort .= '...';
        }

        $primarySpecialty = $this->resource->dichVus
            ->firstWhere('chuyenKhoa.id', '!=', null)?->chuyenKhoa
            ?? $this->resource->dichVus->first()?->chuyenKhoa;

        $specialties = $this->resource->dichVus
            ->map(function (DichVu $dichVu): array {
                return [
                    'id' => $dichVu->chuyenKhoa?->id,
                    'name' => $dichVu->chuyenKhoa?->ten_chuyen_khoa,
                    'description' => $dichVu->chuyenKhoa?->mo_ta,
                    'location' => $dichVu->chuyenKhoa?->vi_tri,
                    'phone' => $dichVu->chuyenKhoa?->so_dien_thoai,
                ];
            })
            ->filter(fn (array $item): bool => !empty($item['id']) && !empty($item['name']))
            ->unique('id')
            ->values();

        $includedServices = $this->resource->dichVus
            ->map(function (DichVu $dichVu): array {
                return [
                    'id' => $dichVu->id,
                    'code' => $dichVu->ma_dich_vu,
                    'name' => $dichVu->ten_dich_vu,
                    'description' => $dichVu->mo_ta,
                    'price' => $dichVu->gia_dich_vu !== null ? (float) $dichVu->gia_dich_vu : null,
                    'duration' => $dichVu->thoi_gian_du_kien,
                    'service_type' => $dichVu->loai_dich_vu,
                    'special_requirement' => $dichVu->yeu_cau_dac_biet,
                    'status' => $dichVu->trang_thai,
                    'specialty' => [
                        'id' => $dichVu->chuyenKhoa?->id,
                        'name' => $dichVu->chuyenKhoa?->ten_chuyen_khoa,
                    ],
                ];
            })
            ->values();

        $requirements = $includedServices
            ->pluck('special_requirement')
            ->filter(fn (?string $item): bool => !empty($item))
            ->unique()
            ->values();

        $servicePrices = $includedServices
            ->pluck('price')
            ->filter(fn (?float $item): bool => $item !== null)
            ->values();

        $totalDuration = $includedServices
            ->pluck('duration')
            ->filter(fn (?int $item): bool => $item !== null)
            ->sum();

        $statusMap = [
            'hoat_dong' => 'Đang hoạt động',
            'tam_ngung' => 'Tạm ngưng',
        ];

        return [
            'id' => $this->resource->id,
            'code' => $this->resource->ma_goi_kham,
            'name' => $this->resource->ten_goi_kham,
            'status' => $this->resource->trang_thai,
            'status_label' => $statusMap[$this->resource->trang_thai] ?? $this->resource->trang_thai,
            'specialty_id' => $primarySpecialty?->id,
            'specialty_name' => $primarySpecialty?->ten_chuyen_khoa,
            'specialties' => $specialties,
            'description_short' => $descriptionShort,
            'description_full' => $fullDescription,
            'price' => (float) $this->resource->gia_goi_kham,
            'duration' => $this->resource->thoi_gian_du_kien,
            'included_services' => $includedServices,
            'requirements' => $requirements,
            'stats' => [
                'specialty_count' => $specialties->count(),
                'included_service_count' => $includedServices->count(),
                'total_included_services_price' => $servicePrices->sum(),
                'min_included_service_price' => $servicePrices->count() ? $servicePrices->min() : null,
                'max_included_service_price' => $servicePrices->count() ? $servicePrices->max() : null,
                'total_estimated_duration' => $totalDuration ?: null,
            ],
            'doctor_id' => null,
            'doctor_name' => null,
        ];
    }
}
