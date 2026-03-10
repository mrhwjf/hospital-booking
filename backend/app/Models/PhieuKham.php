<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class PhieuKham extends Model
{
	use HasFactory;

	protected $table = 'phieu_kham';

	protected $fillable = [
		'ma_phieu_kham',
		'lich_hen_id',
		'benh_nhan_id',
		'bac_si_id',
		'nguoi_tao_id',
		'thoi_gian_tiep_nhan',
		'mach',
		'nhiet_do',
		'huyet_ap',
		'can_nang',
		'chieu_cao',
		'trieu_chung',
		'ket_qua_kham',
		'chan_doan',
		'ma_icd10_chinh',
		'tinh_trang',
		'huong_dieu_tri',
		'loi_dan',
		'hen_tai_kham',
		'ghi_chu_noi_bo',
		'trang_thai',
	];

	protected $casts = [
		'thoi_gian_tiep_nhan' => 'datetime',
		'hen_tai_kham' => 'datetime',
	];

	public function scopeToday(Builder $query): Builder
	{
		return $query->whereDate('created_at', today());
	}

	public function scopeForDoctor(Builder $query, int $doctorId): Builder
	{
		return $query->where('bac_si_id', $doctorId);
	}

	public function scopeForPatient(Builder $query, int $patientId): Builder
	{
		return $query->where('benh_nhan_id', $patientId);
	}

	public function scopeBetweenDates(Builder $query, string $fromDate, string $toDate): Builder
	{
		return $query->whereBetween('created_at', [$fromDate, $toDate]);
	}

	public function lichHen(): BelongsTo
	{
		return $this->belongsTo(LichHen::class, 'lich_hen_id');
	}

	public function benhNhan(): BelongsTo
	{
		return $this->belongsTo(BenhNhan::class, 'benh_nhan_id');
	}

	public function bacSi(): BelongsTo
	{
		return $this->belongsTo(BacSi::class, 'bac_si_id');
	}

	public function nguoiTao(): BelongsTo
	{
		return $this->belongsTo(NguoiDung::class, 'nguoi_tao_id');
	}

	public function icd10Chinh(): BelongsTo
	{
		return $this->belongsTo(Icd10::class, 'ma_icd10_chinh', 'ma_icd10');
	}

	public function chiDinhs(): HasMany
	{
		return $this->hasMany(ChiDinh::class, 'phieu_kham_id');
	}

	public function taiLieuHoSos(): HasMany
	{
		return $this->hasMany(TaiLieuHoSo::class, 'phieu_kham_id');
	}

	public function donThuoc(): HasOne
	{
		return $this->hasOne(DonThuoc::class, 'phieu_kham_id');
	}
}
