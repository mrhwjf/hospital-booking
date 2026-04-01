<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BacSiChuyenKhoaSeeder extends Seeder
{
    public function run(): void
    {
        $bacSi = DB::table('bac_si')->pluck('id', 'ma_bac_si');
        $chuyenKhoa = DB::table('chuyen_khoa')->pluck('id', 'ma_chuyen_khoa');

        $rows = [
            [
                'bac_si_id' => $bacSi['BS-0001'] ?? null,
                'chuyen_khoa_id' => $chuyenKhoa['NOI'] ?? null,
                'la_chuyen_khoa_chinh' => true,
                'ghi_chu' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'bac_si_id' => $bacSi['BS-0001'] ?? null,
                'chuyen_khoa_id' => $chuyenKhoa['TMH'] ?? null,
                'la_chuyen_khoa_chinh' => false,
                'ghi_chu' => 'Ho tro hoi chan.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'bac_si_id' => $bacSi['BS-0002'] ?? null,
                'chuyen_khoa_id' => $chuyenKhoa['NHI'] ?? null,
                'la_chuyen_khoa_chinh' => true,
                'ghi_chu' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        $rows = array_values(array_filter($rows, fn(array $row) => !is_null($row['bac_si_id']) && !is_null($row['chuyen_khoa_id'])));

        DB::table('bac_si_chuyen_khoa')->upsert($rows, ['bac_si_id', 'chuyen_khoa_id'], ['la_chuyen_khoa_chinh', 'ghi_chu', 'updated_at']);

        if (isset($bacSi['BS-0001'])) {
            DB::table('chuyen_khoa')
                ->where('ma_chuyen_khoa', 'NOI')
                ->update(['truong_khoa_id' => $bacSi['BS-0001'], 'updated_at' => now()]);
        }

        if (isset($bacSi['BS-0002'])) {
            DB::table('chuyen_khoa')
                ->where('ma_chuyen_khoa', 'NHI')
                ->update(['truong_khoa_id' => $bacSi['BS-0002'], 'updated_at' => now()]);
        }
    }
}
