<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class QuizResult extends Model
{
    use SoftDeletes;
    protected $fillable = [
        "story_id",
        "user_id",
        "score",
    ];

    public function user() :BelongsTo {
        return $this->belongsTo(User::class);
    }

    public function story() :BelongsTo {
        return $this->belongsTo(Story::class);
    }
}
