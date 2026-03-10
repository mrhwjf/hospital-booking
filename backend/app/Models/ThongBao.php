<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ThongBao extends Model
{
	use HasFactory;

	protected $table = 'thong_bao';

	const UPDATED_AT = null;

	protected $fillable = [
		'nguoi_nhan_id',
		'tieu_de',
		'noi_dung',
		'loai',
		'lien_ket',
		'da_doc',
	];

	protected $casts = [
		'da_doc' => 'boolean',
	];

	public function nguoiNhan(): BelongsTo
	{
		return $this->belongsTo(NguoiDung::class, 'nguoi_nhan_id');
	}
}
