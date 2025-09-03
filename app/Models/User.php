<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Filament\Models\Contracts\FilamentUser;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable implements FilamentUser
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasRoles, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'total_points',
        'stories_read',
        'quizzes_taken',
        'current_badge',
        'location',
        'bio'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function canAccessPanel(\Filament\Panel $panel): bool
    {
        $panelId = $panel->getId();

        return match (true) {
            $this->hasRole('admin') && $panelId === 'tuturadmin' => true,
        };
    }

    public function stories(): HasMany
    {
        return $this->hasMany(Story::class, 'created_by');
    }

    public function quizResults(): HasMany
    {
        return $this->hasMany(QuizResult::class, 'user_id');
    }

    public function communitySubmissions(): HasMany
    {
        return $this->hasMany(CommunitySubmission::class);
    }

    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }

    public function userPoints(): HasMany
    {
        return $this->hasMany(UserPoint::class);
    }

    public function userBadges(): HasMany
    {
        return $this->hasMany(UserBadge::class);
    }

    // Helper method to get weekly points gain
    public function getWeeklyPointsGain()
    {
        return $this->userPoints()
            ->where('created_at', '>=', now()->subWeek())
            ->sum('points');
    }

    // Helper method to get leaderboard rank
    public function getLeaderboardRank($timeFilter = 'alltime')
    {
        $query = static::where('total_points', '>', $this->total_points);
        
        if ($timeFilter === 'weekly') {
            // Count users with higher weekly points
            $query = static::selectRaw('users.id, SUM(CASE WHEN user_points.created_at >= ? THEN user_points.points ELSE 0 END) as weekly_points')
                ->leftJoin('user_points', 'users.id', '=', 'user_points.user_id')
                ->groupBy('users.id')
                ->havingRaw('weekly_points > ?', [
                    now()->subWeek(),
                    $this->getWeeklyPointsGain()
                ]);
        } elseif ($timeFilter === 'monthly') {
            // Similar logic for monthly
            $query = static::selectRaw('users.id, SUM(CASE WHEN user_points.created_at >= ? THEN user_points.points ELSE 0 END) as monthly_points')
                ->leftJoin('user_points', 'users.id', '=', 'user_points.user_id')
                ->groupBy('users.id')
                ->havingRaw('monthly_points > ?', [
                    now()->subMonth(),
                    $this->userPoints()->where('created_at', '>=', now()->subMonth())->sum('points')
                ]);
        }
        
        return $query->count() + 1;
    }
}