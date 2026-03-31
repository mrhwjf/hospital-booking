<?php

namespace App\Requests\Patients;

use Illuminate\Foundation\Http\FormRequest;

class ListTaiLieuHoSoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'keyword' => 'nullable|string|max:255',
            'phieu_kham_id' => 'nullable|integer|exists:phieu_kham,id',
            'loai_tai_lieu' => 'nullable|in:ket_qua_xet_nghiem,ket_qua_sieu_am,ket_qua_xquang,ket_qua_ct_scan,ket_qua_mri,ket_qua_noi_soi,phieu_chi_dinh,bao_cao_phau_thuat,giay_ra_vien,khac',
            'per_page' => 'nullable|integer|min:1|max:100',
        ];
    }
}
