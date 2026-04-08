<?php

namespace App\Requests\Admin;

use App\Models\Quyen;
use App\Requests\Concerns\AuthorizesPolicyAbility;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CapNhatQuyenRequest extends FormRequest
{
    use AuthorizesPolicyAbility;

    public function authorize(): bool
    {
        return $this->authorizeModelAbility('update', Quyen::class, 'id');
    }

    public function rules(): array
    {
        $id = $this->route('id');

        return [
            'id' => ['required', 'integer', 'exists:quyen,id'],
            'ma_quyen' => ['sometimes', 'string', 'max:50', 'regex:/^[A-Z0-9_]+$/', Rule::unique('quyen', 'ma_quyen')->ignore($id)],
            'ten_quyen' => ['sometimes', 'string', 'max:100'],
            'mo_ta' => ['nullable', 'string'],
            'nhom_quyen' => ['sometimes', 'nullable', 'string', 'max:50'],
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'id' => $this->route('id'),
        ]);
    }
}
