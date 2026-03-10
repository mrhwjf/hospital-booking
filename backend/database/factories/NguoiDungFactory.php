<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\NguoiDung>
 */
class NguoiDungFactory extends Factory
{
	public function definition(): array
	{
		$vaiTroId = DB::table('vai_tro')->where('ma_vai_tro', 'BENHNHAN')->value('id')
			?? DB::table('vai_tro')->value('id')
			?? 1;

		return [
			'email' => fake()->unique()->safeEmail(),
			'mat_khau' => Hash::make('MatKhau@123'),
			'vai_tro_id' => $vaiTroId,
			'hinh_anh' => null,
			'trang_thai' => 'hoat_dong',
			'lan_dang_nhap_cuoi' => now(),
		];
	}
}
