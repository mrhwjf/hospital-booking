# Sửa lỗi gấp liên quan đến database.

Sau khi xem xét kỹ lưỡng, tôi nhận thấy rằng bảng:
- Bảng `chi_dinh` cần có thêm cột `goi_kham_id` để liên kết với bảng `goi_kham`. Điều này sẽ giúp chúng ta dễ dàng quản lý các chỉ định dịch vụ thuộc về một gói khám cụ thể.

- Bảng `nhan_vien` bỏ đi cột `phong_ban` vì không nên để nhập tay. Nếu không muốn thì lại phải tạo bảng `phong_ban` để quản lý phòng ban, nhưng hiện tại thấy sửa đổi quá nhiều nên bỏ đi cột này cho gọn.
- Bảng `lich_hen` bỏ đi ràng buộc UNIQUE cho cột `khung_gio_id` vì có thể có nhiều bệnh nhân đặt lịch hẹn vào cùng một khung giờ. Vì edge case: bệnh nhân có thể hủy hoặc thay đổi lịch hẹn, tức khung giờ sẽ được giải phóng (trạng thái `trong`), nên nếu xài UNIQUE sẽ gây lỗi khi có bệnh nhân khác đặt lịch vào khung giờ đó.
- Bảng `quyen` sửa cột `nhom_quyen` từ VARCHAR sang ENUM để đảm bảo tính nhất quán và dễ dàng quản lý các nhóm quyền đã được định nghĩa sẵn trong hệ thống. Các giá trị ENUM sẽ giúp tránh lỗi nhập liệu và đảm bảo rằng chỉ có các nhóm quyền hợp lệ được sử dụng trong hệ thống.
- Bảng `nguoi_dung` thêm cột `hinh_anh_public_id` để lưu public_id của ảnh đại diện trên Cloudinary. Điều này sẽ giúp chúng ta dễ dàng quản lý và xóa ảnh khi cần thiết, thay vì chỉ lưu URL.
- Bảng `tai_lieu_ho_so` bỏ cột `file_name` và `file_url`, thêm cột `file_public_id` để lưu public_id của tài liệu trên Cloudinary. Điều này sẽ giúp chúng ta dễ dàng quản lý và xóa tài liệu khi cần thiết, thay vì chỉ lưu URL.
  - Cột `ma_tai_lieu` được tự động sinh ra từ backend với định dạng: `TL + ddMMyyyyHHmmss + - + ma_phieu_kham` (ví dụ: `TL30032026220510-PK004`), vì vậy độ dài tăng lên VARCHAR(80) để chứa được mã dài này.
  - Cột `file_public_id` là NOT NULL nhưng sử dụng mô hình PENDING placeholder: khi tạo tài liệu, hệ thống gán giá trị `PENDING:<ma_tai_lieu>`, sau khi upload thành công thì thay thế bằng public_id thực từ Cloudinary. Điều này đảm bảo NOT NULL constraint được duy trì trong suốt quá trình 2-phase create-then-upload.

# SCHEMA

Sửa `.github\context-and-instruction-for-AI\schema.sql` và `docs\05-database\schema.sql`:
- thêm cột `goi_kham_id` vào bảng `chi_dinh`.
- bỏ cột `phong_ban` khỏi bảng `nhan_vien`.
- bỏ ràng buộc UNIQUE cho cột `khung_gio_id` trong bảng `lich_hen`.

