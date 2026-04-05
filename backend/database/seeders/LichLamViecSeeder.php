<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LichLamViecSeeder extends Seeder
{
	public function run(): void
	{
		$rows = [];

		// Human-readable labels for display
		$thuLabel = [
			1 => 'Thứ 2',
			2 => 'Thứ 3',
			3 => 'Thứ 4',
			4 => 'Thứ 5',
			5 => 'Thứ 6',
			6 => 'Thứ 7',
			7 => 'Chủ nhật',
		];

		// Mapping for ma_ca IDs
		$maThu = [
			1 => 'T2',
			2 => 'T3',
			3 => 'T4',
			4 => 'T5',
			5 => 'T6',
			6 => 'T7',
			7 => 'CN', // Sunday
		];

		// Shift definitions
		$caMau = [
			[
				'prefix' => 'SANG',
				'ten' => 'Ca sáng',
				'gio_bat_dau' => '07:30:00',
				'gio_ket_thuc' => '11:30:00',
				'thoi_luong_kham' => 60,
				'ghi_chu' => 'Khung giờ khám buổi sáng.',
				'trang_thai' => 'hoat_dong',
				'thu_ap_dung' => [1, 2, 3, 4, 5, 6, 7],
			],
			[
				'prefix' => 'CHIEU',
				'ten' => 'Ca chiều',
				'gio_bat_dau' => '13:00:00',
				'gio_ket_thuc' => '17:00:00',
				'thoi_luong_kham' => 60,
				'ghi_chu' => 'Khung giờ khám buổi chiều.',
				'trang_thai' => 'hoat_dong',
				'thu_ap_dung' => [1, 2, 3, 4, 5, 6, 7],
			],
			[
				'prefix' => 'TOI',
				'ten' => 'Ca tối',
				'gio_bat_dau' => '17:30:00',
				'gio_ket_thuc' => '20:30:00',
				'thoi_luong_kham' => 30,
				'ghi_chu' => 'Khung giờ khám ngoài giờ hành chính.',
				'trang_thai' => 'tam_ngung',
				'thu_ap_dung' => [1, 2, 3, 4, 5], // only Mon-Fri
			],
		];

		// Build rows
		foreach ($caMau as $ca) {
			foreach ($ca['thu_ap_dung'] as $thu) {
				$rows[] = [
					'ma_ca' => sprintf('CA_%s_%s', $ca['prefix'], $maThu[$thu]),
					'ten_ca' => sprintf('%s %s', $ca['ten'], $thuLabel[$thu]),
					'thu_trong_tuan' => $thu,
					'gio_bat_dau' => $ca['gio_bat_dau'],
					'gio_ket_thuc' => $ca['gio_ket_thuc'],
					'thoi_luong_kham' => $ca['thoi_luong_kham'],
					'ghi_chu' => $ca['ghi_chu'],
					'trang_thai' => $ca['trang_thai'],
					'created_at' => now(),
					'updated_at' => now(),
				];
			}
		}

		// Upsert into database
		DB::table('lich_lam_viec')->upsert(
			$rows,
			['ma_ca'], // unique key
			['ten_ca', 'thu_trong_tuan', 'gio_bat_dau', 'gio_ket_thuc', 'thoi_luong_kham', 'ghi_chu', 'trang_thai', 'updated_at']
		);
	}
}