<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class LichLamViec extends Model
{
	use HasFactory;

	protected $table = 'lich_lam_viec';

	protected $fillable = [
		'ma_ca',
		'ten_ca',
		'thu_trong_tuan',
		'gio_bat_dau',
		'gio_ket_thuc',
		'thoi_luong_kham',
		'ghi_chu',
		'trang_thai',
	];

	public function lichLamViecBacSis(): HasMany
	{
		return $this->hasMany(LichLamViecBacSi::class, 'lich_lam_viec_id');
	}
}
