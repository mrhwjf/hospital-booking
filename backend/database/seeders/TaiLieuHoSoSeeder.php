<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TaiLieuHoSoSeeder extends Seeder
{
    public function run(): void
    {
        $phieu = DB::table('phieu_kham')->pluck('id', 'ma_phieu_kham');

        $rows = [
            [
                'ma_tai_lieu' => 'TL0001',
                'phieu_kham_id' => $phieu['PK0001'] ?? null,
                'loai_tai_lieu' => 'ket_qua_xet_nghiem',
                'ten_tai_lieu' => 'Ket qua xet nghiem co ban',
                'file_url' => 'https://example.local/files/tl0001.pdf',
                'file_name' => 'tl0001.pdf',
                'ngay_tao' => '2026-03-16',
                'ghi_chu' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        $rows = array_values(array_filter($rows, fn(array $row) => !is_null($row['phieu_kham_id'])));

        DB::table('tai_lieu_ho_so')->upsert($rows, ['ma_tai_lieu'], ['phieu_kham_id', 'loai_tai_lieu', 'ten_tai_lieu', 'file_url', 'file_name', 'ngay_tao', 'ghi_chu', 'updated_at']);
    }
}
