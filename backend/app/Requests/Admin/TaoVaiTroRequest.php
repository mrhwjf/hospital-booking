<?php

namespace App\Requests\Admin;

use App\Models\VaiTro;
use App\Requests\Concerns\AuthorizesPolicyAbility;
use Illuminate\Foundation\Http\FormRequest;

class TaoVaiTroRequest extends FormRequest
{
    use AuthorizesPolicyAbility;

    public function authorize(): bool
    {
        return $this->authorizeClassAbility('create', VaiTro::class);
    }

    public function rules(): array
    {
        return [
            'ma_vai_tro' => ['required', 'string', 'max:20', 'regex:/^[A-Z0-9_]+$/', 'unique:vai_tro,ma_vai_tro'],
            'ten_vai_tro' => ['required', 'string', 'max:100'],
            'mo_ta' => ['nullable', 'string'],
            'trang_thai' => ['nullable', 'string', 'in:hoat_dong,khoa'],
            'quyen_ids' => ['nullable', 'array'],
            'quyen_ids.*' => ['integer', 'distinct', 'exists:quyen,id'],
        ];
    }
}
