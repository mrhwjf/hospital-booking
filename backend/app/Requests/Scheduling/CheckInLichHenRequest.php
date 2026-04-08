<?php

namespace App\Requests\Scheduling;

use App\Models\LichHen;
use App\Requests\Concerns\AuthorizesPolicyAbility;
use Illuminate\Foundation\Http\FormRequest;

class CheckInLichHenRequest extends FormRequest
{
	use AuthorizesPolicyAbility;

	public function authorize(): bool
	{
		return $this->authorizeModelAbility('update', LichHen::class, 'id');
	}

	public function rules(): array
	{
		return [
			'nguoi_tiep_nhan_id' => ['nullable', 'integer', 'exists:nguoi_dung,id'],
		];
	}
}
