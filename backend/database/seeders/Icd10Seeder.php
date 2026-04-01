<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class Icd10Seeder extends Seeder
{
	public function run(): void
	{
		$rows = [
			['A09', 'Tiêu chảy và viêm dạ dày ruột do nhiễm trùng nghi ngờ', 'I'],
			['B34.9', 'Nhiễm vi rút không xác định', 'I'],
			['E11', 'Đái tháo đường típ 2', 'IV'],
			['E78.5', 'Rối loạn lipid máu không xác định', 'IV'],
			['I10', 'Tăng huyết áp vô căn', 'IX'],
			['I20.9', 'Cơn đau thắt ngực không xác định', 'IX'],
			['I25.1', 'Bệnh tim thiếu máu cục bộ mạn', 'IX'],
			['J06.9', 'Nhiễm trùng đường hô hấp trên cấp, không xác định', 'X'],
			['J18.9', 'Viêm phổi không xác định', 'X'],
			['J45.9', 'Hen phế quản không xác định', 'X'],
			['K21.9', 'Bệnh trào ngược dạ dày thực quản, không viêm thực quản', 'XI'],
			['K29.7', 'Viêm dạ dày không xác định', 'XI'],
			['K52.9', 'Viêm dạ dày ruột và đại tràng không nhiễm trùng, không xác định', 'XI'],
			['L20.9', 'Viêm da cơ địa không xác định', 'XII'],
			['L30.9', 'Viêm da không xác định', 'XII'],
			['M17.9', 'Thoái hóa khớp gối không xác định', 'XIII'],
			['M54.5', 'Đau thắt lưng', 'XIII'],
			['N39.0', 'Nhiễm trùng đường tiết niệu, vị trí không xác định', 'XIV'],
			['N40', 'Tăng sản tuyến tiền liệt lành tính', 'XIV'],
			['R05', 'Ho', 'XVIII'],
			['R07.4', 'Đau ngực không xác định', 'XVIII'],
			['R10.9', 'Đau bụng không xác định', 'XVIII'],
			['R50.9', 'Sốt không xác định', 'XVIII'],
			['R51', 'Đau đầu', 'XVIII'],
		];

		$payload = array_map(static function (array $item): array {
			[$code, $name, $group] = $item;

			return [
				'ma_icd10' => $code,
				'ten_chan_doan' => $name,
				'nhom_chuong' => $group,
				'mo_ta' => 'Mã ICD-10 sử dụng trong chẩn đoán và thống kê điều trị.',
				'trang_thai' => 'hoat_dong',
				'created_at' => now(),
				'updated_at' => now(),
			];
		}, $rows);

		DB::table('icd10')->upsert(
			$payload,
			['ma_icd10'],
			['ten_chan_doan', 'nhom_chuong', 'mo_ta', 'trang_thai', 'updated_at']
		);
	}
}
