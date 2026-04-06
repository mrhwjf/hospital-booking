<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LichHenSeeder extends Seeder
{
    public function run(): void
    {
        $benhNhanIds = DB::table('benh_nhan')->orderBy('id')->pluck('id')->values()->all();
        $testPatientIdsByEmail = DB::table('benh_nhan as bn')
            ->join('nguoi_dung as nd', 'nd.id', '=', 'bn.nguoi_dung_id')
            ->whereIn('nd.email', ['patient1@test.local', 'patient2@test.local'])
            ->pluck('bn.id', 'nd.email');

        $testPatientIds = array_map('intval', $testPatientIdsByEmail->values()->all());

        $regularBenhNhanIds = array_values(array_filter(
            $benhNhanIds,
            fn($benhNhanId) => !in_array((int) $benhNhanId, $testPatientIds, true)
        ));
        $genericPatientIds = !empty($regularBenhNhanIds) ? $regularBenhNhanIds : $benhNhanIds;

        $staffUserIds = DB::table('nguoi_dung as nd')
            ->join('vai_tro as vt', 'vt.id', '=', 'nd.vai_tro_id')
            ->where('vt.ma_vai_tro', 'NHANVIEN')
            ->orderBy('nd.id')
            ->pluck('nd.id')
            ->values()
            ->all();

        $testDoctorIdsByEmail = DB::table('bac_si as bs')
            ->join('nguoi_dung as nd', 'nd.id', '=', 'bs.nguoi_dung_id')
            ->whereIn('nd.email', ['doctor1@test.local', 'doctor2@test.local'])
            ->pluck('bs.id', 'nd.email');

        $testStaffUserIdsByEmail = DB::table('nguoi_dung')
            ->whereIn('email', ['staff1@test.local', 'staff2@test.local'])
            ->pluck('id', 'email');

        $defaultChuyenKhoaId = DB::table('chuyen_khoa')->orderBy('id')->value('id');
        $chuyenKhoaByBacSi = DB::table('bac_si_chuyen_khoa')
            ->select('bac_si_id', 'chuyen_khoa_id')
            ->orderBy('id')
            ->get()
            ->groupBy('bac_si_id')
            ->map(fn($items) => $items->pluck('chuyen_khoa_id')->values()->all());

        $lyDoHuyMap = DB::table('ly_do_huy')->pluck('id', 'ma_ly_do');
        $lyDoHuyIds = array_values(array_filter([
            $lyDoHuyMap['BN_DOI_LICH_KHAM'] ?? null,
            $lyDoHuyMap['BN_BAN_DOT_XUAT'] ?? null,
            $lyDoHuyMap['HT_SU_CO_KET_NOI'] ?? null,
            $lyDoHuyMap['NV_TRUNG_LICH_TN'] ?? null,
        ]));

        $slots = DB::table('khung_gio_kham as kgk')
            ->join('lich_lam_viec_bac_si as llvbs', 'llvbs.id', '=', 'kgk.lich_lam_viec_bac_si_id')
            ->select([
                'kgk.id as khung_gio_id',
                'kgk.gio_bat_dau',
                'llvbs.ngay_lam_viec as ngay_hen',
                'llvbs.bac_si_id',
            ])
            ->orderBy('llvbs.ngay_lam_viec')
            ->orderBy('kgk.gio_bat_dau')
            ->orderBy('kgk.id')
            ->get();

        if (empty($genericPatientIds) || empty($staffUserIds) || $slots->isEmpty() || is_null($defaultChuyenKhoaId)) {
            return;
        }

        $reasons = [
            'Đau đầu, mệt mỏi kéo dài.',
            'Khám sức khỏe định kỳ.',
            'Đau họng, ho khan nhiều ngày.',
            'Tái khám theo chỉ định của bác sĩ.',
            'Đau bụng âm ỉ sau ăn.',
            'Khó thở nhẹ khi vận động.',
            'Theo dõi huyết áp và đường huyết.',
            'Nổi mẩn ngứa, dị ứng da.',
            'Đau lưng và mỏi cổ vai gáy.',
            'Mất ngủ kéo dài, cần tư vấn chuyên khoa.',
        ];

        $statusPattern = ['da_hoan_tat', 'da_xac_nhan', 'dang_cho', 'da_huy', 'khong_den'];
        $targetCount = 50;

        $rows = [];

        for ($index = 0; $index < $targetCount; $index++) {
            $slot = $slots[$index % $slots->count()];
            $benhNhanId = $genericPatientIds[$index % count($genericPatientIds)];
            $nguoiTaoId = $staffUserIds[$index % count($staffUserIds)];
            $nguoiTiepNhanId = $staffUserIds[($index + 1) % count($staffUserIds)];

            $chuyenKhoaCandidates = $chuyenKhoaByBacSi[$slot->bac_si_id] ?? [];
            $chuyenKhoaId = !empty($chuyenKhoaCandidates)
                ? $chuyenKhoaCandidates[$index % count($chuyenKhoaCandidates)]
                : $defaultChuyenKhoaId;

            $status = $statusPattern[$index % count($statusPattern)];

            $maLichHen = sprintf(
                'LH-%s-%s%03d',
                str_replace('-', '', $slot->ngay_hen),
                str_replace(':', '', $slot->gio_bat_dau),
                $index + 1
            );

            if ($index === 0) {
                $maLichHen = 'LH-20260316-07250012';
                $status = 'da_hoan_tat';
            }

            if ($index === 1) {
                $maLichHen = 'LH-20260316-09300045';
                $status = 'da_huy';
            }

            $gioDenThucTe = null;
            if ($status === 'da_hoan_tat') {
                $gioDenThucTe = Carbon::createFromFormat('H:i:s', $slot->gio_bat_dau)
                    ->subMinutes(($index % 10) + 5)
                    ->format('H:i:s');
            }

            $lyDoHuyId = $status === 'da_huy' && !empty($lyDoHuyIds)
                ? $lyDoHuyIds[$index % count($lyDoHuyIds)]
                : null;

            $createdAt = Carbon::parse($slot->ngay_hen)
                ->subDays(7 + ($index % 15))
                ->setTime(8, 0)
                ->format('Y-m-d H:i:s');

            $rows[] = [
                'ma_lich_hen' => $maLichHen,
                'benh_nhan_id' => $benhNhanId,
                'bac_si_id' => $slot->bac_si_id,
                'chuyen_khoa_id' => $chuyenKhoaId,
                'khung_gio_id' => $slot->khung_gio_id,
                'ngay_hen' => $index < 2 ? '2026-03-16' : $slot->ngay_hen,
                'ly_do_kham' => $reasons[$index % count($reasons)],
                'trang_thai' => $status,
                'nguoi_tao_id' => $nguoiTaoId,
                'gio_den_thuc_te' => $gioDenThucTe,
                'nguoi_tiep_nhan_id' => in_array($status, ['da_hoan_tat', 'khong_den'], true) ? $nguoiTiepNhanId : null,
                'ly_do_huy_id' => $lyDoHuyId,
                'ly_do_huy_khac' => $status === 'da_huy' ? 'Điều chỉnh lịch khám theo tình huống thực tế.' : null,
                'ghi_chu' => $index % 9 === 0 ? 'Bệnh nhân cần hỗ trợ ưu tiên khi tiếp nhận.' : null,
                'ghi_chu_noi_bo' => $status === 'da_huy'
                    ? 'Đã liên hệ bệnh nhân và xác nhận phương án hủy lịch.'
                    : ($status === 'khong_den' ? 'Bệnh nhân không đến theo lịch hẹn.' : null),
                'created_at' => $createdAt,
                'updated_at' => now(),
            ];
        }

        $slotsByDoctor = $slots->groupBy('bac_si_id');
        $testStatuses = ['da_hoan_tat', 'da_xac_nhan', 'dang_cho', 'da_hoan_tat', 'khong_den'];

        foreach ([1, 2] as $testIndex) {
            $testPatientEmail = "patient{$testIndex}@test.local";
            $testDoctorEmail = "doctor{$testIndex}@test.local";
            $testStaffEmail = "staff{$testIndex}@test.local";

            $benhNhanId = $testPatientIdsByEmail[$testPatientEmail] ?? null;
            $bacSiId = $testDoctorIdsByEmail[$testDoctorEmail] ?? null;
            $nguoiTaoId = $testStaffUserIdsByEmail[$testStaffEmail] ?? ($staffUserIds[0] ?? null);
            $nguoiTiepNhanId = $testStaffUserIdsByEmail[$testStaffEmail] ?? null;

            if (is_null($benhNhanId) || is_null($bacSiId) || is_null($nguoiTaoId)) {
                continue;
            }

            $doctorSlots = ($slotsByDoctor[$bacSiId] ?? collect())->values();

            if ($doctorSlots->isEmpty()) {
                continue;
            }

            $chuyenKhoaCandidates = $chuyenKhoaByBacSi[$bacSiId] ?? [];
            $chuyenKhoaId = !empty($chuyenKhoaCandidates)
                ? $chuyenKhoaCandidates[0]
                : $defaultChuyenKhoaId;

            foreach (range(0, 4) as $slotOffset) {
                $slot = $doctorSlots[$slotOffset % $doctorSlots->count()];
                $status = $testStatuses[$slotOffset % count($testStatuses)];

                $gioDenThucTe = null;
                if ($status === 'da_hoan_tat') {
                    $gioDenThucTe = Carbon::createFromFormat('H:i:s', $slot->gio_bat_dau)
                        ->subMinutes(8)
                        ->format('H:i:s');
                }

                $createdAt = Carbon::parse($slot->ngay_hen)
                    ->subDays(2 + $slotOffset)
                    ->setTime(9, 0)
                    ->format('Y-m-d H:i:s');

                $rows[] = [
                    'ma_lich_hen' => sprintf('LH-T%d-%04d', $testIndex, $slotOffset + 1),
                    'benh_nhan_id' => $benhNhanId,
                    'bac_si_id' => $bacSiId,
                    'chuyen_khoa_id' => $chuyenKhoaId,
                    'khung_gio_id' => $slot->khung_gio_id,
                    'ngay_hen' => $slot->ngay_hen,
                    'ly_do_kham' => 'Khám theo dõi định kỳ cho tài khoản kiểm thử.',
                    'trang_thai' => $status,
                    'nguoi_tao_id' => $nguoiTaoId,
                    'gio_den_thuc_te' => $gioDenThucTe,
                    'nguoi_tiep_nhan_id' => in_array($status, ['da_hoan_tat', 'khong_den'], true) ? $nguoiTiepNhanId : null,
                    'ly_do_huy_id' => null,
                    'ly_do_huy_khac' => null,
                    'ghi_chu' => 'Dữ liệu kiểm thử doctor portal.',
                    'ghi_chu_noi_bo' => null,
                    'created_at' => $createdAt,
                    'updated_at' => now(),
                ];
            }
        }

        $rows = array_values(array_filter(
            $rows,
            fn(array $row) =>
            !is_null($row['benh_nhan_id']) &&
            !is_null($row['bac_si_id']) &&
            !is_null($row['chuyen_khoa_id']) &&
            !is_null($row['khung_gio_id']) &&
            !is_null($row['nguoi_tao_id'])
        ));

        if (empty($rows)) {
            return;
        }

        DB::table('lich_hen')->upsert(
            $rows,
            ['ma_lich_hen'],
            ['benh_nhan_id', 'bac_si_id', 'chuyen_khoa_id', 'khung_gio_id', 'ngay_hen', 'ly_do_kham', 'trang_thai', 'nguoi_tao_id', 'gio_den_thuc_te', 'nguoi_tiep_nhan_id', 'ly_do_huy_id', 'ly_do_huy_khac', 'ghi_chu', 'ghi_chu_noi_bo', 'updated_at']
        );
    }
}
