<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

// Cerita Routes
Route::get('cerita', [\App\Http\Controllers\StoryController::class, 'index'])->name('stories.index');
Route::get('cerita/{story}', [\App\Http\Controllers\StoryController::class, 'show'])->name('stories.show');

// Nama Nusantara Routes
Route::get('nama-nusantara', [\App\Http\Controllers\NameController::class, 'index'])->name('names.index');
Route::get('nama-nusantara/{name}', [\App\Http\Controllers\NameController::class, 'show'])->name('names.show');

// Leaderboard Routes
Route::get('/leaderboard', [App\Http\Controllers\LeaderboardController::class, 'index'])
    ->name('leaderboard.index');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    Route::post('nama-nusantara', [\App\Http\Controllers\NameController::class, 'store'])->name('names.store');

    // Kontribusi Cerita Routes
    Route::get('kontribusi', [\App\Http\Controllers\StoryController::class, 'create'])->name('stories.create');
    Route::post('kontribusi', [\App\Http\Controllers\StoryController::class, 'store'])->name('stories.store');

    // Quiz Routes
    Route::get('cerita/{story}/kuis', [\App\Http\Controllers\QuizController::class, 'show'])->name('stories.quiz');
    Route::post('cerita/{story}/kuis', [\App\Http\Controllers\QuizController::class, 'submit'])->name('stories.quiz.submit');

    // Comment Routes
    Route::post('cerita/{story}/komentar', [\App\Http\Controllers\CommentController::class, 'store'])->name('comments.store');
    Route::put('komentar/{comment}', [\App\Http\Controllers\CommentController::class, 'update'])->name('comments.update');
    Route::delete('komentar/{comment}', [\App\Http\Controllers\CommentController::class, 'destroy'])->name('comments.destroy');

    // Protected story routes
    Route::get('kontribusi-saya', [\App\Http\Controllers\StoryController::class, 'myContributions'])->name('stories.my-contributions');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';