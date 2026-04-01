<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BacSiSeeder extends Seeder
{
    public function run(): void
    {
        $users = DB::table('nguoi_dung')->pluck('id', 'email');

		$ho = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Đỗ', 'Bùi', 'Vũ', 'Đặng', 'Phan', 'Hoàng'];
		$dem = ['Minh', 'Ngọc', 'Anh', 'Quốc', 'Thành', 'Tuấn', 'Hải', 'Lan', 'Bảo', 'Khánh'];
		$ten = ['An', 'Bình', 'Châu', 'Duy', 'Giang', 'Hiền', 'Khoa', 'Linh', 'Nam', 'Phúc', 'Quỳnh', 'Trang'];
		$hocVi = ['bac_si', 'thac_si', 'tien_si', 'pgs', 'gs'];

		$rows = [];

		foreach (range(1, 50) as $index) {
			$rows[] = [
				'ma_bac_si' => sprintf('BS-%04d', $index),
				'nguoi_dung_id' => $users["doctor{$index}@hospital.local"] ?? null,
				'ho_ten' => sprintf(
					'%s %s %s',
					$ho[$index % count($ho)],
					$dem[$index % count($dem)],
					$ten[$index % count($ten)],
				),
				'so_dien_thoai' => '0911' . str_pad((string) $index, 6, '0', STR_PAD_LEFT),
				'hoc_vi' => $hocVi[$index % count($hocVi)],
				'chung_chi_hanh_nghe' => sprintf('CCHN-BS-%04d', $index),
				'kinh_nghiem' => 3 + ($index % 20),
				'gioi_thieu' => 'Bác sĩ có kinh nghiệm khám và theo dõi điều trị chuyên khoa.',
				'trang_thai' => $index % 23 === 0 ? 'tam_nghi' : 'hoat_dong',
				'created_at' => now(),
				'updated_at' => now(),
			];
		}

		$rows = array_values(array_filter($rows, fn(array $row) => !is_null($row['nguoi_dung_id'])));

		DB::table('bac_si')->upsert(
			$rows,
			['ma_bac_si'],
			['nguoi_dung_id', 'ho_ten', 'so_dien_thoai', 'hoc_vi', 'chung_chi_hanh_nghe', 'kinh_nghiem', 'gioi_thieu', 'trang_thai', 'updated_at']
		);
    }
}
