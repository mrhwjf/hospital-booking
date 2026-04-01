<?php

namespace App\Requests\Clinical;

use Illuminate\Foundation\Http\FormRequest;

class StoreChiDinhRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'bac_si_id' => 'nullable|integer|exists:bac_si,id',
            'items' => 'required|array|min:1',
            'items.*.dich_vu_id' => 'required|integer|exists:dich_vu,id',
            'items.*.so_luong' => 'nullable|integer|min:1',
            'items.*.trang_thai' => 'nullable|in:cho_thuc_hien,da_hoan_thanh,huy',
            'items.*.ngay_chi_dinh' => 'nullable|date',
            'items.*.ghi_chu' => 'nullable|string',
        ];
    }
}