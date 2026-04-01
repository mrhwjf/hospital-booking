<?php

namespace App\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CapNhatVaiTroRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('id');

        return [
            'id' => ['required', 'integer', 'exists:vai_tro,id'],
            'ma_vai_tro' => ['sometimes', 'string', 'max:20', 'regex:/^[A-Z0-9_]+$/', Rule::unique('vai_tro', 'ma_vai_tro')->ignore($id)],
            'ten_vai_tro' => ['sometimes', 'string', 'max:100'],
            'mo_ta' => ['nullable', 'string'],
            'trang_thai' => ['sometimes', 'string', 'in:hoat_dong,khoa'],
            'quyen_ids' => ['sometimes', 'array'],
            'quyen_ids.*' => ['integer', 'distinct', 'exists:quyen,id'],
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'id' => $this->route('id'),
        ]);
    }
}
