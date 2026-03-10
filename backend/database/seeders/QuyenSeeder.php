<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class QuyenSeeder extends Seeder
{
	public function run(): void
	{
		$quyen = [
			['ma_quyen' => 'QUAN_LY_NGUOI_DUNG', 'ten_quyen' => 'Quan ly nguoi dung', 'nhom_quyen' => 'Quan ly'],
			['ma_quyen' => 'QUAN_LY_BAC_SI', 'ten_quyen' => 'Quan ly bac si', 'nhom_quyen' => 'Quan ly'],
			['ma_quyen' => 'QUAN_LY_CHUYEN_KHOA', 'ten_quyen' => 'Quan ly chuyen khoa', 'nhom_quyen' => 'Quan ly'],
			['ma_quyen' => 'QUAN_LY_LICH_HEN', 'ten_quyen' => 'Quan ly lich hen', 'nhom_quyen' => 'Nghiep vu'],
			['ma_quyen' => 'XEM_BAO_CAO', 'ten_quyen' => 'Xem bao cao', 'nhom_quyen' => 'Bao cao'],
			['ma_quyen' => 'CAU_HINH_HE_THONG', 'ten_quyen' => 'Cau hinh he thong', 'nhom_quyen' => 'He thong'],
			['ma_quyen' => 'XEM_NHAT_KY', 'ten_quyen' => 'Xem nhat ky hoat dong', 'nhom_quyen' => 'He thong'],
			['ma_quyen' => 'DAT_LICH_KHAM', 'ten_quyen' => 'Dat lich kham', 'nhom_quyen' => 'Nghiep vu'],
			['ma_quyen' => 'KHAM_BENH', 'ten_quyen' => 'Kham benh', 'nhom_quyen' => 'Nghiep vu'],
			['ma_quyen' => 'KE_DON_THUOC', 'ten_quyen' => 'Ke don thuoc', 'nhom_quyen' => 'Nghiep vu'],
		];

		$rows = array_map(function (array $item) {
			$item['mo_ta'] = null;
			$item['created_at'] = now();

			return $item;
		}, $quyen);

		DB::table('quyen')->upsert($rows, ['ma_quyen'], ['ten_quyen', 'nhom_quyen']);
	}
}
