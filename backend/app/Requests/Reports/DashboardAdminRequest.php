<?php

namespace App\Requests\Reports;

use Illuminate\Foundation\Http\FormRequest;

class DashboardAdminRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'moc_phan_tich' => ['nullable', 'date_format:Y-m-d'],
        ];
    }
}
