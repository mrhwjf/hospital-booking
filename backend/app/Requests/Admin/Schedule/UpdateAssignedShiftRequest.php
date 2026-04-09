<?php

namespace App\Requests\Admin\Schedule;

use App\Models\LichLamViecBacSi;
use App\Requests\Concerns\AuthorizesPolicyAbility;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class UpdateAssignedShiftRequest extends FormRequest
{
	use AuthorizesPolicyAbility;

	public function authorize(): bool
	{
		return $this->authorizeModelAbility('update', LichLamViecBacSi::class, 'id');
	}

	public function rules(): array
	{
		return [
			'phong_kham_id' => ['nullable', 'integer', 'exists:phong_kham,id'],
			'ghi_chu' => ['nullable', 'string', 'max:2000'],
			'trang_thai' => ['nullable', 'in:hoat_dong,tam_ngung,huy'],
			'xac_nhan_huy_lich_hen' => ['nullable', 'boolean'],
		];
	}

	public function withValidator(Validator $validator): void
	{
		$validator->after(function (Validator $validator) {
			$input = $this->all();
			$hasRoomField = array_key_exists('phong_kham_id', $input);
			$hasNoteField = array_key_exists('ghi_chu', $input);
			$hasStatusField = array_key_exists('trang_thai', $input);

			if (!$hasRoomField && !$hasNoteField && !$hasStatusField) {
				$validator->errors()->add('payload', 'Cần cung cấp ít nhất một trường để cập nhật (phong_kham_id, ghi_chu hoặc trang_thai).');
			}
		});
	}
}
