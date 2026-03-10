<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BacSiChuyenKhoa extends Model
{
	use HasFactory;

	protected $table = 'bac_si_chuyen_khoa';

	protected $fillable = [
		'bac_si_id',
		'chuyen_khoa_id',
		'la_chuyen_khoa_chinh',
		'ghi_chu',
	];

	protected $casts = [
		'la_chuyen_khoa_chinh' => 'boolean',
	];

	public function bacSi(): BelongsTo
	{
		return $this->belongsTo(BacSi::class, 'bac_si_id');
	}

	public function chuyenKhoa(): BelongsTo
	{
		return $this->belongsTo(ChuyenKhoa::class, 'chuyen_khoa_id');
	}
}
