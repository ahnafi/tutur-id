<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class NameCategory extends Model
{
    use SoftDeletes;

    protected $fillable = [
        "name",
        "slug",
    ];

    protected static function booted(): void
    {
        static::creating(function ($category) {
            $baseSlug = Str::slug($category->name);
            $slug = $baseSlug;
            $i = 1;
            while (static::where('slug', $slug)->exists()) {
                $slug = $baseSlug . '-' . $i++;
            }
            $category->slug = $slug;
        });
    }

    public function names()
    {
        return $this->hasMany(Name::class);
    }
}
