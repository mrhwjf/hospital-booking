<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RolePermissionDemoSeeder extends Seeder
{
    public function run(): void
    {
        $now = now();

        DB::table('vai_tro')->upsert([
            [
                'ma_vai_tro' => 'DIEUDUONG',
                'ten_vai_tro' => 'Dieu duong',
                'mo_ta' => 'Ho tro tiep nhan va theo doi benh nhan.',
                'trang_thai' => 'hoat_dong',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'ma_vai_tro' => 'TROLY',
                'ten_vai_tro' => 'Tro ly dieu phoi',
                'mo_ta' => 'Ho tro dieu phoi lich hen va thong ke.',
                'trang_thai' => 'hoat_dong',
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ], ['ma_vai_tro'], ['ten_vai_tro', 'mo_ta', 'trang_thai', 'updated_at']);

        DB::table('quyen')->upsert([
            [
                'ma_quyen' => 'THEO_DOI_DIEU_PHOI',
                'ten_quyen' => 'Theo doi dieu phoi',
                'mo_ta' => 'Theo doi tinh hinh dieu phoi lich hen.',
                'nhom_quyen' => 'le_tan',
                'created_at' => $now,
            ],
        ], ['ma_quyen'], ['ten_quyen', 'mo_ta', 'nhom_quyen']);

        $troLyId = DB::table('vai_tro')->where('ma_vai_tro', 'TROLY')->value('id');
        $dieuDuongId = DB::table('vai_tro')->where('ma_vai_tro', 'DIEUDUONG')->value('id');

        $troLyPermissionIds = DB::table('quyen')
            ->whereIn('ma_quyen', ['QUAN_LY_LICH_HEN', 'XEM_BAO_CAO', 'THEO_DOI_DIEU_PHOI'])
            ->pluck('id')
            ->all();

        $dieuDuongPermissionIds = DB::table('quyen')
            ->whereIn('ma_quyen', ['DAT_LICH_KHAM', 'QUAN_LY_LICH_HEN'])
            ->pluck('id')
            ->all();

        if (!$troLyId || !$dieuDuongId) {
            return;
        }

        $rows = [];

        foreach ($troLyPermissionIds as $permissionId) {
            $rows[] = [
                'vai_tro_id' => $troLyId,
                'quyen_id' => $permissionId,
                'created_at' => $now,
            ];
        }

        foreach ($dieuDuongPermissionIds as $permissionId) {
            $rows[] = [
                'vai_tro_id' => $dieuDuongId,
                'quyen_id' => $permissionId,
                'created_at' => $now,
            ];
        }

        if (!empty($rows)) {
            DB::table('vai_tro_quyen')->insertOrIgnore($rows);
        }
    }
}
