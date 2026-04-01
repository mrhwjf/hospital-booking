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
            NguoiDungSeeder::class,
            ChuyenKhoaSeeder::class,
            PhongKhamSeeder::class,
            DichVuSeeder::class,
            GoiKhamSeeder::class,
            ChiTietGoiKhamSeeder::class,
            BenhNhanSeeder::class,
            BacSiSeeder::class,
            NhanVienSeeder::class,
            BacSiChuyenKhoaSeeder::class,
            CauHinhHeThongSeeder::class,
            LyDoHuySeeder::class,
            Icd10Seeder::class,
            LichLamViecSeeder::class,
            NgayNghiLeSeeder::class,
            BacSiNghiSeeder::class,
            LichLamViecBacSiSeeder::class,
            KhungGioKhamSeeder::class,
            LichHenSeeder::class,
            DichVuLichHenSeeder::class,
            PhieuKhamSeeder::class,
            ChiDinhSeeder::class,
            TaiLieuHoSoSeeder::class,
            ThuocSeeder::class,
            DonThuocSeeder::class,
            ChiTietDonThuocSeeder::class,
            ThongBaoSeeder::class,
        ]);
    }
}
