<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ChiTietDonThuocSeeder extends Seeder
{
    public function run(): void
    {
        $donThuoc = DB::table('don_thuoc')->pluck('id', 'ma_don_thuoc');
        $thuoc = DB::table('thuoc')->pluck('id', 'ma_thuoc');

        $rows = [
            [
                'don_thuoc_id' => $donThuoc['DT-20260316-09050065'] ?? null,
                'thuoc_id' => $thuoc['THUOC-001'] ?? null,
                'so_luong' => 10,
                'lieu_dung' => '1 vien/lan, 2 lan/ngay',
                'thoi_diem' => 'sau_an',
                'so_ngay' => 5,
                'ghi_chu' => null,
                'created_at' => now(),
            ],
            [
                'don_thuoc_id' => $donThuoc['DT-20260316-09050065'] ?? null,
                'thuoc_id' => $thuoc['THUOC-003'] ?? null,
                'so_luong' => 5,
                'lieu_dung' => '1 vien/lan, 1 lan/ngay',
                'thoi_diem' => 'truoc_an',
                'so_ngay' => 5,
                'ghi_chu' => 'Uong truoc bua sang.',
                'created_at' => now(),
            ],
        ];

        $rows = array_values(array_filter($rows, function (array $row) {
            return !is_null($row['don_thuoc_id']) && !is_null($row['thuoc_id']);
        }));

        DB::table('chi_tiet_don_thuoc')->upsert($rows, ['don_thuoc_id', 'thuoc_id'], ['so_luong', 'lieu_dung', 'thoi_diem', 'so_ngay', 'ghi_chu']);
    }
}
