<?php

namespace App\Requests\Admin\Schedule;

use Illuminate\Foundation\Http\FormRequest;

class StoreTemplateRequest extends FormRequest
{
	public function authorize(): bool
	{
		return true;
	}

	public function rules(): array
	{
		return [
			'ten_ca' => ['required', 'string', 'max:100'],
			'thu_trong_tuan' => ['required', 'integer', 'min:1', 'max:7'],
			'gio_bat_dau' => ['required', 'date_format:H:i:s'],
			'gio_ket_thuc' => ['required', 'date_format:H:i:s'],
			'thoi_luong_kham' => ['required', 'integer', 'min:1'],
			'ghi_chu' => ['nullable', 'string', 'max:2000'],
			'trang_thai' => ['nullable', 'in:hoat_dong,tam_ngung,huy'],
		];
	}
}
