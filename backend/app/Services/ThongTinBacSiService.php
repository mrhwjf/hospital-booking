<?php

namespace App\Services;

use App\Models\BacSi;
use App\Models\BacSiNghi;
use App\Models\LichLamViecBacSi;
use App\Models\NgayNghiLe;
use Carbon\Carbon;
use Illuminate\Validation\ValidationException;

class ThongTinBacSiService
{
    private const MAX_WEEK_OFFSET = 52;

    public function getStaticInfo(int $doctorId): array
    {
        $doctor = $this->findDoctorOrFail($doctorId, [
            'bacSiChuyenKhoas.chuyenKhoa:id,ma_chuyen_khoa,ten_chuyen_khoa',
        ]);

        return [
            'doctor' => $doctor,
            'specialties' => $doctor->bacSiChuyenKhoas,
        ];
    }

    public function getWeeklySchedule(int $doctorId, int $weekOffset = 0): array
    {
        [$resolvedOffset, $startOfWeek, $endOfWeek] = $this->buildWeekRange($weekOffset);
        $this->findDoctorOrFail($doctorId);

        $schedules = LichLamViecBacSi::query()
            ->forDoctor($doctorId)
            ->betweenDates($startOfWeek->toDateString(), $endOfWeek->toDateString())
            ->with([
                'lichLamViec:id,ma_ca,ten_ca,thu_trong_tuan,gio_bat_dau,gio_ket_thuc,thoi_luong_kham',
                'phongKham:id,ma_phong,ten_phong,vi_tri',
            ])
            ->orderBy('ngay_lam_viec')
            ->orderBy('lich_lam_viec_id')
            ->get();

        $holidays = NgayNghiLe::query()
            ->where('trang_thai', 'hoat_dong')
            ->whereBetween('ngay', [$startOfWeek->toDateString(), $endOfWeek->toDateString()])
            ->orderBy('ngay')
            ->get(['id', 'ten_ngay_nghi', 'ngay', 'mo_ta']);

        $doctorLeaves = BacSiNghi::query()
            ->where('bac_si_id', $doctorId)
            ->where('trang_thai', 'hoat_dong')
            ->whereBetween('ngay', [$startOfWeek->toDateString(), $endOfWeek->toDateString()])
            ->orderBy('ngay')
            ->get(['id', 'bac_si_id', 'ngay', 'gio_bat_dau', 'gio_ket_thuc', 'ly_do', 'trang_thai']);

        return [
            'schedules' => $schedules,
            'holidays' => $holidays,
            'doctor_leaves' => $doctorLeaves,
            'week_offset' => $resolvedOffset,
            'week_range' => [
                'start' => $startOfWeek->toDateString(),
                'end' => $endOfWeek->toDateString(),
            ],
        ];
    }

    /**
     * @param array<int, string> $relations
     */
    private function findDoctorOrFail(int $doctorId, array $relations = []): BacSi
    {
        $query = BacSi::query();

        if ($relations !== []) {
            $query->with($relations);
        }

        $doctor = $query->find($doctorId);

        if ($doctor === null) {
            throw ValidationException::withMessages([
                'bac_si_id' => ['Không tìm thấy bác sĩ.'],
            ]);
        }

        return $doctor;
    }

    /**
     * @return array{int, Carbon, Carbon}
     */
    private function buildWeekRange(int $weekOffset): array
    {
        $resolvedOffset = max(-self::MAX_WEEK_OFFSET, min($weekOffset, self::MAX_WEEK_OFFSET));

        $startOfWeek = Carbon::now()
            ->addWeeks($resolvedOffset)
            ->startOfWeek(Carbon::MONDAY);

        $endOfWeek = (clone $startOfWeek)->endOfWeek(Carbon::SUNDAY);

        return [$resolvedOffset, $startOfWeek, $endOfWeek];
    }
}
