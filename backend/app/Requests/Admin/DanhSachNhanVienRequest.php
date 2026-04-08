<?php

namespace App\Requests\Admin;

use App\Models\NhanVien;
use App\Requests\Concerns\AuthorizesPolicyAbility;
use Illuminate\Foundation\Http\FormRequest;

class DanhSachNhanVienRequest extends FormRequest
{
    use AuthorizesPolicyAbility;

    public function authorize(): bool
    {
        return $this->authorizeClassAbility('viewAny', NhanVien::class);
    }

    public function rules(): array
    {
        return [
            'q' => ['nullable', 'string', 'max:255'],
            'chuc_vu' => ['nullable', 'string', 'in:le_tan,nhan_vien_y_te,dieu_duong'],
            'trang_thai' => ['nullable', 'string', 'in:hoat_dong,tam_khoa,nghi_viec'],
            'page' => ['nullable', 'integer', 'min:1'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
        ];
    }
}
