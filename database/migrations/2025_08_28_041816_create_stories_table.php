<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('stories', function (Blueprint $table) {
            $table->id();
            $table->string("title");
            $table->string("slug")->unique();
            $table->text("content")->nullable();
            $table->string("origin_place")->nullable();
            $table->string("gmaps_link")->nullable();
            $table->boolean("is_official")->default(false);
            $table->unsignedBigInteger("created_by");
            $table->foreign("created_by")->references("id")->on("users")->onDelete("cascade");
            $table->integer('total_reads')->default(0);
            $table->string('image')->nullable();
            $table->foreignId("story_category_id")->constrained()->onDelete("cascade");
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stories');
    }
};
