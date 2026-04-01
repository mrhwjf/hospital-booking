<?php

namespace App\Resources\Clinical;

use Carbon\Carbon;
use Carbon\CarbonInterface;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ThongTinBacSiWeeklyResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $schedules = $this->resource['schedules'];
        $holidays = $this->resource['holidays'];
        $doctorLeaves = collect($this->resource['doctor_leaves'] ?? []);

        return [
            'lich_lam_viec' => $schedules
                ->map(function ($schedule) {
                    return [
                        'id' => $schedule->id,
                        'bac_si_id' => $schedule->bac_si_id,
                        'lich_lam_viec_id' => $schedule->lich_lam_viec_id,
                        'ngay_lam_viec' => $this->formatDate($schedule->ngay_lam_viec),
                        'trang_thai' => $schedule->trang_thai,
                        'ca_lam_viec' => $schedule->lichLamViec ? [
                            'id' => $schedule->lichLamViec->id,
                            'ma_ca' => $schedule->lichLamViec->ma_ca,
                            'ten_ca' => $schedule->lichLamViec->ten_ca,
                            'thu_trong_tuan' => $schedule->lichLamViec->thu_trong_tuan,
                            'gio_bat_dau' => $this->formatTime($schedule->lichLamViec->gio_bat_dau),
                            'gio_ket_thuc' => $this->formatTime($schedule->lichLamViec->gio_ket_thuc),
                            'thoi_luong_kham' => $schedule->lichLamViec->thoi_luong_kham,
                        ] : null,
                        'phong_kham' => $schedule->phongKham ? [
                            'id' => $schedule->phongKham->id,
                            'ma_phong' => $schedule->phongKham->ma_phong,
                            'ten_phong' => $schedule->phongKham->ten_phong,
                            'vi_tri' => $schedule->phongKham->vi_tri,
                        ] : null,
                    ];
                })
                ->values(),
            'ngay_nghi_le' => $holidays
                ->map(function ($holiday) {
                    return [
                        'id' => $holiday->id,
                        'ten_ngay_nghi' => $holiday->ten_ngay_nghi,
                        'ngay' => $this->formatDate($holiday->ngay),
                        'mo_ta' => $holiday->mo_ta,
                    ];
                })
                ->values(),
            'bac_si_nghi' => $doctorLeaves
                ->map(function ($leave) {
                    return [
                        'id' => $leave->id,
                        'bac_si_id' => $leave->bac_si_id,
                        'ngay' => $this->formatDate($leave->ngay),
                        'gio_bat_dau' => $this->formatTime($leave->gio_bat_dau),
                        'gio_ket_thuc' => $this->formatTime($leave->gio_ket_thuc),
                        'ly_do' => $leave->ly_do,
                        'trang_thai' => $leave->trang_thai,
                    ];
                })
                ->values(),
            'meta' => [
                'week_offset' => $this->resource['week_offset'],
                'week_range' => $this->resource['week_range'],
            ],
        ];
    }

    private function formatDate(?CarbonInterface $date): ?string
    {
        if ($date instanceof CarbonInterface) {
            return $date->toDateString();
        }

        if (is_string($date)) {
            try {
                return Carbon::parse($date)->toDateString();
            } catch (\Throwable) {
                return $date;
            }
        }

        return null;
    }

    private function formatTime(?string $time): ?string
    {
        if ($time === null || $time === '') {
            return null;
        }

        try {
            return Carbon::createFromFormat('H:i:s', $time)->format('H:i');
        } catch (\Throwable) {
            return $time;
        }
    }
}
