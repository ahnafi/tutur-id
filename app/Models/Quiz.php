<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Quiz extends Model
{
    use SoftDeletes;
    protected $fillable = [
        "story_id",
        "question",
        "option_a",
        "option_b",
        "option_c",
        "option_d",
        "correct_answer",
    ];

    public function story(): BelongsTo
    {
        return $this->belongsTo(Story::class);
    }
}
