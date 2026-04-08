<?php

namespace App\Requests\Admin;

use App\Models\BacSi;
use App\Requests\Concerns\AuthorizesPolicyAbility;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CapNhatBacSiRequest extends FormRequest
{
    use AuthorizesPolicyAbility;

    public function authorize(): bool
    {
        return $this->authorizeModelAbility('update', BacSi::class, 'id');
    }

    public function rules(): array
    {
        return [
            'id' => ['required', 'integer', 'exists:bac_si,id'],
            'email' => [
                'sometimes',
                'email',
                'max:255',
                Rule::unique('nguoi_dung', 'email')->ignore($this->nguoi_dung_id),
            ],
            'ho_ten' => ['sometimes', 'string', 'max:100'],
            'so_dien_thoai' => ['sometimes', 'string', 'regex:/^0\d{9,10}$/'],
            'hoc_vi' => ['sometimes', 'string', 'in:bac_si,thac_si,tien_si,pgs,gs'],
            'chung_chi_hanh_nghe' => ['sometimes', 'string', 'max:50'],
            'kinh_nghiem' => ['nullable', 'integer', 'min:0', 'max:80'],
            'gioi_thieu' => ['nullable', 'string'],
            'hinh_anh' => ['nullable', 'string', 'max:255'],
            'trang_thai' => ['sometimes', 'string', 'in:hoat_dong,tam_nghi,nghi_viec'],
            'chuyen_khoa_ids' => ['sometimes', 'array', 'min:1'],
            'chuyen_khoa_ids.*' => ['integer', 'distinct', 'exists:chuyen_khoa,id'],
            'chuyen_khoa_chinh_id' => ['sometimes', 'integer', 'exists:chuyen_khoa,id'],
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            if (!$this->has('chuyen_khoa_ids')) {
                return;
            }

            if (!$this->filled('chuyen_khoa_chinh_id')) {
                $validator->errors()->add('chuyen_khoa_chinh_id', 'Vui lòng chọn chuyên khoa chính khi cập nhật danh sách chuyên khoa.');
                return;
            }

            $chuyenKhoaIds = collect($this->input('chuyen_khoa_ids', []))
                ->map(fn($id) => (int) $id)
                ->filter()
                ->values();

            $chuyenKhoaChinhId = (int) $this->input('chuyen_khoa_chinh_id');
            if ($chuyenKhoaChinhId > 0 && !$chuyenKhoaIds->contains($chuyenKhoaChinhId)) {
                $validator->errors()->add('chuyen_khoa_chinh_id', 'Chuyên khoa chính phải nằm trong danh sách chuyên khoa đã chọn.');
            }
        });
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'id' => $this->route('id'),
        ]);

        if ($this->route('id')) {
            $bacSi = \App\Models\BacSi::query()->select(['id', 'nguoi_dung_id'])->find($this->route('id'));
            if ($bacSi) {
                $this->merge([
                    'nguoi_dung_id' => $bacSi->nguoi_dung_id,
                ]);
            }
        }
    }
}
