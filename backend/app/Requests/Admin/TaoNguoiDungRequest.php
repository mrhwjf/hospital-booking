<?php

namespace App\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class TaoNguoiDungRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'email'      => ['required', 'email', 'max:255', 'unique:nguoi_dung,email'],
            'mat_khau'   => ['required', 'string', 'min:8', 'max:255'],
            'vai_tro'    => ['required', 'string', 'exists:vai_tro,ma_vai_tro'],
            'hinh_anh'   => ['nullable', 'string', 'max:255'],
            'trang_thai' => ['nullable', 'string', 'in:hoat_dong,tam_khoa,khoa'],
        ];
    }

    public function messages(): array
    {
        return [
            'email.required'    => 'Email là bắt buộc.',
            'email.email'       => 'Email không hợp lệ.',
            'email.unique'      => 'Email đã tồn tại trong hệ thống.',
            'mat_khau.required' => 'Mật khẩu là bắt buộc.',
            'mat_khau.min'      => 'Mật khẩu phải có ít nhất 8 ký tự.',
            'vai_tro.required'  => 'Vai trò là bắt buộc.',
            'vai_tro.exists'    => 'Vai trò không tồn tại.',
            'trang_thai.in'     => 'Trạng thái không hợp lệ.',
        ];
    }
}
