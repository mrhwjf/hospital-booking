<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class KhungGioKhamSeeder extends Seeder
{
    public function run(): void
    {
        $schedules = DB::table('lich_lam_viec_bac_si as llvbs')
            ->join('lich_lam_viec as llv', 'llv.id', '=', 'llvbs.lich_lam_viec_id')
            ->select('llvbs.id', 'llv.gio_bat_dau', 'llv.gio_ket_thuc', 'llv.thoi_luong_kham')
            ->get();

        $rows = [];

        foreach ($schedules as $schedule) {
            $start = Carbon::createFromFormat('H:i:s', $schedule->gio_bat_dau);
            $end = Carbon::createFromFormat('H:i:s', $schedule->gio_ket_thuc);
            $slotMinutes = max(15, (int) ($schedule->thoi_luong_kham ?? 60));

            $slotStart = $start->copy();

            while ($slotStart->copy()->addMinutes($slotMinutes)->lte($end)) {
                $slotEnd = $slotStart->copy()->addMinutes($slotMinutes);

                $rows[] = [
                    'lich_lam_viec_bac_si_id' => $schedule->id,
                    'gio_bat_dau' => $slotStart->format('H:i:s'),
                    'gio_ket_thuc' => $slotEnd->format('H:i:s'),
                    'trang_thai' => 'trong',
                    'created_at' => now(),
                    'updated_at' => now(),
                ];

                $slotStart->addMinutes($slotMinutes);
            }
        }

        if (empty($rows)) {
            return;
        }

        DB::table('khung_gio_kham')->upsert($rows, ['lich_lam_viec_bac_si_id', 'gio_bat_dau'], ['gio_ket_thuc', 'trang_thai', 'updated_at']);
    }
}
