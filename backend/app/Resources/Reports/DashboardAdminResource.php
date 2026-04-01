<?php

namespace App\Resources\Reports;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DashboardAdminResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'moc_phan_tich' => $this['moc_phan_tich'] ?? null,
            'adminKpi' => $this['adminKpi'] ?? [
                'tongTaiKhoan' => 0,
                'benhNhan' => 0,
                'bacSi' => 0,
                'nhanVien' => 0,
                'tangTruongTaiKhoan' => 0,
            ],
            'nhanSuTongQuan' => $this['nhanSuTongQuan'] ?? [
                'tongBacSi' => 0,
                'tongNhanVien' => 0,
                'tongBacSiHoatDong' => 0,
                'tongNhanVienHoatDong' => 0,
                'tyLeBacSiHoatDong' => 0,
                'tyLeNhanVienHoatDong' => 0,
            ],
            'nhanSuTheoKhoa' => $this['nhanSuTheoKhoa'] ?? [],
            'doanhThuTheoChuyenKhoa' => $this['doanhThuTheoChuyenKhoa'] ?? [],
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
            'taiBacSi' => $this['taiBacSi'] ?? [],
        ];
    }
}
