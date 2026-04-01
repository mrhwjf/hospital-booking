<?php

namespace App\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class ResetMatKhauRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'mat_khau_moi' => ['required', 'string', 'min:8', 'max:255'],
        ];
    }

    public function messages(): array
    {
        return [
            'mat_khau_moi.required' => 'Mật khẩu mới là bắt buộc.',
            'mat_khau_moi.min'      => 'Mật khẩu mới phải có ít nhất 8 ký tự.',
        ];
    }
}
