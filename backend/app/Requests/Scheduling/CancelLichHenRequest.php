<?php

namespace App\Requests\Scheduling;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class CancelLichHenRequest extends FormRequest
{
	public function authorize(): bool
	{
		return true;
	}

	public function rules(): array
	{
		return [
			'ly_do_huy_id' => ['nullable', 'integer', 'exists:ly_do_huy,id'],
			'ly_do_huy_khac' => ['nullable', 'string', 'max:2000'],
		];
	}

	public function withValidator(Validator $validator): void
	{
		$validator->after(function (Validator $validator) {
			if (empty($this->input('ly_do_huy_id')) && empty(trim((string) $this->input('ly_do_huy_khac', '')))) {
				$validator->errors()->add('ly_do_huy_id', 'Vui lòng chọn lý do hủy hoặc nhập lý do hủy khác.');
			}
		});
	}
}
