<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreFeaturedPersonRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'titles' => ['required', 'array', 'min:1'],
            'titles.*' => ['required', 'string', 'max:255'],
            'social_url' => ['required', 'url', 'max:500'],
            'images' => ['required', 'array', 'min:1', 'max:3'],
            'images.*' => ['image', 'max:5120'],
        ];
    }
}