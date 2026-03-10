-- Tai lieu schema tham chieu (rut gon)
-- Nguon su that chi tiet: .github/context-and-instruction-for-AI/schema.sql

CREATE DATABASE IF NOT EXISTS hospital_booking CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE hospital_booking;

-- RBAC
CREATE TABLE vai_tro (
	id INT AUTO_INCREMENT PRIMARY KEY,
	ma_vai_tro VARCHAR(20) UNIQUE NOT NULL,
	ten_vai_tro VARCHAR(100) NOT NULL
);

CREATE TABLE quyen (
	id INT AUTO_INCREMENT PRIMARY KEY,
	ma_quyen VARCHAR(50) UNIQUE NOT NULL,
	ten_quyen VARCHAR(100) NOT NULL
);

CREATE TABLE vai_tro_quyen (
	id INT AUTO_INCREMENT PRIMARY KEY,
	vai_tro_id INT NOT NULL,
	quyen_id INT NOT NULL,
	UNIQUE KEY uk_vai_tro_quyen (vai_tro_id, quyen_id)
);

-- User profile
CREATE TABLE nguoi_dung (
	id INT AUTO_INCREMENT PRIMARY KEY,
	email VARCHAR(255) UNIQUE NOT NULL,
	mat_khau VARCHAR(255) NOT NULL,
	vai_tro_id INT NOT NULL
);

CREATE TABLE benh_nhan (
	id INT AUTO_INCREMENT PRIMARY KEY,
	ma_benh_nhan VARCHAR(20) UNIQUE NOT NULL,
	nguoi_dung_id INT NULL,
	ho_ten VARCHAR(100) NOT NULL
);

CREATE TABLE bac_si (
	id INT AUTO_INCREMENT PRIMARY KEY,
	ma_bac_si VARCHAR(20) UNIQUE NOT NULL,
	nguoi_dung_id INT NOT NULL UNIQUE,
	ho_ten VARCHAR(100) NOT NULL
);

-- Scheduling
CREATE TABLE lich_lam_viec (
	id INT AUTO_INCREMENT PRIMARY KEY,
	ma_ca VARCHAR(20) UNIQUE NOT NULL,
	thu_trong_tuan TINYINT NOT NULL,
	gio_bat_dau TIME NOT NULL,
	gio_ket_thuc TIME NOT NULL
);

CREATE TABLE lich_lam_viec_bac_si (
	id INT AUTO_INCREMENT PRIMARY KEY,
	bac_si_id INT NOT NULL,
	lich_lam_viec_id INT NOT NULL,
	ngay_lam_viec DATE NOT NULL
);

CREATE TABLE khung_gio_kham (
	id INT AUTO_INCREMENT PRIMARY KEY,
	lich_lam_viec_bac_si_id INT NOT NULL,
	gio_bat_dau TIME NOT NULL,
	gio_ket_thuc TIME NOT NULL,
	trang_thai ENUM('trong','da_dat','khoa') DEFAULT 'trong'
);

CREATE TABLE lich_hen (
	id INT AUTO_INCREMENT PRIMARY KEY,
	ma_lich_hen VARCHAR(20) UNIQUE NOT NULL,
	benh_nhan_id INT NOT NULL,
	bac_si_id INT NOT NULL,
	khung_gio_id INT UNIQUE,
	ngay_hen DATE NOT NULL,
	trang_thai ENUM('dang_cho','da_thanh_toan','da_xac_nhan','da_hoan_tat','da_huy','khong_den') DEFAULT 'dang_cho'
);

-- Clinical
CREATE TABLE phieu_kham (
	id INT AUTO_INCREMENT PRIMARY KEY,
	ma_phieu_kham VARCHAR(20) UNIQUE NOT NULL,
	lich_hen_id INT UNIQUE NULL,
	benh_nhan_id INT NOT NULL,
	bac_si_id INT NOT NULL,
	chan_doan VARCHAR(500) NULL
);

