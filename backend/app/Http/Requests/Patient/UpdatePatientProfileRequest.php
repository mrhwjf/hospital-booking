<?php

namespace App\Http\Requests\Patient;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePatientProfileRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Already authenticated via middleware
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'ho_ten' => 'required|string|max:100',
            'ngay_sinh' => 'required|date',
            'gioi_tinh' => 'required|in:nam,nu,khac',
            'so_dien_thoai' => 'required|string|max:15',
            'email' => 'nullable|email|max:255',
            'so_cccd' => [
                'nullable',
                'string',
                'max:12',
                'unique:benh_nhan,so_cccd,' . $this->getUserId()
            ],
            'dia_chi' => 'nullable|string',
            'nguoi_lien_he' => 'nullable|string|max:100',
            'sdt_nguoi_lien_he' => 'nullable|string|max:15',
            'nhom_mau' => 'nullable|in:A+,A-,B+,B-,AB+,AB-,O+,O-',
            'tien_su_di_ung' => 'nullable|string',
            'tien_su_benh' => 'nullable|string',
            'ghi_chu' => 'nullable|string',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'ho_ten.required' => 'Họ tên là bắt buộc',
            'ho_ten.string' => 'Họ tên phải là văn bản',
            'ho_ten.max' => 'Họ tên không được vượt quá 100 ký tự',
            'ngay_sinh.required' => 'Ngày sinh là bắt buộc',
            'ngay_sinh.date' => 'Ngày sinh không hợp lệ',
            'gioi_tinh.required' => 'Giới tính là bắt buộc',
            'gioi_tinh.in' => 'Giới tính phải là nam, nữ hoặc khác',
            'so_dien_thoai.required' => 'Số điện thoại là bắt buộc',
            'so_dien_thoai.string' => 'Số điện thoại phải là văn bản',
            'so_dien_thoai.max' => 'Số điện thoại không được vượt quá 15 ký tự',
            'email.email' => 'Email không hợp lệ',
            'email.max' => 'Email không được vượt quá 255 ký tự',
            'so_cccd.max' => 'Số CCCD không được vượt quá 12 ký tự',
            'so_cccd.unique' => 'Số CCCD này đã tồn tại',
            'nhom_mau.in' => 'Nhóm máu không hợp lệ',
        ];
    }

    /**
     * Get the ID of the current patient from benh_nhan table
     */
    private function getUserId()
    {
        $benhNhan = \App\Models\BenhNhan::where('nguoi_dung_id', auth()->id())->first();
        return $benhNhan ? $benhNhan->id : null;
    }
}
