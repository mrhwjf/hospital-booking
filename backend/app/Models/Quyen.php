<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Quyen extends Model
{
	use HasFactory;

	protected $table = 'quyen';

	const UPDATED_AT = null;

	protected $fillable = [
		'ma_quyen',
		'ten_quyen',
		'mo_ta',
		'nhom_quyen',
	];

	public function vaiTroQuyens(): HasMany
	{
		return $this->hasMany(VaiTroQuyen::class, 'quyen_id');
	}

	public function vaiTros(): BelongsToMany
	{
		return $this->belongsToMany(VaiTro::class, 'vai_tro_quyen', 'quyen_id', 'vai_tro_id');
	}
}
