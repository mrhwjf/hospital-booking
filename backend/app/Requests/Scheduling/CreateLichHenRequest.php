<?php

namespace App\Requests\Scheduling;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class CreateLichHenRequest extends FormRequest
{
	protected function prepareForValidation(): void
	{
		$authenticatedPatientId = $this->user()?->benhNhan?->id;

		if (!empty($authenticatedPatientId)) {
			$this->merge([
				'benh_nhan_id' => (int) $authenticatedPatientId,
			]);
		}
	}

	public function authorize(): bool
	{
		return true;
	}

	public function rules(): array
	{
		return [
			'benh_nhan_id' => ['nullable', 'integer', 'exists:benh_nhan,id'],
			'bac_si_id' => ['required', 'integer', 'exists:bac_si,id'],
			'chuyen_khoa_id' => ['required', 'integer', 'exists:chuyen_khoa,id'],
			'ngay_hen' => ['required', 'date_format:Y-m-d'],
			'khung_gio_id' => ['nullable', 'integer', 'exists:khung_gio_kham,id'],
			'lich_lam_viec_bac_si_id' => ['required_without:khung_gio_id', 'nullable', 'integer', 'exists:lich_lam_viec_bac_si,id'],
			'gio_bat_dau' => ['required_without:khung_gio_id', 'nullable', 'date_format:H:i:s'],
			'gio_ket_thuc' => ['required_without:khung_gio_id', 'nullable', 'date_format:H:i:s', 'after:gio_bat_dau'],
			'ly_do_kham' => ['required', 'string', 'max:2000'],
			'ghi_chu' => ['nullable', 'string', 'max:2000'],
			'nguoi_tao_id' => ['nullable', 'integer', 'exists:nguoi_dung,id'],
			'items' => ['required', 'array', 'min:1'],
			'items.*.dich_vu_id' => ['nullable', 'integer', 'exists:dich_vu,id'],
			'items.*.goi_kham_id' => ['nullable', 'integer', 'exists:goi_kham,id'],
			'items.*.so_luong' => ['nullable', 'integer', 'min:1'],
			'items.*.ghi_chu' => ['nullable', 'string', 'max:500'],
		];
	}

	public function messages(): array
	{
		return [
			'items.required' => 'Danh sách dịch vụ/gói khám là bắt buộc.',
			'items.min' => 'Cần chọn ít nhất 1 dịch vụ hoặc gói khám.',
			'khung_gio_id.exists' => 'Khung giờ khám không tồn tại trong hệ thống.',
			'lich_lam_viec_bac_si_id.required_without' => 'Vui lòng cung cấp lich_lam_viec_bac_si_id khi không có khung_gio_id.',
			'gio_bat_dau.required_without' => 'Vui lòng cung cấp gio_bat_dau khi không có khung_gio_id.',
			'gio_ket_thuc.required_without' => 'Vui lòng cung cấp gio_ket_thuc khi không có khung_gio_id.',
		];
	}

	public function withValidator(Validator $validator): void
	{
		$validator->after(function (Validator $validator) {
			$authenticatedPatientId = $this->user()?->benhNhan?->id;

			if (empty($authenticatedPatientId) && empty($this->input('benh_nhan_id'))) {
				$validator->errors()->add('benh_nhan_id', 'Vui lòng cung cấp benh_nhan_id hợp lệ.');
			}

			$items = $this->input('items', []);

			foreach ($items as $index => $item) {
				$hasDichVu = !empty($item['dich_vu_id']);
				$hasGoiKham = !empty($item['goi_kham_id']);

				if ($hasDichVu === $hasGoiKham) {
					$validator->errors()->add("items.$index", 'Mỗi item chỉ được có dich_vu_id hoặc goi_kham_id.');
				}
			}
		});
	}
}
