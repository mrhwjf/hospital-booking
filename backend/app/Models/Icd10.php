<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Icd10 extends Model
{
	use HasFactory;

	protected $table = 'icd10';

	protected $primaryKey = 'ma_icd10';

	public $incrementing = false;

	protected $keyType = 'string';

	protected $fillable = [
		'ma_icd10',
		'ten_chan_doan',
		'nhom_chuong',
		'mo_ta',
		'trang_thai',
	];

	public function phieuKhams(): HasMany
	{
		return $this->hasMany(PhieuKham::class, 'ma_icd10_chinh', 'ma_icd10');
	}
}
