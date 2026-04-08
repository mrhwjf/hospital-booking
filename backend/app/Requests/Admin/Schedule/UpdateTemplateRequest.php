<?php

namespace App\Requests\Admin\Schedule;

use App\Models\LichLamViec;
use App\Requests\Concerns\AuthorizesPolicyAbility;
use Illuminate\Foundation\Http\FormRequest;

class UpdateTemplateRequest extends FormRequest
{
	use AuthorizesPolicyAbility;

	public function authorize(): bool
	{
		return $this->authorizeModelAbility('update', LichLamViec::class, 'id');
	}

	public function rules(): array
	{
		return [
			'ten_ca' => ['sometimes', 'string', 'max:100'],
			'thu_trong_tuan' => ['sometimes', 'integer', 'min:1', 'max:7'],
			'gio_bat_dau' => ['sometimes', 'date_format:H:i:s'],
			'gio_ket_thuc' => ['sometimes', 'date_format:H:i:s'],
			'thoi_luong_kham' => ['sometimes', 'integer', 'min:1'],
			'ghi_chu' => ['nullable', 'string', 'max:2000'],
			'trang_thai' => ['sometimes', 'in:hoat_dong,tam_ngung,huy'],
		];
	}
}
