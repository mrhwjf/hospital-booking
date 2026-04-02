<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ChiDinh extends Model
{
    use HasFactory;

    protected $table = 'chi_dinh';

    protected $fillable = [
        'phieu_kham_id',
        'bac_si_id',
        'dich_vu_id',
        'goi_kham_id',
        'so_luong',
        'trang_thai',
        'ngay_chi_dinh',
        'ghi_chu',
    ];

    protected $casts = [
        'ngay_chi_dinh' => 'datetime',
    ];

    public function phieuKham(): BelongsTo
    {
        return $this->belongsTo(PhieuKham::class, 'phieu_kham_id');
    }

    public function bacSi(): BelongsTo
    {
        return $this->belongsTo(BacSi::class, 'bac_si_id');
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