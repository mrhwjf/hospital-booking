<?php

namespace App\Requests\Reports;

use Illuminate\Foundation\Http\FormRequest;

class BaoCaoLichHenRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'moc_phan_tich' => ['nullable', 'date_format:Y-m-d'],
            'tu_ngay' => ['nullable', 'date_format:Y-m-d'],
            'den_ngay' => ['nullable', 'date_format:Y-m-d', 'after_or_equal:tu_ngay'],
            'chuyen_khoa_id' => ['nullable', 'integer', 'exists:chuyen_khoa,id'],
        ];
    }
}
