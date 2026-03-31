<?php
namespace App\Requests\Cloudinary;

use Illuminate\Foundation\Http\FormRequest;

class UploadAvatarRequest extends FormRequest
{
	public function authorize(): bool
	{
		return true;
	}

	public function rules(): array
	{
		return [
			'hinh_anh' => 'required|image|max:5120',
		];
	}

	public function messages(): array
	{
		return [
			'hinh_anh.required' => 'Vui lòng chọn một hình ảnh để tải lên.',
			'hinh_anh.image' => 'Tệp tải lên phải là một hình ảnh.',
			'hinh_anh.max' => 'Kích thước hình ảnh không được vượt quá 5MB.',
		];
	}
}