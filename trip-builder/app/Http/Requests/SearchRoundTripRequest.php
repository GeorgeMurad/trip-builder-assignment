<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class SearchRoundTripRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $today = now()->toDateString();
        $maxDate = now()->addDays(365)->toDateString();

        return [
            'from' => ['required', 'string'],
            'to' => ['required', 'string'],
            'departure_date' => ['required', 'date', "after_or_equal:{$today}", "before_or_equal:{$maxDate}"],
            'return_date' => ['required', 'date', 'after:departure_date'],
            'preferred_airline' => ['nullable', 'string'],
            'sort' => ['nullable', 'string'],
            'sort_by' => ['nullable', 'string', 'in:price_asc,price_desc,departure_asc,departure_desc,duration_asc'],
            'page' => ['nullable', 'integer', 'min:1'],
            'limit' => ['nullable', 'integer', 'in:3,4'],
        ];
    }

    protected function failedValidation(Validator $validator): void
    {
        throw new HttpResponseException(response()->json([
            'message' => 'The given data was invalid.',
            'errors' => $validator->errors(),
        ], 422));
    }
}
