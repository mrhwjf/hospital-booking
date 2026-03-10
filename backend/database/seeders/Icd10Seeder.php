<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class Icd10Seeder extends Seeder
{
	public function run(): void
	{
		DB::table('icd10')->upsert([
			['ma_icd10' => 'A09', 'ten_chan_doan' => 'Tieu chay va viem da day ruot do nhiem trung nghi ngo', 'nhom_chuong' => 'I', 'mo_ta' => null, 'trang_thai' => 'hoat_dong', 'created_at' => now(), 'updated_at' => now()],
			['ma_icd10' => 'E11', 'ten_chan_doan' => 'Dai thao duong typ 2', 'nhom_chuong' => 'IV', 'mo_ta' => null, 'trang_thai' => 'hoat_dong', 'created_at' => now(), 'updated_at' => now()],
			['ma_icd10' => 'I10', 'ten_chan_doan' => 'Tang huyet ap vo can', 'nhom_chuong' => 'IX', 'mo_ta' => null, 'trang_thai' => 'hoat_dong', 'created_at' => now(), 'updated_at' => now()],
			['ma_icd10' => 'J06.9', 'ten_chan_doan' => 'Nhiem trung duong ho hap tren cap khong xac dinh', 'nhom_chuong' => 'X', 'mo_ta' => null, 'trang_thai' => 'hoat_dong', 'created_at' => now(), 'updated_at' => now()],
			['ma_icd10' => 'K29.7', 'ten_chan_doan' => 'Viem da day khong xac dinh', 'nhom_chuong' => 'XI', 'mo_ta' => null, 'trang_thai' => 'hoat_dong', 'created_at' => now(), 'updated_at' => now()],
			['ma_icd10' => 'M54.5', 'ten_chan_doan' => 'Dau that lung', 'nhom_chuong' => 'XIII', 'mo_ta' => null, 'trang_thai' => 'hoat_dong', 'created_at' => now(), 'updated_at' => now()],
			['ma_icd10' => 'R07.4', 'ten_chan_doan' => 'Dau nguc khong xac dinh', 'nhom_chuong' => 'XVIII', 'mo_ta' => null, 'trang_thai' => 'hoat_dong', 'created_at' => now(), 'updated_at' => now()],
			['ma_icd10' => 'R10.9', 'ten_chan_doan' => 'Dau bung khong xac dinh', 'nhom_chuong' => 'XVIII', 'mo_ta' => null, 'trang_thai' => 'hoat_dong', 'created_at' => now(), 'updated_at' => now()],
			['ma_icd10' => 'R50.9', 'ten_chan_doan' => 'Sot khong xac dinh', 'nhom_chuong' => 'XVIII', 'mo_ta' => null, 'trang_thai' => 'hoat_dong', 'created_at' => now(), 'updated_at' => now()],
			['ma_icd10' => 'R51', 'ten_chan_doan' => 'Dau dau', 'nhom_chuong' => 'XVIII', 'mo_ta' => null, 'trang_thai' => 'hoat_dong', 'created_at' => now(), 'updated_at' => now()],
		], ['ma_icd10'], ['ten_chan_doan', 'nhom_chuong', 'mo_ta', 'trang_thai', 'updated_at']);
	}
}
