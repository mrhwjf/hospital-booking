<?php

namespace App\Requests\Admin;

use App\Models\BacSi;
use App\Requests\Concerns\AuthorizesPolicyAbility;
use Illuminate\Foundation\Http\FormRequest;

class XoaBacSiRequest extends FormRequest
{
    use AuthorizesPolicyAbility;

    public function authorize(): bool
    {
        return $this->authorizeModelAbility('delete', BacSi::class, 'id');
    }

    public function rules(): array
    {
        return [
            'id' => ['required', 'integer', 'exists:bac_si,id'],
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'id' => $this->route('id'),
        ]);
    }
}
