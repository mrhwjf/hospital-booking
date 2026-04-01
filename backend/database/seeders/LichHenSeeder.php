<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LichHenSeeder extends Seeder
{
    public function run(): void
    {
        $benhNhanIds = DB::table('benh_nhan')->orderBy('id')->pluck('id')->values();
        $bacSiIds = DB::table('bac_si')->orderBy('id')->pluck('id')->values();
        $chuyenKhoaTheoBacSi = DB::table('bac_si_chuyen_khoa')
            ->where('la_chuyen_khoa_chinh', true)
            ->pluck('chuyen_khoa_id', 'bac_si_id');
        $adminId = DB::table('nguoi_dung')->where('email', 'admin@hospital.local')->value('id');
        $lyDoHuyId = DB::table('ly_do_huy')->orderBy('id')->value('id');

        if ($benhNhanIds->isEmpty() || $bacSiIds->isEmpty() || $chuyenKhoaTheoBacSi->isEmpty()) {
            return;
        }

        $rows = [];
        for ($i = 1; $i <= 72; $i++) {
            $bacSiId = $bacSiIds[($i - 1) % $bacSiIds->count()];
            $benhNhanId = $benhNhanIds[($i - 1) % $benhNhanIds->count()];
            $chuyenKhoaId = (int) ($chuyenKhoaTheoBacSi[$bacSiId] ?? 0);

            if ($chuyenKhoaId === 0) {
                continue;
            }

            // Keep sample data around current date so dashboard and monthly reports always have values.
            $ngayHen = Carbon::today()->subDays(45)->addDays($i);
            $soNgayLech = Carbon::today()->diffInDays($ngayHen, false);
            $status = match (true) {
                $soNgayLech <= -3 => ['da_hoan_tat', 'da_hoan_tat', 'da_thanh_toan', 'da_huy', 'khong_den'][($i - 1) % 5],
                $soNgayLech <= 1 => ['da_xac_nhan', 'dang_cho', 'da_thanh_toan', 'da_hoan_tat'][($i - 1) % 4],
                default => $i % 9 === 0 ? 'da_hoan_tat' : ['da_xac_nhan', 'dang_cho', 'dang_cho'][($i - 1) % 3],
            };

            $rows[] = [
                'ma_lich_hen' => 'LH' . str_pad((string) $i, 6, '0', STR_PAD_LEFT),
                'benh_nhan_id' => $benhNhanId,
                'bac_si_id' => $bacSiId,
                'chuyen_khoa_id' => $chuyenKhoaId,
                'khung_gio_id' => null,
                'ngay_hen' => $ngayHen->toDateString(),
                'ly_do_kham' => 'Kham dinh ky du lieu mau.',
                'trang_thai' => $status,
                'nguoi_tao_id' => $adminId,
                'gio_den_thuc_te' => $status === 'da_hoan_tat' ? '08:30:00' : null,
                'nguoi_tiep_nhan_id' => $adminId,
                'ly_do_huy_id' => $status === 'da_huy' ? $lyDoHuyId : null,
                'ly_do_huy_khac' => null,
                'ghi_chu' => null,
                'ghi_chu_noi_bo' => null,
                'created_at' => $ngayHen->copy()->subDays(2)->setTime(7 + ($i % 12), 0, 0),
                'updated_at' => $ngayHen->copy()->subDay()->setTime(7 + ($i % 12), 0, 0),
            ];
        }

        DB::table('lich_hen')->upsert(
            $rows,
            ['ma_lich_hen'],
            [
                'benh_nhan_id',
                'bac_si_id',
                'chuyen_khoa_id',
                'khung_gio_id',
                'ngay_hen',
                'ly_do_kham',
                'trang_thai',
                'nguoi_tao_id',
                'gio_den_thuc_te',
                'nguoi_tiep_nhan_id',
                'ly_do_huy_id',
                'ly_do_huy_khac',
                'ghi_chu',
                'ghi_chu_noi_bo',
                'updated_at',
            ]
        );
    }
}
