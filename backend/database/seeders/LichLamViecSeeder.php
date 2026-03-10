<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LichLamViecSeeder extends Seeder
{
	public function run(): void
	{
		$rows = [];

		foreach ([1, 2, 3, 4, 5, 6] as $thu) {
			$rows[] = [
				'ma_ca' => 'CA_SANG_T' . $thu,
				'ten_ca' => 'Ca sang Thu ' . $thu,
				'thu_trong_tuan' => $thu,
				'gio_bat_dau' => '07:30:00',
				'gio_ket_thuc' => '11:30:00',
				'thoi_luong_kham' => 60,
				'ghi_chu' => 'Lich kham buoi sang',
				'trang_thai' => 'hoat_dong',
				'created_at' => now(),
				'updated_at' => now(),
			];

			$rows[] = [
				'ma_ca' => 'CA_CHIEU_T' . $thu,
				'ten_ca' => 'Ca chieu Thu ' . $thu,
				'thu_trong_tuan' => $thu,
				'gio_bat_dau' => '13:30:00',
				'gio_ket_thuc' => '17:00:00',
				'thoi_luong_kham' => 60,
				'ghi_chu' => 'Lich kham buoi chieu',
				'trang_thai' => 'hoat_dong',
				'created_at' => now(),
				'updated_at' => now(),
			];
		}

		DB::table('lich_lam_viec')->upsert($rows, ['ma_ca'], ['ten_ca', 'thu_trong_tuan', 'gio_bat_dau', 'gio_ket_thuc', 'thoi_luong_kham', 'ghi_chu', 'trang_thai', 'updated_at']);
	}
}
