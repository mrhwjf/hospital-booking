<?php

namespace Database\Seeders;

use App\Enums\PermissionEnum;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class QuyenSeeder extends Seeder
{
    public function run(): void
    {
        $quyen = PermissionEnum::rows();

        $rows = array_map(function (array $item) {
            $item['created_at'] = now();

            return $item;
        }, $quyen);

        // Remove legacy permission codes from previous schema versions (e.g. QUAN_LY_*).
        DB::table('quyen')
            ->where('ma_quyen', 'not like', '%:%')
            ->delete();

        DB::table('quyen')->upsert($rows, ['ma_quyen'], ['ten_quyen', 'mo_ta', 'nhom_quyen']);
    }
}