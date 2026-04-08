<?php

namespace App\Requests\Patients;

use App\Models\PhieuKham;
use App\Requests\Concerns\AuthorizesPolicyAbility;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class VisitHistoryListRequest extends FormRequest
{
	use AuthorizesPolicyAbility;

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

		return $this->authorizeClassAbility('viewAny', PhieuKham::class);
	}

	public function rules(): array
	{
		return [
			'benh_nhan_id' => ['required', 'integer', 'exists:benh_nhan,id'],
			'q' => ['nullable', 'string', 'max:255'],
			'trang_thai' => ['nullable', 'string', 'in:tiep_nhan,dang_kham,hoan_thanh,all'],
			'tu_ngay' => ['nullable', 'date_format:Y-m-d'],
			'den_ngay' => ['nullable', 'date_format:Y-m-d'],
			'page' => ['nullable', 'integer', 'min:1'],
			'pageSize' => ['nullable', 'integer', 'min:1', 'max:100'],
		];
	}

	public function withValidator(Validator $validator): void
	{
		$validator->after(function (Validator $validator) {
			$fromDate = $this->input('tu_ngay');
			$toDate = $this->input('den_ngay');

			if (!empty($fromDate) && !empty($toDate) && $fromDate > $toDate) {
				$validator->errors()->add('tu_ngay', 'tu_ngay phải nhỏ hơn hoặc bằng den_ngay.');
			}
		});
	}

	public function messages(): array
	{
		return [
			'benh_nhan_id.required' => 'Vui lòng cung cấp benh_nhan_id.',
			'benh_nhan_id.exists' => 'Bệnh nhân không tồn tại.',
			'trang_thai.in' => 'trang_thai không hợp lệ.',
		];
	}

	protected function failedAuthorization(): void
	{
		throw new \Illuminate\Auth\Access\AuthorizationException('Bạn không có quyền truy cập dữ liệu bệnh nhân khác.');
	}
}
