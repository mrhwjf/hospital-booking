<?php

namespace App\Requests\Clinical;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\PhieuKham;

class UpdatePhieuKhamRequest extends FormRequest
{
    public function authorize(): bool
    {
        $phieuKhamId = (int) $this->route('id');

        if (!$phieuKhamId) {
            return false;
        }

        $phieuKham = PhieuKham::query()->find($phieuKhamId);
        if (!$phieuKham) {
            return false;
        }

        return (bool) $this->user()?->can('update', $phieuKham);
    }

    public function rules(): array
    {
        return [
            'mach' => 'nullable|integer|min:0|max:300',
            'nhiet_do' => 'nullable|numeric|min:30|max:45',
            'huyet_ap' => ['nullable', 'string', 'max:20', 'regex:/^\d{2,3}\/\d{2,3}$/'],
            'can_nang' => 'nullable|numeric|min:0|max:500',
            'chieu_cao' => 'nullable|numeric|min:0|max:300',
            'trieu_chung' => 'nullable|string',
            'ket_qua_kham' => 'nullable|string',
            'chan_doan' => 'nullable|string',
            'ma_icd10_chinh' => 'nullable|string|exists:icd10,ma_icd10',
            'tinh_trang' => 'nullable|in:nhe,trung_binh,nang',
            'huong_dieu_tri' => 'nullable|string',
            'loi_dan' => 'nullable|string',
            'hen_tai_kham' => 'nullable|date',
            'ghi_chu_noi_bo' => 'nullable|string',
        ];
    }

    public function messages(): array
    {
        return [
            'huyet_ap.regex' => 'Huyết áp phải theo định dạng <tâm thu>/<tâm trương>, ví dụ 120/80.',
            'ma_icd10_chinh.exists' => 'Mã ICD10 chính không hợp lệ.',
            'tinh_trang.in' => 'Tình trạng không hợp lệ.',
        ];
    }
}
