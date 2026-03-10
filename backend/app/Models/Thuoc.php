<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Thuoc extends Model
{
	use HasFactory;

	protected $table = 'thuoc';

	protected $fillable = [
		'ma_thuoc',
		'ten_thuoc',
		'hoat_chat',
		'don_vi',
		'ham_luong',
		'duong_dung',
		'huong_dan_su_dung',
		'trang_thai',
	];

	public function chiTietDonThuocs(): HasMany
	{
		return $this->hasMany(ChiTietDonThuoc::class, 'thuoc_id');
	}
}
