<?php

namespace App\Requests\Scheduling;

use Illuminate\Foundation\Http\FormRequest;

class DoiLichHenRequest extends FormRequest
{
	public function authorize(): bool
	{
		return true;
	}

	public function rules(): array
	{
		return [
			'bac_si_id' => ['required', 'integer', 'exists:bac_si,id'],
			'ngay_hen' => ['required', 'date_format:Y-m-d'],
			'khung_gio_id' => ['nullable', 'integer', 'exists:khung_gio_kham,id'],
			'lich_lam_viec_bac_si_id' => ['required_without:khung_gio_id', 'nullable', 'integer', 'exists:lich_lam_viec_bac_si,id'],
			'gio_bat_dau' => ['required_without:khung_gio_id', 'nullable', 'date_format:H:i:s'],
			'gio_ket_thuc' => ['required_without:khung_gio_id', 'nullable', 'date_format:H:i:s', 'after:gio_bat_dau'],
			'ghi_chu' => ['nullable', 'string', 'max:2000'],
		];
	}

	public function messages(): array
	{
		return [
			'lich_lam_viec_bac_si_id.required_without' => 'Vui long cung cap lich_lam_viec_bac_si_id khi khong co khung_gio_id.',
			'gio_bat_dau.required_without' => 'Vui long cung cap gio_bat_dau khi khong co khung_gio_id.',
			'gio_ket_thuc.required_without' => 'Vui long cung cap gio_ket_thuc khi khong co khung_gio_id.',
		];
	}
}
