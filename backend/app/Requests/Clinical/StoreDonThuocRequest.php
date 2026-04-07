<?php

namespace App\Requests\Clinical;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\PhieuKham;

class StoreDonThuocRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $phieuKhamId = (int) $this->route('phieu_kham_id');

        if (!$phieuKhamId) {
            return false;
        }

        $phieuKham = PhieuKham::query()->find($phieuKhamId);
        if (!$phieuKham) {
            return false;
        }

        return (bool) $this->user()?->can('update', $phieuKham);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'ngay_ke' => [
                'required',
                'date',
                'date_format:Y-m-d',
                'before_or_equal:today', // Ngày kê đơn không được là ngày tương lai
            ],
            'ghi_chu' => [
                'nullable',
                'string',
                'max:500',
            ],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'ngay_ke.required' => 'Ngày kê đơn không được để trống.',
            'ngay_ke.date' => 'Ngày kê đơn phải là ngày hợp lệ.',
            'ngay_ke.date_format' => 'Ngày kê đơn phải có định dạng YYYY-MM-DD.',
            'ngay_ke.before_or_equal' => 'Ngày kê đơn không được lớn hơn ngày hôm nay.',
            'ghi_chu.string' => 'Ghi chú phải là chuỗi ký tự.',
            'ghi_chu.max' => 'Ghi chú không được vượt quá 500 ký tự.',
        ];
    }
}
