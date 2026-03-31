<?php

namespace App\Requests\Admin\Schedule;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class StoreDoctorLeaveRequest extends FormRequest
{
	public function authorize(): bool
	{
		return true;
	}

	public function rules(): array
	{
		return [
			'bac_si_id' => ['required', 'integer', 'exists:bac_si,id'],
			'ngay' => ['required', 'date_format:Y-m-d', 'after_or_equal:today'],
			'gio_bat_dau' => ['nullable', 'date_format:H:i:s'],
			'gio_ket_thuc' => ['nullable', 'date_format:H:i:s'],
			'ly_do' => ['nullable', 'string', 'max:2000'],
			'trang_thai' => ['nullable', 'in:hoat_dong,huy'],
			'xac_nhan_huy_lich_hen' => ['nullable', 'boolean'],
		];
	}

	public function withValidator(Validator $validator): void
	{
		$validator->after(function (Validator $validator) {
			$start = $this->input('gio_bat_dau');
			$end = $this->input('gio_ket_thuc');

			if ((empty($start) && !empty($end)) || (!empty($start) && empty($end))) {
				$validator->errors()->add('gio_bat_dau', 'Nghỉ theo giờ yêu cầu cả giờ bắt đầu và giờ kết thúc.');
			}

			if (!empty($start) && !empty($end) && $start >= $end) {
				$validator->errors()->add('gio_bat_dau', 'Giờ bắt đầu phải nhỏ hơn giờ kết thúc.');
			}
		});
	}
}
