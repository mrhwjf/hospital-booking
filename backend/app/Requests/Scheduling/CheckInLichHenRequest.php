<?php

namespace App\Requests\Scheduling;

use Illuminate\Foundation\Http\FormRequest;

class CheckInLichHenRequest extends FormRequest
{
	public function authorize(): bool
	{
		return true;
	}

	public function rules(): array
	{
		return [
			'nguoi_tiep_nhan_id' => ['nullable', 'integer', 'exists:nguoi_dung,id'],
		];
	}
}
