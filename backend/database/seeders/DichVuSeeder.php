<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DichVuSeeder extends Seeder
{
    public function run(): void
    {
        $chuyenKhoa = DB::table('chuyen_khoa')->pluck('id', 'ma_chuyen_khoa');

        DB::table('dich_vu')->upsert([
            [
                'ma_dich_vu' => 'DV001',
                'ten_dich_vu' => 'Kham noi tong quat',
                'chuyen_khoa_id' => $chuyenKhoa['NOI'] ?? null,
                'mo_ta' => 'Kham tong quat noi khoa.',
                'gia_dich_vu' => 200000,
                'thoi_gian_du_kien' => 30,
                'yeu_cau_dac_biet' => null,
                'trang_thai' => 'hoat_dong',
                'loai_dich_vu' => 'kham_benh',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'ma_dich_vu' => 'DV002',
                'ten_dich_vu' => 'Kham nhi tong quat',
                'chuyen_khoa_id' => $chuyenKhoa['NHI'] ?? null,
                'mo_ta' => 'Kham tong quat cho tre em.',
                'gia_dich_vu' => 180000,
                'thoi_gian_du_kien' => 30,
                'yeu_cau_dac_biet' => null,
                'trang_thai' => 'hoat_dong',
                'loai_dich_vu' => 'kham_benh',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'ma_dich_vu' => 'DV003',
                'ten_dich_vu' => 'Xet nghiem mau co ban',
                'chuyen_khoa_id' => $chuyenKhoa['NOI'] ?? null,
                'mo_ta' => 'Xet nghiem cong thuc mau va chi so co ban.',
                'gia_dich_vu' => 120000,
                'thoi_gian_du_kien' => 20,
                'yeu_cau_dac_biet' => 'Nhin an 8 gio.',
                'trang_thai' => 'hoat_dong',
                'loai_dich_vu' => 'xet_nghiem',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'ma_dich_vu' => 'DV004',
                'ten_dich_vu' => 'Noi soi tai mui hong',
                'chuyen_khoa_id' => $chuyenKhoa['TMH'] ?? null,
                'mo_ta' => 'Noi soi chan doan TMH.',
                'gia_dich_vu' => 350000,
                'thoi_gian_du_kien' => 25,
                'yeu_cau_dac_biet' => null,
                'trang_thai' => 'hoat_dong',
                'loai_dich_vu' => 'chan_doan_hinh_anh',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ], ['ma_dich_vu'], ['ten_dich_vu', 'chuyen_khoa_id', 'mo_ta', 'gia_dich_vu', 'thoi_gian_du_kien', 'yeu_cau_dac_biet', 'trang_thai', 'loai_dich_vu', 'updated_at']);
    }
}
