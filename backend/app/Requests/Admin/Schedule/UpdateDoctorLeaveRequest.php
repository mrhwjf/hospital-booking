<?php

namespace App\Requests\Admin\Schedule;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class UpdateDoctorLeaveRequest extends FormRequest
{
	public function authorize(): bool
	{
		return true;
	}

	public function rules(): array
	{
		return [
			'bac_si_id' => ['sometimes', 'integer', 'exists:bac_si,id'],
			'ngay' => ['sometimes', 'date_format:Y-m-d', 'after_or_equal:today'],
			'gio_bat_dau' => ['nullable', 'date_format:H:i:s'],
			'gio_ket_thuc' => ['nullable', 'date_format:H:i:s'],
			'ly_do' => ['nullable', 'string', 'max:2000'],
			'trang_thai' => ['sometimes', 'in:hoat_dong,huy'],
			'xac_nhan_huy_lich_hen' => ['nullable', 'boolean'],
		];
	}

	public function withValidator(Validator $validator): void
	{
		$validator->after(function (Validator $validator) {
			$input = $this->all();
			$hasStart = array_key_exists('gio_bat_dau', $input);
			$hasEnd = array_key_exists('gio_ket_thuc', $input);

			if ($hasStart xor $hasEnd) {
				$validator->errors()->add('gio_bat_dau', 'Cập nhật nghỉ theo giờ yêu cầu gửi cả giờ bắt đầu và giờ kết thúc.');
				return;
			}

			if ($hasStart && $hasEnd) {
				$start = $input['gio_bat_dau'];
				$end = $input['gio_ket_thuc'];

				if ((empty($start) && !empty($end)) || (!empty($start) && empty($end))) {
					$validator->errors()->add('gio_bat_dau', 'Nghỉ theo giờ yêu cầu cả giờ bắt đầu và giờ kết thúc.');
					return;
				}

				if (!empty($start) && !empty($end) && $start >= $end) {
					$validator->errors()->add('gio_bat_dau', 'Giờ bắt đầu phải nhỏ hơn giờ kết thúc.');
				}
			}
		});
	}
}
