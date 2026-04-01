<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DichVuSeeder extends Seeder
{
    public function run(): void
    {
        $chuyenKhoaIds = DB::table('chuyen_khoa')->pluck('id')->values();
        if ($chuyenKhoaIds->isEmpty()) {
            return;
        }

        $templates = [
            ['suffix' => 'Kham tong quat', 'loai' => 'kham_benh', 'gia' => 250000],
            ['suffix' => 'Xet nghiem tong quat', 'loai' => 'xet_nghiem', 'gia' => 350000],
            ['suffix' => 'Chan doan hinh anh', 'loai' => 'chan_doan_hinh_anh', 'gia' => 450000],
        ];

        $rows = [];
        $counter = 1;
        foreach ($chuyenKhoaIds as $chuyenKhoaId) {
            foreach ($templates as $tpl) {
                $rows[] = [
                    'ma_dich_vu' => 'DV' . str_pad((string) $counter, 4, '0', STR_PAD_LEFT),
                    'ten_dich_vu' => $tpl['suffix'] . ' CK' . $chuyenKhoaId,
                    'chuyen_khoa_id' => $chuyenKhoaId,
                    'mo_ta' => 'Du lieu mau cho bao cao.',
                    'gia_dich_vu' => $tpl['gia'] + ($chuyenKhoaId * 10000),
                    'thoi_gian_du_kien' => 30,
                    'yeu_cau_dac_biet' => null,
                    'trang_thai' => 'hoat_dong',
                    'loai_dich_vu' => $tpl['loai'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
                $counter++;
            }
        }

        DB::table('dich_vu')->upsert(
            $rows,
            ['ma_dich_vu'],
            [
                'ten_dich_vu',
                'chuyen_khoa_id',
                'mo_ta',
                'gia_dich_vu',
                'thoi_gian_du_kien',
                'yeu_cau_dac_biet',
                'trang_thai',
                'loai_dich_vu',
                'updated_at',
            ]
        );
    }
}
