<?php

namespace App\Requests\Reports;

use App\Enums\PermissionEnum;
use Illuminate\Foundation\Http\FormRequest;

class DashboardAdminRequest extends FormRequest
{
    public function authorize(): bool
    {
        $user = $this->user();

        return $user !== null && $user->hasPermission(PermissionEnum::QUAN_TRI_BAO_CAO);
    }

    public function rules(): array
    {
        return [
            'moc_phan_tich' => ['nullable', 'date_format:Y-m-d'],
        ];
    }
}
