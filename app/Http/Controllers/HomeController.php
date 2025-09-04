<?php

namespace App\Http\Controllers;

use App\Models\Name;
use App\Models\Story;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        // Get featured/popular stories (most read)
        $featuredStories = Story::with(['storyCategory', 'creator'])
            ->withCount('allComments')
            ->orderBy('total_reads', 'desc')
            ->limit(3)
            ->get()
            ->map(function ($story) {
                return [
                    'id' => $story->id,
                    'title' => $story->title,
                    'slug' => $story->slug,
                    'origin_place' => $story->origin_place,
                    'image' => $story->image,
                    'total_reads' => $story->total_reads,
                    'comments_count' => $story->all_comments_count,
                    'category' => $story->storyCategory?->name,
                    'is_official' => $story->is_official,
                    'created_at' => $story->created_at->format('Y-m-d'),
                    'read_time' => $this->calculateReadTime($story->content),
                    'rating' => $this->calculateRating($story->total_reads), // Mock rating based on reads
                ];
            });

        // Get popular names (most viewed)
        $popularNames = Name::with('category')
            ->orderBy('views', 'desc')
            ->limit(4)
            ->get()
            ->map(function ($name) {
                return [
                    'id' => $name->id,
                    'name' => $name->name,
                    'slug' => $name->slug,
                    'meaning' => $name->meaning,
                    'origin' => $name->origin,
                    'category' => $name->category->name,
                    'views' => $name->views,
                ];
            });

        // Get platform statistics
        $stats = [
            'total_stories' => Story::count(),
            'total_names' => Name::count(),
            'total_users' => User::count(),
            'total_reads' => Story::sum('total_reads'),
        ];

        // Get recent activities (latest stories)
        $recentStories = Story::with(['storyCategory', 'creator'])
            ->orderBy('created_at', 'desc')
            ->limit(3)
            ->get()
            ->map(function ($story) {
                return [
                    'id' => $story->id,
                    'title' => $story->title,
                    'slug' => $story->slug,
                    'origin_place' => $story->origin_place,
                    'image' => $story->image,
                    'created_at' => $story->created_at->format('d M Y'),
                    'creator' => $story->creator?->name ?? 'Anonymous',
                    'category' => $story->storyCategory?->name,
                    'excerpt' => $this->getExcerpt($story->content, 100),
                ];
            });

        return Inertia::render('welcome', [
            'featuredStories' => $featuredStories,
            'popularNames' => $popularNames,
            'stats' => $stats,
            'recentStories' => $recentStories,
        ]);
    }

    private function calculateReadTime($content)
    {
        $wordCount = str_word_count(strip_tags($content));
        $readTime = ceil($wordCount / 200); // Assuming 200 words per minute
        return max(1, $readTime); // Minimum 1 minute
    }

    private function calculateRating($totalReads)
    {
        // Mock rating calculation based on reads
        if ($totalReads > 1000) return 4.9;
        if ($totalReads > 500) return 4.8;
        if ($totalReads > 200) return 4.7;
        if ($totalReads > 100) return 4.6;
        if ($totalReads > 50) return 4.5;
        return 4.0;
    }

    private function getExcerpt($content, $length = 150)
    {
        $content = strip_tags($content);
        if (strlen($content) <= $length) {
            return $content;
        }
        return substr($content, 0, $length) . '...';
    }
}
