<?php

namespace App\Http\Controllers;

use App\Services\PointService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LeaderboardController extends Controller
{
    protected $pointService;

    public function __construct(PointService $pointService)
    {
        $this->pointService = $pointService;
    }

    public function index(Request $request)
    {
        $timeFilter = $request->get('timeFilter', 'alltime');
        
        // Get leaderboard data
        $leaderboard = $this->pointService->getLeaderboard($timeFilter, 10);
        
        // Get current user's rank and stats
        $currentUser = null;
        if (Auth::check()) {
            $user = Auth::user();
            $currentUser = [
                'rank' => $user->getLeaderboardRank($timeFilter),
                'score' => $user->total_points,
                'badge' => $user->current_badge ?? 'Pemula Budaya',
                'storiesRead' => $user->stories_read,
                'quizzesTaken' => $user->quizzes_taken,
                'weeklyGain' => $user->getWeeklyPointsGain(),
            ];
        }

        // Get badge descriptions
        $badgeDescriptions = [
            'Penjelajah Cerita' => 'Baca 40+ cerita',
            'Kolektor Nama' => 'Selesaikan 25+ kuis',
            'Ahli Budaya' => 'Skor kuis rata-rata 90%',
            'Pencinta Tradisi' => 'Baca 20+ cerita',
            'Penjaga Warisan' => 'Kumpulkan 1500+ poin',
            'Pemula Budaya' => 'Mulai perjalanan budaya',
        ];

        // Weekly challenge progress (example: read 5 stories)
        $weeklyProgress = null;
        if (Auth::check()) {
            $user = Auth::user();
            $weeklyReads = $user->userPoints()
                ->where('action', 'story_read')
                ->where('created_at', '>=', now()->startOfWeek())
                ->count();
            
            $weeklyProgress = [
                'current' => min($weeklyReads, 5),
                'target' => 5,
                'completed' => $weeklyReads >= 5,
            ];
        }

        return inertia('leaderboard/index', [
            'leaderboard' => $leaderboard,
            'currentUser' => $currentUser,
            'timeFilter' => $timeFilter,
            'badgeDescriptions' => $badgeDescriptions,
            'weeklyProgress' => $weeklyProgress,
        ]);
    }
}