<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ChuyenKhoaSeeder extends Seeder
{
    public function run(): void
    {
        $seedData = [
            ['NOI', 'Nội tổng quát', 'Khám và điều trị các bệnh lý nội khoa thường gặp.'],
            ['NHI', 'Nhi khoa', 'Theo dõi sức khỏe và điều trị bệnh lý trẻ em.'],
            ['TMH', 'Tai Mũi Họng', 'Khám và điều trị bệnh lý tai mũi họng.'],
            ['RANG_HAM_MAT', 'Răng Hàm Mặt', 'Khám răng miệng, điều trị nha khoa tổng quát.'],
            ['MAT', 'Mắt', 'Khám tật khúc xạ và bệnh lý nhãn khoa.'],
            ['DA_LIEU', 'Da liễu', 'Chẩn đoán và điều trị bệnh da liễu.'],
            ['TIM_MACH', 'Tim mạch', 'Tầm soát và theo dõi bệnh lý tim mạch.'],
            ['THAN_KINH', 'Thần kinh', 'Khám và điều trị bệnh lý thần kinh.'],
            ['HO_HAP', 'Hô hấp', 'Điều trị bệnh lý đường hô hấp.'],
            ['TIEU_HOA', 'Tiêu hóa', 'Khám bệnh lý dạ dày, gan mật và tiêu hóa.'],
            ['CO_XUONG_KHOP', 'Cơ xương khớp', 'Khám đau xương khớp và phục hồi vận động.'],
            ['NOI_TIET', 'Nội tiết', 'Theo dõi đái tháo đường và rối loạn nội tiết.'],
            ['SAN_PHU_KHOA', 'Sản phụ khoa', 'Khám thai, phụ khoa và chăm sóc sức khỏe sinh sản.'],
            ['NAM_HOC', 'Nam học', 'Khám sức khỏe sinh sản nam giới.'],
            ['UNG_BUOU', 'Ung bướu', 'Tầm soát và quản lý điều trị ung thư.'],
            ['PHCN', 'Phục hồi chức năng', 'Hỗ trợ phục hồi sau chấn thương và phẫu thuật.'],
            ['Y_HOC_CO_TRUYEN', 'Y học cổ truyền', 'Khám và điều trị kết hợp y học cổ truyền.'],
            ['CHAN_DOAN_HINH_ANH', 'Chẩn đoán hình ảnh', 'Thực hiện siêu âm, X-quang, CT, MRI.'],
            ['XET_NGHIEM', 'Xét nghiệm', 'Xét nghiệm sinh hóa, huyết học và vi sinh.'],
            ['CAP_CUU', 'Cấp cứu', 'Tiếp nhận và xử trí cấp cứu 24/7.'],
        ];

        $rows = [];
        foreach ($seedData as $index => $item) {
            [$code, $name, $description] = $item;
            $rows[] = [
                'ma_chuyen_khoa' => $code,
                'ten_chuyen_khoa' => $name,
                'mo_ta' => $description,
                'hinh_anh' => null,
                'hinh_anh_public_id' => null,
                'vi_tri' => 'Tầng ' . (($index % 5) + 1) . ' - Khu ' . chr(65 + ($index % 4)),
                'so_dien_thoai' => '0281111' . str_pad((string) ($index + 1), 4, '0', STR_PAD_LEFT),
                'truong_khoa_id' => null,
                'thu_tu_hien_thi' => $index + 1,
                'trang_thai' => 'hoat_dong',
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        DB::table('chuyen_khoa')->upsert(
            $rows,
            ['ma_chuyen_khoa'],
            ['ten_chuyen_khoa', 'mo_ta', 'hinh_anh', 'hinh_anh_public_id', 'vi_tri', 'so_dien_thoai', 'truong_khoa_id', 'thu_tu_hien_thi', 'trang_thai', 'updated_at']
        );
    }
}
