<?php

namespace App\Requests\Admin\Schedule;

use Illuminate\Foundation\Http\FormRequest;

class UpdateHolidayRequest extends FormRequest
{
	public function authorize(): bool
	{
		return true;
	}

	public function rules(): array
	{
		return [
			'ten_ngay_nghi' => ['sometimes', 'string', 'max:100'],
			'ngay' => ['sometimes', 'date_format:Y-m-d', 'after_or_equal:today'],
			'mo_ta' => ['nullable', 'string', 'max:2000'],
			'trang_thai' => ['sometimes', 'in:hoat_dong,huy'],
		];
	}
}
