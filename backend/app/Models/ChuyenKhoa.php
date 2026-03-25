<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ChuyenKhoa extends Model
{
	use HasFactory;

	protected $table = 'chuyen_khoa';

	protected $fillable = [
		'ma_chuyen_khoa',
		'ten_chuyen_khoa',
		'mo_ta',
		'hinh_anh',
		'hinh_anh_public_id',
		'vi_tri',
		'so_dien_thoai',
		'truong_khoa_id',
		'thu_tu_hien_thi',
		'trang_thai',
	];

	public function scopeActive(Builder $query): Builder
	{
		return $query->where('trang_thai', 'hoat_dong');
	}

	public function truongKhoa(): BelongsTo
	{
		return $this->belongsTo(BacSi::class, 'truong_khoa_id');
	}

	public function phongKhams(): HasMany
	{
		return $this->hasMany(PhongKham::class, 'chuyen_khoa_id');
	}

	public function dichVus(): HasMany
	{
		return $this->hasMany(DichVu::class, 'chuyen_khoa_id');
	}

	public function bacSiChuyenKhoas(): HasMany
	{
		return $this->hasMany(BacSiChuyenKhoa::class, 'chuyen_khoa_id');
	}

	public function bacSis(): BelongsToMany
	{
		return $this->belongsToMany(BacSi::class, 'bac_si_chuyen_khoa', 'chuyen_khoa_id', 'bac_si_id');
	}

	public function lichHens(): HasMany
	{
		return $this->hasMany(LichHen::class, 'chuyen_khoa_id');
	}
}
