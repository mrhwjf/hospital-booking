<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Service extends Model
{
    use HasFactory;

    protected $table = 'goi_kham';

    protected $fillable = [
        'ma_goi_kham',
        'ten_goi_kham',
        'mo_ta',
        'gia_goi_kham',
        'thoi_gian_du_kien',
        'trang_thai',
    ];

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('trang_thai', 'hoat_dong');
    }

    public function chiTietGoiKhams(): HasMany
    {
        return $this->hasMany(ChiTietGoiKham::class, 'goi_kham_id');
    }

    public function dichVus(): BelongsToMany
    {
        return $this->belongsToMany(DichVu::class, 'chi_tiet_goi_kham', 'goi_kham_id', 'dich_vu_id');
    }
}
