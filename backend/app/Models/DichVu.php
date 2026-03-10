<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class DichVu extends Model
{
	use HasFactory;

	protected $table = 'dich_vu';

	protected $fillable = [
		'ma_dich_vu',
		'ten_dich_vu',
		'chuyen_khoa_id',
		'mo_ta',
		'gia_dich_vu',
		'thoi_gian_du_kien',
		'yeu_cau_dac_biet',
		'trang_thai',
		'loai_dich_vu',
	];

	public function scopeActive(Builder $query): Builder
	{
		return $query->where('trang_thai', 'hoat_dong');
	}

	public function chuyenKhoa(): BelongsTo
	{
		return $this->belongsTo(ChuyenKhoa::class, 'chuyen_khoa_id');
	}

	public function chiTietGoiKhams(): HasMany
	{
		return $this->hasMany(ChiTietGoiKham::class, 'dich_vu_id');
	}

	public function goiKhams(): BelongsToMany
	{
		return $this->belongsToMany(GoiKham::class, 'chi_tiet_goi_kham', 'dich_vu_id', 'goi_kham_id');
	}

	public function dichVuLichHens(): HasMany
	{
		return $this->hasMany(DichVuLichHen::class, 'dich_vu_id');
	}

	public function lichHens(): BelongsToMany
	{
		return $this->belongsToMany(LichHen::class, 'dich_vu_lich_hen', 'dich_vu_id', 'lich_hen_id');
	}

	public function chiDinhs(): HasMany
	{
		return $this->hasMany(ChiDinh::class, 'dich_vu_id');
	}
}
