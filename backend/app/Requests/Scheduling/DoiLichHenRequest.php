<?php

namespace App\Requests\Scheduling;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class DoiLichHenRequest extends FormRequest
{
	public function authorize(): bool
	{
		return true;
	}

	public function rules(): array
	{
		return [
			'chuyen_khoa_id' => ['required', 'integer', 'exists:chuyen_khoa,id'],
			'bac_si_id' => ['required', 'integer', 'exists:bac_si,id'],
			'ngay_hen' => ['required', 'date_format:Y-m-d'],
			'khung_gio_id' => ['nullable', 'integer', 'exists:khung_gio_kham,id'],
			'lich_lam_viec_bac_si_id' => ['required_without:khung_gio_id', 'nullable', 'integer', 'exists:lich_lam_viec_bac_si,id'],
			'gio_bat_dau' => ['required_without:khung_gio_id', 'nullable', 'date_format:H:i:s'],
			'gio_ket_thuc' => ['required_without:khung_gio_id', 'nullable', 'date_format:H:i:s', 'after:gio_bat_dau'],
			'items' => ['required', 'array', 'min:1'],
			'items.*.dich_vu_id' => ['nullable', 'integer', 'exists:dich_vu,id'],
			'items.*.goi_kham_id' => ['nullable', 'integer', 'exists:goi_kham,id'],
			'items.*.so_luong' => ['nullable', 'integer', 'min:1'],
			'items.*.ghi_chu' => ['nullable', 'string', 'max:500'],
			'ly_do_kham' => ['nullable', 'string', 'max:2000'],
			'ghi_chu' => ['nullable', 'string', 'max:2000'],
		];
	}

	public function messages(): array
	{
		return [
			'items.required' => 'Danh sach dich vu/goi kham la bat buoc khi doi lich.',
			'items.min' => 'Can chon it nhat 1 dich vu hoac goi kham.',
			'lich_lam_viec_bac_si_id.required_without' => 'Vui long cung cap lich_lam_viec_bac_si_id khi khong co khung_gio_id.',
			'gio_bat_dau.required_without' => 'Vui long cung cap gio_bat_dau khi khong co khung_gio_id.',
			'gio_ket_thuc.required_without' => 'Vui long cung cap gio_ket_thuc khi khong co khung_gio_id.',
		];
	}

	public function withValidator(Validator $validator): void
	{
		$validator->after(function (Validator $validator) {
			$items = $this->input('items', []);

			foreach ($items as $index => $item) {
				$hasDichVu = !empty($item['dich_vu_id']);
				$hasGoiKham = !empty($item['goi_kham_id']);

				if ($hasDichVu === $hasGoiKham) {
					$validator->errors()->add("items.$index", 'Moi item chi duoc co dich_vu_id hoac goi_kham_id.');
				}
			}
		});
	}
}
