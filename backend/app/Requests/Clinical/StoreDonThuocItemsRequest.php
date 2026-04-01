<?php

namespace App\Requests\Clinical;

use Illuminate\Foundation\Http\FormRequest;

class StoreDonThuocItemsRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // TODO: Thêm kiểm tra policy - bác sĩ chỉ có thể thêm thuốc vào đơn của mình
        // return $this->user()->can('addItems', $donThuoc);
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'items' => [
                'required',
                'array',
                'min:1',
                'max:100', // Giới hạn số lượng thuốc trong một đơn
            ],
            'items.*.thuoc_id' => [
                'required',
                'integer',
                'exists:thuoc,id',
            ],
            'items.*.so_luong' => [
                'required',
                'integer',
                'min:1',
                'max:9999',
            ],
            'items.*.lieu_dung' => [
                'required',
                'string',
                'max:200',
            ],
            'items.*.thoi_diem' => [
                'required',
                'in:truoc_an,sau_an,trong_an,khong_lien_quan',
            ],
            'items.*.so_ngay' => [
                'required',
                'integer',
                'min:1',
                'max:365', // Giới hạn số ngày dùng thuốc
            ],
            'items.*.ghi_chu' => [
                'nullable',
                'string',
                'max:300',
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
            'items.required' => 'Danh sách thuốc không được để trống.',
            'items.array' => 'Danh sách thuốc phải là một mảng.',
            'items.min' => 'Phải có ít nhất 1 thuốc trong đơn.',
            'items.max' => 'Không được thêm quá 100 thuốc trong một đơn.',
            'items.*.thuoc_id.required' => 'Mã thuốc không được để trống.',
            'items.*.thuoc_id.integer' => 'Mã thuốc phải là một số nguyên.',
            'items.*.thuoc_id.exists' => 'Thuốc được chọn không tồn tại trong hệ thống.',
            'items.*.so_luong.required' => 'Số lượng thuốc không được để trống.',
            'items.*.so_luong.integer' => 'Số lượng thuốc phải là một số nguyên duương.',
            'items.*.so_luong.min' => 'Số lượng thuốc phải ít nhất là 1.',
            'items.*.so_luong.max' => 'Số lượng thuốc không được vượt quá 9999.',
            'items.*.lieu_dung.required' => 'Liều dùng không được để trống.',
            'items.*.lieu_dung.string' => 'Liều dùng phải là chuỗi ký tự.',
            'items.*.lieu_dung.max' => 'Liều dùng không được vượt quá 200 ký tự.',
            'items.*.thoi_diem.required' => 'Thời điểm dùng thuốc không được để trống.',
            'items.*.thoi_diem.in' => 'Thời điểm dùng thuốc phải là một trong các giá trị: truoc_an, sau_an, trong_an, khong_lien_quan.',
            'items.*.so_ngay.required' => 'Số ngày dùng thuốc không được để trống.',
            'items.*.so_ngay.integer' => 'Số ngày phải là một số nguyên.',
            'items.*.so_ngay.min' => 'Số ngày dùng thuốc phải ít nhất là 1.',
            'items.*.so_ngay.max' => 'Số ngày dùng thuốc không được vượt quá 365 ngày.',
            'items.*.ghi_chu.string' => 'Ghi chú phải là chuỗi ký tự.',
            'items.*.ghi_chu.max' => 'Ghi chú không được vượt quá 300 ký tự.',
        ];
    }
}
