<?php

namespace App\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class XoaVaiTroRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'id' => ['required', 'integer', 'exists:vai_tro,id'],
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'id' => $this->route('id'),
        ]);
    }
}
