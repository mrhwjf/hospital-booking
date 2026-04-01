<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class NguoiDung extends Authenticatable
{
	use HasFactory, HasApiTokens, Notifiable;

	protected $table = 'nguoi_dung';

	protected $fillable = [
		'email',
		'ho_ten',
		'mat_khau',
		'vai_tro_id',
		'hinh_anh',
		'trang_thai',
		'lan_dang_nhap_cuoi',
	];

	protected $hidden = ['mat_khau'];

	protected $casts = [
		'lan_dang_nhap_cuoi' => 'datetime',
	];

	// Ánh xạ field mật khẩu sang tên cột thực trong DB
	public function getAuthPassword(): string
	{
		return $this->mat_khau;
	}

	public function getAuthPasswordName(): string
	{
		return 'mat_khau';
	}

	public function scopeActive(Builder $query): Builder
	{
		return $query->where('trang_thai', 'hoat_dong');
	}

	public function vaiTro(): BelongsTo
	{
		return $this->belongsTo(VaiTro::class, 'vai_tro_id');
	}

	public function benhNhan(): HasOne
	{
		return $this->hasOne(BenhNhan::class, 'nguoi_dung_id');
	}

	public function nhanVien(): HasOne
	{
		return $this->hasOne(NhanVien::class, 'nguoi_dung_id');
	}

	public function bacSi(): HasOne
	{
		return $this->hasOne(BacSi::class, 'nguoi_dung_id');
	}

	public function lichHenNguoiTaos(): HasMany
	{
		return $this->hasMany(LichHen::class, 'nguoi_tao_id');
	}

	public function lichHenNguoiTiepNhans(): HasMany
	{
		return $this->hasMany(LichHen::class, 'nguoi_tiep_nhan_id');
	}

	public function phieuKhamNguoiTaos(): HasMany
	{
		return $this->hasMany(PhieuKham::class, 'nguoi_tao_id');
	}

	public function thongBaos(): HasMany
	{
		return $this->hasMany(ThongBao::class, 'nguoi_nhan_id');
	}
}
