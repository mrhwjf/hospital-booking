<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class NhanVienSeeder extends Seeder
{
    public function run(): void
    {
        $users = DB::table('nguoi_dung')->pluck('id', 'email');

        $rows = [
            [
                'ma_nhan_vien' => 'NV0001',
                'nguoi_dung_id' => $users['staff1@hospital.local'] ?? $users['doctor1@gmail.com'] ?? null,
                'ho_ten' => 'Le Thi Thu',
                'so_dien_thoai' => '0922000001',
                'chuc_vu' => 'le_tan',
                'ngay_vao_lam' => '2024-01-10',
                'trang_thai' => 'hoat_dong',
                'ghi_chu' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'ma_nhan_vien' => 'NV0002',
                'nguoi_dung_id' => $users['staff2@hospital.local'] ?? $users['doctor2@gmail.com'] ?? null,
                'ho_ten' => 'Pham Van Khanh',
                'so_dien_thoai' => '0922000002',
                'chuc_vu' => 'nhan_vien_y_te',
                'ngay_vao_lam' => '2023-06-20',
                'trang_thai' => 'hoat_dong',
                'ghi_chu' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        $rows = array_values(array_filter($rows, fn(array $row) => $row['nguoi_dung_id'] !== null));

        if (empty($rows)) {
            return;
        }

        DB::table('nhan_vien')->upsert(
            $rows,
            ['ma_nhan_vien'],
            ['nguoi_dung_id', 'ho_ten', 'so_dien_thoai', 'chuc_vu', 'ngay_vao_lam', 'trang_thai', 'ghi_chu', 'updated_at']
        );
    }
}