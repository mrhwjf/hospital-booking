<?php

namespace App\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class TaoQuyenRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'ma_quyen' => ['required', 'string', 'max:50', 'regex:/^[A-Z0-9_]+$/', 'unique:quyen,ma_quyen'],
            'ten_quyen' => ['required', 'string', 'max:100'],
            'mo_ta' => ['nullable', 'string'],
            'nhom_quyen' => ['nullable', 'string', 'max:50'],
        ];
    }
}
