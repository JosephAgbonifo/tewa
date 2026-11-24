<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class FeaturedPersonResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'titles' => $this->titles,
            'social_url' => $this->social_url,
            'images' => collect($this->images)
                ->map(fn ($path) => url(Storage::url($path)))
                ->values(),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}