<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\NewsletterController;
use App\Http\Controllers\Api\PostController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\FeaturedPersonController;

// ---------- Public routes ----------

Route::post('/auth/login', [AuthController::class, 'login']);
Route::get('/featured-people', [FeaturedPersonController::class, 'index']);
Route::get('/posts', [PostController::class, 'index']);
Route::get('/posts/latest', [PostController::class, 'latest']);
Route::get('/posts/popular', [PostController::class, 'popular']);
Route::get('/posts/trending', [PostController::class, 'trending']);
Route::get('/posts/top', [PostController::class, 'top']);
Route::get('/posts/featured', [PostController::class, 'featured']);
Route::get('/posts/{post:slug}', [PostController::class, 'show']);

Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{category:slug}/posts', [PostController::class, 'byCategory']);
Route::get('/categories/{category:slug}/top', [PostController::class, 'topByCategory']);

Route::post('/newsletter/subscribe', [NewsletterController::class, 'subscribe']);
Route::get('/newsletter/unsubscribe/{token}', [NewsletterController::class, 'unsubscribe']);

// ---------- Admin routes ----------

Route::middleware('auth:sanctum')->prefix('admin')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    Route::post('/featured-people', [FeaturedPersonController::class, 'store']);
    Route::delete('/featured-people/{featuredPerson}', [FeaturedPersonController::class, 'destroy']);

    Route::post('/posts', [PostController::class, 'store']);
    Route::post('/posts/{post}', [PostController::class, 'update']);
    Route::delete('/posts/{post}', [PostController::class, 'destroy']);

    Route::post('/categories', [CategoryController::class, 'store']);
    Route::put('/categories/{category}', [CategoryController::class, 'update']);
    Route::delete('/categories/{category}', [CategoryController::class, 'destroy']);

    Route::get('/newsletter/subscribers', [NewsletterController::class, 'subscribers']);
    Route::post('/newsletter/send', [NewsletterController::class, 'send']);
    Route::get('/newsletter/campaigns', [NewsletterController::class, 'campaigns']);
});