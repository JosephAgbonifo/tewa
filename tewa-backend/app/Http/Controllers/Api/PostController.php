<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePostRequest;
use App\Http\Requests\UpdatePostRequest;
use App\Http\Resources\PostResource;
use App\Models\Category;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PostController extends Controller
{
    /**
     * GET /api/posts
     */
    public function index(Request $request)
    {
        $query = Post::with(['category', 'author'])->published()->latest('published_at');

        if ($request->filled('category')) {
            $query->whereHas('category', fn ($q) => $q->where('slug', $request->category));
        }

        $posts = $query->paginate($request->integer('per_page', 12));

        return PostResource::collection($posts);
    }

    /**
     * GET /api/posts/latest
     */
    public function latest(Request $request)
    {
        $posts = Post::with(['category', 'author'])
            ->published()
            ->latest('published_at')
            ->limit($request->integer('limit', 8))
            ->get();

        return PostResource::collection($posts);
    }

    /**
     * GET /api/posts/popular
     */
    public function popular(Request $request)
    {
        $posts = Post::with(['category', 'author'])
            ->published()
            ->orderByDesc('views_count')
            ->limit($request->integer('limit', 3))
            ->get();

        return PostResource::collection($posts);
    }

    /**
     * GET /api/posts/trending
     */
    public function trending(Request $request)
    {
        $posts = Post::with(['category', 'author'])
            ->published()
            ->where('is_trending', true)
            ->latest('published_at')
            ->limit($request->integer('limit', 5))
            ->get();

        return PostResource::collection($posts);
    }

    /**
     * GET /api/posts/top
     * Admin-flagged "top news" posts — powers the homepage hero carousel.
     */
    public function top(Request $request)
    {
        $posts = Post::with(['category', 'author'])
            ->published()
            ->where('is_top', true)
            ->latest('published_at')
            ->limit($request->integer('limit', 5))
            ->get();

        return PostResource::collection($posts);
    }

    /**
     * GET /api/posts/featured
     * Admin-flagged posts — powers the homepage featured grid.
     */
    public function featured(Request $request)
    {
        $posts = Post::with(['category', 'author'])
            ->published()
            ->where('is_featured', true)
            ->latest('published_at')
            ->limit($request->integer('limit', 5))
            ->get();

        return PostResource::collection($posts);
    }

    /**
     * GET /api/categories/{category:slug}/top
     */
    public function topByCategory(Category $category)
    {
        $post = Post::with(['category', 'author'])
            ->published()
            ->where('category_id', $category->id)
            ->where('is_top', true)
            ->latest('published_at')
            ->first();

        $post ??= Post::with(['category', 'author'])
            ->published()
            ->where('category_id', $category->id)
            ->latest('published_at')
            ->first();

        if (! $post) {
            return response()->json(['message' => 'No posts in this category yet.'], 404);
        }

        return new PostResource($post);
    }

    /**
     * GET /api/categories/{category:slug}/posts
     */
    public function byCategory(Request $request, Category $category)
    {
        $posts = Post::with(['category', 'author'])
            ->published()
            ->where('category_id', $category->id)
            ->latest('published_at')
            ->paginate($request->integer('per_page', 12));

        return PostResource::collection($posts);
    }

    /**
     * GET /api/posts/{post:slug}
     */
    public function show(Post $post)
    {
        $post->load(['category', 'author']);
        $post->increment('views_count');

        return new PostResource($post);
    }

    /**
     * POST /api/admin/posts
     */
    public function store(StorePostRequest $request)
    {
        $data = $request->validated();

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('posts', 'public');
        }

        $data['author_id'] = $request->user()->id;

        $post = Post::create($data);

        return new PostResource($post->load(['category', 'author']));
    }

    /**
     * POST /api/admin/posts/{post}
     */
    public function update(UpdatePostRequest $request, Post $post)
    {
        $data = $request->validated();

        if ($request->hasFile('image')) {
            if ($post->image) {
                Storage::disk('public')->delete($post->image);
            }
            $data['image'] = $request->file('image')->store('posts', 'public');
        }

        $post->update($data);

        return new PostResource($post->load(['category', 'author']));
    }

    /**
     * DELETE /api/admin/posts/{post}
     */
    public function destroy(Post $post)
    {
        if ($post->image) {
            Storage::disk('public')->delete($post->image);
        }

        $post->delete();

        return response()->json(['message' => 'Post deleted.']);
    }
}