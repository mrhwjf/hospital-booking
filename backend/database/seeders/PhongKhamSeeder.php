<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PhongKhamSeeder extends Seeder
{
    public function run(): void
    {
        $chuyenKhoa = DB::table('chuyen_khoa')->pluck('id', 'ma_chuyen_khoa');

        $specialtyCodes = array_values(array_keys($chuyenKhoa->toArray()));
        $rows = [];

        foreach (range(1, 4) as $floor) {
            foreach (range(1, 6) as $roomNumber) {
                $index = (($floor - 1) * 6) + $roomNumber;
                $specialtyCode = $specialtyCodes[($index - 1) % count($specialtyCodes)] ?? null;

                $rows[] = [
                    'ma_phong' => sprintf('PK-%d%02d', $floor, $roomNumber),
                    'ten_phong' => sprintf('Phòng khám %d.%02d', $floor, $roomNumber),
                    'chuyen_khoa_id' => $specialtyCode ? ($chuyenKhoa[$specialtyCode] ?? null) : null,
                    'vi_tri' => 'Tầng ' . $floor . ' - Khu ' . chr(64 + (($roomNumber % 4) + 1)),
                    'trang_thiet_bi' => 'Bàn khám, monitor, máy đo huyết áp, máy đo SpO2',
                    'trang_thai' => $index % 11 === 0 ? 'bao_tri' : 'hoat_dong',
                    'ghi_chu' => $index % 11 === 0 ? 'Bảo trì định kỳ thiết bị.' : null,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }

        DB::table('phong_kham')->upsert(
            $rows,
            ['ma_phong'],
            ['ten_phong', 'chuyen_khoa_id', 'vi_tri', 'trang_thiet_bi', 'trang_thai', 'ghi_chu', 'updated_at']
        );
    }
}
