<?php

namespace App\Requests\Reports;

use Illuminate\Foundation\Http\FormRequest;

class BaoCaoDoanhThuRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'tu_ngay' => ['nullable', 'date_format:Y-m-d'],
            'den_ngay' => ['nullable', 'date_format:Y-m-d', 'after_or_equal:tu_ngay'],
            'chuyen_khoa_id' => ['nullable', 'integer', 'exists:chuyen_khoa,id'],
            'loai_dich_vu' => ['nullable', 'string', 'in:kham_benh,xet_nghiem,chan_doan_hinh_anh,thu_thuat,phau_thuat,khac'],
            'muc_tieu_thang' => ['nullable', 'numeric', 'min:0'],
        ];
    }
}
