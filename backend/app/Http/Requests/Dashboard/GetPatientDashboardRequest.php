<?php

namespace App\Http\Requests\Dashboard;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Get Patient Dashboard Request
 * 
 * Validates patient dashboard request and permission
 * Route: GET /api/v1/dashboard/patient
 */
class GetPatientDashboardRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     * 
     * User must be authenticated and have patient role
     */
    public function authorize(): bool
    {
        // User must be authenticated (enforced by auth:sanctum middleware)
        // User must have patient relationship
        return $this->user() && $this->user()->benh_nhan;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * GET request has no body, validation is on user authorization
     */
    public function rules(): array
    {
        return [
            //  No body parameters for GET request
            // Authorization is checked in authorize() method
        ];
    }

    /**
     * Handle a failed authorization attempt.
     */
    protected function failedAuthorization()
    {
        throw new \Illuminate\Auth\Access\AuthorizationException(
            'Bạn không phải bệnh nhân'
        );
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            // No messages needed for GET request validation
        ];
    }
}
