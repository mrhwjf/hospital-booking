<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\BenhNhan>
 */
class BenhNhanFactory extends Factory
{
	public function definition(): array
	{
		$gioiTinh = fake()->randomElement(['nam', 'nu']);

		return [
			'ma_benh_nhan' => 'BN' . str_pad((string) fake()->unique()->numberBetween(1, 999999), 6, '0', STR_PAD_LEFT),
			'nguoi_dung_id' => null,
			'ho_ten' => fake('vi_VN')->name($gioiTinh === 'nam' ? 'male' : 'female'),
			'ngay_sinh' => fake()->dateTimeBetween('-80 years', '-1 years')->format('Y-m-d'),
			'gioi_tinh' => $gioiTinh,
			'so_dien_thoai' => '0' . fake()->numerify('9########'),
			'email' => fake()->optional()->safeEmail(),
			'so_cccd' => fake()->optional()->numerify('############'),
			'dia_chi' => fake('vi_VN')->address(),
			'nguoi_lien_he' => fake('vi_VN')->name(),
			'sdt_nguoi_lien_he' => '0' . fake()->numerify('9########'),
			'nhom_mau' => fake()->randomElement(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
			'tien_su_di_ung' => fake()->optional()->sentence(),
			'tien_su_benh' => fake()->optional()->sentence(),
			'ghi_chu' => fake()->optional()->sentence(),
			'trang_thai' => 'hoat_dong',
		];
	}
}
