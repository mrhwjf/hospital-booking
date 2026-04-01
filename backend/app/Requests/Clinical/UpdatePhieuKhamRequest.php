<?php

namespace App\Requests\Clinical;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePhieuKhamRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'mach'           => 'nullable|integer',
            'nhiet_do'       => 'nullable|numeric',
            'huyet_ap'       => 'nullable|string|max:20',
            'can_nang'       => 'nullable|numeric',
            'chieu_cao'      => 'nullable|numeric',
            'trieu_chung'    => 'nullable|string',
            'ket_qua_kham'   => 'nullable|string',
            'chan_doan'      => 'nullable|string',
            'ma_icd10_chinh' => 'nullable|string|max:20',
            'tinh_trang'     => 'nullable|string|max:50',
            'huong_dieu_tri' => 'nullable|string',
            'loi_dan'        => 'nullable|string',
            'hen_tai_kham'   => 'nullable|date',
            'ghi_chu_noi_bo' => 'nullable|string',
            'trang_thai'     => 'nullable|in:tiep_nhan,dang_kham,cho_ke_don,hoan_thanh',
        ];
    }
}
