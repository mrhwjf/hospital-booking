<?php
namespace App\Requests\Cloudinary;

use Illuminate\Foundation\Http\FormRequest;

class UploadMedicalDocumentRequest extends FormRequest
{
	public function authorize(): bool
	{
		return true;
	}

	public function rules(): array
	{
		return [
			'tai_lieu' => 'required|file|max:15360|mimes:pdf,jpeg,png,jpg', // Max 15MB
		];
	}

	public function messages(): array
	{
		return [
			'tai_lieu.required' => 'Vui lòng chọn một tài liệu để tải lên.',
			'tai_lieu.file' => 'Tệp tải lên phải là một tệp hợp lệ.',
			'tai_lieu.max' => 'Kích thước tài liệu không được vượt quá 15MB.',
			'tai_lieu.mimes' => 'Tài liệu phải có định dạng PDF, JPEG, PNG hoặc JPG.',
		];
	}
}