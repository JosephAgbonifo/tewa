<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreFeaturedPersonRequest;
use App\Http\Resources\FeaturedPersonResource;
use App\Models\FeaturedPerson;
use Illuminate\Support\Facades\Storage;

class FeaturedPersonController extends Controller
{
    /**
     * GET /api/featured-people
     * Newest first: [0] is the current feature, the rest feed the strip.
     */
    public function index()
    {
        return FeaturedPersonResource::collection(
            FeaturedPerson::latest('id')->get()
        );
    }

    /**
     * POST /api/admin/featured-people
     */
    public function store(StoreFeaturedPersonRequest $request)
    {
        $data = $request->validated();

        $data['images'] = collect($request->file('images'))
            ->map(fn ($file) => $file->store('featured', 'public'))
            ->all();

        $person = FeaturedPerson::create($data);

        return new FeaturedPersonResource($person);
    }

    /**
     * DELETE /api/admin/featured-people/{featuredPerson}
     */
    public function destroy(FeaturedPerson $featuredPerson)
    {
        foreach ($featuredPerson->images ?? [] as $path) {
            Storage::disk('public')->delete($path);
        }

        $featuredPerson->delete();

        return response()->json(['message' => 'Featured person deleted.']);
    }
}