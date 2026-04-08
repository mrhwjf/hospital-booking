<?php

namespace App\Requests\Clinical;

use App\Enums\PermissionEnum;
use Illuminate\Foundation\Http\FormRequest;


class SearchThuocRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $user = $this->user();

        return $user !== null && $user->hasPermission(PermissionEnum::NGHIEP_VU_KHAM_BENH);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'q' => [
                'nullable',
                'string',
                'max:100',
            ],
            'per_page' => [
                'nullable',
                'integer',
                'min:1',
                'max:100',
            ],
            'page' => [
                'nullable',
                'integer',
                'min:1',
            ],
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'q.string' => 'Từ khóa tìm kiếm phải là chuỗi ký tự.',
            'q.max' => 'Từ khóa tìm kiếm không được vượt quá 100 ký tự.',
            'per_page.integer' => 'Số lượng kết quả trên mỗi trang phải là một số nguyên.',
            'per_page.min' => 'Số lượng kết quả tối thiểu là 1.',
            'per_page.max' => 'Số lượng kết quả tối đa là 100.',
            'page.integer' => 'Trang phải là một số nguyên.',
            'page.min' => 'Trang tối thiểu là 1.',
        ];
    }

    /**
     * Get the validated data from the request.
     *
     * @param  string|null  $key
     * @param  mixed  $default
     * @return mixed
     */
    public function validated($key = null, $default = null)
    {
        $validated = array_filter([
            'q' => $this->input('q'),
            'per_page' => $this->input('per_page', 10),
            'page' => $this->input('page', 1),
        ]);

        if ($key === null) {
            return $validated;
        }

        return $validated[$key] ?? $default;
    }
}
