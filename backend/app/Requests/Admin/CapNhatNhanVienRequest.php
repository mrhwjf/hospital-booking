<?php

namespace App\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class CapNhatNhanVienRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'id'           => ['required', 'integer', 'exists:nhan_vien,id'],
            'ho_ten'       => ['sometimes', 'string', 'max:100'],
            'so_dien_thoai'=> ['sometimes', 'string', 'regex:/^0\d{9,10}$/'],
            'chuc_vu'      => ['sometimes', 'string', 'in:le_tan,nhan_vien_y_te,dieu_duong'],
            'ngay_vao_lam' => ['sometimes', 'date'],
            'hinh_anh'     => ['nullable', 'string', 'max:255'],
            'trang_thai'   => ['sometimes', 'string', 'in:hoat_dong,tam_khoa,nghi_viec'],
            'ghi_chu'      => ['nullable', 'string'],
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'id' => $this->route('id'),
        ]);
    }
}
