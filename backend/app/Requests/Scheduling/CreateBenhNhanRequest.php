<?php

namespace App\Requests\Scheduling;

use App\Models\BenhNhan;
use App\Requests\Concerns\AuthorizesPolicyAbility;
use Illuminate\Foundation\Http\FormRequest;

class CreateBenhNhanRequest extends FormRequest
{
	use AuthorizesPolicyAbility;

	public function authorize(): bool
	{
		return $this->authorizeClassAbility('create', BenhNhan::class);
	}

	public function rules(): array
	{
		return [
			'ho_ten' => ['required', 'string', 'max:100'],
			'ngay_sinh' => ['required', 'date_format:Y-m-d'],
			'gioi_tinh' => ['required', 'in:nam,nu,khac'],
			'so_dien_thoai' => ['required', 'string', 'max:15'],
			'email' => ['nullable', 'email', 'max:255'],
			'so_cccd' => ['required', 'string', 'max:12'],
			'dia_chi' => ['required', 'string'],
			'nguoi_lien_he' => ['nullable', 'string', 'max:100'],
			'sdt_nguoi_lien_he' => ['nullable', 'string', 'max:15'],
			'nhom_mau' => ['nullable', 'in:A+,A-,B+,B-,AB+,AB-,O+,O-'],
			'tien_su_di_ung' => ['nullable', 'string', 'max:2000'],
			'tien_su_benh' => ['nullable', 'string', 'max:2000'],
			'ghi_chu' => ['nullable', 'string', 'max:2000'],
		];
	}
}
