<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class LichHen extends Model
{
	use HasFactory;

	protected $table = 'lich_hen';

	protected $fillable = [
		'ma_lich_hen',
		'benh_nhan_id',
		'bac_si_id',
		'chuyen_khoa_id',
		'khung_gio_id',
		'ngay_hen',
		'ly_do_kham',
		'trang_thai',
		'nguoi_tao_id',
		'gio_den_thuc_te',
		'nguoi_tiep_nhan_id',
		'ly_do_huy_id',
		'ly_do_huy_khac',
		'ghi_chu',
		'ghi_chu_noi_bo',
	];

	protected $casts = [
		'ngay_hen' => 'date:Y-m-d',
	];

	public function scopeToday(Builder $query): Builder
	{
		return $query->whereDate('ngay_hen', today());
	}

	public function scopeUpcoming(Builder $query): Builder
	{
		return $query->whereDate('ngay_hen', '>', today());
	}

	public function scopeForDoctor(Builder $query, int $doctorId): Builder
	{
		return $query->where('bac_si_id', $doctorId);
	}

	public function scopeForPatient(Builder $query, int $patientId): Builder
	{
		return $query->where('benh_nhan_id', $patientId);
	}

	public function scopeConfirmed(Builder $query): Builder
	{
		return $query->where('trang_thai', 'da_xac_nhan');
	}

	public function scopeBetweenDates(Builder $query, string $fromDate, string $toDate): Builder
	{
		return $query->whereBetween('ngay_hen', [$fromDate, $toDate]);
	}

	public function benhNhan(): BelongsTo
	{
		return $this->belongsTo(BenhNhan::class, 'benh_nhan_id');
	}

	public function bacSi(): BelongsTo
	{
		return $this->belongsTo(BacSi::class, 'bac_si_id');
	}

	public function chuyenKhoa(): BelongsTo
	{
		return $this->belongsTo(ChuyenKhoa::class, 'chuyen_khoa_id');
	}

	public function khungGioKham(): BelongsTo
	{
		return $this->belongsTo(KhungGioKham::class, 'khung_gio_id');
	}

	public function nguoiTao(): BelongsTo
	{
		return $this->belongsTo(NguoiDung::class, 'nguoi_tao_id');
	}

	public function nguoiTiepNhan(): BelongsTo
	{
		return $this->belongsTo(NguoiDung::class, 'nguoi_tiep_nhan_id');
	}

	public function lyDoHuy(): BelongsTo
	{
		return $this->belongsTo(LyDoHuy::class, 'ly_do_huy_id');
	}

	public function dichVuLichHens(): HasMany
	{
		return $this->hasMany(DichVuLichHen::class, 'lich_hen_id');
	}

	public function dichVus(): BelongsToMany
	{
		return $this->belongsToMany(DichVu::class, 'dich_vu_lich_hen', 'lich_hen_id', 'dich_vu_id');
	}

	public function goiKhams(): BelongsToMany
	{
		return $this->belongsToMany(GoiKham::class, 'dich_vu_lich_hen', 'lich_hen_id', 'goi_kham_id');
	}

	public function phieuKham(): HasOne
	{
		return $this->hasOne(PhieuKham::class, 'lich_hen_id');
	}
}
