<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BacSiSeeder extends Seeder
{
    public function run(): void
    {
        $vaiTroBacSiId = DB::table('vai_tro')->where('ma_vai_tro', 'BACSI')->value('id');
        if (!$vaiTroBacSiId) {
            return;
        }

        $bacSiUsers = DB::table('nguoi_dung')
            ->where('vai_tro_id', $vaiTroBacSiId)
            ->orderBy('id')
            ->get(['id', 'email']);

        if ($bacSiUsers->isEmpty()) {
            return;
        }

        $hocViPool = ['bac_si', 'thac_si', 'tien_si', 'pgs', 'gs'];
        $rows = [];
        $now = now();

        foreach ($bacSiUsers as $index => $user) {
            $next = $index + 1;
            $localPart = explode('@', $user->email)[0] ?? (string) $user->id;
            $displayName = ucwords(str_replace(['.', '_', '-'], ' ', $localPart));

            if (trim($displayName) === '') {
                $displayName = 'Bac Si ' . $user->id;
            }

            $rows[] = [
                'ma_bac_si' => 'BS' . str_pad((string) $user->id, 4, '0', STR_PAD_LEFT),
                'nguoi_dung_id' => $user->id,
                'ho_ten' => $displayName,
                'so_dien_thoai' => '09' . str_pad((string) (20000000 + $user->id), 8, '0', STR_PAD_LEFT),
                'hoc_vi' => $hocViPool[$index % count($hocViPool)],
                'chung_chi_hanh_nghe' => 'CCHN' . str_pad((string) $user->id, 6, '0', STR_PAD_LEFT),
                'kinh_nghiem' => 3 + $index,
                'gioi_thieu' => 'Ho so bac si duoc tao tu tai khoan role BACSI trong nguoi_dung.',
                'trang_thai' => 'hoat_dong',
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }

        DB::table('bac_si')->upsert(
            $rows,
            ['nguoi_dung_id'],
            ['ma_bac_si', 'ho_ten', 'so_dien_thoai', 'hoc_vi', 'chung_chi_hanh_nghe', 'kinh_nghiem', 'gioi_thieu', 'trang_thai', 'updated_at']
        );
    }
}
