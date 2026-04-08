<?php

namespace App\Requests\Patients;

use App\Models\BenhNhan;
use App\Models\TaiLieuHoSo;
use App\Requests\Concerns\AuthorizesPolicyAbility;
use Illuminate\Foundation\Http\FormRequest;

class CreateTaiLieuHoSoRequest extends FormRequest
{
    use AuthorizesPolicyAbility;

    public function authorize(): bool
    {
        return $this->authorizeModelAbility('view', BenhNhan::class, 'benhNhanId')
            && $this->authorizeClassAbility('create', TaiLieuHoSo::class);
    }

    public function rules(): array
    {
        return [
            'phieu_kham_id' => 'required|integer|exists:phieu_kham,id',
            'loai_tai_lieu' => 'required|in:ket_qua_xet_nghiem,ket_qua_sieu_am,ket_qua_xquang,ket_qua_ct_scan,ket_qua_mri,ket_qua_noi_soi,phieu_chi_dinh,bao_cao_phau_thuat,giay_ra_vien,khac',
            'ten_tai_lieu' => 'required|string|max:200',
            'ngay_tao' => 'required|date',
            'ghi_chu' => 'nullable|string',
        ];
    }
}
