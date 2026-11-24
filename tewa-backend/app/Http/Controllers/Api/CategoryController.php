<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Http\Resources\CategoryResource;
use App\Models\Category;

class CategoryController extends Controller
{
    /**
     * GET /api/categories
     */
    public function index()
    {
        $categories = Category::withCount('posts')->orderBy('name')->get();

        return CategoryResource::collection($categories);
    }

    /**
     * POST /api/admin/categories
     */
    public function store(StoreCategoryRequest $request)
    {
        $category = Category::create($request->validated());

        return new CategoryResource($category);
    }

    /**
     * PUT /api/admin/categories/{category}
     */
    public function update(UpdateCategoryRequest $request, Category $category)
    {
        $category->update($request->validated());

        return new CategoryResource($category);
    }

    /**
     * DELETE /api/admin/categories/{category}
     * Blocked if posts still reference it — reassign or delete those first.
     */
    public function destroy(Category $category)
    {
        if ($category->posts()->exists()) {
            return response()->json([
                'message' => 'Cannot delete a category that still has posts. Reassign them first.',
            ], 422);
        }

        $category->delete();

        return response()->json(['message' => 'Category deleted.']);
    }
}