<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ChiTietGoiKhamSeeder extends Seeder
{
    public function run(): void
    {
        $goiKham = DB::table('goi_kham')->pluck('id', 'ma_goi_kham');
        $dichVu = DB::table('dich_vu')->pluck('id', 'ma_dich_vu');

        $packageServices = [
            'GK-001' => ['DV-001', 'DV-011', 'DV-014'],
            'GK-002' => ['DV-001', 'DV-012', 'DV-015', 'DV-017'],
            'GK-003' => ['DV-007', 'DV-015', 'DV-016'],
            'GK-004' => ['DV-009', 'DV-015', 'DV-011'],
            'GK-005' => ['DV-010', 'DV-014', 'DV-018'],
            'GK-006' => ['DV-001', 'DV-012', 'DV-013'],
            'GK-007' => ['DV-002', 'DV-011', 'DV-014'],
            'GK-008' => ['DV-001', 'DV-014', 'DV-020'],
            'GK-009' => ['DV-001', 'DV-011', 'DV-016'],
            'GK-010' => ['DV-003', 'DV-019', 'DV-015'],
            'GK-011' => ['DV-005', 'DV-014', 'DV-011'],
            'GK-012' => ['DV-006', 'DV-011', 'DV-021'],
            'GK-013' => ['DV-001', 'DV-015', 'DV-023'],
            'GK-014' => ['DV-008', 'DV-016', 'DV-011'],
            'GK-015' => ['DV-001', 'DV-007', 'DV-012', 'DV-014'],
            'GK-016' => ['DV-001', 'DV-011', 'DV-012', 'DV-013'],
            'GK-017' => ['DV-001', 'DV-011', 'DV-015'],
            'GK-018' => ['DV-001', 'DV-012', 'DV-016', 'DV-022'],
            'GK-019' => ['DV-023', 'DV-024', 'DV-011'],
            'GK-020' => ['DV-024', 'DV-011', 'DV-014'],
        ];

        $rows = [];
        foreach ($packageServices as $packageCode => $serviceCodes) {
            foreach ($serviceCodes as $displayOrder => $serviceCode) {
                $rows[] = [
                    'goi_kham_id' => $goiKham[$packageCode] ?? null,
                    'dich_vu_id' => $dichVu[$serviceCode] ?? null,
                    'thu_tu_hien_thi' => $displayOrder + 1,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }

        $rows = array_values(array_filter(
            $rows,
            fn(array $row) => !is_null($row['goi_kham_id']) && !is_null($row['dich_vu_id'])
        ));

        DB::table('chi_tiet_goi_kham')->upsert(
            $rows,
            ['goi_kham_id', 'dich_vu_id'],
            ['thu_tu_hien_thi', 'updated_at']
        );
    }
}
