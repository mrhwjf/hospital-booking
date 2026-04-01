<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BacSiChuyenKhoaSeeder extends Seeder
{
    public function run(): void
    {
        $bacSiIds = DB::table('bac_si')->orderBy('id')->pluck('id')->values();
        $chuyenKhoaIds = DB::table('chuyen_khoa')->where('trang_thai', 'hoat_dong')->orderBy('id')->pluck('id')->values();

        if ($bacSiIds->isEmpty() || $chuyenKhoaIds->isEmpty()) {
            return;
        }

        DB::table('bac_si_chuyen_khoa')
            ->whereIn('bac_si_id', $bacSiIds)
            ->delete();

        DB::table('chuyen_khoa')
            ->whereIn('id', $chuyenKhoaIds)
            ->update([
                'truong_khoa_id' => null,
                'updated_at' => now(),
            ]);

        $rows = [];
        foreach ($bacSiIds as $index => $bacSiId) {
            $chuyenKhoaId = $chuyenKhoaIds[$index % $chuyenKhoaIds->count()];

            $rows[] = [
                'bac_si_id' => $bacSiId,
                'chuyen_khoa_id' => $chuyenKhoaId,
                'la_chuyen_khoa_chinh' => true,
                'ghi_chu' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        DB::table('bac_si_chuyen_khoa')->insert($rows);

        $truongKhoaIds = DB::table('bac_si_chuyen_khoa')
            ->where('la_chuyen_khoa_chinh', true)
            ->pluck('bac_si_id', 'chuyen_khoa_id');

        foreach ($chuyenKhoaIds as $chuyenKhoaId) {
            if (isset($truongKhoaIds[$chuyenKhoaId])) {
                DB::table('chuyen_khoa')
                    ->where('id', $chuyenKhoaId)
                    ->update([
                        'truong_khoa_id' => $truongKhoaIds[$chuyenKhoaId],
                        'updated_at' => now(),
                    ]);
            }
        }
    }
}
