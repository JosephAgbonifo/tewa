<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
  public function up(): void
{
    Schema::create('featured_people', function (Blueprint $table) {
        $table->id();
        $table->string('name');
        $table->json('titles');
        $table->string('social_url');
        $table->json('images'); // 1–3 storage paths
        $table->timestamps();
    });
}

public function down(): void
{
    Schema::dropIfExists('featured_people');
}
};
