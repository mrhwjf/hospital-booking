<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TaiLieuHoSoSeeder extends Seeder
{
    public function run(): void
    {
        $phieu = DB::table('phieu_kham')->pluck('id', 'ma_phieu_kham');

        $rows = [
            [
                'ma_tai_lieu' => 'TL0001',
                'phieu_kham_id' => $phieu['PK004'] ?? null,
                'loai_tai_lieu' => 'ket_qua_xet_nghiem',
                'ten_tai_lieu' => 'Ket qua cong thuc mau',
                'file_public_id' => 'hospital_booking/medical_documents/appointments_1/document_tl0001',
                'ngay_tao' => now()->subDays(45)->toDateString(),
                'ghi_chu' => 'Tai lieu theo lan kham PK004',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'ma_tai_lieu' => 'TL0002',
                'phieu_kham_id' => $phieu['PK005'] ?? null,
                'loai_tai_lieu' => 'phieu_chi_dinh',
                'ten_tai_lieu' => 'Phieu chi dinh can lam sang',
                'file_public_id' => 'hospital_booking/medical_documents/appointments_1/document_tl0002',
                'ngay_tao' => now()->subDays(18)->toDateString(),
                'ghi_chu' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'ma_tai_lieu' => 'TL0003',
                'phieu_kham_id' => $phieu['PK002'] ?? null,
                'loai_tai_lieu' => 'ket_qua_xquang',
                'ten_tai_lieu' => 'Ket qua X-quang phoI',
                'file_public_id' => 'hospital_booking/medical_documents/appointments_2/document_tl0003',
                'ngay_tao' => now()->subDays(30)->toDateString(),
                'ghi_chu' => 'Theo doi viem hong cap',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'ma_tai_lieu' => 'TL0004',
                'phieu_kham_id' => $phieu['PK007'] ?? null,
                'loai_tai_lieu' => 'ket_qua_sieu_am',
                'ten_tai_lieu' => 'Ket qua sieu am bung',
                'file_public_id' => 'hospital_booking/medical_documents/appointments_2/document_tl0004',
                'ngay_tao' => now()->subDays(9)->toDateString(),
                'ghi_chu' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'ma_tai_lieu' => 'TL0005',
                'phieu_kham_id' => $phieu['PK003'] ?? null,
                'loai_tai_lieu' => 'ket_qua_ct_scan',
                'ten_tai_lieu' => 'Ket qua CT o bung',
                'file_public_id' => 'hospital_booking/medical_documents/appointments_3/document_tl0005',
                'ngay_tao' => now()->subDays(7)->toDateString(),
                'ghi_chu' => 'Kiem tra tiep theo neu can',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'ma_tai_lieu' => 'TL0006',
                'phieu_kham_id' => $phieu['PK008'] ?? null,
                'loai_tai_lieu' => 'ket_qua_mri',
                'ten_tai_lieu' => 'Ket qua MRI so nao',
                'file_public_id' => 'hospital_booking/medical_documents/appointments_3/document_tl0006',
                'ngay_tao' => now()->subDays(60)->toDateString(),
                'ghi_chu' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'ma_tai_lieu' => 'TL0007',
                'phieu_kham_id' => $phieu['PK009'] ?? null,
                'loai_tai_lieu' => 'khac',
                'ten_tai_lieu' => 'Tai lieu bo sung lan kham',
                'file_public_id' => 'hospital_booking/medical_documents/appointments_3/document_tl0007',
                'ngay_tao' => now()->subDays(12)->toDateString(),
                'ghi_chu' => 'Dung de test FE preview iframe',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        $rows = array_values(array_filter($rows, fn (array $row) => $row['phieu_kham_id'] !== null));

        if (empty($rows)) {
            return;
        }

        DB::table('tai_lieu_ho_so')->upsert(
            $rows,
            ['ma_tai_lieu'],
            ['phieu_kham_id', 'loai_tai_lieu', 'ten_tai_lieu', 'file_public_id', 'ngay_tao', 'ghi_chu', 'updated_at']
        );
    }
}