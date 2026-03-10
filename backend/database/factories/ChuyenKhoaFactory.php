<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ChuyenKhoa>
 */
class ChuyenKhoaFactory extends Factory
{
	public function definition(): array
	{
		return [
			'ma_chuyen_khoa' => 'CK' . str_pad((string) fake()->unique()->numberBetween(1, 999), 3, '0', STR_PAD_LEFT),
			'ten_chuyen_khoa' => fake()->randomElement(['Noi tong quat', 'Nhi khoa', 'Tim mach', 'Da lieu', 'Tai mui hong']),
			'mo_ta' => fake()->sentence(),
			'hinh_anh' => null,
			'vi_tri' => fake()->randomElement(['Tang 1', 'Tang 2', 'Tang 3']),
			'so_dien_thoai' => '0' . fake()->numerify('28#######'),
			'truong_khoa_id' => null,
			'thu_tu_hien_thi' => fake()->numberBetween(0, 20),
			'trang_thai' => 'hoat_dong',
		];
	}
}
