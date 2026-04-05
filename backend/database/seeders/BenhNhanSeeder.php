<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BenhNhanSeeder extends Seeder
{
    public function run(): void
    {
        $users = DB::table('nguoi_dung')->pluck('id', 'email');

        $ho = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Phan', 'Vũ', 'Đặng', 'Bùi', 'Đỗ'];
        $dem = ['Văn', 'Thị', 'Hữu', 'Minh', 'Gia', 'Anh', 'Đức', 'Quỳnh', 'Ngọc', 'Thanh'];
        $ten = ['An', 'Bình', 'Chi', 'Duy', 'Hạnh', 'Khánh', 'Linh', 'My', 'Nam', 'Phúc', 'Quân', 'Trang'];
        $diaChi = ['Quận 1, TP.HCM', 'Quận 3, TP.HCM', 'Thủ Đức, TP.HCM', 'Quận 7, TP.HCM', 'Bình Thạnh, TP.HCM'];
        $nhomMau = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

        $rows = [];

        foreach (range(1, 50) as $index) {
            $patientHospitalEmail = "patient{$index}@hospital.local";
            $patientTestEmail = "patient{$index}@test.local";
            $patientEmail = $patientHospitalEmail;
            $patientUserId = $users[$patientHospitalEmail] ?? null;

            if (is_null($patientUserId)) {
                $patientUserId = $users[$patientTestEmail] ?? null;
                $patientEmail = $patientTestEmail;
            }

            $cccd = match ($index) {
                1 => '079093001111',
                2 => '079093002222',
                default => '079093' . str_pad((string) (2000 + $index), 6, '0', STR_PAD_LEFT),
            };

            $fullName = sprintf(
                '%s %s %s',
                $ho[$index % count($ho)],
                $dem[$index % count($dem)],
                $ten[$index % count($ten)],
            );

            $rows[] = [
                'ma_benh_nhan' => 'BN-' . $cccd,
                'nguoi_dung_id' => $patientUserId,
                'ho_ten' => $fullName,
                'ngay_sinh' => now()->subYears(18 + ($index % 45))->subDays($index)->format('Y-m-d'),
                'gioi_tinh' => $index % 3 === 0 ? 'khac' : ($index % 2 === 0 ? 'nu' : 'nam'),
                'so_dien_thoai' => '0901' . str_pad((string) $index, 6, '0', STR_PAD_LEFT),
                'email' => $patientEmail,
                'so_cccd' => $cccd,
                'dia_chi' => $diaChi[$index % count($diaChi)],
                'nguoi_lien_he' => $ho[($index + 2) % count($ho)] . ' ' . $ten[($index + 3) % count($ten)],
                'sdt_nguoi_lien_he' => '0909' . str_pad((string) $index, 6, '0', STR_PAD_LEFT),
                'nhom_mau' => $nhomMau[$index % count($nhomMau)],
                'tien_su_di_ung' => $index % 5 === 0 ? 'Dị ứng hải sản nhẹ' : null,
                'tien_su_benh' => $index % 4 === 0 ? 'Tăng huyết áp' : null,
                'ghi_chu' => null,
                'trang_thai' => $index % 17 === 0 ? 'khoa' : 'hoat_dong',
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        $rows = array_values(array_filter($rows, fn(array $row) => !is_null($row['nguoi_dung_id'])));

        DB::table('benh_nhan')->upsert(
            $rows,
            ['ma_benh_nhan'],
            ['nguoi_dung_id', 'ho_ten', 'ngay_sinh', 'gioi_tinh', 'so_dien_thoai', 'email', 'so_cccd', 'dia_chi', 'nguoi_lien_he', 'sdt_nguoi_lien_he', 'nhom_mau', 'tien_su_di_ung', 'tien_su_benh', 'ghi_chu', 'trang_thai', 'updated_at']
        );
    }
}
