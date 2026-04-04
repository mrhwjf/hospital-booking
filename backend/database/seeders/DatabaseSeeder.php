<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
                // Access control and user identities.
            VaiTroSeeder::class,
            QuyenSeeder::class,
            VaiTroQuyenSeeder::class,
            NguoiDungSeeder::class,

                // Static catalogs.
            ChuyenKhoaSeeder::class,
            PhongKhamSeeder::class,
            DichVuSeeder::class,
            GoiKhamSeeder::class,
            ChiTietGoiKhamSeeder::class,

                // Core profiles.
            BenhNhanSeeder::class,
            BacSiSeeder::class,
            NhanVienSeeder::class,
            BacSiChuyenKhoaSeeder::class,

                // System and lookup tables.
            CauHinhHeThongSeeder::class,
            LyDoHuySeeder::class,
            Icd10Seeder::class,

                // Scheduling foundations.
            LichLamViecSeeder::class,
            NgayNghiLeSeeder::class,
            BacSiNghiSeeder::class,
            LichLamViecBacSiSeeder::class,
            KhungGioKhamSeeder::class,

                // Appointments and related service selections.
            LichHenSeeder::class,
            DichVuLichHenSeeder::class,

                // Clinical records.
            PhieuKhamSeeder::class,
            ChiDinhSeeder::class,
            TaiLieuHoSoSeeder::class,

                // Medication and notification data.
            ThuocSeeder::class,
            DonThuocSeeder::class,
            ChiTietDonThuocSeeder::class,
            ThongBaoSeeder::class,
        ]);
    }
}
