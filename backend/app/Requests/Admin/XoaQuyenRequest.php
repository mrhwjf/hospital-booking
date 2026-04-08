<?php

namespace App\Requests\Admin;

use App\Models\Quyen;
use App\Requests\Concerns\AuthorizesPolicyAbility;
use Illuminate\Foundation\Http\FormRequest;

class XoaQuyenRequest extends FormRequest
{
    use AuthorizesPolicyAbility;

    public function authorize(): bool
    {
        return $this->authorizeModelAbility('delete', Quyen::class, 'id');
    }

    public function rules(): array
    {
        return [
            'id' => ['required', 'integer', 'exists:quyen,id'],
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'id' => $this->route('id'),
        ]);
    }
}
