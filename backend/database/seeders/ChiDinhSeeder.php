<<<<<<< HEAD
=======

>>>>>>> feature/don-thuoc
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ChiDinhSeeder extends Seeder
{
    public function run(): void
    {
        $phieu = DB::table('phieu_kham')->pluck('id', 'ma_phieu_kham');
        $bacSi = DB::table('bac_si')->pluck('id', 'ma_bac_si');
        $dichVu = DB::table('dich_vu')->pluck('id', 'ma_dich_vu');
        $goiKham = DB::table('goi_kham')->pluck('id', 'ma_goi_kham');

        $rows = [
            [
                'phieu_kham_id' => $phieu['PK0001'] ?? $phieu['PK001'] ?? null,
                'bac_si_id' => $bacSi['BS0001'] ?? $bacSi['BS001'] ?? null,
                'dich_vu_id' => $dichVu['DV003'] ?? null,
                'goi_kham_id' => null,
                'so_luong' => 1,
                'trang_thai' => 'da_hoan_thanh',
                'ngay_chi_dinh' => '2026-03-16',
                'ghi_chu' => 'Thuc hien trong buoi sang.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'phieu_kham_id' => $phieu['PK0002'] ?? $phieu['PK002'] ?? null,
                'bac_si_id' => $bacSi['BS0002'] ?? $bacSi['BS002'] ?? null,
                'dich_vu_id' => null,
                'goi_kham_id' => $goiKham['GK0001'] ?? $goiKham['GK001'] ?? null,
                'so_luong' => 1,
                'trang_thai' => 'cho_thuc_hien',
                'ngay_chi_dinh' => '2026-03-16',
                'ghi_chu' => 'Chi dinh theo goi kham tong quat.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        $rows = array_values(array_filter($rows, function (array $row) {
            $hasService = $row['dich_vu_id'] !== null;
            $hasPackage = $row['goi_kham_id'] !== null;

            return
                $row['phieu_kham_id'] !== null &&
                $row['bac_si_id'] !== null &&
                ($hasService xor $hasPackage);
        }));

        if (empty($rows)) {
            return;
        }

        DB::table('chi_dinh')->upsert(
            $rows,
            ['phieu_kham_id', 'dich_vu_id', 'goi_kham_id'],
            ['bac_si_id', 'so_luong', 'trang_thai', 'ngay_chi_dinh', 'ghi_chu', 'updated_at']
        );
    }
}