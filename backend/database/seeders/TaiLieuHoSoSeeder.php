<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TaiLieuHoSoSeeder extends Seeder
{
    public function run(): void
    {
        $phieuRows = DB::table('phieu_kham')
            ->orderBy('ma_phieu_kham')
            ->get(['id', 'ma_phieu_kham']);

        if ($phieuRows->isEmpty()) {
            return;
        }

        $documentTypes = [
            'ket_qua_xet_nghiem' => 'Ket qua xet nghiem tong quan',
            'ket_qua_sieu_am' => 'Bao cao ket qua sieu am',
            'ket_qua_xquang' => 'Ket qua chup X-quang',
            'ket_qua_ct_scan' => 'Ket qua chup CT scan',
            'ket_qua_mri' => 'Ket qua chup MRI',
            'ket_qua_noi_soi' => 'Bao cao noi soi',
            'phieu_chi_dinh' => 'Phieu chi dinh dich vu',
            'bao_cao_phau_thuat' => 'Bao cao thu thuat/phau thuat',
            'giay_ra_vien' => 'Giay huong dan ra vien',
            'khac' => 'Tai lieu bo sung khac',
        ];

        $typeCodes = array_keys($documentTypes);
        $phieuCount = $phieuRows->count();
        $targetCount = max(18, $phieuCount * 3);
        $publicId = 'hospital_booking/medical_documents/appointments_1/document_1.pdf';
        $now = now();
        $rows = [];

        foreach (range(0, $targetCount - 1) as $index) {
            $phieu = $phieuRows[$index % $phieuCount];
            $typeCode = $typeCodes[$index % count($typeCodes)];

            $rows[] = [
                'ma_tai_lieu' => sprintf('TL-20260316-%08d', 10000098 + $index),
                'phieu_kham_id' => $phieu->id,
                'loai_tai_lieu' => $typeCode,
                'ten_tai_lieu' => $documentTypes[$typeCode],
                'file_public_id' => $publicId,
                'ngay_tao' => $now->copy()->subDays($index % 21)->toDateString(),
                'ghi_chu' => 'Tai lieu phuc vu tham khao trong ho so kham benh.',
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }

        DB::table('tai_lieu_ho_so')->upsert(
            $rows,
            ['ma_tai_lieu'],
            ['phieu_kham_id', 'loai_tai_lieu', 'ten_tai_lieu', 'file_public_id', 'ngay_tao', 'ghi_chu', 'updated_at']
        );
    }
}
