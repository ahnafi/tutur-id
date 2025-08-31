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

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    Route::post('nama-nusantara', [\App\Http\Controllers\NameController::class, 'store'])->name('names.store');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
