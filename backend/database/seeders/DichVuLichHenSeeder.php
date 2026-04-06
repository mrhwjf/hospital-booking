<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DichVuLichHenSeeder extends Seeder
{
    public function run(): void
    {
        $lichHen = DB::table('lich_hen')->pluck('id', 'ma_lich_hen');
        $dichVu = DB::table('dich_vu')->pluck('id', 'ma_dich_vu');
        $goiKham = DB::table('goi_kham')->pluck('id', 'ma_goi_kham');

        $testAppointmentIds = DB::table('lich_hen')
            ->where('ma_lich_hen', 'like', 'LH-T%')
            ->orderBy('ma_lich_hen')
            ->pluck('id')
            ->values()
            ->all();

        $serviceIds = array_values($dichVu->all());
        $packageIds = array_values($goiKham->all());

        $rows = [
            [
                'lich_hen_id' => $lichHen['LH-20260316-07250012'] ?? null,
                'dich_vu_id' => null,
                'goi_kham_id' => $goiKham['GK-001'] ?? null,
                'so_luong' => 1,
                'ghi_chu' => 'Su dung goi kham co ban.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'lich_hen_id' => $lichHen['LH-20260316-09300045'] ?? null,
                'dich_vu_id' => $dichVu['DV-019'] ?? null,
                'goi_kham_id' => null,
                'so_luong' => 1,
                'ghi_chu' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        foreach ($testAppointmentIds as $index => $lichHenId) {
            $preferService = $index % 2 === 0;

            $dichVuId = $preferService && !empty($serviceIds)
                ? $serviceIds[$index % count($serviceIds)]
                : null;

            $goiKhamId = (!$preferService && !empty($packageIds))
                ? $packageIds[$index % count($packageIds)]
                : null;

            // Fallback để luôn có ít nhất 1 lựa chọn dịch vụ/gói cho mỗi lịch hẹn test.
            if (is_null($dichVuId) && is_null($goiKhamId)) {
                $dichVuId = $serviceIds[0] ?? null;
            }

            $rows[] = [
                'lich_hen_id' => $lichHenId,
                'dich_vu_id' => $dichVuId,
                'goi_kham_id' => $goiKhamId,
                'so_luong' => 1,
                'ghi_chu' => 'Dữ liệu dịch vụ/gói khám cho tài khoản kiểm thử.',
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        $rows = array_values(array_filter($rows, function (array $row) {
            if (is_null($row['lich_hen_id'])) {
                return false;
            }

            return !is_null($row['dich_vu_id']) || !is_null($row['goi_kham_id']);
        }));

        DB::table('dich_vu_lich_hen')->upsert($rows, ['lich_hen_id', 'dich_vu_id'], ['goi_kham_id', 'so_luong', 'ghi_chu', 'updated_at']);
    }
}
