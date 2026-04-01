<?php

namespace App\Http\Requests\Doctor;

use Illuminate\Foundation\Http\FormRequest;

class DoctorIndexRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'specialty_id' => ['nullable', 'integer', 'exists:chuyen_khoa,id'],
            'chuyen_khoa_id' => ['nullable', 'integer', 'exists:chuyen_khoa,id'],
            'q' => ['nullable', 'string', 'max:100'],
        ];
    }

    protected function prepareForValidation(): void
    {
        if ($this->filled('chuyen_khoa_id') && !$this->filled('specialty_id')) {
            $this->merge([
                'specialty_id' => $this->input('chuyen_khoa_id'),
            ]);
        }
    }
}
