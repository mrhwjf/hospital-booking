<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ThuocSeeder extends Seeder
{
	public function run(): void
	{
		DB::table('thuoc')->upsert([
			['ma_thuoc' => 'TH001', 'ten_thuoc' => 'Paracetamol', 'hoat_chat' => 'Paracetamol', 'don_vi' => 'vien', 'ham_luong' => '500mg', 'duong_dung' => 'uong', 'huong_dan_su_dung' => 'Uong sau an, moi lan 1 vien khi sot hoac dau', 'trang_thai' => 'hoat_dong', 'created_at' => now(), 'updated_at' => now()],
			['ma_thuoc' => 'TH002', 'ten_thuoc' => 'Amoxicillin', 'hoat_chat' => 'Amoxicillin', 'don_vi' => 'vien', 'ham_luong' => '500mg', 'duong_dung' => 'uong', 'huong_dan_su_dung' => 'Dung theo ke don cua bac si, khong tu y ngung thuoc', 'trang_thai' => 'hoat_dong', 'created_at' => now(), 'updated_at' => now()],
			['ma_thuoc' => 'TH003', 'ten_thuoc' => 'Omeprazole', 'hoat_chat' => 'Omeprazole', 'don_vi' => 'vien', 'ham_luong' => '20mg', 'duong_dung' => 'uong', 'huong_dan_su_dung' => 'Uong truoc an sang 30 phut', 'trang_thai' => 'hoat_dong', 'created_at' => now(), 'updated_at' => now()],
			['ma_thuoc' => 'TH004', 'ten_thuoc' => 'Diclofenac Gel', 'hoat_chat' => 'Diclofenac', 'don_vi' => 'ong', 'ham_luong' => '1%', 'duong_dung' => 'boi', 'huong_dan_su_dung' => 'Boi mong len vung dau 2-3 lan moi ngay', 'trang_thai' => 'hoat_dong', 'created_at' => now(), 'updated_at' => now()],
			['ma_thuoc' => 'TH005', 'ten_thuoc' => 'Sodium Chloride 0.9%', 'hoat_chat' => 'Natri clorid', 'don_vi' => 'chai', 'ham_luong' => '500ml', 'duong_dung' => 'truyen', 'huong_dan_su_dung' => 'Su dung theo y lenh va theo doi tai khoa', 'trang_thai' => 'hoat_dong', 'created_at' => now(), 'updated_at' => now()],
		], ['ma_thuoc'], ['ten_thuoc', 'hoat_chat', 'don_vi', 'ham_luong', 'duong_dung', 'huong_dan_su_dung', 'trang_thai', 'updated_at']);
	}
}
