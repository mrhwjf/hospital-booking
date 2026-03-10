<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\LichHen>
 */
class LichHenFactory extends Factory
{
	public function definition(): array
	{
		return [
			'ma_lich_hen' => 'LH' . now()->format('Ymd') . fake()->unique()->numberBetween(100, 999),
			'benh_nhan_id' => 1,
			'bac_si_id' => 1,
			'chuyen_khoa_id' => 1,
			'khung_gio_id' => null,
			'ngay_hen' => fake()->dateTimeBetween('now', '+30 days')->format('Y-m-d'),
			'ly_do_kham' => 'Kham suc khoe dinh ky',
			'trang_thai' => 'dang_cho',
			'ly_do_huy_id' => null,
			'ghi_chu' => null,
		];
	}
}