```sql
CREATE TABLE chi_dinh (
    id INT AUTO_INCREMENT PRIMARY KEY,
    phieu_kham_id INT NOT NULL,
    bac_si_id INT NOT NULL COMMENT 'Bác sĩ chỉ định',

    dich_vu_id INT NULL,
    goi_kham_id INT NULL,

    so_luong INT DEFAULT 1 COMMENT 'Số lượng chỉ định',

    trang_thai ENUM('cho_thuc_hien', 'da_hoan_thanh', 'huy') DEFAULT 'cho_thuc_hien',
    ngay_chi_dinh DATE NOT NULL,
    ghi_chu TEXT COMMENT 'Ghi chú cho chỉ định',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_phieu_kham_id (phieu_kham_id),
    INDEX idx_bac_si_id (bac_si_id),
    INDEX idx_dich_vu_id (dich_vu_id),
    INDEX idx_trang_thai (trang_thai),
    INDEX idx_ngay_chi_dinh (ngay_chi_dinh),

    CONSTRAINT fk_cdxn_phieu_kham FOREIGN KEY (phieu_kham_id)
        REFERENCES phieu_kham(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_cdxn_dich_vu FOREIGN KEY (dich_vu_id)
        REFERENCES dich_vu(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_cdxn_goi_kham FOREIGN KEY (goi_kham_id)
        REFERENCES goi_kham(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE nhan_vien (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ma_nhan_vien VARCHAR(20) NOT NULL UNIQUE COMMENT 'VD: NV001',
    nguoi_dung_id INT NOT NULL UNIQUE,
    ho_ten VARCHAR(100) NOT NULL,
    so_dien_thoai VARCHAR(15) NOT NULL,
    chuc_vu ENUM('le_tan', 'nhan_vien_y_te', 'dieu_duong') NOT NULL,
    ngay_vao_lam DATE NOT NULL,
    trang_thai ENUM('hoat_dong', 'tam_khoa', 'nghi_viec') DEFAULT 'hoat_dong',
    ghi_chu TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    UNIQUE KEY uk_ma_nhan_vien (ma_nhan_vien),
    UNIQUE KEY uk_nguoi_dung_id (nguoi_dung_id),
    INDEX idx_chuc_vu (chuc_vu),
    INDEX idx_trang_thai (trang_thai),

    CONSTRAINT fk_nv_nguoi_dung FOREIGN KEY (nguoi_dung_id)
        REFERENCES nguoi_dung(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE lich_hen (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ma_lich_hen VARCHAR(20) NOT NULL UNIQUE COMMENT 'VD: LH20240116001',
    benh_nhan_id INT NOT NULL,
    bac_si_id INT NOT NULL,
    chuyen_khoa_id INT NOT NULL,
    khung_gio_id INT COMMENT 'Khung giờ khám đã đặt, chỉ cho 1 bệnh nhân/khung giờ',

    ngay_hen DATE NOT NULL,
    ly_do_kham TEXT,

    trang_thai ENUM('dang_cho', 'da_thanh_toan', 'da_xac_nhan', 'da_hoan_tat', 'da_huy', 'khong_den') DEFAULT 'dang_cho',
    nguoi_tao_id INT COMMENT 'Người tạo lịch hẹn, có thể là bệnh nhân hoặc nhân viên lễ tân',
    gio_den_thuc_te TIME COMMENT 'Giờ check-in thực tế',
    nguoi_tiep_nhan_id INT NULL COMMENT 'Nhân viên/lễ tân tiếp nhận (check-in)',

    ly_do_huy_id INT,
    ly_do_huy_khac TEXT COMMENT 'Lý do hủy khác nếu không chọn từ danh sách',

    ghi_chu TEXT,
    ghi_chu_noi_bo TEXT COMMENT 'Ghi chú chỉ nhân viên thấy',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    UNIQUE KEY uk_ma_lich_hen (ma_lich_hen),
    INDEX idx_benh_nhan_id (benh_nhan_id),
    INDEX idx_bac_si_id (bac_si_id),
    INDEX idx_chuyen_khoa_id (chuyen_khoa_id),
    INDEX idx_ngay_hen (ngay_hen),
    INDEX idx_trang_thai (trang_thai),
    INDEX idx_bac_si_ngay (bac_si_id, ngay_hen),
    INDEX idx_benh_nhan_ngay (benh_nhan_id, ngay_hen),
    INDEX idx_nguoi_tao_id (nguoi_tao_id),
    INDEX idx_nguoi_tiep_nhan_id (nguoi_tiep_nhan_id),

    CONSTRAINT fk_lh_benh_nhan FOREIGN KEY (benh_nhan_id)
        REFERENCES benh_nhan(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_lh_bac_si FOREIGN KEY (bac_si_id)
        REFERENCES bac_si(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_lh_chuyen_khoa FOREIGN KEY (chuyen_khoa_id)
        REFERENCES chuyen_khoa(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_lh_khung_gio FOREIGN KEY (khung_gio_id)
        REFERENCES khung_gio_kham(id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_lh_nguoi_tao FOREIGN KEY (nguoi_tao_id)
        REFERENCES nguoi_dung(id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_lh_nguoi_tiep_nhan FOREIGN KEY (nguoi_tiep_nhan_id)
        REFERENCES nguoi_dung(id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_lh_ly_do_huy FOREIGN KEY (ly_do_huy_id)
        REFERENCES ly_do_huy(id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE quyen (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ma_quyen VARCHAR(50) NOT NULL UNIQUE COMMENT 'VD: QUAN_LY_NGUOI_DUNG, XEM_BAO_CAO',
    ten_quyen VARCHAR(100) NOT NULL,
    mo_ta TEXT,
    nhom_quyen ENUM('quan_tri', 'nguoi_dung', 'le_tan', 'bac_si', 'khac') COMMENT 'Nhóm quyền để phân loại',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_ma_quyen (ma_quyen),
    INDEX idx_nhom_quyen (nhom_quyen)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE tai_lieu_ho_so (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ma_tai_lieu VARCHAR(80) NOT NULL UNIQUE COMMENT 'VD: TL30032026220510-PK004 (auto-generated format: TL + ddMMyyyyHHmmss + - + ma_phieu_kham)',
    phieu_kham_id INT NOT NULL,

    loai_tai_lieu ENUM(
        'ket_qua_xet_nghiem',
        'ket_qua_sieu_am',
        'ket_qua_xquang',
        'ket_qua_ct_scan',
        'ket_qua_mri',
        'ket_qua_noi_soi',
        'phieu_chi_dinh',
        'bao_cao_phau_thuat',
        'giay_ra_vien',
        'khac'
    ) NOT NULL,

    ten_tai_lieu VARCHAR(200) NOT NULL,
    file_public_id VARCHAR(500) NOT NULL COMMENT 'Cloudinary public_id của tài liệu',
    ngay_tao DATE NOT NULL,
    ghi_chu TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    UNIQUE KEY uk_ma_tai_lieu (ma_tai_lieu),
    INDEX idx_phieu_kham_id (phieu_kham_id),
    INDEX idx_loai_tai_lieu (loai_tai_lieu),
    INDEX idx_ngay_tao (ngay_tao),

    CONSTRAINT fk_tl_phieu_kham FOREIGN KEY (phieu_kham_id)
        REFERENCES phieu_kham(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

# MIGRATION

Sửa `backend\database\migrations\2026_03_06_181323_create_chi_dinh_table.php`:
- thêm cột `goi_kham_id` vào bảng `chi_dinh`.

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('chi_dinh', function (Blueprint $table) {
            $table->id();
            $table->foreignId('phieu_kham_id')->constrained('phieu_kham')->cascadeOnDelete();
            $table->foreignId('bac_si_id')->constrained('bac_si')->restrictOnDelete();
            $table->foreignId('dich_vu_id')->nullable()->constrained('dich_vu')->restrictOnDelete();
            $table->foreignId('goi_kham_id')->nullable()->constrained('goi_kham')->restrictOnDelete();
            $table->integer('so_luong')->default(1);
            $table->enum('trang_thai', ['cho_thuc_hien', 'da_hoan_thanh', 'huy'])->default('cho_thuc_hien');
            $table->date('ngay_chi_dinh');
            $table->text('ghi_chu')->nullable();
            $table->timestamps();

            $table->index('phieu_kham_id');
            $table->index('bac_si_id');
            $table->index('dich_vu_id');
            $table->index('goi_kham_id');
            $table->index('trang_thai');
            $table->index('ngay_chi_dinh');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('chi_dinh');
    }
};
```

