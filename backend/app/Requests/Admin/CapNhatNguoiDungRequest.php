<?php

namespace App\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CapNhatNguoiDungRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $nguoiDungId = $this->route('id');

        return [
            'email'      => ['sometimes', 'email', 'max:255', Rule::unique('nguoi_dung', 'email')->ignore($nguoiDungId)],
            'vai_tro'    => ['sometimes', 'string', 'exists:vai_tro,ma_vai_tro'],
            'hinh_anh'   => ['nullable', 'string', 'max:255'],
            'trang_thai' => ['sometimes', 'string', 'in:hoat_dong,tam_khoa,khoa'],
        ];
    }

    public function messages(): array
    {
        return [
            'email.email'    => 'Email không hợp lệ.',
            'email.unique'   => 'Email đã tồn tại trong hệ thống.',
            'vai_tro.exists' => 'Vai trò không tồn tại.',
            'trang_thai.in'  => 'Trạng thái không hợp lệ.',
        ];
    }
}
