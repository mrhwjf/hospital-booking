<?php

namespace App\Resources\Reports;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BaoCaoDoanhThuResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'filters' => $this['filters'] ?? [
                'tu_ngay' => null,
                'den_ngay' => null,
                'chuyen_khoa_id' => null,
                'loai_dich_vu' => null,
            ],
            'summary' => $this['summary'] ?? [
                'tongDoanhThu' => 0,
                'tongLuotKham' => 0,
                'doanhThuTrungBinh' => 0,
                'mucTieuThang' => 0,
                'doanhThuThangGanNhat' => 0,
            ],
            'doanhThuTheoChuyenKhoa' => $this['doanhThuTheoChuyenKhoa'] ?? [],
            'xuHuongDoanhThuThang' => $this['xuHuongDoanhThuThang'] ?? [],
            'danhMucChuyenKhoa' => $this['danhMucChuyenKhoa'] ?? [],
        ];
    }
}
