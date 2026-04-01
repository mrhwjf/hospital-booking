<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ThuocSeeder extends Seeder
{
	public function run(): void
	{
		$seedData = [
			['Paracetamol', 'Paracetamol', 'vien', '500mg', 'uong', 'Uống sau ăn, mỗi lần 1 viên khi sốt hoặc đau.'],
			['Amoxicillin', 'Amoxicillin', 'vien', '500mg', 'uong', 'Dùng theo kê đơn của bác sĩ, không tự ý ngưng thuốc.'],
			['Omeprazole', 'Omeprazole', 'vien', '20mg', 'uong', 'Uống trước ăn sáng 30 phút.'],
			['Diclofenac Gel', 'Diclofenac', 'ong', '1%', 'boi', 'Bôi mỏng lên vùng đau 2-3 lần mỗi ngày.'],
			['Natri Clorid 0.9%', 'Natri clorid', 'chai', '500ml', 'truyen', 'Sử dụng theo y lệnh và theo dõi tại khoa.'],
			['Cetirizine', 'Cetirizine', 'vien', '10mg', 'uong', 'Uống 1 viên vào buổi tối khi có triệu chứng dị ứng.'],
			['Loratadine', 'Loratadine', 'vien', '10mg', 'uong', 'Uống 1 viên/ngày, tránh dùng quá liều.'],
			['Metformin', 'Metformin hydrochloride', 'vien', '500mg', 'uong', 'Uống trong hoặc sau bữa ăn.'],
			['Amlodipine', 'Amlodipine besylate', 'vien', '5mg', 'uong', 'Uống vào cùng một thời điểm mỗi ngày.'],
			['Atorvastatin', 'Atorvastatin calcium', 'vien', '20mg', 'uong', 'Uống buổi tối theo chỉ định điều trị mỡ máu.'],
			['Salbutamol', 'Salbutamol sulfate', 'ong', '100mcg', 'xit', 'Hít theo liều chỉ định, lắc kỹ trước khi dùng.'],
			['Budesonide', 'Budesonide', 'ong', '200mcg', 'xit', 'Súc miệng sau khi hít để tránh kích ứng họng.'],
			['Azithromycin', 'Azithromycin', 'vien', '500mg', 'uong', 'Uống xa bữa ăn, theo đủ liệu trình.'],
			['Levofloxacin', 'Levofloxacin', 'vien', '500mg', 'uong', 'Không dùng cùng chế phẩm chứa sắt hoặc calci.'],
			['Methylprednisolone', 'Methylprednisolone', 'vien', '16mg', 'uong', 'Dùng đúng thời gian, không tự ý ngừng đột ngột.'],
			['Vitamin C', 'Acid ascorbic', 'vien', '500mg', 'uong', 'Uống sau ăn để tăng dung nạp.'],
			['Calcium D3', 'Calcium carbonate + Vitamin D3', 'vien', '600mg/400IU', 'uong', 'Uống sau ăn, tránh dùng cùng sắt.'],
			['ORS', 'Glucose + Electrolytes', 'goi', '27.9g', 'uong', 'Pha đúng tỷ lệ hướng dẫn trước khi uống.'],
			['Insulin Glargine', 'Insulin glargine', 'ong', '100IU/ml', 'tiem', 'Tiêm dưới da vào cùng khung giờ mỗi ngày.'],
			['Heparin', 'Heparin sodium', 'ong', '5000 IU/ml', 'tiem', 'Theo dõi chảy máu và xét nghiệm đông máu định kỳ.'],
			['Pantoprazole', 'Pantoprazole', 'vien', '40mg', 'uong', 'Uống trước ăn sáng 30 phút.'],
			['Meloxicam', 'Meloxicam', 'vien', '7.5mg', 'uong', 'Dùng sau ăn để giảm kích ứng dạ dày.'],
			['Acetylcysteine', 'Acetylcysteine', 'goi', '200mg', 'uong', 'Pha tan với nước, uống sau ăn.'],
			['Clopidogrel', 'Clopidogrel bisulfate', 'vien', '75mg', 'uong', 'Dùng theo đơn, lưu ý nguy cơ chảy máu.'],
		];

		$rows = [];
		foreach ($seedData as $index => $item) {
			[$name, $activeIngredient, $unit, $strength, $usageRoute, $instruction] = $item;

			$rows[] = [
				'ma_thuoc' => sprintf('THUOC-%03d', $index + 1),
				'ten_thuoc' => $name,
				'hoat_chat' => $activeIngredient,
				'don_vi' => $unit,
				'ham_luong' => $strength,
				'duong_dung' => $usageRoute,
				'huong_dan_su_dung' => $instruction,
				'trang_thai' => $index % 23 === 0 ? 'ngung_su_dung' : 'hoat_dong',
				'created_at' => now(),
				'updated_at' => now(),
			];
		}

		DB::table('thuoc')->upsert(
			$rows,
			['ma_thuoc'],
			['ten_thuoc', 'hoat_chat', 'don_vi', 'ham_luong', 'duong_dung', 'huong_dan_su_dung', 'trang_thai', 'updated_at']
		);
	}
}
