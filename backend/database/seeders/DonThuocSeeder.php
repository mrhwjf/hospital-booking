<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DonThuocSeeder extends Seeder
{
    public function run(): void
    {
        $phieu = DB::table('phieu_kham')->pluck('id', 'ma_phieu_kham');
        $testPhieus = DB::table('phieu_kham')
            ->where('ma_phieu_kham', 'like', 'PK-T%')
            ->orderBy('ma_phieu_kham')
            ->get(['id', 'ma_phieu_kham', 'thoi_gian_tiep_nhan', 'trang_thai']);

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

        foreach ($testPhieus as $index => $testPhieu) {
            $rows[] = [
                'ma_don_thuoc' => sprintf('DT-T%06d', $testPhieu->id),
                'phieu_kham_id' => $testPhieu->id,
                'ngay_ke' => now()->subDays($index % 7)->toDateString(),
                'ghi_chu' => 'Đơn thuốc dữ liệu kiểm thử cho doctor portal.',
                'trang_thai' => $testPhieu->trang_thai === 'hoan_thanh' ? 'da_cap' : 'moi_tao',
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        $rows = array_values(array_filter($rows, fn(array $row) => !is_null($row['phieu_kham_id'])));

        DB::table('don_thuoc')->upsert($rows, ['ma_don_thuoc'], ['phieu_kham_id', 'ngay_ke', 'ghi_chu', 'trang_thai', 'updated_at']);
    }
}
