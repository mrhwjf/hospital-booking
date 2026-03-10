<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NgayNghiLe extends Model
{
	use HasFactory;

	protected $table = 'ngay_nghi_le';

	const UPDATED_AT = null;

	protected $fillable = [
		'ten_ngay_nghi',
		'ngay',
		'mo_ta',
		'trang_thai',
	];

	protected $casts = [
		'ngay' => 'datetime',
	];
}
