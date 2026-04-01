<?php

namespace App\Http\Resources\Dashboard;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Patient Dashboard Resource
 * 
 * Formats patient dashboard data for API response
 * Maps service data → API response structure
 */
class PatientDashboardResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'patient_info' => [
                'id' => $this['patient_info']['id'],
                'ma_benh_nhan' => $this['patient_info']['ma_benh_nhan'],
                'ho_ten' => $this['patient_info']['ho_ten'],
                'ngay_sinh' => $this['patient_info']['ngay_sinh'],
                'tuoi' => $this['patient_info']['tuoi'],
                'gioi_tinh' => $this['patient_info']['gioi_tinh'],
                'nhom_mau' => $this['patient_info']['nhom_mau'],
                'so_dien_thoai' => $this['patient_info']['so_dien_thoai'],
                'email' => $this['patient_info']['email'],
                'dia_chi' => $this['patient_info']['dia_chi'],
            ],
            'upcoming_appointments' => $this->formatUpcomingAppointments(
                $this['upcoming_appointments']
            ),
            'recent_visit_history' => $this->formatRecentVisitHistory(
                $this['recent_visit_history']
            ),
            'health_profile' => [
                'tien_su_benh' => $this['health_profile']['tien_su_benh'],
                'tien_su_di_ung' => $this['health_profile']['tien_su_di_ung'],
                'nhom_mau' => $this['health_profile']['nhom_mau'],
                'ghi_chu' => $this['health_profile']['ghi_chu'],
                'nguoi_lien_he' => $this['health_profile']['nguoi_lien_he'],
                'sdt_nguoi_lien_he' => $this['health_profile']['sdt_nguoi_lien_he'],
            ],
            'health_reminder' => [
                'title' => $this['health_reminder']['title'],
                'message' => $this['health_reminder']['message'],
                'icon' => $this['health_reminder']['icon'],
            ],
        ];
    }

    /**
     * Format upcoming appointments array
     *
     * @param array $appointments
     * @return array
     */
    private function formatUpcomingAppointments(array $appointments): array
    {
        return array_map(function ($appointment) {
            return [
                'id' => $appointment['id'],
                'ma_lich_hen' => $appointment['ma_lich_hen'],
                'ngay_hen' => $appointment['ngay_hen'],
                'gio_hen' => $appointment['gio_hen'],
                'gio_ket_thuc' => $appointment['gio_ket_thuc'],
                'bac_si' => [
                    'id' => $appointment['bac_si']['id'],
                    'ho_ten' => $appointment['bac_si']['ho_ten'],
                    'ma_bac_si' => $appointment['bac_si']['ma_bac_si'] ?? null,
                ],
                'chuyen_khoa' => [
                    'id' => $appointment['chuyen_khoa']['id'],
                    'ten_chuyen_khoa' => $appointment['chuyen_khoa']['ten_chuyen_khoa'],
                ],
                'phong_kham' => [
                    'id' => $appointment['phong_kham']['id'] ?? null,
                    'ma_phong' => $appointment['phong_kham']['ma_phong'] ?? null,
                    'ten_phong' => $appointment['phong_kham']['ten_phong'] ?? null,
                ],
                'dich_vu' => $appointment['dich_vu'] ?? [],
                'trang_thai' => $appointment['trang_thai'],
                'ly_do_kham' => $appointment['ly_do_kham'],
            ];
        }, $appointments);
    }

    /**
     * Format recent visit history array
     *
     * @param array $visits
     * @return array
     */
    private function formatRecentVisitHistory(array $visits): array
    {
        return array_map(function ($visit) {
            return [
                'id' => $visit['id'],
                'ma_phieu_kham' => $visit['ma_phieu_kham'],
                'ngay_kham' => $visit['ngay_kham'],
                'bac_si' => [
                    'ho_ten' => $visit['bac_si']['ho_ten'],
                    'ma_bac_si' => $visit['bac_si']['ma_bac_si'] ?? null,
                ],
                'chuyen_khoa' => $visit['chuyen_khoa'],
                'dich_vu' => $visit['dich_vu'],
                'chan_doan' => $visit['chan_doan'],
                'trang_thai' => $visit['trang_thai'],
                'ly_do_kham' => $visit['ly_do_kham'],
            ];
        }, $visits);
    }

    /**
     * Get additional data that should be returned with the resource array.
     *
     * @return array<string, mixed>
     */
    public function with(Request $request): array
    {
        return [
            'meta' => [
                'timestamp' => now()->toIso8601String(),
            ],
        ];
    }
}
