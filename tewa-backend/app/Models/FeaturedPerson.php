<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FeaturedPerson extends Model
{
    protected $fillable = ['name', 'titles', 'social_url', 'images'];

    protected $casts = [
        'titles' => 'array',
        'images' => 'array',
    ];
}