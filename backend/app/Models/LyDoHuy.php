<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class LyDoHuy extends Model
{
	use HasFactory;

	protected $table = 'ly_do_huy';

	const UPDATED_AT = null;

	protected $fillable = [
		'ma_ly_do',
		'ten_ly_do',
		'loai',
		'thu_tu',
		'trang_thai',
	];

	public function lichHens(): HasMany
	{
		return $this->hasMany(LichHen::class, 'ly_do_huy_id');
	}
}
