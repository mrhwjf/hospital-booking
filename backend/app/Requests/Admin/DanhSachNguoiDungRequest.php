<?php

namespace App\Requests\Admin;

use App\Models\NguoiDung;
use App\Requests\Concerns\AuthorizesPolicyAbility;
use Illuminate\Foundation\Http\FormRequest;

class DanhSachNguoiDungRequest extends FormRequest
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
            'vai_tro' => ['nullable', 'string', 'exists:vai_tro,ma_vai_tro'],
            'trang_thai' => ['nullable', 'string', 'in:hoat_dong,tam_khoa,khoa'],
            'page' => ['nullable', 'integer', 'min:1'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
        ];
    }
}
