<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TaiLieuHoSo extends Model
{
	use HasFactory;

	protected $table = 'tai_lieu_ho_so';

	protected $fillable = [
		'ma_tai_lieu',
		'phieu_kham_id',
		'loai_tai_lieu',
		'ten_tai_lieu',
		'file_public_id',
		'ngay_tao',
		'ghi_chu',
	];

	protected $casts = [
		'ngay_tao' => 'datetime',
	];

	public function phieuKham(): BelongsTo
	{
		return $this->belongsTo(PhieuKham::class, 'phieu_kham_id');
	}
}