Sửa `backend\database\migrations\2026_03_06_180808_create_nhan_vien_table.php`:
- bỏ cột `phong_ban` khỏi bảng `nhan_vien`.

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('nhan_vien', function (Blueprint $table) {

            $table->id();

            $table->string('ma_nhan_vien', 20)->unique();

            $table->foreignId('nguoi_dung_id')
                ->unique()
                ->constrained('nguoi_dung');

            $table->string('ho_ten');

            $table->string('so_dien_thoai');

            $table->enum('chuc_vu', ['le_tan', 'nhan_vien_y_te', 'dieu_duong']);

            $table->date('ngay_vao_lam');

            $table->enum('trang_thai', ['hoat_dong', 'tam_khoa', 'nghi_viec'])->default('hoat_dong');

            $table->text('ghi_chu')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('nhan_vien');
    }
};
```

Sửa `backend\database\migrations\2026_03_06_181500_create_lich_hen_table.php`:
- bỏ ràng buộc UNIQUE cho cột `khung_gio_id` trong bảng `lich_hen`.

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('lich_hen', function (Blueprint $table) {

            $table->id();

            $table->string('ma_lich_hen')->unique();

            $table->foreignId('benh_nhan_id')->constrained('benh_nhan');

            $table->foreignId('bac_si_id')->constrained('bac_si');

            $table->foreignId('chuyen_khoa_id')->constrained('chuyen_khoa');

            $table->foreignId('khung_gio_id')
                ->nullable()
                ->constrained('khung_gio_kham')
                ->nullOnDelete();

            $table->date('ngay_hen');

            $table->text('ly_do_kham')->nullable();

            $table->enum('trang_thai', [
                'dang_cho',
                'da_thanh_toan',
                'da_xac_nhan',
                'da_hoan_tat',
                'da_huy',
                'khong_den'
            ])->default('dang_cho');

            $table->foreignId('nguoi_tao_id')
                ->nullable()
                ->constrained('nguoi_dung')
                ->nullOnDelete();

            $table->time('gio_den_thuc_te')->nullable();

            $table->foreignId('nguoi_tiep_nhan_id')
                ->nullable()
                ->constrained('nguoi_dung')
                ->nullOnDelete();

            $table->foreignId('ly_do_huy_id')
                ->nullable()
                ->constrained('ly_do_huy')
                ->nullOnDelete();

            $table->text('ly_do_huy_khac')->nullable();

            $table->text('ghi_chu')->nullable();
            $table->text('ghi_chu_noi_bo')->nullable();

            $table->timestamps();

            $table->index('ngay_hen');
            $table->index('trang_thai');
            $table->index('benh_nhan_id');
            $table->index('bac_si_id');
            $table->index('chuyen_khoa_id');
            $table->index(['bac_si_id', 'ngay_hen']);
            $table->index(['benh_nhan_id', 'ngay_hen']);
            $table->index('nguoi_tao_id');
            $table->index('nguoi_tiep_nhan_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lich_hen');
    }
};
```

