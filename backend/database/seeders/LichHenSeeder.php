<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LichHenSeeder extends Seeder
{
    public function run(): void
    {
        $benhNhanIds = DB::table('benh_nhan')->orderBy('id')->pluck('id')->values();
        $bacSi = DB::table('bac_si')->pluck('id', 'ma_bac_si');
        $chuyenKhoa = DB::table('chuyen_khoa')->pluck('id', 'ma_chuyen_khoa');
        $lyDoHuy = DB::table('ly_do_huy')->pluck('id', 'ma_ly_do');
        $users = DB::table('nguoi_dung')->pluck('id', 'email');
        $khungGio = DB::table('khung_gio_kham')->orderBy('id')->pluck('id')->values();

        $firstKhungGio = $khungGio[0] ?? null;
        $secondKhungGio = $khungGio[1] ?? $firstKhungGio;

        $rows = [
            [
                'ma_lich_hen' => 'LH-20260316-07250012',
                'benh_nhan_id' => $benhNhanIds[0] ?? null,
                'bac_si_id' => $bacSi['BS-0001'] ?? null,
                'chuyen_khoa_id' => $chuyenKhoa['NOI'] ?? null,
                'khung_gio_id' => $firstKhungGio,
                'ngay_hen' => '2026-03-16',
                'ly_do_kham' => 'Đau đầu, mệt mỏi kéo dài.',
                'trang_thai' => 'da_hoan_tat',
                'nguoi_tao_id' => $users['staff1@hospital.local'] ?? null,
                'gio_den_thuc_te' => '07:25:00',
                'nguoi_tiep_nhan_id' => $users['staff1@hospital.local'] ?? null,
                'ly_do_huy_id' => null,
                'ly_do_huy_khac' => null,
                'ghi_chu' => null,
                'ghi_chu_noi_bo' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'ma_lich_hen' => 'LH-20260316-09300045',
                'benh_nhan_id' => $benhNhanIds[1] ?? ($benhNhanIds[0] ?? null),
                'bac_si_id' => $bacSi['BS-0002'] ?? ($bacSi['BS-0001'] ?? null),
                'chuyen_khoa_id' => $chuyenKhoa['NHI'] ?? null,
                'khung_gio_id' => $secondKhungGio,
                'ngay_hen' => '2026-03-16',
                'ly_do_kham' => 'Kiểm tra sức khỏe định kỳ.',
                'trang_thai' => 'da_huy',
                'nguoi_tao_id' => $users['staff2@hospital.local'] ?? ($users['staff1@hospital.local'] ?? null),
                'gio_den_thuc_te' => null,
                'nguoi_tiep_nhan_id' => null,
                'ly_do_huy_id' => $lyDoHuy['BN_DOI_LICH_KHAM'] ?? null,
                'ly_do_huy_khac' => null,
                'ghi_chu' => null,
                'ghi_chu_noi_bo' => 'Đã liên hệ bệnh nhân để đổi lịch.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        $rows = array_values(array_filter($rows, function (array $row) {
            return
                !is_null($row['benh_nhan_id']) &&
                !is_null($row['bac_si_id']) &&
                !is_null($row['chuyen_khoa_id']) &&
                !is_null($row['khung_gio_id']) &&
                !is_null($row['nguoi_tao_id']);
        }));

        DB::table('lich_hen')->upsert(
            $rows,
            ['ma_lich_hen'],
            ['benh_nhan_id', 'bac_si_id', 'chuyen_khoa_id', 'khung_gio_id', 'ngay_hen', 'ly_do_kham', 'trang_thai', 'nguoi_tao_id', 'gio_den_thuc_te', 'nguoi_tiep_nhan_id', 'ly_do_huy_id', 'ly_do_huy_khac', 'ghi_chu', 'ghi_chu_noi_bo', 'updated_at']
        );
    }
}
