<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class LichLamViecBacSi extends Model
{
	use HasFactory;

	protected $table = 'lich_lam_viec_bac_si';

	protected $fillable = [
		'bac_si_id',
		'lich_lam_viec_id',
		'phong_kham_id',
		'ngay_lam_viec',
		'ghi_chu',
		'trang_thai',
	];

	protected $casts = [
		'ngay_lam_viec' => 'datetime',
	];

	public function scopeActive(Builder $query): Builder
	{
		return $query->where('trang_thai', 'hoat_dong');
	}

	public function scopeToday(Builder $query): Builder
	{
		return $query->whereDate('ngay_lam_viec', today());
	}

	public function scopeUpcoming(Builder $query): Builder
	{
		return $query->whereDate('ngay_lam_viec', '>', today());
	}

	public function scopeForDoctor(Builder $query, int $doctorId): Builder
	{
		return $query->where('bac_si_id', $doctorId);
	}

	public function scopeBetweenDates(Builder $query, string $fromDate, string $toDate): Builder
	{
		return $query->whereBetween('ngay_lam_viec', [$fromDate, $toDate]);
	}

	public function bacSi(): BelongsTo
	{
		return $this->belongsTo(BacSi::class, 'bac_si_id');
	}

	public function lichLamViec(): BelongsTo
	{
		return $this->belongsTo(LichLamViec::class, 'lich_lam_viec_id');
	}

	public function phongKham(): BelongsTo
	{
		return $this->belongsTo(PhongKham::class, 'phong_kham_id');
	}

	public function khungGioKhams(): HasMany
	{
		return $this->hasMany(KhungGioKham::class, 'lich_lam_viec_bac_si_id');
	}
}