Sửa `backend\database\migrations\2026_03_06_180501_create_quyen_table.php`:
- sửa cột `nhom_quyen` từ VARCHAR sang ENUM.

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('quyen', function (Blueprint $table) {
            $table->id();
            $table->string('ma_quyen', 50)->unique();
            $table->string('ten_quyen', 100);
            $table->text('mo_ta')->nullable();
            $table->enum('nhom_quyen', ['quan_tri', 'nguoi_dung', 'le_tan', 'bac_si', 'khac'])->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->index('ma_quyen');
            $table->index('nhom_quyen');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('quyen');
    }
};
```

Sửa `backend\database\migrations\2026_03_06_181324_create_tai_lieu_ho_so_table.php`:
- bỏ cột `file_name` và `file_url`, thêm cột `file_public_id`.

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('tai_lieu_ho_so', function (Blueprint $table) {
            $table->id();
            $table->string('ma_tai_lieu', 80)->unique();
            $table->foreignId('phieu_kham_id')->constrained('phieu_kham')->cascadeOnDelete();
            $table->enum('loai_tai_lieu', [
                'ket_qua_xet_nghiem',
                'ket_qua_sieu_am',
                'ket_qua_xquang',
                'ket_qua_ct_scan',
                'ket_qua_mri',
                'ket_qua_noi_soi',
                'phieu_chi_dinh',
                'bao_cao_phau_thuat',
                'giay_ra_vien',
                'khac',
            ]);
            $table->string('ten_tai_lieu', 200);
            $table->string('file_public_id', 500);
            $table->date('ngay_tao');
            $table->text('ghi_chu')->nullable();
            $table->timestamps();

            $table->index('phieu_kham_id');
            $table->index('loai_tai_lieu');
            $table->index('ngay_tao');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tai_lieu_ho_so');
    }
};
```

---

# DATA SEEDER

Sứa seeder `backend\database\seeders\ChiDinhSeeder.php`:
- thêm dữ liệu mẫu cho cột `goi_kham_id`.

```php
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ChiDinhSeeder extends Seeder
{
    public function run(): void
    {
        $phieu = DB::table('phieu_kham')->pluck('id', 'ma_phieu_kham');
        $bacSi = DB::table('bac_si')->pluck('id', 'ma_bac_si');
        $dichVu = DB::table('dich_vu')->pluck('id', 'ma_dich_vu');
        $goiKham = DB::table('goi_kham')->pluck('id', 'ma_goi_kham');

        $rows = [
            [
                'phieu_kham_id' => $phieu['PK0001'] ?? null,
                'bac_si_id' => $bacSi['BS0001'] ?? null,
                'dich_vu_id' => $dichVu['DV003'] ?? null,
                'goi_kham_id' => null,
                'so_luong' => 1,
                'trang_thai' => 'da_hoan_thanh',
                'ngay_chi_dinh' => '2026-03-16',
                'ghi_chu' => 'Thuc hien trong buoi sang.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        $rows = array_values(array_filter($rows, function (array $row) {
            $hasService = $row['dich_vu_id'] !== null;
            $hasPackage = $row['goi_kham_id'] !== null;

            return
                $row['phieu_kham_id'] !== null &&
                $row['bac_si_id'] !== null &&
                ($hasService xor $hasPackage);
        }));

        DB::table('chi_dinh')->upsert(
            $rows,
            ['phieu_kham_id', 'dich_vu_id', 'goi_kham_id'],
            ['bac_si_id', 'so_luong', 'trang_thai', 'ngay_chi_dinh', 'ghi_chu', 'updated_at']
        );
    }
}
```

