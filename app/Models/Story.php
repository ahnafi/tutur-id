<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Story extends Model
{
    use SoftDeletes;
    
    protected $fillable = [
        "title",
        "slug",
        "content",
        "origin_place",
        "gmaps_link",
        "is_official",
        "created_by",
        'total_reads',
        'image',
        "story_category_id",
    ];

    protected static function booted(): void
    {
        static::creating(function ($story) {
            if (!$story->slug) {
                $baseSlug = Str::slug($story->title);
                $slug = $baseSlug;
                $i = 1;
                while (static::where('slug', $slug)->exists()) {
                    $slug = $baseSlug . '-' . $i++;
                }
                $story->slug = $slug;
            }
        });
    }

    // Tambahkan method ini untuk route model binding dengan slug
    public function getRouteKeyName()
    {
        return 'slug';
    }

    public function storyCategory(): BelongsTo
    {
        return $this->belongsTo(StoryCategory::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function quizzes(): HasMany
    {
        return $this->hasMany(Quiz::class);
    }

    public function quizresult(): HasMany
    {
        return $this->hasMany(QuizResult::class);
    }
}