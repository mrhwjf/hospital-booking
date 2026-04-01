<?php

namespace App\Http\Requests\Specialty;

use Illuminate\Foundation\Http\FormRequest;

class SpecialtyIndexRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'q' => ['nullable', 'string', 'max:100'],
        ];
    }
}