Sửa `backend\database\seeders\NhanVienSeeder.php`:
- bỏ dữ liệu mẫu cho cột `phong_ban`.

```php
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class NhanVienSeeder extends Seeder
{
    public function run(): void
    {
        $users = DB::table('nguoi_dung')->pluck('id', 'email');

        DB::table('nhan_vien')->upsert([
            [
                'ma_nhan_vien' => 'NV0001',
                'nguoi_dung_id' => $users['staff1@hospital.local'] ?? null,
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
                'nguoi_dung_id' => $users['staff2@hospital.local'] ?? null,
                'ho_ten' => 'Pham Van Khanh',
                'so_dien_thoai' => '0922000002',
                'chuc_vu' => 'nhan_vien_y_te',
                'ngay_vao_lam' => '2023-06-20',
                'trang_thai' => 'hoat_dong',
                'ghi_chu' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ], ['ma_nhan_vien'], ['nguoi_dung_id', 'ho_ten', 'so_dien_thoai', 'chuc_vu', 'ngay_vao_lam', 'trang_thai', 'ghi_chu', 'updated_at']);
    }
}
```

Sửa `backend\database\seeders\QuyenSeeder.php`:
- sửa dữ liệu mẫu cho cột `nhom_quyen`.

```php
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class QuyenSeeder extends Seeder
{
    public function run(): void
    {
        $quyen = [
            ['ma_quyen' => 'QUAN_LY_NGUOI_DUNG', 'ten_quyen' => 'Quan ly nguoi dung', 'nhom_quyen' => 'quan_tri'],
            ['ma_quyen' => 'QUAN_LY_BAC_SI', 'ten_quyen' => 'Quan ly bac si', 'nhom_quyen' => 'quan_tri'],
            ['ma_quyen' => 'QUAN_LY_CHUYEN_KHOA', 'ten_quyen' => 'Quan ly chuyen khoa', 'nhom_quyen' => 'quan_tri'],
            ['ma_quyen' => 'QUAN_LY_LICH_HEN', 'ten_quyen' => 'Quan ly lich hen', 'nhom_quyen' => 'le_tan'],
            ['ma_quyen' => 'XEM_BAO_CAO', 'ten_quyen' => 'Xem bao cao', 'nhom_quyen' => 'quan_tri'],
            ['ma_quyen' => 'CAU_HINH_HE_THONG', 'ten_quyen' => 'Cau hinh he thong', 'nhom_quyen' => 'quan_tri'],
            ['ma_quyen' => 'XEM_NHAT_KY', 'ten_quyen' => 'Xem nhat ky hoat dong', 'nhom_quyen' => 'quan_tri'],
            ['ma_quyen' => 'DAT_LICH_KHAM', 'ten_quyen' => 'Dat lich kham', 'nhom_quyen' => 'nguoi_dung'],
            ['ma_quyen' => 'KHAM_BENH', 'ten_quyen' => 'Kham benh', 'nhom_quyen' => 'bac_si'],
            ['ma_quyen' => 'KE_DON_THUOC', 'ten_quyen' => 'Ke don thuoc', 'nhom_quyen' => 'bac_si'],
        ];

        $rows = array_map(function (array $item) {
            $item['mo_ta'] = null;
            $item['created_at'] = now();

            return $item;
        }, $quyen);

        DB::table('quyen')->upsert($rows, ['ma_quyen'], ['ten_quyen', 'nhom_quyen']);
    }
}
```

Sửa `backend\database\seeders\TaiLieuHoSoSeeder.php`:
- bỏ dữ liệu mẫu cho cột `file_name` và `file_url`, thêm dữ liệu mẫu cho cột `file_public_id`.

