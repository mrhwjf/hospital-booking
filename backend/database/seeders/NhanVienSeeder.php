<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class NhanVienSeeder extends Seeder
{
    public function run(): void
    {
        $users = DB::table('nguoi_dung')->pluck('id', 'email');

        $ho = ['Lê', 'Trần', 'Nguyễn', 'Phạm', 'Bùi', 'Đỗ', 'Đặng', 'Võ', 'Phan', 'Hồ'];
        $dem = ['Thị', 'Văn', 'Gia', 'Ngọc', 'Minh', 'Thanh', 'Quốc', 'Bảo'];
        $ten = ['Thu', 'Khánh', 'Linh', 'Huy', 'An', 'Việt', 'Hà', 'Trang', 'Ngân', 'Duy'];
        $chucVu = ['le_tan', 'nhan_vien_y_te', 'dieu_duong'];

        $rows = [];

        foreach (range(1, 50) as $index) {
            $rows[] = [
                'ma_nhan_vien' => sprintf('NV-%04d', $index),
                'nguoi_dung_id' => $users["staff{$index}@hospital.local"] ?? null,
                'ho_ten' => sprintf(
                    '%s %s %s',
                    $ho[$index % count($ho)],
                    $dem[$index % count($dem)],
                    $ten[$index % count($ten)],
                ),
                'so_dien_thoai' => '0922' . str_pad((string) $index, 6, '0', STR_PAD_LEFT),
                'chuc_vu' => $chucVu[$index % count($chucVu)],
                'ngay_vao_lam' => now()->subYears(1 + ($index % 12))->subDays($index * 5)->format('Y-m-d'),
                'trang_thai' => $index % 19 === 0 ? 'tam_khoa' : 'hoat_dong',
                'ghi_chu' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        $rows = array_values(array_filter($rows, fn(array $row) => !is_null($row['nguoi_dung_id'])));

        DB::table('nhan_vien')->upsert(
            $rows,
            ['ma_nhan_vien'],
            ['nguoi_dung_id', 'ho_ten', 'so_dien_thoai', 'chuc_vu', 'ngay_vao_lam', 'trang_thai', 'ghi_chu', 'updated_at']
        );
    }
}
