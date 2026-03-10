<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CauHinhHeThong extends Model
{
	use HasFactory;

	protected $table = 'cau_hinh_he_thong';

	protected $fillable = [
		'khoa',
		'gia_tri',
		'mo_ta',
		'nhom',
	];
}
