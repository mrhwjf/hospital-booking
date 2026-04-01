<?php

namespace App\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class DanhSachChuyenKhoaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'q'          => ['nullable', 'string', 'max:255'],
            'trang_thai' => ['nullable', 'string', 'in:hoat_dong,tam_ngung'],
            'page'       => ['nullable', 'integer', 'min:1'],
            'per_page'   => ['nullable', 'integer', 'min:1', 'max:100'],
        ];
    }
}
