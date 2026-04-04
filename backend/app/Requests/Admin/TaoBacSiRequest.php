<?php

namespace App\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class TaoBacSiRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'kieu_tao' => ['required', 'string', 'in:tai_khoan_co_san,tao_moi_tai_khoan'],
            'nguoi_dung_id' => [
                'nullable',
                'integer',
                Rule::exists('nguoi_dung', 'id'),
            ],
            'email' => ['nullable', 'email', 'max:255', 'unique:nguoi_dung,email'],
            'mat_khau' => ['nullable', 'string', 'min:8', 'max:255'],
            'ho_ten' => ['required', 'string', 'max:100'],
            'so_dien_thoai' => ['required', 'string', 'regex:/^0\d{9,10}$/'],
            'hoc_vi' => ['required', 'string', 'in:bac_si,thac_si,tien_si,pgs,gs'],
            'chung_chi_hanh_nghe' => ['required', 'string', 'max:50'],
            'kinh_nghiem' => ['nullable', 'integer', 'min:0', 'max:80'],
            'gioi_thieu' => ['nullable', 'string'],
            'hinh_anh' => ['nullable', 'string', 'max:255'],
            'trang_thai' => ['nullable', 'string', 'in:hoat_dong,tam_nghi,nghi_viec'],
            'chuyen_khoa_ids' => ['required', 'array', 'min:1'],
            'chuyen_khoa_ids.*' => ['integer', 'distinct', 'exists:chuyen_khoa,id'],
            'chuyen_khoa_chinh_id' => ['required', 'integer', 'exists:chuyen_khoa,id'],
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            $kieuTao = $this->input('kieu_tao');

            if ($kieuTao === 'tai_khoan_co_san') {
                if (!$this->filled('nguoi_dung_id')) {
                    $validator->errors()->add('nguoi_dung_id', 'Vui lòng chọn tài khoản bác sĩ đã có sẵn.');
                }
            }

            if ($kieuTao === 'tao_moi_tai_khoan') {
                if (!$this->filled('email')) {
                    $validator->errors()->add('email', 'Email là bắt buộc khi tạo mới tài khoản bác sĩ.');
                }

                if (!$this->filled('mat_khau')) {
                    $validator->errors()->add('mat_khau', 'Mật khẩu là bắt buộc khi tạo mới tài khoản bác sĩ.');
                }
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
}
