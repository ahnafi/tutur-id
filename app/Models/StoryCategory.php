<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class StoryCategory extends Model
{
    use SoftDeletes;
    protected $fillable = [
        "title",
        "slug",
    ];

    public function setTitleAttribute($value): void
    {
        $this->attributes['title'] = $value;
        $this->attributes['slug'] = Str::slug($value);
    }

    public function story(): HasMany
    {
        return $this->hasMany(Story::class);
    }
}
