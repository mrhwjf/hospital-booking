<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BacSi extends Model
{
	use HasFactory;

	protected $table = 'bac_si';

	protected $fillable = [
		'ma_bac_si',
		'nguoi_dung_id',
		'ho_ten',
		'so_dien_thoai',
		'hoc_vi',
		'chung_chi_hanh_nghe',
		'kinh_nghiem',
		'gioi_thieu',
		'trang_thai',
	];

	public function scopeActive(Builder $query): Builder
	{
		return $query->where('trang_thai', 'hoat_dong');
	}

	public function nguoiDung(): BelongsTo
	{
		return $this->belongsTo(NguoiDung::class, 'nguoi_dung_id');
	}

	public function chuyenKhoas(): BelongsToMany
	{
		return $this->belongsToMany(ChuyenKhoa::class, 'bac_si_chuyen_khoa', 'bac_si_id', 'chuyen_khoa_id');
	}

	public function bacSiChuyenKhoas(): HasMany
	{
		return $this->hasMany(BacSiChuyenKhoa::class, 'bac_si_id');
	}

	public function bacSiNghis(): HasMany
	{
		return $this->hasMany(BacSiNghi::class, 'bac_si_id');
	}

	public function lichLamViecBacSis(): HasMany
	{
		return $this->hasMany(LichLamViecBacSi::class, 'bac_si_id');
	}

	public function lichHens(): HasMany
	{
		return $this->hasMany(LichHen::class, 'bac_si_id');
	}

	public function phieuKhams(): HasMany
	{
		return $this->hasMany(PhieuKham::class, 'bac_si_id');
	}

	public function chiDinhs(): HasMany
	{
		return $this->hasMany(ChiDinh::class, 'bac_si_id');
	}

	public function chuyenKhoaTruongKhoas(): HasMany
	{
		return $this->hasMany(ChuyenKhoa::class, 'truong_khoa_id');
	}
}
