<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class VaiTro extends Model
{
	use HasFactory;

	protected $table = 'vai_tro';

	protected $fillable = [
		'ma_vai_tro',
		'ten_vai_tro',
		'mo_ta',
		'trang_thai',
	];

	public function nguoiDungs(): HasMany
	{
		return $this->hasMany(NguoiDung::class, 'vai_tro_id');
	}

	public function vaiTroQuyens(): HasMany
	{
		return $this->hasMany(VaiTroQuyen::class, 'vai_tro_id');
	}

	public function quyens(): BelongsToMany
	{
		return $this->belongsToMany(Quyen::class, 'vai_tro_quyen', 'vai_tro_id', 'quyen_id');
	}
}
