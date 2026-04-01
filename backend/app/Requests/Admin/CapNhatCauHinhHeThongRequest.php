<?php

namespace App\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class CapNhatCauHinhHeThongRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'items' => ['required', 'array', 'min:1'],
            'items.*.khoa' => ['required', 'string', 'max:100', 'exists:cau_hinh_he_thong,khoa', 'distinct'],
            'items.*.gia_tri' => ['required', 'string'],
            'items.*.mo_ta' => ['nullable', 'string'],
            'items.*.nhom' => ['nullable', 'string', 'max:50'],
        ];
    }
}
