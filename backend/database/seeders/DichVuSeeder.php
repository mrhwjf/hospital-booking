<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DichVuSeeder extends Seeder
{
    public function run(): void
    {
        $chuyenKhoa = DB::table('chuyen_khoa')->pluck('id', 'ma_chuyen_khoa');

		$seedData = [
			['Khám nội tổng quát', 'NOI', 'kham_benh', 220000, 30, null],
			['Khám nhi tổng quát', 'NHI', 'kham_benh', 200000, 30, null],
			['Khám tai mũi họng', 'TMH', 'kham_benh', 260000, 25, null],
			['Khám răng hàm mặt', 'RANG_HAM_MAT', 'kham_benh', 240000, 30, null],
			['Khám mắt tật khúc xạ', 'MAT', 'kham_benh', 210000, 25, null],
			['Khám da liễu tổng quát', 'DA_LIEU', 'kham_benh', 230000, 30, null],
			['Khám tim mạch chuyên sâu', 'TIM_MACH', 'kham_benh', 320000, 40, null],
			['Khám thần kinh', 'THAN_KINH', 'kham_benh', 300000, 40, null],
			['Khám hô hấp', 'HO_HAP', 'kham_benh', 260000, 30, null],
			['Khám tiêu hóa', 'TIEU_HOA', 'kham_benh', 280000, 35, null],
			['Xét nghiệm máu cơ bản', 'XET_NGHIEM', 'xet_nghiem', 150000, 20, 'Nhịn ăn 8 giờ trước lấy mẫu.'],
			['Xét nghiệm sinh hóa gan thận', 'XET_NGHIEM', 'xet_nghiem', 320000, 25, 'Nhịn ăn 8 giờ trước lấy mẫu.'],
			['Xét nghiệm đường huyết HbA1c', 'XET_NGHIEM', 'xet_nghiem', 220000, 20, null],
			['Siêu âm ổ bụng', 'CHAN_DOAN_HINH_ANH', 'chan_doan_hinh_anh', 280000, 25, 'Uống nhiều nước trước khi siêu âm.'],
			['X-quang phổi thẳng', 'CHAN_DOAN_HINH_ANH', 'chan_doan_hinh_anh', 180000, 15, null],
			['Chụp CT não', 'CHAN_DOAN_HINH_ANH', 'chan_doan_hinh_anh', 1500000, 45, 'Thực hiện theo chỉ định bác sĩ.'],
			['Chụp MRI cột sống', 'CHAN_DOAN_HINH_ANH', 'chan_doan_hinh_anh', 2200000, 60, 'Không mang vật kim loại khi chụp.'],
			['Nội soi dạ dày', 'TIEU_HOA', 'thu_thuat', 900000, 40, 'Nhịn ăn tối thiểu 6 giờ.'],
			['Nội soi tai mũi họng', 'TMH', 'thu_thuat', 380000, 25, null],
			['Thay băng vết thương', 'CAP_CUU', 'thu_thuat', 120000, 15, null],
			['Tiêm truyền tĩnh mạch', 'CAP_CUU', 'thu_thuat', 140000, 20, null],
			['Phẫu thuật cắt u nhỏ', 'UNG_BUOU', 'phau_thuat', 5000000, 120, 'Đánh giá tiền mê trước phẫu thuật.'],
			['Vật lý trị liệu cột sống', 'PHCN', 'khac', 250000, 45, null],
			['Châm cứu giảm đau', 'Y_HOC_CO_TRUYEN', 'khac', 180000, 35, null],
		];

		$rows = [];
		foreach ($seedData as $index => $item) {
			[$name, $specialtyCode, $serviceType, $price, $duration, $requirement] = $item;

			$rows[] = [
				'ma_dich_vu' => sprintf('DV-%03d', $index + 1),
				'ten_dich_vu' => $name,
				'chuyen_khoa_id' => $chuyenKhoa[$specialtyCode] ?? null,
				'mo_ta' => 'Dịch vụ ' . $name . ' theo quy trình chuẩn của bệnh viện.',
				'gia_dich_vu' => $price,
				'thoi_gian_du_kien' => $duration,
				'yeu_cau_dac_biet' => $requirement,
				'trang_thai' => $index % 17 === 0 ? 'tam_ngung' : 'hoat_dong',
				'loai_dich_vu' => $serviceType,
				'created_at' => now(),
				'updated_at' => now(),
			];
		}

		$rows = array_values(array_filter($rows, fn(array $row) => !is_null($row['chuyen_khoa_id'])));

		DB::table('dich_vu')->upsert(
			$rows,
			['ma_dich_vu'],
			['ten_dich_vu', 'chuyen_khoa_id', 'mo_ta', 'gia_dich_vu', 'thoi_gian_du_kien', 'yeu_cau_dac_biet', 'trang_thai', 'loai_dich_vu', 'updated_at']
		);
    }
}
