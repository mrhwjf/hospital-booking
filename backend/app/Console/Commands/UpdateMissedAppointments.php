<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\LichHen;
use Carbon\Carbon;

class UpdateMissedAppointments extends Command
{
    protected $signature = 'appointments:check-missed';
    protected $description = 'Mark appointments as khong_den if current time is after end time';

    public function handle()
    {
        $now = Carbon::now();

        // Get the appointments that will be updated
        $appointments = LichHen::where('trang_thai', 'dang_cho')
            ->whereHas('khungGioKham', function ($query) use ($now) {
                $query->whereTime('gio_ket_thuc', '<', $now->format('H:i:s'));
            })
            ->get();

        $count = $appointments->count();

        if ($count > 0) {
            // Update them
            LichHen::whereIn('id', $appointments->pluck('id'))->update(['trang_thai' => 'khong_den']);

            $this->info("Missed appointments updated: {$count}");
            $this->line("Affected appointments:");
            foreach ($appointments as $a) {
                $this->line("- {$a->ma_lich_hen}");
            }
        } else {
            $this->info("Ran successfully. 0 appointments affected.");
        }
    }
}