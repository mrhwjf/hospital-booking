<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DichVuLichHenSeeder extends Seeder
{
    public function run(): void
    {
        $dichVuTheoChuyenKhoa = DB::table('dich_vu')
            ->where('trang_thai', 'hoat_dong')
            ->orderBy('id')
            ->get(['id', 'chuyen_khoa_id'])
            ->groupBy('chuyen_khoa_id');

        if ($dichVuTheoChuyenKhoa->isEmpty()) {
            return;
        }

        $lichHenRows = DB::table('lich_hen')
            ->orderBy('id')
            ->get(['id', 'chuyen_khoa_id', 'trang_thai']);

        $rows = [];
        foreach ($lichHenRows as $lichHen) {
            $dichVuList = $dichVuTheoChuyenKhoa->get($lichHen->chuyen_khoa_id);
            if (!$dichVuList || $dichVuList->isEmpty()) {
                continue;
            }

            $service = $dichVuList->first();

            $rows[] = [
                'lich_hen_id' => $lichHen->id,
                'dich_vu_id' => $service->id,
                'goi_kham_id' => null,
                'so_luong' => $lichHen->trang_thai === 'da_hoan_tat' ? 1 : 0,
                'ghi_chu' => 'Dich vu gan tu dong cho lich hen seed.',
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        if (empty($rows)) {
            return;
        }

        DB::table('dich_vu_lich_hen')->upsert(
            $rows,
            ['lich_hen_id', 'dich_vu_id'],
            ['so_luong', 'ghi_chu', 'updated_at']
        );
    }
}
