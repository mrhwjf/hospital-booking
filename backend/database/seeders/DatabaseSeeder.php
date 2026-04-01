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
            RolePermissionDemoSeeder::class,
            NguoiDungSeeder::class,
            NguoiDungAvatarCloudinarySeeder::class,
            ChuyenKhoaSeeder::class,
            BacSiSeeder::class,
            BacSiChuyenKhoaSeeder::class,
            NhanVienSeeder::class,
            CauHinhHeThongSeeder::class,
            LyDoHuySeeder::class,
            Icd10Seeder::class,
            LichLamViecSeeder::class,
            BenhNhanSeeder::class,
            DichVuSeeder::class,
            GoiKhamSeeder::class,
            LichHenSeeder::class,
            DichVuLichHenSeeder::class,
            NgayNghiLeSeeder::class,
            ThuocSeeder::class,
        ]);
    }
}
