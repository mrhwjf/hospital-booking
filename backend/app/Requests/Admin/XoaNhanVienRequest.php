<?php

namespace App\Requests\Admin;

use App\Models\NhanVien;
use App\Requests\Concerns\AuthorizesPolicyAbility;
use Illuminate\Foundation\Http\FormRequest;

class XoaNhanVienRequest extends FormRequest
{
    use AuthorizesPolicyAbility;

    public function authorize(): bool
    {
        return $this->authorizeModelAbility('delete', NhanVien::class, 'id');
    }

    public function rules(): array
    {
        return [
            'id' => ['required', 'integer', 'exists:nhan_vien,id'],
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'id' => $this->route('id'),
        ]);
    }
}
