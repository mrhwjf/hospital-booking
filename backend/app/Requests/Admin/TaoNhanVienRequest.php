<?php

namespace App\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class TaoNhanVienRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nguoi_dung_id' => ['required', 'integer', 'exists:nguoi_dung,id'],
            'ho_ten'        => ['required', 'string', 'max:100'],
            'so_dien_thoai' => ['required', 'string', 'regex:/^0\d{9,10}$/'],
            'chuc_vu'       => ['required', 'string', 'in:le_tan,nhan_vien_y_te,dieu_duong'],
            'ngay_vao_lam'  => ['required', 'date'],
            'hinh_anh'      => ['nullable', 'string', 'max:255'],
            'trang_thai'    => ['nullable', 'string', 'in:hoat_dong,tam_khoa,nghi_viec'],
            'ghi_chu'       => ['nullable', 'string'],
        ];
    }
}
