<?php

namespace App\Requests\Admin;

use App\Models\CauHinhHeThong;
use App\Requests\Concerns\AuthorizesPolicyAbility;
use Illuminate\Foundation\Http\FormRequest;

class CapNhatCauHinhHeThongRequest extends FormRequest
{
    use AuthorizesPolicyAbility;

    public function authorize(): bool
    {
        return $this->authorizeClassAbility('update', CauHinhHeThong::class);
    }

    public function rules(): array
    {
        return [
            'items' => ['required', 'array', 'min:1'],
            'items.*.khoa' => ['required', 'string', 'max:100', 'exists:cau_hinh_he_thong,khoa', 'distinct'],
            'items.*.gia_tri' => ['required', 'string'],
            'items.*.mo_ta' => ['nullable', 'string'],
            'items.*.nhom' => ['nullable', 'string', 'max:50'],
        ];
    }
}
