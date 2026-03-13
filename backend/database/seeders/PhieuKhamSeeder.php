<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PhieuKhamSeeder extends Seeder
{
    public function run(): void
    {
        $lichHen = DB::table('lich_hen')->pluck('id', 'ma_lich_hen');
        $benhNhan = DB::table('benh_nhan')->pluck('id', 'ma_benh_nhan');
        $bacSi = DB::table('bac_si')->pluck('id', 'ma_bac_si');
        $users = DB::table('nguoi_dung')->pluck('id', 'email');

        DB::table('phieu_kham')->upsert([
            [
                'ma_phieu_kham' => 'PK0001',
                'lich_hen_id' => $lichHen['LH0001'] ?? null,
                'benh_nhan_id' => $benhNhan['BN0001'] ?? null,
                'bac_si_id' => $bacSi['BS0001'] ?? null,
                'nguoi_tao_id' => $users['doctor1@hospital.local'] ?? null,
                'thoi_gian_tiep_nhan' => now()->subDays(1),
                'mach' => 78,
                'nhiet_do' => 36.8,
                'huyet_ap' => '120/80',
                'can_nang' => 62.5,
                'chieu_cao' => 170,
                'trieu_chung' => 'Dau dau, met moi, ho nhe.',
                'ket_qua_kham' => 'Tinh trang on dinh, chua co dau hieu nguy hiem.',
                'chan_doan' => 'Nhiem trung duong ho hap tren cap.',
                'ma_icd10_chinh' => 'J06.9',
                'tinh_trang' => 'nhe',
                'huong_dieu_tri' => 'Dieu tri ngoai tru, theo doi tai nha.',
                'loi_dan' => 'Uong du nuoc, nghi ngoi, tai kham neu sot cao.',
                'hen_tai_kham' => '2026-03-23',
                'ghi_chu_noi_bo' => null,
                'trang_thai' => 'hoan_thanh',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ], ['ma_phieu_kham'], ['lich_hen_id', 'benh_nhan_id', 'bac_si_id', 'nguoi_tao_id', 'thoi_gian_tiep_nhan', 'mach', 'nhiet_do', 'huyet_ap', 'can_nang', 'chieu_cao', 'trieu_chung', 'ket_qua_kham', 'chan_doan', 'ma_icd10_chinh', 'tinh_trang', 'huong_dieu_tri', 'loi_dan', 'hen_tai_kham', 'ghi_chu_noi_bo', 'trang_thai', 'updated_at']);
    }
}
