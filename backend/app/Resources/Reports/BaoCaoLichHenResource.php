<?php

namespace App\Resources\Reports;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BaoCaoLichHenResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'filters' => $this['filters'] ?? [
                'moc_phan_tich' => null,
                'tu_ngay' => null,
                'den_ngay' => null,
                'chuyen_khoa_id' => null,
            ],
            'lichHenTheoThoiGian' => $this['lichHenTheoThoiGian'] ?? [
                'ngay' => [
                    'daDat' => 0,
                    'daHoanTat' => 0,
                    'daHuy' => 0,
                    'khongDen' => 0,
                    'tongLich' => 0,
                ],
                'tuan' => [
                    'daDat' => 0,
                    'daHoanTat' => 0,
                    'daHuy' => 0,
                    'khongDen' => 0,
                    'tongLich' => 0,
                ],
                'thang' => [
                    'daDat' => 0,
                    'daHoanTat' => 0,
                    'daHuy' => 0,
                    'khongDen' => 0,
                    'tongLich' => 0,
                ],
            ],
            'nhanSuTheoKhoa' => $this['nhanSuTheoKhoa'] ?? [],
            'taiBacSi' => $this['taiBacSi'] ?? [],
            'phanTichTheoKhungGio' => $this['phanTichTheoKhungGio'] ?? [],
            'danhMucChuyenKhoa' => $this['danhMucChuyenKhoa'] ?? [],
        ];
    }
}
