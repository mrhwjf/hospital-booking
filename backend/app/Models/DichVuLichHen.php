<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DichVuLichHen extends Model
{
	use HasFactory;

	protected $table = 'dich_vu_lich_hen';

	protected $fillable = [
		'lich_hen_id',
		'dich_vu_id',
		'goi_kham_id',
		'so_luong',
		'ghi_chu',
	];

	public function lichHen(): BelongsTo
	{
		return $this->belongsTo(LichHen::class, 'lich_hen_id');
	}

	public function dichVu(): BelongsTo
	{
		return $this->belongsTo(DichVu::class, 'dich_vu_id');
	}

	public function goiKham(): BelongsTo
	{
		return $this->belongsTo(GoiKham::class, 'goi_kham_id');
	}
}
