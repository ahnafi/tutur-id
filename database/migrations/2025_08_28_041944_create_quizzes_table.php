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
        Schema::create('quizzes', function (Blueprint $table) {
            $table->id();
            $table->foreignId("story_id")->constrained()->onDelete("cascade");
            $table->string("question");
            $table->string("option_a");
            $table->string("option_b");
            $table->string("option_c");
            $table->string("option_d");
            $table->enum("correct_answer", ['option_a', 'option_b', 'option_c', 'option_d']);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('quizzes');
    }
};
