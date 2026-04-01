<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class GoiKhamSeeder extends Seeder
{
    public function run(): void
    {
        $seedData = [
            ['Gói khám sức khỏe cơ bản', 'Đánh giá tổng quát kết hợp xét nghiệm cơ bản.', 450000, 70],
            ['Gói khám sức khỏe nâng cao', 'Khám tổng quát chuyên sâu cho người trưởng thành.', 850000, 100],
            ['Gói khám tim mạch', 'Tầm soát bệnh lý tim mạch và huyết áp.', 950000, 110],
            ['Gói khám hô hấp', 'Đánh giá chức năng hô hấp và bệnh lý phổi.', 780000, 90],
            ['Gói khám tiêu hóa', 'Tầm soát bệnh lý đường tiêu hóa.', 920000, 110],
            ['Gói khám nội tiết', 'Theo dõi đái tháo đường và rối loạn nội tiết.', 880000, 95],
            ['Gói khám nhi tổng quát', 'Theo dõi tăng trưởng và sức khỏe trẻ em.', 520000, 80],
            ['Gói khám sản phụ khoa', 'Khám và tư vấn sức khỏe phụ nữ định kỳ.', 760000, 90],
            ['Gói khám nam khoa', 'Đánh giá sức khỏe nam giới định kỳ.', 700000, 85],
            ['Gói khám tai mũi họng', 'Khám chuyên khoa tai mũi họng.', 600000, 75],
            ['Gói khám mắt', 'Tầm soát tật khúc xạ và bệnh mắt thường gặp.', 580000, 70],
            ['Gói khám da liễu', 'Khám và tư vấn bệnh da liễu thường gặp.', 620000, 75],
            ['Gói khám cơ xương khớp', 'Đánh giá đau lưng, đau khớp và vận động.', 680000, 85],
            ['Gói khám thần kinh', 'Khám đau đầu, rối loạn giấc ngủ, thần kinh ngoại biên.', 890000, 100],
            ['Gói khám người cao tuổi', 'Theo dõi sức khỏe tổng hợp cho người trên 60 tuổi.', 990000, 120],
            ['Gói khám tiền hôn nhân', 'Sàng lọc sức khỏe trước kết hôn.', 1050000, 120],
            ['Gói khám tổng quát doanh nghiệp', 'Khám sức khỏe định kỳ cho nhân sự công ty.', 730000, 85],
            ['Gói tầm soát ung thư cơ bản', 'Sàng lọc ban đầu các nguy cơ ung thư phổ biến.', 1250000, 130],
            ['Gói vật lý trị liệu cột sống', 'Đánh giá và điều trị phục hồi chức năng cột sống.', 540000, 80],
            ['Gói y học cổ truyền', 'Khám và điều trị hỗ trợ bằng y học cổ truyền.', 500000, 75],
        ];

        $rows = [];
        foreach ($seedData as $index => $item) {
            [$name, $description, $price, $duration] = $item;

            $rows[] = [
                'ma_goi_kham' => sprintf('GK-%03d', $index + 1),
                'ten_goi_kham' => $name,
                'mo_ta' => $description,
                'gia_goi_kham' => $price,
                'thoi_gian_du_kien' => $duration,
                'trang_thai' => $index % 19 === 0 ? 'tam_ngung' : 'hoat_dong',
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        DB::table('goi_kham')->upsert(
            $rows,
            ['ma_goi_kham'],
            ['ten_goi_kham', 'mo_ta', 'gia_goi_kham', 'thoi_gian_du_kien', 'trang_thai', 'updated_at']
        );
    }
}
