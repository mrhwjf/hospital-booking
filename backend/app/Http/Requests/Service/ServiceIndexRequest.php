<?php

namespace App\Http\Requests\Service;

use Illuminate\Foundation\Http\FormRequest;

class ServiceIndexRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'specialty_id' => ['nullable', 'integer', 'exists:chuyen_khoa,id'],
            'q' => ['nullable', 'string', 'max:150'],
        ];
    }
}
