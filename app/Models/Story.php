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
        "story_category_id",
    ];

    public function setTitleAttribute($value): void
    {
        $this->attributes['title'] = $value;
        $this->attributes['slug'] = Str::slug($value) . '-' . Str::random(5);
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
