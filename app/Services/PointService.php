<?php

namespace App\Services;

use App\Models\User;
use App\Models\UserPoint;
use App\Models\UserBadge;

class PointService
{
    const POINTS = [
        'story_read' => 10,
        'quiz_completed' => 50,
        'quiz_perfect' => 100, // 100% score
        'story_created' => 200,
        'first_story' => 100,
        'daily_login' => 5,
    ];

    const BADGES = [
        'pemula_budaya' => [
            'name' => 'Pemula Budaya',
            'requirement' => 'total_points',
            'value' => 0
        ],
        'penjelajah_cerita' => [
            'name' => 'Penjelajah Cerita',
            'requirement' => 'stories_read',
            'value' => 40
        ],
        'kolektor_nama' => [
            'name' => 'Kolektor Nama',
            'requirement' => 'quizzes_taken',
            'value' => 25
        ],
        'ahli_budaya' => [
            'name' => 'Ahli Budaya',
            'requirement' => 'quiz_average',
            'value' => 90
        ],
        'pencinta_tradisi' => [
            'name' => 'Pencinta Tradisi',
            'requirement' => 'stories_read',
            'value' => 20
        ],
        'penjaga_warisan' => [
            'name' => 'Penjaga Warisan',
            'requirement' => 'total_points',
            'value' => 1500
        ],
    ];

    public function awardPoints(User $user, string $action, string $description = null)
    {
        if (!isset(self::POINTS[$action])) {
            return false;
        }

        $points = self::POINTS[$action];

        // Create point record
        UserPoint::create([
            'user_id' => $user->id,
            'action' => $action,
            'points' => $points,
            'description' => $description,
        ]);

        // Update user total points
        $user->increment('total_points', $points);

        // Check for badge eligibility
        $this->checkBadges($user);

        return $points;
    }

    public function checkBadges(User $user)
    {
        foreach (self::BADGES as $badgeType => $badge) {
            // Check if user already has this badge
            if ($user->userBadges()->where('badge_type', $badgeType)->exists()) {
                continue;
            }

            $eligible = false;

            switch ($badge['requirement']) {
                case 'total_points':
                    $eligible = $user->total_points >= $badge['value'];
                    break;
                case 'stories_read':
                    $eligible = $user->stories_read >= $badge['value'];
                    break;
                case 'quizzes_taken':
                    $eligible = $user->quizzes_taken >= $badge['value'];
                    break;
                case 'quiz_average':
                    $averageScore = $user->quizResults()->avg('score');
                    $eligible = $averageScore >= $badge['value'];
                    break;
            }

            if ($eligible) {
                $this->awardBadge($user, $badgeType, $badge['name']);
            }
        }
    }

    private function awardBadge(User $user, string $badgeType, string $badgeName)
    {
        UserBadge::create([
            'user_id' => $user->id,
            'badge_type' => $badgeType,
            'badge_name' => $badgeName,
            'earned_at' => now(),
        ]);

        // Update user's current badge to the latest earned
        $user->update(['current_badge' => $badgeName]);
    }

    public function getLeaderboard($timeFilter = 'alltime', $limit = 50)
    {
        if ($timeFilter === 'weekly') {
            $startDate = now()->subWeek();
            
            $users = User::selectRaw('
                    users.*, 
                    COALESCE(SUM(user_points.points), 0) as period_points
                ')
                ->leftJoin('user_points', function($join) use ($startDate) {
                    $join->on('users.id', '=', 'user_points.user_id')
                         ->where('user_points.created_at', '>=', $startDate);
                })
                ->groupBy('users.id', 'users.name', 'users.email', 'users.email_verified_at', 
                         'users.password', 'users.remember_token', 'users.created_at', 
                         'users.updated_at', 'users.deleted_at', 'users.total_points', 
                         'users.stories_read', 'users.quizzes_taken', 'users.current_badge')
                ->orderBy('period_points', 'desc')
                ->limit($limit)
                ->get();
                
        } elseif ($timeFilter === 'monthly') {
            $startDate = now()->subMonth();
            
            $users = User::selectRaw('
                    users.*, 
                    COALESCE(SUM(user_points.points), 0) as period_points
                ')
                ->leftJoin('user_points', function($join) use ($startDate) {
                    $join->on('users.id', '=', 'user_points.user_id')
                         ->where('user_points.created_at', '>=', $startDate);
                })
                ->groupBy('users.id', 'users.name', 'users.email', 'users.email_verified_at', 
                         'users.password', 'users.remember_token', 'users.created_at', 
                         'users.updated_at', 'users.deleted_at', 'users.total_points', 
                         'users.stories_read', 'users.quizzes_taken', 'users.current_badge')
                ->orderBy('period_points', 'desc')
                ->limit($limit)
                ->get();
                
        } else {
            // All time - just order by total_points
            $users = User::orderBy('total_points', 'desc')
                ->limit($limit)
                ->get();
        }

        return $users->map(function ($user, $index) use ($timeFilter) {
            $weeklyGain = $user->userPoints()
                ->where('created_at', '>=', now()->subWeek())
                ->sum('points');

            return [
                'id' => $user->id,
                'name' => $user->name,
                'score' => $timeFilter === 'alltime' ? $user->total_points : ($user->period_points ?? 0),
                'storiesRead' => $user->stories_read,
                'quizzesTaken' => $user->quizzes_taken,
                'rank' => $index + 1,
                'badge' => $user->current_badge ?? 'Pemula Budaya',
                'weeklyGain' => $weeklyGain,
            ];
        });
    }
}