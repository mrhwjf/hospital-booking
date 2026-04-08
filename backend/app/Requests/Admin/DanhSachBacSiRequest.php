<?php

namespace App\Requests\Admin;

use App\Models\BacSi;
use App\Requests\Concerns\AuthorizesPolicyAbility;
use Illuminate\Foundation\Http\FormRequest;

class DanhSachBacSiRequest extends FormRequest
{
    use AuthorizesPolicyAbility;

    public function authorize(): bool
    {
        return $this->authorizeClassAbility('viewAny', BacSi::class);
    }

    public function rules(): array
    {
        return [
            'q' => ['nullable', 'string', 'max:255'],
            'chuyen_khoa_id' => ['nullable', 'integer', 'exists:chuyen_khoa,id'],
            'hoc_vi' => ['nullable', 'string', 'in:bac_si,thac_si,tien_si,pgs,gs'],
            'trang_thai' => ['nullable', 'string', 'in:hoat_dong,tam_nghi,nghi_viec'],
            'page' => ['nullable', 'integer', 'min:1'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
        ];
    }
}
