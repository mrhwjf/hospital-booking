<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ChiTietDonThuoc extends Model
{
	use HasFactory;

	protected $table = 'chi_tiet_don_thuoc';

	const UPDATED_AT = null;

	protected $fillable = [
		'don_thuoc_id',
		'thuoc_id',
		'so_luong',
		'lieu_dung',
		'thoi_diem',
		'so_ngay',
		'ghi_chu',
	];

	public function donThuoc(): BelongsTo
	{
		return $this->belongsTo(DonThuoc::class, 'don_thuoc_id');
	}

	public function thuoc(): BelongsTo
	{
		return $this->belongsTo(Thuoc::class, 'thuoc_id');
	}
}
