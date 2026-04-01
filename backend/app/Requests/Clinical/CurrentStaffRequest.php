<?php

namespace App\Requests\Clinical;

use Illuminate\Foundation\Http\FormRequest;

class CurrentStaffRequest extends FormRequest
{
	public function authorize(): bool
	{
		return true;
	}

	public function rules(): array
	{
		return [
			'nguoi_dung_id' => ['required', 'integer', 'exists:nguoi_dung,id'],
		];
	}

	public function messages(): array
	{
		return [
			'nguoi_dung_id.required' => 'Vui lòng cung cấp nguoi_dung_id.',
			'nguoi_dung_id.exists' => 'Người dùng không tồn tại.',
		];
	}
}
