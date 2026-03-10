<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PhongKham extends Model
{
	use HasFactory;

	protected $table = 'phong_kham';

	protected $fillable = [
		'ma_phong',
		'ten_phong',
		'chuyen_khoa_id',
		'vi_tri',
		'trang_thiet_bi',
		'trang_thai',
		'ghi_chu',
	];

	public function chuyenKhoa(): BelongsTo
	{
		return $this->belongsTo(ChuyenKhoa::class, 'chuyen_khoa_id');
	}

	public function lichLamViecBacSis(): HasMany
	{
		return $this->hasMany(LichLamViecBacSi::class, 'phong_kham_id');
	}
}
