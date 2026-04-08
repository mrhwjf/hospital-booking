<?php

namespace App\Requests\Admin;

use App\Models\Quyen;
use App\Requests\Concerns\AuthorizesPolicyAbility;
use Illuminate\Foundation\Http\FormRequest;

class TaoQuyenRequest extends FormRequest
{
    use AuthorizesPolicyAbility;

    public function authorize(): bool
    {
        return $this->authorizeClassAbility('create', Quyen::class);
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
