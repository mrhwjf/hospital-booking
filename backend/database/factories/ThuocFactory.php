<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Thuoc>
 */
class ThuocFactory extends Factory
{
	public function definition(): array
	{
		$tenThuoc = fake()->randomElement(['Paracetamol', 'Amoxicillin', 'Omeprazole', 'Ibuprofen', 'Cetirizine']);

		return [
			'ma_thuoc' => 'TH' . str_pad((string) fake()->unique()->numberBetween(1, 999), 3, '0', STR_PAD_LEFT),
			'ten_thuoc' => $tenThuoc,
			'hoat_chat' => $tenThuoc,
			'don_vi' => fake()->randomElement(['vien', 'goi', 'ong', 'ml', 'lo', 'hop', 'chai']),
			'ham_luong' => fake()->randomElement(['5mg', '10mg', '20mg', '250mg', '500mg']),
			'duong_dung' => fake()->randomElement(['uong', 'tiem', 'truyen', 'boi', 'nho', 'xit']),
			'huong_dan_su_dung' => 'Su dung theo huong dan cua bac si',
			'trang_thai' => 'hoat_dong',
		];
	}
}
