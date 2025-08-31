<?php

namespace App\Http\Controllers;

use App\Models\Story;
use App\Models\StoryCategory;
use Illuminate\Http\Request;

class StoryController extends Controller
{
    public function index(Request $request)
    {
        $query = Story::with(['storyCategory', 'creator']);

        // Search functionality
        if ($request->has('search') && $request->search) {
            $searchTerm = $request->search;
            $query->where(function ($q) use ($searchTerm) {
                $q->where('title', 'like', '%' . $searchTerm . '%')
                    ->orWhere('content', 'like', '%' . $searchTerm . '%')
                    ->orWhere('origin_place', 'like', '%' . $searchTerm . '%');
            });
        }

        // Filter by region/origin_place
        if ($request->has('region') && $request->region && $request->region !== 'all') {
            $query->where('origin_place', $request->region);
        }

        // Filter by category
        if ($request->has('category') && $request->category && $request->category !== 'all') {
            $query->where('story_category_id', $request->category);
        }

        // Filter by type (official/community)
        if ($request->has('type') && $request->type && $request->type !== 'all') {
            $isOfficial = $request->type === 'official' ? 1 : 0;
            $query->where('is_official', $isOfficial);
        }

        // Sorting
        $sortBy = $request->get('sort', 'popular');
        switch ($sortBy) {
            case 'newest':
                $query->orderBy('created_at', 'desc');
                break;
            case 'oldest':
                $query->orderBy('created_at', 'asc');
                break;
            case 'alphabetical':
                $query->orderBy('title', 'asc');
                break;
            case 'reads':
                $query->orderBy('total_reads', 'desc');
                break;
            case 'popular':
            default:
                $query->orderBy('total_reads', 'desc');
                break;
        }

        // Paginate results (12 per page)
        $stories = $query->paginate(12)->withQueryString();

        // Get available regions for filter
        $regions = Story::select('origin_place')
            ->distinct()
            ->whereNotNull('origin_place')
            ->orderBy('origin_place')
            ->pluck('origin_place');

        // Get story categories for filter
        $categories = StoryCategory::orderBy('name')->get();

        // Get trending stories (most read)
        $trendingStories = Story::with(['storyCategory', 'creator'])
            ->orderBy('total_reads', 'desc')
            ->limit(5)
            ->get();

        return inertia('stories/index', [
            'stories' => $stories,
            'trendingStories' => $trendingStories,
            'regions' => $regions,
            'categories' => $categories,
            'filters' => [
                'search' => $request->search ?? '',
                'region' => $request->region ?? 'all',
                'category' => $request->category ?? 'all',
                'type' => $request->type ?? 'all',
                'sort' => $request->sort ?? 'popular',
            ],
            'totalStories' => Story::count()
        ]);
    }

    public function show(Story $story)
    {
        // Increment read count
        $story->increment('total_reads');

        // Load relationships
        $story->load(['storyCategory', 'creator']);

        // Get related stories (same category or region)
        $relatedStories = Story::with(['storyCategory', 'creator'])
            ->where('id', '!=', $story->id)
            ->where(function ($query) use ($story) {
                $query->where('story_category_id', $story->story_category_id)
                    ->orWhere('origin_place', $story->origin_place);
            })
            ->limit(4)
            ->get();

        return inertia('stories/show', [
            'story' => $story,
            'relatedStories' => $relatedStories
        ]);
    }
}
