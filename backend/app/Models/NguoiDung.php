<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Laravel\Sanctum\HasApiTokens;

class NguoiDung extends Authenticatable
{
	use HasApiTokens, HasFactory;

	protected $table = 'nguoi_dung';

	protected $fillable = [
		'email',
		'mat_khau',
		'vai_tro_id',
		'hinh_anh',
		'trang_thai',
		'lan_dang_nhap_cuoi',
	];

	protected $casts = [
		'lan_dang_nhap_cuoi' => 'datetime',
	];

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
