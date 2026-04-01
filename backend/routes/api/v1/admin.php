<?php

use App\Http\Controllers\Api\V1\Admin\BacSiController;
use App\Http\Controllers\Api\V1\Admin\CauHinhHeThongController;
use App\Http\Controllers\Api\V1\Admin\NhanVienController;
use App\Http\Controllers\Api\V1\Admin\NguoiDungController;
use App\Http\Controllers\Api\V1\Admin\VaiTroQuyenController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Admin API Routes
|--------------------------------------------------------------------------
|
| Prefix: /api/v1
| Các route quản trị người dùng (tạo, sửa, lọc, khóa/mở khóa, reset mật khẩu)
|
*/

Route::middleware(['role:ADMIN'])->group(function () {
	// Nguoi dung CRUD
	Route::get('/nguoi-dung', [NguoiDungController::class, 'index']);
	Route::post('/nguoi-dung', [NguoiDungController::class, 'store']);
	Route::get('/nguoi-dung/{id}', [NguoiDungController::class, 'show'])->where('id', '[0-9]+');
	Route::patch('/nguoi-dung/{id}', [NguoiDungController::class, 'update'])->where('id', '[0-9]+');
	Route::patch('/nguoi-dung/{id}/reset-password', [NguoiDungController::class, 'resetPassword'])->where('id', '[0-9]+');
	Route::patch('/nguoi-dung/{id}/toggle-lock', [NguoiDungController::class, 'toggleLock'])->where('id', '[0-9]+');

	// Ho so bac si CRUD + tim kiem, loc
	Route::get('/bac-si', [BacSiController::class, 'index']);
	Route::get('/bac-si/tai-khoan', [BacSiController::class, 'danhSachTaiKhoanBacSi']);
	Route::post('/bac-si', [BacSiController::class, 'store']);
	Route::get('/bac-si/{id}', [BacSiController::class, 'show'])->where('id', '[0-9]+');
	Route::put('/bac-si/{id}', [BacSiController::class, 'update'])->where('id', '[0-9]+');
	Route::delete('/bac-si/{id}', [BacSiController::class, 'destroy'])->where('id', '[0-9]+');

	// Ho so nhan vien CRUD + tim kiem, loc
	Route::get('/nhan-vien', [NhanVienController::class, 'index']);
	Route::get('/nhan-vien/tai-khoan', [NhanVienController::class, 'danhSachTaiKhoanNhanVien']);
	Route::post('/nhan-vien', [NhanVienController::class, 'store']);
	Route::get('/nhan-vien/{id}', [NhanVienController::class, 'show'])->where('id', '[0-9]+');
	Route::put('/nhan-vien/{id}', [NhanVienController::class, 'update'])->where('id', '[0-9]+');
	Route::delete('/nhan-vien/{id}', [NhanVienController::class, 'destroy'])->where('id', '[0-9]+');

	// Danh muc phuc vu UI ho so bac si
	Route::get('/danh-muc/chuyen-khoa', [BacSiController::class, 'danhSachChuyenKhoa']);

	// Vai tro va phan quyen
	Route::get('/vai-tro', [VaiTroQuyenController::class, 'danhSachVaiTro']);
	Route::get('/vai-tro/{id}', [VaiTroQuyenController::class, 'chiTietVaiTro'])->where('id', '[0-9]+');
	Route::post('/vai-tro', [VaiTroQuyenController::class, 'taoVaiTro']);
	Route::patch('/vai-tro/{id}', [VaiTroQuyenController::class, 'capNhatVaiTro'])->where('id', '[0-9]+');
	Route::delete('/vai-tro/{id}', [VaiTroQuyenController::class, 'xoaVaiTro'])->where('id', '[0-9]+');

	Route::get('/quyen', [VaiTroQuyenController::class, 'danhSachQuyen']);
	Route::post('/quyen', [VaiTroQuyenController::class, 'taoQuyen']);
	Route::patch('/quyen/{id}', [VaiTroQuyenController::class, 'capNhatQuyen'])->where('id', '[0-9]+');
	Route::delete('/quyen/{id}', [VaiTroQuyenController::class, 'xoaQuyen'])->where('id', '[0-9]+');

	// Cau hinh he thong
	Route::get('/cau-hinh-he-thong', [CauHinhHeThongController::class, 'index']);
	Route::put('/cau-hinh-he-thong', [CauHinhHeThongController::class, 'capNhatHangLoat']);
});
