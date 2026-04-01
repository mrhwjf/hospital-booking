<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Specialty extends Model
{
    use HasFactory;

    protected $table = 'chuyen_khoa';

    protected $fillable = [
        'ma_chuyen_khoa',
        'ten_chuyen_khoa',
        'mo_ta',
        'hinh_anh',
        'vi_tri',
        'so_dien_thoai',
        'truong_khoa_id',
        'thu_tu_hien_thi',
        'trang_thai',
    ];

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('trang_thai', 'hoat_dong');
    }
}
