<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            VaiTroSeeder::class,
            QuyenSeeder::class,
            VaiTroQuyenSeeder::class,
            CauHinhHeThongSeeder::class,
            LyDoHuySeeder::class,
            Icd10Seeder::class,
            LichLamViecSeeder::class,
            NgayNghiLeSeeder::class,
            ThuocSeeder::class,
            NguoiDungSeeder::class,
            BenhNhanSeeder::class,
            NhanVienSeeder::class,
            BacSiSeeder::class,
            ChuyenKhoaSeeder::class,
            DichVuSeeder::class,
            PhieuKhamSeeder::class,
            ChiDinhSeeder::class,
        ]);
    }
}
