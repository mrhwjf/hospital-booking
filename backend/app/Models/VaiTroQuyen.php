<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VaiTroQuyen extends Model
{
	use HasFactory;

	protected $table = 'vai_tro_quyen';

	const UPDATED_AT = null;

	protected $fillable = [
		'vai_tro_id',
		'quyen_id',
	];

	public function vaiTro(): BelongsTo
	{
		return $this->belongsTo(VaiTro::class, 'vai_tro_id');
	}

	public function quyen(): BelongsTo
	{
		return $this->belongsTo(Quyen::class, 'quyen_id');
	}
}
