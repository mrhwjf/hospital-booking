-- ============================================
-- Hospital Booking System - MySQL Database Schema
-- Database: hospital_booking
-- Version: 1.0
-- Created: 2026-01-16
-- Table count: 30
-- ============================================

-- Tạo database
DROP DATABASE IF EXISTS hospital_booking;

CREATE DATABASE IF NOT EXISTS hospital_booking CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE hospital_booking;

-- ============================================
-- BẢNG QUẢN LÝ NGƯỜI DÙNG VÀ PHÂN QUYỀN
-- ============================================

-- Bảng vai trò
-- Mô tả: Bảng lưu trữ các vai trò hệ thống.
CREATE TABLE vai_tro (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ma_vai_tro VARCHAR(20) NOT NULL UNIQUE COMMENT 'Mã vai trò: ADMIN, BACSI, BENHNHAN, NHANVIEN',
    ten_vai_tro VARCHAR(100) NOT NULL,
    mo_ta TEXT,
    trang_thai ENUM('hoat_dong', 'khoa') DEFAULT 'hoat_dong',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_ma_vai_tro (ma_vai_tro),
    INDEX idx_trang_thai (trang_thai)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- Bảng quyền
-- Mô tả: Bảng lưu trữ các quyền cụ thể trong hệ thống.
CREATE TABLE quyen (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ma_quyen VARCHAR(50) NOT NULL UNIQUE COMMENT 'VD: QUAN_LY_NGUOI_DUNG, XEM_BAO_CAO',
    ten_quyen VARCHAR(100) NOT NULL,
    mo_ta TEXT,
    nhom_quyen ENUM(
        'quan_tri',
        'nguoi_dung',
        'le_tan',
        'bac_si',
        'khac'
    ) COMMENT 'Nhóm quyền để phân loại',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_ma_quyen (ma_quyen),
    INDEX idx_nhom_quyen (nhom_quyen)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- Bảng vai trò - quyền (many-to-many)
-- Mô tả: Bảng liên kết giữa vai trò và quyền.
CREATE TABLE vai_tro_quyen (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vai_tro_id INT NOT NULL,
    quyen_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_vai_tro_quyen (vai_tro_id, quyen_id),
    INDEX idx_vai_tro_id (vai_tro_id),
    INDEX idx_quyen_id (quyen_id),
    CONSTRAINT fk_vtq_vai_tro FOREIGN KEY (vai_tro_id) REFERENCES vai_tro (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_vtq_quyen FOREIGN KEY (quyen_id) REFERENCES quyen (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- Bảng người dùng
-- Mô tả: Bảng lưu trữ thông tin người dùng hệ thống.
CREATE TABLE nguoi_dung (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    mat_khau VARCHAR(255) NOT NULL COMMENT 'Mật khẩu đã hash',
    vai_tro_id INT NOT NULL,
    hinh_anh VARCHAR(255) COMMENT 'Đường dẫn ảnh đại diện',
    hinh_anh_public_id VARCHAR(255) COMMENT 'Cloudinary public_id ảnh đại diện',
    trang_thai ENUM(
        'hoat_dong',
        'tam_khoa',
        'khoa'
    ) DEFAULT 'hoat_dong',
    lan_dang_nhap_cuoi TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_email (email),
    INDEX idx_vai_tro_id (vai_tro_id),
    INDEX idx_trang_thai (trang_thai),
    CONSTRAINT fk_nd_vai_tro FOREIGN KEY (vai_tro_id) REFERENCES vai_tro (id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- ============================================
-- BẢNG CHUYÊN KHOA VÀ PHÒNG KHÁM
-- ============================================

-- Bảng chuyên khoa (tạo trước, FK trưởng khoa thêm sau)
-- Mô tả: Bảng lưu trữ các chuyên khoa y tế trong bệnh viện.
CREATE TABLE chuyen_khoa (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ma_chuyen_khoa VARCHAR(20) NOT NULL UNIQUE COMMENT 'Business ID của chuyên khoa, định dạng: NOI hoặc Y_HOC_CO_TRUYEN',
    ten_chuyen_khoa VARCHAR(100) NOT NULL,
    mo_ta TEXT,
    hinh_anh VARCHAR(255),
    hinh_anh_public_id VARCHAR(255) COMMENT 'Cloudinary public_id ảnh chuyên khoa',
    vi_tri VARCHAR(100) COMMENT 'Vị trí: Tầng/Khu',
    so_dien_thoai VARCHAR(15),
    truong_khoa_id INT NULL COMMENT 'FK đến bac_si, thêm sau',
    thu_tu_hien_thi INT DEFAULT 0,
    trang_thai ENUM('hoat_dong', 'tam_ngung') DEFAULT 'hoat_dong',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_ma_chuyen_khoa (ma_chuyen_khoa),
    INDEX idx_ten_chuyen_khoa (ten_chuyen_khoa),
    INDEX idx_trang_thai (trang_thai),
    INDEX idx_thu_tu (thu_tu_hien_thi)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- Bảng phòng khám
-- Mô tả: Bảng lưu trữ thông tin các phòng khám trong bệnh viện.
CREATE TABLE phong_kham (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ma_phong VARCHAR(20) NOT NULL UNIQUE COMMENT 'Business ID của phòng khám, định dạng: PK-<tầng><so_phong> (VD: PK-205)',
    ten_phong VARCHAR(100) NOT NULL,
    chuyen_khoa_id INT,
    vi_tri VARCHAR(100) NOT NULL COMMENT 'VD: Tầng 1, Khu A',
    trang_thiet_bi TEXT COMMENT 'Danh sách trang thiết bị trong phòng',
    trang_thai ENUM(
        'hoat_dong',
        'bao_tri',
        'ngung_su_dung'
    ) DEFAULT 'hoat_dong',
    ghi_chu TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_ma_phong (ma_phong),
    INDEX idx_chuyen_khoa_id (chuyen_khoa_id),
    INDEX idx_trang_thai (trang_thai),
    CONSTRAINT fk_pk_chuyen_khoa FOREIGN KEY (chuyen_khoa_id) REFERENCES chuyen_khoa (id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- ============================================
-- BẢNG DỊCH VỤ KHÁM, GÓI KHÁM VÀ CHI TIẾT GÓI
-- ============================================

-- Bảng dịch vụ
-- Mô tả: Bảng lưu trữ các dịch vụ khám chữa bệnh.
CREATE TABLE dich_vu (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ma_dich_vu VARCHAR(20) NOT NULL UNIQUE COMMENT 'Business ID của dịch vụ, định dạng: DV-<stt> (VD: DV-001)',
    ten_dich_vu VARCHAR(200) NOT NULL,
    chuyen_khoa_id INT NOT NULL,
    mo_ta TEXT,
    gia_dich_vu DECIMAL(12, 0) NOT NULL DEFAULT 0 COMMENT 'Giá VNĐ',
    thoi_gian_du_kien INT COMMENT 'Thời gian dự kiến (phút) để hoàn thành dịch vụ',
    yeu_cau_dac_biet TEXT COMMENT 'VD: Nhịn ăn trước khi khám',
    trang_thai ENUM('hoat_dong', 'tam_ngung') DEFAULT 'hoat_dong',
    loai_dich_vu ENUM(
        'kham_benh',
        'xet_nghiem',
        'chan_doan_hinh_anh',
        'thu_thuat',
        'phau_thuat',
        'khac'
    ) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_ma_dich_vu (ma_dich_vu),
    INDEX idx_chuyen_khoa_id (chuyen_khoa_id),
    INDEX idx_trang_thai (trang_thai),
    INDEX idx_ten_dich_vu (ten_dich_vu),
    CONSTRAINT fk_dv_chuyen_khoa FOREIGN KEY (chuyen_khoa_id) REFERENCES chuyen_khoa (id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- Bảng gói khám
-- Mô tả: Bảng lưu trữ các gói khám tổng hợp.
CREATE TABLE goi_kham (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ma_goi_kham VARCHAR(20) NOT NULL UNIQUE COMMENT 'Business ID của gói khám, định dạng: GK-<stt> (VD: GK-001)',
    ten_goi_kham VARCHAR(200) NOT NULL,
    mo_ta TEXT,
    gia_goi_kham DECIMAL(12, 0) NOT NULL DEFAULT 0 COMMENT 'Giá VNĐ, Thường < tổng giá các dịch vụ bên dưới',
    thoi_gian_du_kien INT COMMENT 'Thời gian dự kiến (phút) để hoàn thành gói khám',
    trang_thai ENUM('hoat_dong', 'tam_ngung') DEFAULT 'hoat_dong',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_ma_goi_kham (ma_goi_kham),
    INDEX idx_trang_thai (trang_thai),
    INDEX idx_ten_goi_kham (ten_goi_kham)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- Bảng chi tiết gói khám
-- Mô tả: Bảng lưu trữ chi tiết các dịch vụ trong gói khám.
CREATE TABLE chi_tiet_goi_kham (
    id INT AUTO_INCREMENT PRIMARY KEY,
    goi_kham_id INT NOT NULL,
    dich_vu_id INT NOT NULL,
    thu_tu_hien_thi INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_goi_kham_dich_vu (goi_kham_id, dich_vu_id),
    INDEX idx_goi_kham_id (goi_kham_id),
    INDEX idx_dich_vu_id (dich_vu_id),
    INDEX idx_thu_tu (thu_tu_hien_thi),
    CONSTRAINT fk_ctgk_goi_kham FOREIGN KEY (goi_kham_id) REFERENCES goi_kham (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_ctgk_dich_vu FOREIGN KEY (dich_vu_id) REFERENCES dich_vu (id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- ============================================
-- BẢNG BỆNH NHÂN
-- ============================================

-- Bảng bệnh nhân
-- Mô tả: Bảng lưu trữ thông tin bệnh nhân.
CREATE TABLE benh_nhan (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ma_benh_nhan VARCHAR(20) NOT NULL UNIQUE COMMENT 'Business ID của bệnh nhân, định dạng: BN-<so_cccd>',
    nguoi_dung_id INT UNIQUE COMMENT 'NULL nếu là walk-in patient',
    ho_ten VARCHAR(100) NOT NULL,
    ngay_sinh DATE NOT NULL,
    gioi_tinh ENUM('nam', 'nu', 'khac') NOT NULL,
    so_dien_thoai VARCHAR(15) NOT NULL,
    email VARCHAR(255),
    so_cccd VARCHAR(12) UNIQUE,
    dia_chi TEXT,
    nguoi_lien_he VARCHAR(100) COMMENT 'Người liên hệ khẩn cấp',
    sdt_nguoi_lien_he VARCHAR(15),
    nhom_mau ENUM(
        'A+',
        'A-',
        'B+',
        'B-',
        'AB+',
        'AB-',
        'O+',
        'O-'
    ),
    tien_su_di_ung TEXT,
    tien_su_benh TEXT COMMENT 'Tiền sử bệnh mãn tính',
    ghi_chu TEXT,
    trang_thai ENUM('hoat_dong', 'khoa') DEFAULT 'hoat_dong',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_ma_benh_nhan (ma_benh_nhan),
    UNIQUE KEY uk_nguoi_dung_id (nguoi_dung_id),
    INDEX idx_so_dien_thoai (so_dien_thoai),
    INDEX idx_ho_ten (ho_ten),
    INDEX idx_trang_thai (trang_thai),
    CONSTRAINT fk_bn_nguoi_dung FOREIGN KEY (nguoi_dung_id) REFERENCES nguoi_dung (id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- ============================================
-- BẢNG NHÂN VIÊN
-- ============================================

-- Bảng nhân viên
-- Mô tả: Bảng lưu trữ thông tin nhân viên bệnh viện.
CREATE TABLE nhan_vien (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ma_nhan_vien VARCHAR(20) NOT NULL UNIQUE COMMENT 'Business ID của nhân viên, định dạng: NV-<stt> (padding 4 số, VD: NV-0001)',
    nguoi_dung_id INT NOT NULL UNIQUE,
    ho_ten VARCHAR(100) NOT NULL,
    so_dien_thoai VARCHAR(15) NOT NULL,
    chuc_vu ENUM(
        'le_tan',
        'nhan_vien_y_te',
        'dieu_duong'
    ) NOT NULL,
    ngay_vao_lam DATE NOT NULL,
    trang_thai ENUM(
        'hoat_dong',
        'tam_khoa',
        'nghi_viec'
    ) DEFAULT 'hoat_dong',
    ghi_chu TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_ma_nhan_vien (ma_nhan_vien),
    UNIQUE KEY uk_nguoi_dung_id (nguoi_dung_id),
    INDEX idx_chuc_vu (chuc_vu),
    INDEX idx_trang_thai (trang_thai),
    CONSTRAINT fk_nv_nguoi_dung FOREIGN KEY (nguoi_dung_id) REFERENCES nguoi_dung (id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- ============================================
-- BẢNG BÁC SĨ
-- ============================================

-- Bảng bác sĩ
-- Mô tả: Bảng lưu trữ thông tin bác sĩ.
CREATE TABLE bac_si (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ma_bac_si VARCHAR(20) NOT NULL UNIQUE COMMENT 'Business ID của bác sĩ, định dạng: BS-<stt> (padding 4 số, VD: BS-0001)',
    nguoi_dung_id INT NOT NULL UNIQUE,
    ho_ten VARCHAR(100) NOT NULL,
    so_dien_thoai VARCHAR(15) NOT NULL,
    hoc_vi ENUM(
        'bac_si',
        'thac_si',
        'tien_si',
        'pgs',
        'gs'
    ) DEFAULT 'bac_si',
    chung_chi_hanh_nghe VARCHAR(50) NOT NULL,
    kinh_nghiem INT COMMENT 'Số năm kinh nghiệm',
    gioi_thieu TEXT,
    trang_thai ENUM(
        'hoat_dong',
        'tam_nghi',
        'nghi_viec'
    ) DEFAULT 'hoat_dong',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_ma_bac_si (ma_bac_si),
    UNIQUE KEY uk_nguoi_dung_id (nguoi_dung_id),
    INDEX idx_hoc_vi (hoc_vi),
    INDEX idx_trang_thai (trang_thai),
    CONSTRAINT fk_bs_nguoi_dung FOREIGN KEY (nguoi_dung_id) REFERENCES nguoi_dung (id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- Thêm FK trưởng khoa cho bảng chuyen_khoa
ALTER TABLE chuyen_khoa
ADD CONSTRAINT fk_ck_truong_khoa FOREIGN KEY (truong_khoa_id) REFERENCES bac_si (id) ON DELETE SET NULL ON UPDATE CASCADE;

-- ============================================
-- BẢNG PHÂN BỔ BÁC SĨ - CHUYÊN KHOA
-- ============================================

-- Bảng phân bổ bác sĩ - chuyên khoa
-- Mô tả: Bảng liên kết nhiều-nhiều giữa bác sĩ và chuyên khoa.
CREATE TABLE bac_si_chuyen_khoa (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bac_si_id INT NOT NULL,
    chuyen_khoa_id INT NOT NULL,
    la_chuyen_khoa_chinh BOOLEAN DEFAULT FALSE COMMENT 'Đánh dấu chuyên khoa chính',
    ghi_chu TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_bac_si_chuyen_khoa (bac_si_id, chuyen_khoa_id),
    INDEX idx_bac_si_id (bac_si_id),
    INDEX idx_chuyen_khoa_id (chuyen_khoa_id),
    INDEX idx_la_chinh (la_chuyen_khoa_chinh),
    CONSTRAINT fk_bsck_bac_si FOREIGN KEY (bac_si_id) REFERENCES bac_si (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_bsck_chuyen_khoa FOREIGN KEY (chuyen_khoa_id) REFERENCES chuyen_khoa (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- ===========================================
-- BẢNG CÁC NGÀY NGHỈ LỄ CHUNG (DANH MỤC)
-- ===========================================

-- Bảng ngày nghỉ lễ
-- Mô tả: Bảng lưu trữ các ngày nghỉ lễ chung trong năm.
CREATE TABLE ngay_nghi_le (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ten_ngay_nghi VARCHAR(100) NOT NULL,
    ngay DATE NOT NULL UNIQUE,
    mo_ta TEXT,
    trang_thai ENUM('hoat_dong', 'huy') DEFAULT 'hoat_dong',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_ngay (ngay),
    INDEX idx_trang_thai (trang_thai)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- ============================================
-- BẢNG NGHỈ RIÊNG BÁC SĨ
-- ============================================

-- Bảng bác sĩ nghỉ
-- Mô tả: Bảng lưu trữ các ngày nghỉ riêng của từng bác sĩ.
CREATE TABLE bac_si_nghi (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bac_si_id INT NOT NULL,
    ngay DATE NOT NULL,
    gio_bat_dau TIME NULL COMMENT 'NULL = nghỉ cả ngày',
    gio_ket_thuc TIME NULL,
    ly_do TEXT,
    trang_thai ENUM('hoat_dong', 'huy') DEFAULT 'hoat_dong',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_bac_si_ngay (bac_si_id, ngay),
    INDEX idx_trang_thai (trang_thai),
    CONSTRAINT fk_bsn_bac_si FOREIGN KEY (bac_si_id) REFERENCES bac_si (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- ============================================
-- BẢNG CA LÀM VIỆC (TEMPLATE)
-- ============================================

-- Bảng ca làm việc (template)
-- Mô tả: Bảng tĩnh lưu các ca làm việc mẫu (theo thứ trong tuần) để gán cho bác sĩ theo ngày.
CREATE TABLE lich_lam_viec (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ma_ca VARCHAR(20) NOT NULL UNIQUE COMMENT 'Business ID của ca làm việc, định dạng: CA-<shiftPrefix>-<weekdayCode>-<suffix>',
    ten_ca VARCHAR(100) NOT NULL,
    thu_trong_tuan TINYINT NOT NULL COMMENT '1=Thứ 2 ... 7=Chủ nhật',
    gio_bat_dau TIME NOT NULL,
    gio_ket_thuc TIME NOT NULL,
    thoi_luong_kham INT NOT NULL DEFAULT 60 COMMENT 'Phút/ca khám. Áp dụng khi sinh khung giờ khám',
    ghi_chu TEXT,
    trang_thai ENUM(
        'hoat_dong',
        'tam_ngung',
        'huy'
    ) DEFAULT 'hoat_dong',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_thu (thu_trong_tuan),
    INDEX idx_trang_thai (trang_thai),
    UNIQUE KEY uk_ma_ca (ma_ca)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- ============================================
-- BẢNG LỊCH LÀM VIỆC BÁC SĨ (THEO NGÀY)
-- ============================================

-- Bảng lịch làm việc bác sĩ
-- Mô tả: Bảng gán ca làm việc (template) cho bác sĩ theo ngày làm việc cụ thể.
CREATE TABLE lich_lam_viec_bac_si (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bac_si_id INT NOT NULL,
    lich_lam_viec_id INT NOT NULL,
    phong_kham_id INT NULL,
    ngay_lam_viec DATE NOT NULL,
    ghi_chu TEXT,
    trang_thai ENUM(
        'hoat_dong',
        'tam_ngung',
        'huy'
    ) DEFAULT 'hoat_dong',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_bac_si_ngay_ca (
        bac_si_id,
        ngay_lam_viec,
        lich_lam_viec_id
    ),
    INDEX idx_bac_si_id (bac_si_id),
    INDEX idx_ngay_lam_viec (ngay_lam_viec),
    INDEX idx_trang_thai (trang_thai),
    INDEX idx_phong_kham_id (phong_kham_id),
    CONSTRAINT fk_llvbs_bac_si FOREIGN KEY (bac_si_id) REFERENCES bac_si (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_llvbs_llv FOREIGN KEY (lich_lam_viec_id) REFERENCES lich_lam_viec (id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_llvbs_phong_kham FOREIGN KEY (phong_kham_id) REFERENCES phong_kham (id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- ============================================
-- BẢNG KHUNG GIỜ KHÁM
-- ============================================

-- Bảng khung giờ khám
-- Mô tả: Bảng lưu trữ các khung giờ khám theo ngày (tạo từ lịch làm việc bác sĩ).
CREATE TABLE khung_gio_kham (
    id INT AUTO_INCREMENT PRIMARY KEY,
    lich_lam_viec_bac_si_id INT NOT NULL,

-- Khung giờ cụ thể trong ngày, dựa vào lich_lam_viec.thoi_luong_kham hoặc tùy chỉnh riêng
gio_bat_dau TIME NOT NULL,
    gio_ket_thuc TIME NOT NULL,

    trang_thai ENUM('trong', 'da_dat', 'khoa') DEFAULT 'trong',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_lich_lam_viec_bac_si_id (lich_lam_viec_bac_si_id),
    UNIQUE KEY uk_lich_gio (lich_lam_viec_bac_si_id, gio_bat_dau),
    INDEX idx_trang_thai (trang_thai),
    
    CONSTRAINT fk_kgk_llvbs FOREIGN KEY (lich_lam_viec_bac_si_id)
        REFERENCES lich_lam_viec_bac_si(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- BẢNG LÝ DO HỦY LỊCH (DANH MỤC)
-- ============================================

-- Bảng lý do hủy
-- Mô tả: Bảng lưu trữ các lý do hủy lịch hẹn.
CREATE TABLE ly_do_huy (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ma_ly_do VARCHAR(20) NOT NULL UNIQUE COMMENT 'Business ID của lý do hủy, định dạng: <TYPE>_<REASON> (VD: BN_DOI_LICH_KHAM)',
    ten_ly_do VARCHAR(200) NOT NULL,
    loai ENUM(
        'benh_nhan',
        'bac_si',
        'he_thong'
    ) NOT NULL,
    thu_tu INT DEFAULT 0,
    trang_thai ENUM('hoat_dong', 'an') DEFAULT 'hoat_dong',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_ma_ly_do (ma_ly_do),
    INDEX idx_loai (loai),
    INDEX idx_trang_thai (trang_thai)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- ============================================
-- BẢNG LỊCH HẸN KHÁM
-- ============================================

-- Bảng lịch hẹn
-- Mô tả: Bảng lưu trữ thông tin lịch hẹn khám của bệnh nhân.
CREATE TABLE lich_hen (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ma_lich_hen VARCHAR(20) NOT NULL UNIQUE COMMENT 'Business ID của lịch hẹn, định dạng: LH-<YYYYMMDD>-<HHMMSSmmm>',
    benh_nhan_id INT NOT NULL,
    bac_si_id INT NOT NULL,
    chuyen_khoa_id INT NOT NULL,
    khung_gio_id INT COMMENT 'Khung giờ khám đã đặt, chỉ cho 1 bệnh nhân/khung giờ',
    ngay_hen DATE NOT NULL,
    ly_do_kham TEXT,
    trang_thai ENUM(
        'dang_cho',
        'da_thanh_toan',
        'da_xac_nhan',
        'da_hoan_tat',
        'da_huy',
        'khong_den'
    ) DEFAULT 'dang_cho',
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
    CONSTRAINT fk_lh_benh_nhan FOREIGN KEY (benh_nhan_id) REFERENCES benh_nhan (id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_lh_bac_si FOREIGN KEY (bac_si_id) REFERENCES bac_si (id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_lh_chuyen_khoa FOREIGN KEY (chuyen_khoa_id) REFERENCES chuyen_khoa (id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_lh_khung_gio FOREIGN KEY (khung_gio_id) REFERENCES khung_gio_kham (id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_lh_nguoi_tao FOREIGN KEY (nguoi_tao_id) REFERENCES nguoi_dung (id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_lh_nguoi_tiep_nhan FOREIGN KEY (nguoi_tiep_nhan_id) REFERENCES nguoi_dung (id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_lh_ly_do_huy FOREIGN KEY (ly_do_huy_id) REFERENCES ly_do_huy (id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- ============================================
-- BẢNG DỊCH VỤ/GÓI KHÁM CỦA LỊCH HẸN (N-N)
-- ============================================

-- Bảng dịch vụ lịch hẹn
-- Mô tả: Mỗi lịch hẹn có thể chọn nhiều dịch vụ đơn lẻ và/hoặc nhiều gói khám.
CREATE TABLE dich_vu_lich_hen (
    id INT AUTO_INCREMENT PRIMARY KEY,
    lich_hen_id INT NOT NULL,
    dich_vu_id INT NULL,
    goi_kham_id INT NULL,
    so_luong INT NOT NULL DEFAULT 1,
    ghi_chu TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_lh_dich_vu (lich_hen_id, dich_vu_id),
    UNIQUE KEY uk_lh_goi_kham (lich_hen_id, goi_kham_id),
    INDEX idx_lich_hen_id (lich_hen_id),
    INDEX idx_dich_vu_id (dich_vu_id),
    INDEX idx_goi_kham_id (goi_kham_id),
    CONSTRAINT fk_dvlh_lich_hen FOREIGN KEY (lich_hen_id) REFERENCES lich_hen (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_dvlh_dich_vu FOREIGN KEY (dich_vu_id) REFERENCES dich_vu (id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_dvlh_goi_kham FOREIGN KEY (goi_kham_id) REFERENCES goi_kham (id) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- ============================================
-- BẢNG DANH MỤC ICD-10 (STATIC LOOKUP)
-- ============================================

-- Bảng ICD-10
-- Mô tả: Danh mục mã ICD-10 tĩnh để chuẩn hóa chẩn đoán.
CREATE TABLE icd10 (
    ma_icd10 VARCHAR(10) PRIMARY KEY COMMENT 'Mã ICD-10, VD: R51',
    ten_chan_doan VARCHAR(255) NOT NULL COMMENT 'Tên chẩn đoán theo ICD-10',
    nhom_chuong VARCHAR(20) COMMENT 'Nhóm/chương ICD-10, VD: VI',
    mo_ta TEXT,
    trang_thai ENUM('hoat_dong', 'an') DEFAULT 'hoat_dong',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_ten_chan_doan (ten_chan_doan),
    INDEX idx_nhom_chuong (nhom_chuong),
    INDEX idx_trang_thai (trang_thai)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- ============================================
-- BẢNG PHIẾU KHÁM BỆNH
-- ============================================

-- Bảng phiếu khám
-- Mô tả: Bảng lưu trữ thông tin phiếu khám bệnh của bệnh nhân.
CREATE TABLE phieu_kham (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ma_phieu_kham VARCHAR(20) NOT NULL UNIQUE COMMENT 'Business ID của phiếu khám, định dạng: PK-<YYYYMMDD>-<HHMMSSmmm>',
    lich_hen_id INT UNIQUE COMMENT 'NULL nếu là walk-in patient',
    benh_nhan_id INT NOT NULL,
    bac_si_id INT NOT NULL,
    nguoi_tao_id INT COMMENT 'Người tiếp nhận/tạo phiếu (nhân viên/lễ tân)',
    thoi_gian_tiep_nhan TIMESTAMP NULL COMMENT 'Thời điểm tiếp nhận (check-in)',

-- Sinh hiệu
mach INT COMMENT 'Mạch (lần/phút)',
nhiet_do DECIMAL(3, 1) COMMENT 'Nhiệt độ (°C)',
huyet_ap VARCHAR(10) COMMENT 'VD: 120/80, <huyết áp tâm thu/huyết áp tâm trương>',
can_nang DECIMAL(5, 2) COMMENT 'Cân nặng (kg)',
chieu_cao DECIMAL(5, 2) COMMENT 'Chiều cao (cm)',

-- Thông tin khám (có thể để trống khi tiếp nhận; bác sĩ sẽ cập nhật khi khám)
trieu_chung TEXT, ket_qua_kham TEXT,

-- Chẩn đoán
chan_doan VARCHAR(500) COMMENT 'Tự động hoàn thành từ ICD-10 nếu không có thì nhập tay, nếu có nhiều chẩn đoán thì cách nhau dấu chấm phẩy',
ma_icd10_chinh VARCHAR(10) COMMENT 'Mã ICD-10 chẩn đoán chính',
tinh_trang ENUM('nhe', 'trung_binh', 'nang'),

-- Hướng điều trị
huong_dieu_tri TEXT,
    loi_dan TEXT COMMENT 'Lời dặn bệnh nhân',
    hen_tai_kham DATE COMMENT 'Ngày tái khám nếu có (chỉ là gợi ý, không tự động tạo lịch)',
    ghi_chu_noi_bo TEXT COMMENT 'Ghi chú nội bộ',
    
    trang_thai ENUM('tiep_nhan', 'dang_kham', 'cho_ke_don', 'hoan_thanh') DEFAULT 'tiep_nhan',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    UNIQUE KEY uk_ma_phieu_kham (ma_phieu_kham),
    UNIQUE KEY uk_lich_hen_id (lich_hen_id),
    INDEX idx_benh_nhan_id (benh_nhan_id),
    INDEX idx_bac_si_id (bac_si_id),
    INDEX idx_nguoi_tao_id (nguoi_tao_id),
    INDEX idx_ma_icd10_chinh (ma_icd10_chinh),
    INDEX idx_benh_nhan_ngay (benh_nhan_id, created_at),
    INDEX idx_trang_thai (trang_thai),
    INDEX idx_chan_doan (chan_doan(100)),
    
    CONSTRAINT fk_pk_lich_hen FOREIGN KEY (lich_hen_id) 
        REFERENCES lich_hen(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_pk_benh_nhan FOREIGN KEY (benh_nhan_id) 
        REFERENCES benh_nhan(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_pk_bac_si FOREIGN KEY (bac_si_id) 
        REFERENCES bac_si(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_pk_nguoi_tao FOREIGN KEY (nguoi_tao_id)
        REFERENCES nguoi_dung(id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_pk_icd10 FOREIGN KEY (ma_icd10_chinh)
        REFERENCES icd10(ma_icd10) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- BẢNG CHỈ ĐỊNH DỊCH VỤ
-- ============================================

-- Bảng chỉ định
-- Mô tả: Bảng lưu trữ các chỉ định dịch vụ cho phiếu khám.
CREATE TABLE chi_dinh (
    id INT AUTO_INCREMENT PRIMARY KEY,
    phieu_kham_id INT NOT NULL,
    bac_si_id INT NOT NULL COMMENT 'Bác sĩ chỉ định',
    dich_vu_id INT NULL,
    goi_kham_id INT NULL,
    so_luong INT DEFAULT 1 COMMENT 'Số lượng chỉ định',
    trang_thai ENUM(
        'cho_thuc_hien',
        'da_hoan_thanh',
        'huy'
    ) DEFAULT 'cho_thuc_hien',
    ngay_chi_dinh DATE NOT NULL,
    ghi_chu TEXT COMMENT 'Ghi chú cho chỉ định',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_phieu_kham_id (phieu_kham_id),
    INDEX idx_bac_si_id (bac_si_id),
    INDEX idx_dich_vu_id (dich_vu_id),
    INDEX idx_trang_thai (trang_thai),
    INDEX idx_ngay_chi_dinh (ngay_chi_dinh),
    CONSTRAINT fk_cdxn_phieu_kham FOREIGN KEY (phieu_kham_id) REFERENCES phieu_kham (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_cdxn_dich_vu FOREIGN KEY (dich_vu_id) REFERENCES dich_vu (id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_cdxn_goi_kham FOREIGN KEY (goi_kham_id) REFERENCES goi_kham (id) ON DELETE RESTRICT ON UPDATE CASCADE,
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- ============================================
-- BẢNG TÀI LIỆU HỒ SƠ BỆNH ÁN
-- ============================================

-- Bảng tài liệu hồ sơ
-- Mô tả: Bảng lưu trữ các tài liệu liên quan đến hồ sơ (file) bệnh án của bệnh nhân.
CREATE TABLE tai_lieu_ho_so (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ma_tai_lieu VARCHAR(20) NOT NULL UNIQUE COMMENT 'Business ID của tài liệu hồ sơ, định dạng: TL-<YYYYMMDD>-<HHMMSSmmm>',
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
    CONSTRAINT fk_tl_phieu_kham FOREIGN KEY (phieu_kham_id) REFERENCES phieu_kham (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- ============================================
-- BẢNG THUỐC
-- ============================================

-- Bảng thuốc
-- Mô tả: Bảng lưu trữ thông tin các loại thuốc.
CREATE TABLE thuoc (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ma_thuoc VARCHAR(20) NOT NULL UNIQUE COMMENT 'Business ID của thuốc, định dạng: THUOC-<stt> (VD: THUOC-001)',
    ten_thuoc VARCHAR(200) NOT NULL,
    hoat_chat VARCHAR(200) COMMENT 'Hoạt chất chính của thuốc',
    don_vi ENUM(
        'vien',
        'goi',
        'ong',
        'ml',
        'lo',
        'hop',
        'chai'
    ) NOT NULL,
    ham_luong VARCHAR(50),
    duong_dung ENUM(
        'uong',
        'tiem',
        'truyen',
        'boi',
        'nho',
        'xit'
    ) NOT NULL,
    huong_dan_su_dung TEXT,
    trang_thai ENUM('hoat_dong', 'ngung_su_dung') DEFAULT 'hoat_dong',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_ma_thuoc (ma_thuoc),
    INDEX idx_ten_thuoc (ten_thuoc),
    INDEX idx_hoat_chat (hoat_chat),
    INDEX idx_trang_thai (trang_thai)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- ============================================
-- BẢNG ĐƠN THUỐC
-- ============================================

-- Bảng đơn thuốc
-- Mô tả: Bảng lưu trữ thông tin đơn thuốc được kê cho bệnh
CREATE TABLE don_thuoc (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ma_don_thuoc VARCHAR(20) NOT NULL UNIQUE COMMENT 'Business ID của đơn thuốc, định dạng: DT-<YYYYMMDD>-<HHMMSSmmm>',
    phieu_kham_id INT NOT NULL UNIQUE,
    ngay_ke DATE NOT NULL,
    ghi_chu TEXT,
    trang_thai ENUM('moi_tao', 'da_cap', 'huy') DEFAULT 'moi_tao',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_ma_don_thuoc (ma_don_thuoc),
    UNIQUE KEY uk_phieu_kham_id (phieu_kham_id),
    INDEX idx_ngay_ke (ngay_ke),
    INDEX idx_trang_thai (trang_thai),
    CONSTRAINT fk_dt_phieu_kham FOREIGN KEY (phieu_kham_id) REFERENCES phieu_kham (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- ============================================
-- BẢNG CHI TIẾT ĐƠN THUỐC
-- ============================================

-- Bảng chi tiết đơn thuốc
-- Mô tả: Bảng lưu trữ chi tiết các thuốc trong đơn thuốc.
CREATE TABLE chi_tiet_don_thuoc (
    id INT AUTO_INCREMENT PRIMARY KEY,
    don_thuoc_id INT NOT NULL,
    thuoc_id INT NOT NULL,
    so_luong INT NOT NULL,
    lieu_dung VARCHAR(200) NOT NULL COMMENT 'VD: 2 viên x 3 lần/ngày',
    thoi_diem ENUM(
        'truoc_an',
        'sau_an',
        'trong_an',
        'khong_lien_quan'
    ) DEFAULT 'khong_lien_quan',
    so_ngay INT NOT NULL COMMENT 'Số ngày dùng',
    ghi_chu TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_don_thuoc_id (don_thuoc_id),
    INDEX idx_thuoc_id (thuoc_id),
    CONSTRAINT fk_ctdt_don_thuoc FOREIGN KEY (don_thuoc_id) REFERENCES don_thuoc (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_ctdt_thuoc FOREIGN KEY (thuoc_id) REFERENCES thuoc (id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- ============================================
-- BẢNG CẤU HÌNH HỆ THỐNG
-- ============================================

-- Bảng cấu hình hệ thống
-- Mô tả: Bảng lưu trữ các cấu hình hệ thống dưới dạng key-value. (Admin/devs quản lý)
CREATE TABLE cau_hinh_he_thong (
    id INT AUTO_INCREMENT PRIMARY KEY,
    khoa VARCHAR(100) NOT NULL UNIQUE,
    gia_tri TEXT NOT NULL,
    mo_ta TEXT,
    nhom VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_khoa (khoa),
    INDEX idx_nhom (nhom)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- ============================================
-- BẢNG THÔNG BÁO
-- ============================================

-- Bảng thông báo
-- Mô tả: Bảng lưu trữ các thông báo gửi đến người dùng.
CREATE TABLE thong_bao (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nguoi_nhan_id INT NOT NULL COMMENT 'Người nhận thông báo',
    tieu_de VARCHAR(200) NOT NULL,
    noi_dung TEXT NOT NULL,
    loai ENUM(
        'lich_hen',
        'he_thong',
        'nhac_nho'
    ) NOT NULL,
    lien_ket VARCHAR(255) COMMENT 'link điều hướng khi người dùng click vào thông báo',
    da_doc BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_nguoi_nhan_id (nguoi_nhan_id),
    INDEX idx_da_doc (da_doc),
    INDEX idx_loai (loai),
    INDEX idx_created_at (created_at),
    INDEX idx_nguoi_nhan_da_doc (nguoi_nhan_id, da_doc),
    CONSTRAINT fk_tb_nguoi_nhan FOREIGN KEY (nguoi_nhan_id) REFERENCES nguoi_dung (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;