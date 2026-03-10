<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BenhNhan extends Model
{
	use HasFactory;

	protected $table = 'benh_nhan';

	protected $fillable = [
		'ma_benh_nhan',
		'nguoi_dung_id',
		'ho_ten',
		'ngay_sinh',
		'gioi_tinh',
		'so_dien_thoai',
		'email',
		'so_cccd',
		'dia_chi',
		'nguoi_lien_he',
		'sdt_nguoi_lien_he',
		'nhom_mau',
		'tien_su_di_ung',
		'tien_su_benh',
		'ghi_chu',
		'trang_thai',
	];

	protected $casts = [
		'ngay_sinh' => 'datetime',
	];

	public function scopeActive(Builder $query): Builder
	{
		return $query->where('trang_thai', 'hoat_dong');
	}

	public function nguoiDung(): BelongsTo
	{
		return $this->belongsTo(NguoiDung::class, 'nguoi_dung_id');
	}

	public function lichHens(): HasMany
	{
		return $this->hasMany(LichHen::class, 'benh_nhan_id');
	}

	public function phieuKhams(): HasMany
	{
		return $this->hasMany(PhieuKham::class, 'benh_nhan_id');
	}
}
