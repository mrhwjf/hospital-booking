<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ChiTietGoiKham extends Model
{
	use HasFactory;

	protected $table = 'chi_tiet_goi_kham';

	protected $fillable = [
		'goi_kham_id',
		'dich_vu_id',
		'thu_tu_hien_thi',
	];

	public function goiKham(): BelongsTo
	{
		return $this->belongsTo(GoiKham::class, 'goi_kham_id');
	}

	public function dichVu(): BelongsTo
	{
		return $this->belongsTo(DichVu::class, 'dich_vu_id');
	}
}