```php
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
                'phieu_kham_id' => $phieu['PK0001'] ?? null,
                'loai_tai_lieu' => 'ket_qua_xet_nghiem',
                'ten_tai_lieu' => 'Ket qua xet nghiem co ban',
                'file_public_id' => 'hospital_booking/medical_documents/appointments_1/document_tl0001',
                'ngay_tao' => '2026-03-16',
                'ghi_chu' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        $rows = array_values(array_filter($rows, fn(array $row) => !is_null($row['phieu_kham_id'])));

        DB::table('tai_lieu_ho_so')->upsert($rows, ['ma_tai_lieu'], ['phieu_kham_id', 'loai_tai_lieu', 'ten_tai_lieu', 'file_public_id', 'ngay_tao', 'ghi_chu', 'updated_at']);
    }
}
```

---

# MODEL

Sửa `backend\app\Models\ChiDinh.php`:
- thêm thuộc tính `goi_kham_id` vào `$fillable`.
- thêm quan hệ `goiKham()` để liên kết với model `GoiKham`.

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ChiDinh extends Model
{
    use HasFactory;

    protected $table = 'chi_dinh';

    protected $fillable = [
        'phieu_kham_id',
        'bac_si_id',
        'dich_vu_id',
        'goi_kham_id',
        'so_luong',
        'trang_thai',
        'ngay_chi_dinh',
        'ghi_chu',
    ];

    protected $casts = [
        'ngay_chi_dinh' => 'datetime',
    ];

    public function phieuKham(): BelongsTo
    {
        return $this->belongsTo(PhieuKham::class, 'phieu_kham_id');
    }

    public function bacSi(): BelongsTo
    {
        return $this->belongsTo(BacSi::class, 'bac_si_id');
    }

    public function dichVu(): BelongsTo
    {
        return $this->belongsTo(DichVu::class, 'dich_vu_id');
    }

    public function goiKham(): BelongsTo
    {
        return $this->belongsTo(GoiKham::class, 'goi_kham_id');
    }
}
```

Sửa `backend\app\Models\NhanVien.php`:
- bỏ thuộc tính `phong_ban` và các phương thức liên quan.

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NhanVien extends Model
{
    use HasFactory;

    protected $table = 'nhan_vien';

    protected $fillable = [
        'ma_nhan_vien',
        'nguoi_dung_id',
        'ho_ten',
        'so_dien_thoai',
        'chuc_vu',
        'ngay_vao_lam',
        'trang_thai',
        'ghi_chu',
    ];

    protected $casts = [
        'ngay_vao_lam' => 'datetime',
    ];

    public function nguoiDung(): BelongsTo
    {
        return $this->belongsTo(NguoiDung::class, 'nguoi_dung_id');
    }
}
```

Sửa `backend\app\Models\LichHen.php`:
- bỏ ràng buộc UNIQUE cho cột `khung_gio_id` trong bảng `lich_hen` (không cần sửa model vì ràng buộc này chỉ có ở database).

Sửa `backend\app\Models\Quyen.php`:
- sửa thuộc tính `nhom_quyen` từ VARCHAR sang ENUM (không cần sửa model vì Laravel sẽ tự động nhận dạng kiểu ENUM).

Sửa `backend\app\Models\TaiLieuHoSo.php`:
- bỏ thuộc tính `file_name` và `file_url`, thêm thuộc tính `file_public_id`.

```php
<?php

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TaiLieuHoSo extends Model
{
    use HasFactory;

    protected $table = 'tai_lieu_ho_so';

    protected $fillable = [
        'ma_tai_lieu',
        'phieu_kham_id',
        'loai_tai_lieu',
        'ten_tai_lieu',
        'file_public_id',
        'ngay_tao',
        'ghi_chu',
    ];

    protected $casts = [
        'ngay_tao' => 'datetime',
    ];

    public function phieuKham(): BelongsTo
    {
        return $this->belongsTo(PhieuKham::class, 'phieu_kham_id');
    }
}
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TaiLieuHoSo extends Model
{
    use HasFactory;

    protected $table = 'tai_lieu_ho_so';

    protected $fillable = [
        'ma_tai_lieu',
        'phieu_kham_id',
        'loai_tai_lieu',
        'ten_tai_lieu',
        'file_public_id',
        'ngay_tao',
        'ghi_chu',
    ];

    protected $casts = [
        'ngay_tao' => 'datetime',
    ];

    public function phieuKham(): BelongsTo
    {
        return $this->belongsTo(PhieuKham::class, 'phieu_kham_id');
    }
}
```