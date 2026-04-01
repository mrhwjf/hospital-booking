<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DonThuocSeeder extends Seeder
{
    public function run(): void
    {
        $phieu = DB::table('phieu_kham')->pluck('id', 'ma_phieu_kham');

        $rows = [
            [
                'ma_don_thuoc' => 'DT-20260316-09050065',
                'phieu_kham_id' => $phieu['PK-20260316-08000032'] ?? null,
                'ngay_ke' => '2026-03-16',
                'ghi_chu' => 'Don thuoc sau kham ngoai tru.',
                'trang_thai' => 'da_cap',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        $rows = array_values(array_filter($rows, fn(array $row) => !is_null($row['phieu_kham_id'])));

        DB::table('don_thuoc')->upsert($rows, ['ma_don_thuoc'], ['phieu_kham_id', 'ngay_ke', 'ghi_chu', 'trang_thai', 'updated_at']);
    }
}
