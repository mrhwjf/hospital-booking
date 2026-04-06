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
        $allThuocIds = array_values($thuoc->all());
        $testDonThuocIds = DB::table('don_thuoc')
            ->where('ma_don_thuoc', 'like', 'DT-T%')
            ->orderBy('ma_don_thuoc')
            ->pluck('id')
            ->values()
            ->all();

        $timeOptions = ['truoc_an', 'sau_an', 'trong_an', 'khong_lien_quan', 'sau_an'];

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

        foreach ($testDonThuocIds as $donThuocIndex => $testDonThuocId) {
            if (count($allThuocIds) < 5) {
                break;
            }

            foreach (range(0, 4) as $itemIndex) {
                $thuocId = $allThuocIds[($donThuocIndex + $itemIndex) % count($allThuocIds)];

                $rows[] = [
                    'don_thuoc_id' => $testDonThuocId,
                    'thuoc_id' => $thuocId,
                    'so_luong' => 8 + $itemIndex,
                    'lieu_dung' => sprintf('Uống %d viên/lần, %d lần/ngày', 1, 2),
                    'thoi_diem' => $timeOptions[$itemIndex],
                    'so_ngay' => 5 + ($itemIndex % 3),
                    'ghi_chu' => 'Chi tiết đơn thuốc dữ liệu kiểm thử.',
                    'created_at' => now(),
                ];
            }
        }

        $rows = array_values(array_filter($rows, function (array $row) {
            return !is_null($row['don_thuoc_id']) && !is_null($row['thuoc_id']);
        }));

        DB::table('chi_tiet_don_thuoc')->upsert($rows, ['don_thuoc_id', 'thuoc_id'], ['so_luong', 'lieu_dung', 'thoi_diem', 'so_ngay', 'ghi_chu']);
    }
}
