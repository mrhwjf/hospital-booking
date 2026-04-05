<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ThongBaoSeeder extends Seeder
{
    public function run(): void
    {
        $users = DB::table('nguoi_dung')->pluck('id', 'email');

        $rows = [
            [
                'nguoi_nhan_id' => $users['patient1@hospital.local'] ?? $users['patient1@test.local'] ?? null,
                'tieu_de' => 'Lich hen da duoc xac nhan',
                'noi_dung' => 'Ban co lich kham vao ngay 2026-03-16. Vui long den truoc 15 phut.',
                'loai' => 'lich_hen',
                'lien_ket' => '/appointments/LH-20260316-07250012',
                'da_doc' => false,
                'created_at' => now(),
            ],
            [
                'nguoi_nhan_id' => $users['staff1@hospital.local'] ?? $users['staff1@test.local'] ?? null,
                'tieu_de' => 'Co lich hen moi',
                'noi_dung' => 'He thong ghi nhan lich hen LH-20260316-09300045 can tiep nhan.',
                'loai' => 'he_thong',
                'lien_ket' => '/appointments/LH-20260316-09300045',
                'da_doc' => false,
                'created_at' => now(),
            ],
        ];

        $rows = array_values(array_filter($rows, fn(array $row) => !is_null($row['nguoi_nhan_id'])));

        DB::table('thong_bao')->insertOrIgnore($rows);
    }
}
