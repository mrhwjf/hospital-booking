<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class DonThuoc extends Model
{
	use HasFactory;

	protected $table = 'don_thuoc';

	protected $fillable = [
		'ma_don_thuoc',
		'phieu_kham_id',
		'ngay_ke',
		'ghi_chu',
		'trang_thai',
	];

	protected $casts = [
		'ngay_ke' => 'datetime',
	];

	public function phieuKham(): BelongsTo
	{
		return $this->belongsTo(PhieuKham::class, 'phieu_kham_id');
	}

	public function chiTietDonThuocs(): HasMany
	{
		return $this->hasMany(ChiTietDonThuoc::class, 'don_thuoc_id');
	}
}
