<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LichHenSeeder extends Seeder
{
    public function run(): void
    {
        $benhNhan = DB::table('benh_nhan')->pluck('id', 'ma_benh_nhan');
        $bacSi = DB::table('bac_si')->pluck('id', 'ma_bac_si');
        $chuyenKhoa = DB::table('chuyen_khoa')->pluck('id', 'ma_chuyen_khoa');
        $lyDoHuy = DB::table('ly_do_huy')->pluck('id', 'ma_ly_do');
        $users = DB::table('nguoi_dung')->pluck('id', 'email');
        $khungGio = DB::table('khung_gio_kham')->orderBy('id')->pluck('id')->values();

        DB::table('lich_hen')->upsert([
            [
                'ma_lich_hen' => 'LH0001',
                'benh_nhan_id' => $benhNhan['BN0001'] ?? null,
                'bac_si_id' => $bacSi['BS0001'] ?? null,
                'chuyen_khoa_id' => $chuyenKhoa['NOI'] ?? null,
                'khung_gio_id' => $khungGio[0] ?? null,
                'ngay_hen' => '2026-03-16',
                'ly_do_kham' => 'Dau dau, met moi keo dai.',
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
                'ma_lich_hen' => 'LH0002',
                'benh_nhan_id' => $benhNhan['BN0002'] ?? null,
                'bac_si_id' => $bacSi['BS0002'] ?? null,
                'chuyen_khoa_id' => $chuyenKhoa['NHI'] ?? null,
                'khung_gio_id' => $khungGio[1] ?? null,
                'ngay_hen' => '2026-03-16',
                'ly_do_kham' => 'Kiem tra dinh ky.',
                'trang_thai' => 'da_huy',
                'nguoi_tao_id' => $users['staff2@hospital.local'] ?? null,
                'gio_den_thuc_te' => null,
                'nguoi_tiep_nhan_id' => null,
                'ly_do_huy_id' => $lyDoHuy['BN_DOI_LICH'] ?? null,
                'ly_do_huy_khac' => null,
                'ghi_chu' => null,
                'ghi_chu_noi_bo' => 'Da lien he benh nhan.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ], ['ma_lich_hen'], ['benh_nhan_id', 'bac_si_id', 'chuyen_khoa_id', 'khung_gio_id', 'ngay_hen', 'ly_do_kham', 'trang_thai', 'nguoi_tao_id', 'gio_den_thuc_te', 'nguoi_tiep_nhan_id', 'ly_do_huy_id', 'ly_do_huy_khac', 'ghi_chu', 'ghi_chu_noi_bo', 'updated_at']);
    }
}
