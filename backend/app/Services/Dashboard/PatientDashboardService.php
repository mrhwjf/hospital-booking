<?php

namespace App\Services\Dashboard;

use App\Models\BenhNhan;
use App\Models\LichHen;
use App\Models\PhieuKham;
use Carbon\Carbon;
use Illuminate\Support\Facades\Cache;

class PatientDashboardService
{
    /**
     * Get patient dashboard data
     * Data structure matches Tongquan.jsx frontend
     */
    public function getDashboardData(int $benhNhanId): array
    {
        $cacheKey = "dashboard:patient:{$benhNhanId}";
        
        if (Cache::has($cacheKey)) {
            return Cache::get($cacheKey);
        }

        try {
            $benh_nhan = BenhNhan::findOrFail($benhNhanId);

            $data = [
                'patient_info' => $this->getPatientInfo($benh_nhan),
                'upcoming_appointments' => $this->getUpcomingAppointments($benh_nhan),
                'recent_visit_history' => [], // Temporarily disabled
                'health_profile' => $this->getHealthProfile($benh_nhan),
                'health_reminder' => $this->getHealthReminder(),
            ];

            Cache::put($cacheKey, $data, now()->addMinutes(5));

            return $data;
        } catch (\Exception $e) {
            \Log::error('PatientDashboardService error:', ['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            throw $e;
        }
    }

    /**
     * Thông tin bệnh nhân (Mã BN, nhóm máu, tên)
     */
    private function getPatientInfo(BenhNhan $benh_nhan): array
    {
        return [
            'id' => $benh_nhan->id,
            'ma_benh_nhan' => $benh_nhan->ma_benh_nhan,
            'ho_ten' => $benh_nhan->ho_ten,
            'ngay_sinh' => $benh_nhan->ngay_sinh,
            'tuoi' => $benh_nhan->ngay_sinh ? 
                now()->diffInYears(Carbon::parse($benh_nhan->ngay_sinh)) : null,
            'gioi_tinh' => $benh_nhan->gioi_tinh,
            'nhom_mau' => $benh_nhan->nhom_mau,
            'so_dien_thoai' => $benh_nhan->so_dien_thoai,
            'email' => $benh_nhan->email,
            'dia_chi' => $benh_nhan->dia_chi,
        ];
    }

    /**
     * Lịch hẹn sắp tới (hiện thị 1 hoặc nhiều)
     */
    private function getUpcomingAppointments(BenhNhan $benh_nhan): array
    {
        return $benh_nhan->lichHens()
            ->where('ngay_hen', '>=', now()->toDateString())
            ->where('trang_thai', '!=', 'da_huy')
            ->with(['bac_si', 'chuyen_khoa', 'khung_gio_kham'])
            ->orderBy('ngay_hen')
            ->limit(5)
            ->get()
            ->map(fn ($lh) => [
                'id' => $lh->id,
                'ma_lich_hen' => $lh->ma_lich_hen,
                'ngay_hen' => $lh->ngay_hen,
                'gio_hen' => $lh->khung_gio_kham?->gio_bat_dau,
                'gio_ket_thuc' => $lh->khung_gio_kham?->gio_ket_thuc,
                'bac_si' => [
                    'id' => $lh->bac_si->id,
                    'ho_ten' => $lh->bac_si->ho_ten,
                    'ma_bac_si' => $lh->bac_si->ma_bac_si,
                ],
                'chuyen_khoa' => [
                    'id' => $lh->chuyen_khoa->id,
                    'ten_chuyen_khoa' => $lh->chuyen_khoa->ten_chuyen_khoa,
                ],
                'phong_kham' => $lh->khung_gio_kham?->lich_lam_viec_bac_si?->phong_kham ? [
                    'id' => $lh->khung_gio_kham->lich_lam_viec_bac_si->phong_kham->id,
                    'ma_phong' => $lh->khung_gio_kham->lich_lam_viec_bac_si->phong_kham->ma_phong,
                    'ten_phong' => $lh->khung_gio_kham->lich_lam_viec_bac_si->phong_kham->ten_phong,
                ] : null,
                'dich_vu' => [],
                'trang_thai' => $lh->trang_thai,
                'ly_do_kham' => $lh->ly_do_kham,
            ])
            ->toArray();
    }

    /**
     * Lịch sử khám gần đây (các lần khám đã hoàn thành)
     */
    private function getRecentVisitHistory(BenhNhan $benh_nhan): array
    {
        return $benh_nhan->phieuKhams()
            ->with(['lich_hen', 'bac_si', 'bac_si.bac_si_chuyen_khoa'])
            ->where('trang_thai', '!=', 'tiep_nhan')
            ->orderByDesc('created_at')
            ->limit(10)
            ->get()
            ->map(fn ($pk) => [
                'id' => $pk->id,
                'ma_phieu_kham' => $pk->ma_phieu_kham,
                'ngay_kham' => $pk->lich_hen?->ngay_hen ?? $pk->created_at->toDateString(),
                'bac_si' => [
                    'ho_ten' => $pk->bac_si->ho_ten,
                    'ma_bac_si' => $pk->bac_si->ma_bac_si,
                ],
                'chuyen_khoa' => $pk->bac_si->bac_si_chuyen_khoa()
                    ->where('la_chuyen_khoa_chinh', true)
                    ->with('chuyen_khoa')
                    ->first()?->chuyen_khoa?->ten_chuyen_khoa,
                'dich_vu' => $pk->lich_hen?->dich_vu_lich_hen()
                    ->with('dich_vu', 'goi_kham')
                    ->get()
                    ->map(fn ($d) => $d->dich_vu?->ten_dich_vu ?? $d->goi_kham?->ten_goi_kham)
                    ->implode(', '),
                'chan_doan' => $pk->chan_doan,
                'trang_thai' => $pk->trang_thai,
                'ly_do_kham' => $pk->lich_hen?->ly_do_kham,
            ])
            ->toArray();
    }

    /**
     * Hồ sơ sức khỏe (Tiền sử bệnh, dị ứng, ...)
     */
    private function getHealthProfile(BenhNhan $benh_nhan): array
    {
        return [
            'tien_su_benh' => $benh_nhan->tien_su_benh,
            'tien_su_di_ung' => $benh_nhan->tien_su_di_ung,
            'nhom_mau' => $benh_nhan->nhom_mau,
            'ghi_chu' => $benh_nhan->ghi_chu,
            'nguoi_lien_he' => $benh_nhan->nguoi_lien_he,
            'sdt_nguoi_lien_he' => $benh_nhan->sdt_nguoi_lien_he,
        ];
    }

    /**
     * Nhắc nhở sức khỏe (Tạm để cứng, có thể lấy từ config sau)
     */
    private function getHealthReminder(): array
    {
        return [
            'title' => 'Nhắc nhở sức khỏe',
            'message' => 'Uống ít nhất 2 lít nước mỗi ngày và đừng quên kiểm tra sức khỏe định kỳ.',
            'icon' => 'heart_check_fill',
        ];
    }
}
