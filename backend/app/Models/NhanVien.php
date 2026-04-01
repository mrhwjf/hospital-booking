<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NhanVien extends Model
{
    use HasFactory;

    protected $table = 'nhan_vien';

    protected $fillable = [
        'ma_nhan_vien',
        'nguoi_dung_id',
        'ho_ten',
        'so_dien_thoai',
        'chuc_vu',
        'ngay_vao_lam',
        'trang_thai',
        'ghi_chu',
    ];

    protected $casts = [
        'ngay_vao_lam' => 'datetime',
    ];

    public function nguoiDung(): BelongsTo
    {
        return $this->belongsTo(NguoiDung::class, 'nguoi_dung_id');
    }
}