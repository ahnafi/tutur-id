<?php

namespace App\Http\Controllers;

use App\Models\Story;
use App\Models\StoryCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class StoryController extends Controller
{
    public function index(Request $request)
    {
        $query = Story::with(['storyCategory', 'creator', 'quizzes']);

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

        // Paginate results (6 per page)
        $stories = $query->paginate(6)->withQueryString();

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

    public function show($slug)
    {
        // Manual lookup by slug instead of route model binding
        $story = Story::where('slug', $slug)->firstOrFail();

        // Increment read count
        $story->increment('total_reads');

        // Load relationships including quizzes
        $story->load(['storyCategory', 'creator', 'quizzes']);

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

    // Method untuk halaman kontribusi
    public function create()
    {
        $categories = StoryCategory::orderBy('name')->get();

        $regions = [
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

        return inertia('stories/create', [
            'categories' => $categories,
            'regions' => $regions
        ]);
    }

    // Method untuk menyimpan kontribusi
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string|min:100',
            'origin_place' => 'required|string',
            'story_category_id' => 'nullable|exists:story_categories,id',
            'gmaps_link' => 'nullable|url',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
        ], [
            'title.required' => 'Judul cerita wajib diisi.',
            'title.max' => 'Judul maksimal 255 karakter.',
            'content.required' => 'Isi cerita wajib diisi.',
            'content.min' => 'Isi cerita minimal 100 karakter.',
            'origin_place.required' => 'Asal daerah cerita wajib diisi.',
            'story_category_id.exists' => 'Kategori cerita tidak valid.',
            'gmaps_link.url' => 'Link Google Maps harus berupa URL yang valid.',
            'image.image' => 'File yang diunggah harus berupa gambar.',
            'image.mimes' => 'Gambar harus berformat jpeg, png, jpg, atau gif.',
            'image.max' => 'Ukuran gambar maksimal 2MB.'
        ]);

        $imagePath = null;

        // Handle image upload
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $fileName = 'indonesian-folklore-' . Str::slug($request->title) . '-community.' . $image->getClientOriginalExtension();

            // Store in storage/app/public/story-images directory using the public disk
            $imagePath = '/story-images/' . $fileName;
            $image->storeAs('story-images', $fileName, 'public');
        }

        // Determine if user is admin to set is_official
        $isOfficial = Auth::check() && Auth::user()->hasRole('admin') ? 1 : 0;

        $story = Story::create([
            'title' => $request->title,
            'content' => $request->content,
            'origin_place' => $request->origin_place,
            'story_category_id' => $request->story_category_id,
            'gmaps_link' => $request->gmaps_link,
            'image' => $imagePath,
            'created_by' => Auth::id(),
            'is_official' => $isOfficial,
            'total_reads' => 0
        ]);

        return redirect()->route('stories.show', $story->slug)->with('success', 'Cerita berhasil dikirim! Terima kasih atas kontribusinya.');
    }

    // Method untuk melihat kontribusi user sendiri
    public function myContributions()
    {
        if (!Auth::check()) {
            return redirect()->route('login');
        }

        $stories = Story::where('created_by', Auth::id())
            ->with('storyCategory')
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return inertia('stories/my-contributions', [
            'stories' => $stories
        ]);
    }
}
