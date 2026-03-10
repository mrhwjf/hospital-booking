<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\LichLamViec>
 */
class LichLamViecFactory extends Factory
{
	public function definition(): array
	{
		$ca = fake()->randomElement([
			['CA_SANG', 'Ca sang', '07:30:00', '11:30:00'],
			['CA_CHIEU', 'Ca chieu', '13:30:00', '17:00:00'],
		]);

		return [
			'ma_ca' => $ca[0] . '_' . fake()->numberBetween(1, 7) . '_' . fake()->numberBetween(1, 99),
			'ten_ca' => $ca[1],
			'thu_trong_tuan' => fake()->numberBetween(1, 7),
			'gio_bat_dau' => $ca[2],
			'gio_ket_thuc' => $ca[3],
			'thoi_luong_kham' => fake()->randomElement([30, 45, 60]),
			'ghi_chu' => fake()->optional()->sentence(),
			'trang_thai' => 'hoat_dong',
		];
	}
}
