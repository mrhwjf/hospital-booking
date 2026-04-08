<?php

namespace App\Requests\Patients;

use App\Models\BenhNhan;
use Illuminate\Foundation\Http\FormRequest;

class CurrentPatientRequest extends FormRequest
{
	protected function prepareForValidation(): void
	{
		$authenticatedPatientId = $this->user()?->benhNhan?->id;

		if (!empty($authenticatedPatientId) && empty($this->input('benh_nhan_id'))) {
			$this->merge([
				'benh_nhan_id' => (int) $authenticatedPatientId,
			]);
		}
	}

	public function authorize(): bool
	{
		$user = $this->user();
		$authPatientId = (int) ($user?->benhNhan?->id ?? 0);

		if ($authPatientId <= 0) {
			return false;
		}

		if (!empty($this->input('benh_nhan_id')) && (int) $this->input('benh_nhan_id') !== $authPatientId) {
			return false;
		}

		$this->merge([
			'benh_nhan_id' => $authPatientId,
		]);

		$benhNhan = BenhNhan::query()->find($authPatientId);

		return $benhNhan !== null && (bool) $this->user()?->can('view', $benhNhan);
	}

	public function rules(): array
	{
		return [
			'benh_nhan_id' => ['required', 'integer', 'exists:benh_nhan,id'],
		];
	}

	public function messages(): array
	{
		return [
			'benh_nhan_id.required' => 'Vui lòng cung cấp benh_nhan_id.',
			'benh_nhan_id.exists' => 'Bệnh nhân không tồn tại.',
		];
	}

	protected function failedAuthorization(): void
	{
		throw new \Illuminate\Auth\Access\AuthorizationException('Bạn không có quyền truy cập dữ liệu bệnh nhân khác.');
	}
}
