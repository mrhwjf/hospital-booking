<?php

namespace App\Requests\Clinical;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\PhieuKham;
use Illuminate\Validation\Validator;

class StoreChiDinhRequest extends FormRequest
{
    public function authorize(): bool
    {
        $phieuKhamId = (int) $this->route('phieuKhamId');

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
            'bac_si_id' => 'nullable|integer|exists:bac_si,id',
            'items' => 'present|array',
            'items.*.dich_vu_id' => 'nullable|integer|exists:dich_vu,id',
            'items.*.goi_kham_id' => 'nullable|integer|exists:goi_kham,id',
            'items.*.so_luong' => 'nullable|integer|min:1',
            'items.*.trang_thai' => 'nullable|in:cho_thuc_hien,da_hoan_thanh,huy',
            'items.*.ngay_chi_dinh' => 'nullable|date',
            'items.*.ghi_chu' => 'nullable|string',
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            $items = $this->input('items', []);

            foreach ($items as $index => $item) {
                $hasDichVu = !empty($item['dich_vu_id']);
                $hasGoiKham = !empty($item['goi_kham_id']);

                if (!$hasDichVu && !$hasGoiKham) {
                    $validator->errors()->add(
                        "items.$index",
                        'Mỗi chỉ định phải chọn dịch vụ hoặc gói khám.'
                    );
                }

                if ($hasDichVu && $hasGoiKham) {
                    $validator->errors()->add(
                        "items.$index",
                        'Mỗi chỉ định chỉ được chọn một trong hai: dịch vụ hoặc gói khám.'
                    );
                }
            }
        });
    }
}