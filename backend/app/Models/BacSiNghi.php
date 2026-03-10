<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BacSiNghi extends Model
{
	use HasFactory;

	protected $table = 'bac_si_nghi';

	const UPDATED_AT = null;

	protected $fillable = [
		'bac_si_id',
		'ngay',
		'gio_bat_dau',
		'gio_ket_thuc',
		'ly_do',
		'trang_thai',
	];

	protected $casts = [
		'ngay' => 'datetime',
	];

	public function bacSi(): BelongsTo
	{
		return $this->belongsTo(BacSi::class, 'bac_si_id');
	}
}
