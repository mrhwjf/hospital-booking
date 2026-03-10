<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CauHinhHeThongSeeder extends Seeder
{
	public function run(): void
	{
		DB::table('cau_hinh_he_thong')->upsert([
			['khoa' => 'THOI_GIAN_HUY_TOI_THIEU', 'gia_tri' => '12', 'mo_ta' => 'So gio toi thieu truoc khi kham de duoc huy lich', 'nhom' => 'lich_hen', 'created_at' => now(), 'updated_at' => now()],
			['khoa' => 'THOI_GIAN_DOI_TOI_THIEU', 'gia_tri' => '24', 'mo_ta' => 'So gio toi thieu truoc khi kham de duoc doi lich', 'nhom' => 'lich_hen', 'created_at' => now(), 'updated_at' => now()],
			['khoa' => 'SO_NGAY_DAT_TRUOC_TOI_DA', 'gia_tri' => '30', 'mo_ta' => 'So ngay toi da co the dat lich truoc', 'nhom' => 'lich_hen', 'created_at' => now(), 'updated_at' => now()],
			['khoa' => 'THOI_LUONG_KHAM_MAC_DINH', 'gia_tri' => '60', 'mo_ta' => 'Thoi luong kham mac dinh (phut)', 'nhom' => 'lich_hen', 'created_at' => now(), 'updated_at' => now()],
			['khoa' => 'TEN_BENH_VIEN', 'gia_tri' => 'Benh vien ABC', 'mo_ta' => 'Ten benh vien', 'nhom' => 'chung', 'created_at' => now(), 'updated_at' => now()],
			['khoa' => 'DIA_CHI', 'gia_tri' => '123 Duong ABC, Quan XYZ, TP.HCM', 'mo_ta' => 'Dia chi benh vien', 'nhom' => 'chung', 'created_at' => now(), 'updated_at' => now()],
			['khoa' => 'SO_DIEN_THOAI', 'gia_tri' => '028-1234-5678', 'mo_ta' => 'So dien thoai lien he', 'nhom' => 'chung', 'created_at' => now(), 'updated_at' => now()],
			['khoa' => 'EMAIL', 'gia_tri' => 'contact@benhvienabc.com', 'mo_ta' => 'Email lien he', 'nhom' => 'chung', 'created_at' => now(), 'updated_at' => now()],
		], ['khoa'], ['gia_tri', 'mo_ta', 'nhom', 'updated_at']);
	}
}
