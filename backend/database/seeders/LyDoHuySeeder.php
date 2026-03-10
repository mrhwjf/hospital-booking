<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LyDoHuySeeder extends Seeder
{
	public function run(): void
	{
		DB::table('ly_do_huy')->upsert([
			['ma_ly_do' => 'BN_BAN', 'ten_ly_do' => 'Ban viec dot xuat', 'loai' => 'benh_nhan', 'thu_tu' => 1, 'trang_thai' => 'hoat_dong', 'created_at' => now()],
			['ma_ly_do' => 'BN_SUC_KHOE', 'ten_ly_do' => 'Suc khoe khong cho phep', 'loai' => 'benh_nhan', 'thu_tu' => 2, 'trang_thai' => 'hoat_dong', 'created_at' => now()],
			['ma_ly_do' => 'BN_DOI_LICH', 'ten_ly_do' => 'Muon doi ngay gio khac', 'loai' => 'benh_nhan', 'thu_tu' => 3, 'trang_thai' => 'hoat_dong', 'created_at' => now()],
			['ma_ly_do' => 'BN_KHAC', 'ten_ly_do' => 'Ly do khac', 'loai' => 'benh_nhan', 'thu_tu' => 99, 'trang_thai' => 'hoat_dong', 'created_at' => now()],
			['ma_ly_do' => 'BS_NGHI_PHEP', 'ten_ly_do' => 'Bac si nghi phep', 'loai' => 'bac_si', 'thu_tu' => 1, 'trang_thai' => 'hoat_dong', 'created_at' => now()],
			['ma_ly_do' => 'BS_HOI_NGHI', 'ten_ly_do' => 'Bac si tham du hoi nghi', 'loai' => 'bac_si', 'thu_tu' => 2, 'trang_thai' => 'hoat_dong', 'created_at' => now()],
			['ma_ly_do' => 'BS_KHAN_CAP', 'ten_ly_do' => 'Bac si co viec khan cap', 'loai' => 'bac_si', 'thu_tu' => 3, 'trang_thai' => 'hoat_dong', 'created_at' => now()],
			['ma_ly_do' => 'HT_BAO_TRI', 'ten_ly_do' => 'He thong bao tri', 'loai' => 'he_thong', 'thu_tu' => 1, 'trang_thai' => 'hoat_dong', 'created_at' => now()],
			['ma_ly_do' => 'HT_TRUNG_LICH', 'ten_ly_do' => 'Trung lich hen', 'loai' => 'he_thong', 'thu_tu' => 2, 'trang_thai' => 'hoat_dong', 'created_at' => now()],
		], ['ma_ly_do'], ['ten_ly_do', 'loai', 'thu_tu', 'trang_thai']);
	}
}
