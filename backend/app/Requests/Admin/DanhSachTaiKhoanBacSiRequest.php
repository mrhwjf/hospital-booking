<?php

namespace App\Requests\Admin;

use App\Models\NguoiDung;
use App\Requests\Concerns\AuthorizesPolicyAbility;
use Illuminate\Foundation\Http\FormRequest;

class DanhSachTaiKhoanBacSiRequest extends FormRequest
{
    use AuthorizesPolicyAbility;

    public function authorize(): bool
    {
        return $this->authorizeClassAbility('viewAny', NguoiDung::class);
    }

    public function rules(): array
    {
        return [
            'q' => ['nullable', 'string', 'max:255'],
            'trang_thai' => ['nullable', 'string', 'in:hoat_dong,tam_khoa,khoa'],
            'page' => ['nullable', 'integer', 'min:1'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
        ];
    }
}
