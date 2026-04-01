<?php

namespace App\Requests\Patients;

use Illuminate\Foundation\Http\FormRequest;

class CurrentPatientRequest extends FormRequest
{
	public function authorize(): bool
	{
		return true;
	}

	public function rules(): array
	{
		return [
			'benh_nhan_id' => ['required', 'integer', 'exists:benh_nhan,id'],
		];
	}

	public function messages(): array
	{
		return [
			'benh_nhan_id.required' => 'Vui lòng cung cấp benh_nhan_id.',
			'benh_nhan_id.exists' => 'Bệnh nhân không tồn tại.',
		];
	}
}
