<?php

namespace App\Requests\Admin\Schedule;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class AssignmentRequest extends FormRequest
{
	public function authorize(): bool
	{
		return true;
	}

	public function rules(): array
	{
		return [
			'bac_si_id' => ['required', 'integer', 'exists:bac_si,id'],
			'tuan_bat_dau' => ['required', 'date_format:Y-m-d'],
			'so_tuan_lap' => ['nullable', 'integer', 'min:1', 'max:4'],
			'mau_ca' => ['required', 'array', 'min:1'],
			'mau_ca.*.lich_lam_viec_id' => ['required', 'integer', 'exists:lich_lam_viec,id'],
			'mau_ca.*.phong_kham_id' => ['required', 'integer', 'exists:phong_kham,id'],
			'mau_ca.*.ghi_chu' => ['nullable', 'string', 'max:2000'],
		];
	}

	public function withValidator(Validator $validator): void
	{
		$validator->after(function (Validator $validator) {
			$templateIds = collect($this->input('mau_ca', []))
				->pluck('lich_lam_viec_id')
				->filter();

			if ($templateIds->duplicates()->isNotEmpty()) {
				$validator->errors()->add('mau_ca', 'Không được chọn trùng mẫu ca trong cùng một lần gán.');
			}
		});
	}
}
