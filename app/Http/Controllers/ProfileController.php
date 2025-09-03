<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use App\Models\Story;
use App\Models\Comment;
use App\Models\UserBadge;
use App\Models\UserPoint;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class ProfileController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        // Basic Stats
        $stats = [
            'storiesContributed' => $user->stories()->count(),
            'commentsPosted' => $user->comments()->count(),
            'quizzesTaken' => $user->quizzes_taken ?? 0,
            'totalScore' => $user->total_points ?? 0,
            'averageScore' => round($user->quizResults()->avg('score') ?? 0),
            'storiesRead' => $user->stories_read ?? 0,
            'favoriteStories' => 0, // Placeholder - implement if needed
            'achievements' => $user->userBadges()->count(),
        ];

        // User Contributions (Stories)
        $contributions = $user->stories()
            ->select('id', 'title', 'slug', 'created_at', 'total_reads', 'image', 'is_official')
            ->withCount('comments')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($story) {
                return [
                    'id' => $story->id,
                    'title' => $story->title,
                    'slug' => $story->slug,
                    'type' => 'story',
                    'status' => $story->is_official ? 'official' : 'published',
                    'submittedAt' => $story->created_at->diffForHumans(),
                    'reads' => $story->total_reads ?? 0,
                    'rating' => null, // Implement if you have rating system
                    'comments' => $story->comments_count,
                ];
            });

        // User Badges/Achievements
        $userBadges = $user->userBadges()->orderBy('earned_at', 'desc')->get();
        
        // Define all possible badges with progress tracking
        $allBadges = [
            [
                'title' => 'Pemula Budaya',
                'description' => 'Memulai perjalanan budaya',
                'requirement' => 'total_points',
                'target' => 0,
                'icon' => 'Star'
            ],
            [
                'title' => 'Penjelajah Cerita',
                'description' => 'Baca 40+ cerita',
                'requirement' => 'stories_read',
                'target' => 40,
                'icon' => 'BookOpen'
            ],
            [
                'title' => 'Kolektor Nama',
                'description' => 'Selesaikan 25+ kuis',
                'requirement' => 'quizzes_taken',
                'target' => 25,
                'icon' => 'Star'
            ],
            [
                'title' => 'Ahli Budaya',
                'description' => 'Skor kuis rata-rata 90%',
                'requirement' => 'quiz_average',
                'target' => 90,
                'icon' => 'Trophy'
            ],
            [
                'title' => 'Pencinta Tradisi',
                'description' => 'Baca 20+ cerita',
                'requirement' => 'stories_read',
                'target' => 20,
                'icon' => 'Award'
            ],
            [
                'title' => 'Penjaga Warisan',
                'description' => 'Kumpulkan 1500+ poin',
                'requirement' => 'total_points',
                'target' => 1500,
                'icon' => 'TrendingUp'
            ],
            [
                'title' => 'Kontributor Aktif',
                'description' => 'Kirim 5+ cerita',
                'requirement' => 'stories_contributed',
                'target' => 5,
                'icon' => 'Award'
            ],
            [
                'title' => 'Diskusi Aktif',
                'description' => 'Tulis 50+ komentar',
                'requirement' => 'comments_posted',
                'target' => 50,
                'icon' => 'MessageCircle'
            ]
        ];

        $achievements = collect($allBadges)->map(function ($badge) use ($user, $userBadges, $stats) {
            $earnedBadge = $userBadges->firstWhere('badge_name', $badge['title']);
            
            // Calculate current progress
            $progress = 0;
            switch ($badge['requirement']) {
                case 'total_points':
                    $progress = $user->total_points ?? 0;
                    break;
                case 'stories_read':
                    $progress = $user->stories_read ?? 0;
                    break;
                case 'quizzes_taken':
                    $progress = $user->quizzes_taken ?? 0;
                    break;
                case 'quiz_average':
                    $progress = round($user->quizResults()->avg('score') ?? 0);
                    break;
                case 'stories_contributed':
                    $progress = $stats['storiesContributed'];
                    break;
                case 'comments_posted':
                    $progress = $stats['commentsPosted'];
                    break;
            }

            return [
                'id' => $badge['title'],
                'title' => $badge['title'],
                'description' => $badge['description'],
                'icon' => $badge['icon'],
                'earned' => $earnedBadge ? true : false,
                'earnedAt' => $earnedBadge ? $earnedBadge->earned_at->diffForHumans() : null,
                'progress' => min($progress, $badge['target']),
                'target' => $badge['target'],
            ];
        });

        // Recent Activity
        $recentActivity = collect();

        // Add recent comments
        $recentComments = $user->comments()
            ->with('story:id,title,slug')
            ->latest()
            ->take(10)
            ->get();
        
        foreach ($recentComments as $comment) {
            $recentActivity->push([
                'id' => 'comment-' . $comment->id,
                'type' => 'comment',
                'action' => 'Berkomentar di',
                'target' => $comment->story->title ?? 'Cerita tidak ditemukan',
                'target_link' => $comment->story ? route('stories.show', $comment->story->slug) : '#',
                'timestamp' => $comment->created_at->diffForHumans(),
                'created_at' => $comment->created_at,
            ]);
        }

        // Add recent quiz results
        $recentQuizzes = $user->quizResults()
            ->with('story:id,title,slug')
            ->latest()
            ->take(10)
            ->get();
        
        foreach ($recentQuizzes as $quiz) {
            $recentActivity->push([
                'id' => 'quiz-' . $quiz->id,
                'type' => 'quiz',
                'action' => 'Menyelesaikan kuis',
                'target' => $quiz->story->title ?? 'Cerita tidak ditemukan',
                'target_link' => $quiz->story ? route('stories.show', $quiz->story->slug) : '#',
                'score' => $quiz->score,
                'timestamp' => $quiz->created_at->diffForHumans(),
                'created_at' => $quiz->created_at,
            ]);
        }

        // Add recent story reads from UserPoints
        $recentReads = $user->userPoints()
            ->where('action', 'story_read')
            ->latest()
            ->take(10)
            ->get();
        
        foreach ($recentReads as $read) {
            // Extract story title from description
            $storyTitle = str_replace('Membaca cerita: ', '', explode(' (story_id:', $read->description)[0] ?? '');
            
            $recentActivity->push([
                'id' => 'read-' . $read->id,
                'type' => 'read',
                'action' => 'Membaca cerita',
                'target' => $storyTitle,
                'target_link' => '#', // Could extract story_id and build link if needed
                'timestamp' => $read->created_at->diffForHumans(),
                'created_at' => $read->created_at,
            ]);
        }

        // Add recent story contributions
        $recentStories = $user->stories()
            ->select('id', 'title', 'slug', 'created_at')
            ->latest()
            ->take(5)
            ->get();
        
        foreach ($recentStories as $story) {
            $recentActivity->push([
                'id' => 'story-' . $story->id,
                'type' => 'story',
                'action' => 'Menerbitkan cerita',
                'target' => $story->title,
                'target_link' => route('stories.show', $story->slug),
                'timestamp' => $story->created_at->diffForHumans(),
                'created_at' => $story->created_at,
            ]);
        }

        // Sort by created_at and take latest 15 activities
        $recentActivity = $recentActivity->sortByDesc('created_at')->take(15)->values();

        // Avatar URL using DiceBear
        $avatarUrl = "https://api.dicebear.com/7.x/avataaars/svg?seed=" . urlencode($user->name);

        // User Info
        $userInfo = [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'avatar' => $avatarUrl,
            'joinedAt' => $user->created_at ? 'Bergabung ' . $user->created_at->translatedFormat('F Y') : '',
            'location' => $user->location ?? 'Tidak disebutkan',
            'bio' => $user->bio ?? 'Belum ada bio.',
            'isVerified' => $user->hasVerifiedEmail(),
            'currentBadge' => $user->current_badge ?? 'Pemula Budaya',
        ];

        // List of Indonesian provinces for location select
        $provinces = [
            "Aceh",
            "Sumatera Utara",
            "Sumatera Barat",
            "Riau",
            "Kepulauan Riau",
            "Jambi",
            "Sumatera Selatan",
            "Bangka Belitung",
            "Bengkulu",
            "Lampung",
            "DKI Jakarta",
            "Jawa Barat",
            "Jawa Tengah",
            "DI Yogyakarta",
            "Jawa Timur",
            "Banten",
            "Bali",
            "Nusa Tenggara Barat",
            "Nusa Tenggara Timur",
            "Kalimantan Barat",
            "Kalimantan Tengah",
            "Kalimantan Selatan",
            "Kalimantan Timur",
            "Kalimantan Utara",
            "Sulawesi Utara",
            "Sulawesi Tengah",
            "Sulawesi Selatan",
            "Sulawesi Tenggara",
            "Gorontalo",
            "Sulawesi Barat",
            "Maluku",
            "Maluku Utara",
            "Papua",
            "Papua Barat",
            "Papua Selatan",
            "Papua Tengah",
            "Papua Pegunungan"
        ];

        return inertia('profile/index', [
            'user' => $userInfo,
            'stats' => $stats,
            'contributions' => $contributions,
            'achievements' => $achievements,
            'recentActivity' => $recentActivity,
            'provinces' => $provinces,
        ]);
    }

    public function update(Request $request)
    {
        $user = Auth::user();

        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email,' . $user->id],
            'location' => ['nullable', 'string', 'max:255'],
            'bio' => ['nullable', 'string', 'max:500'],
        ], [
            'name.required' => 'Nama wajib diisi.',
            'name.max' => 'Nama maksimal 255 karakter.',
            'email.required' => 'Email wajib diisi.',
            'email.email' => 'Format email tidak valid.',
            'email.unique' => 'Email sudah digunakan oleh akun lain.',
            'location.max' => 'Lokasi maksimal 255 karakter.',
            'bio.max' => 'Bio maksimal 500 karakter.',
        ]);

        // Update user data
        $user->update([
            'name' => $request->name,
            'email' => $request->email,
            'location' => $request->location,
            'bio' => $request->bio,
        ]);

        return back()->with('success', 'Profil berhasil diperbarui!');
    }

    public function updatePassword(Request $request)
    {
        $user = Auth::user();

        $request->validate([
            'current_password' => ['required'],
            'password' => ['required', 'confirmed', Password::defaults()],
        ], [
            'current_password.required' => 'Password saat ini wajib diisi.',
            'password.required' => 'Password baru wajib diisi.',
            'password.confirmed' => 'Konfirmasi password tidak cocok.',
        ]);

        // Verify current password
        if (!Hash::check($request->current_password, $user->password)) {
            return back()->withErrors([
                'current_password' => 'Password saat ini tidak benar.'
            ]);
        }

        // Update password
        $user->update([
            'password' => Hash::make($request->password)
        ]);

        return back()->with('success', 'Password berhasil diperbarui!');
    }
}