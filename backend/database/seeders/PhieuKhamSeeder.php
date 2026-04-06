<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PhieuKhamSeeder extends Seeder
{
    public function run(): void
    {
        $users = DB::table('nguoi_dung')->pluck('id', 'email');

        $rows = [];

        $appointment = DB::table('lich_hen')
            ->where('ma_lich_hen', 'LH-20260316-07250012')
            ->first(['id', 'benh_nhan_id', 'bac_si_id']);

        if (!is_null($appointment)) {
            $rows[] = [
                'ma_phieu_kham' => 'PK-20260316-08000032',
                'lich_hen_id' => $appointment->id,
                'benh_nhan_id' => $appointment->benh_nhan_id,
                'bac_si_id' => $appointment->bac_si_id,
                'nguoi_tao_id' => $users['staff1@hospital.local'] ?? $users['staff1@test.local'] ?? null,
                'thoi_gian_tiep_nhan' => now()->subDays(1),
                'mach' => 78,
                'nhiet_do' => 36.8,
                'huyet_ap' => '120/80',
                'can_nang' => 62.5,
                'chieu_cao' => 170,
                'trieu_chung' => 'Đau đầu, mệt mỏi, ho nhẹ.',
                'ket_qua_kham' => 'Tình trạng ổn định, chưa có dấu hiệu nguy hiểm.',
                'chan_doan' => 'Nhiễm trùng đường hô hấp trên cấp.',
                'ma_icd10_chinh' => 'J06.9',
                'tinh_trang' => 'nhe',
                'huong_dieu_tri' => 'Điều trị ngoại trú, theo dõi tại nhà.',
                'loi_dan' => 'Uống đủ nước, nghỉ ngơi, tái khám nếu sốt cao.',
                'hen_tai_kham' => '2026-03-23',
                'ghi_chu_noi_bo' => null,
                'trang_thai' => 'hoan_thanh',
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        $testAppointments = DB::table('lich_hen')
            ->where('ma_lich_hen', 'like', 'LH-T%')
            ->orderBy('ma_lich_hen')
            ->get(['id', 'ma_lich_hen', 'benh_nhan_id', 'bac_si_id', 'trang_thai', 'ngay_hen']);

        foreach ($testAppointments as $index => $testAppointment) {
            preg_match('/^LH-T(\d+)-/', (string) $testAppointment->ma_lich_hen, $matches);
            $testIndex = isset($matches[1]) ? (int) $matches[1] : 1;

            $appointmentDate = Carbon::parse($testAppointment->ngay_hen);
            $isCompleted = in_array($testAppointment->trang_thai, ['da_hoan_tat', 'khong_den'], true);

            $rows[] = [
                'ma_phieu_kham' => sprintf('PK-T%06d', $testAppointment->id),
                'lich_hen_id' => $testAppointment->id,
                'benh_nhan_id' => $testAppointment->benh_nhan_id,
                'bac_si_id' => $testAppointment->bac_si_id,
                'nguoi_tao_id' => $users["staff{$testIndex}@test.local"] ?? $users['staff1@test.local'] ?? null,
                'thoi_gian_tiep_nhan' => $appointmentDate->copy()->setTime(8 + ($index % 3), 15),
                'mach' => 72 + ($index % 8),
                'nhiet_do' => 36.6 + (($index % 4) * 0.1),
                'huyet_ap' => '118/78',
                'can_nang' => 55 + ($index % 12),
                'chieu_cao' => 160 + ($index % 11),
                'trieu_chung' => $isCompleted ? 'Đau họng, mệt mỏi nhẹ.' : null,
                'ket_qua_kham' => $isCompleted ? 'Theo dõi điều trị ngoại trú.' : null,
                'chan_doan' => $isCompleted ? 'Viêm đường hô hấp trên.' : null,
                'ma_icd10_chinh' => $isCompleted ? 'J06.9' : null,
                'tinh_trang' => $isCompleted ? 'nhe' : null,
                'huong_dieu_tri' => $isCompleted ? 'Uống thuốc theo toa và tái khám đúng hẹn.' : null,
                'loi_dan' => $isCompleted ? 'Nghỉ ngơi, uống đủ nước, theo dõi triệu chứng.' : null,
                'hen_tai_kham' => $isCompleted ? $appointmentDate->copy()->addDays(7)->toDateString() : null,
                'ghi_chu_noi_bo' => null,
                'trang_thai' => $isCompleted
                    ? 'hoan_thanh'
                    : ($testAppointment->trang_thai === 'da_xac_nhan' ? 'dang_kham' : 'tiep_nhan'),
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        $rows = array_values(array_filter($rows, fn(array $row) => !is_null($row['lich_hen_id'])));

        if (empty($rows)) {
            return;
        }

        DB::table('phieu_kham')->upsert(
            $rows,
            ['ma_phieu_kham'],
            ['lich_hen_id', 'benh_nhan_id', 'bac_si_id', 'nguoi_tao_id', 'thoi_gian_tiep_nhan', 'mach', 'nhiet_do', 'huyet_ap', 'can_nang', 'chieu_cao', 'trieu_chung', 'ket_qua_kham', 'chan_doan', 'ma_icd10_chinh', 'tinh_trang', 'huong_dieu_tri', 'loi_dan', 'hen_tai_kham', 'ghi_chu_noi_bo', 'trang_thai', 'updated_at']
        );
    }
}
