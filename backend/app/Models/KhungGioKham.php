<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class KhungGioKham extends Model
{
	use HasFactory;

	protected $table = 'khung_gio_kham';

	protected $fillable = [
		'lich_lam_viec_bac_si_id',
		'gio_bat_dau',
		'gio_ket_thuc',
		'trang_thai',
	];

	public function scopeActive(Builder $query): Builder
	{
		return $query->where('trang_thai', 'trong');
	}

	public function scopeToday(Builder $query): Builder
	{
		return $query->whereHas('lichLamViecBacSi', function (Builder $scheduleQuery) {
			$scheduleQuery->whereDate('ngay_lam_viec', today());
		});
	}

	public function scopeUpcoming(Builder $query): Builder
	{
		return $query->whereHas('lichLamViecBacSi', function (Builder $scheduleQuery) {
			$scheduleQuery->whereDate('ngay_lam_viec', '>', today());
		});
	}

	public function scopeForDoctor(Builder $query, int $doctorId): Builder
	{
		return $query->whereHas('lichLamViecBacSi', function (Builder $scheduleQuery) use ($doctorId) {
			$scheduleQuery->where('bac_si_id', $doctorId);
		});
	}

	public function lichLamViecBacSi(): BelongsTo
	{
		return $this->belongsTo(LichLamViecBacSi::class, 'lich_lam_viec_bac_si_id');
	}

	public function lichHen(): HasOne
	{
		return $this->hasOne(LichHen::class, 'khung_gio_id');
	}
}
