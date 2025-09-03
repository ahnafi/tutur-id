<?php

namespace App\Http\Controllers;

use App\Models\Name;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class NameController extends Controller
{
    public function index(Request $request)
    {
        $query = Name::with('category');

        // Search functionality
        if ($request->has('name') && $request->name) {
            $searchTerm = $request->name;
            $query->where(function ($q) use ($searchTerm) {
                $q->where('name', 'like', '%' . $searchTerm . '%')
                    ->orWhere('meaning', 'like', '%' . $searchTerm . '%')
                    ->orWhere('origin', 'like', '%' . $searchTerm . '%');
            });
        }

        // Paginate results (10 per page)
        $names = $query->paginate(5)->withQueryString();

        // Get trending names (most viewed)
        $trendingNames = Name::with('category')
            ->orderBy('views', 'desc')
            ->limit(5)
            ->get();

        return inertia('names/index', [
            'names' => $names,
            'trendingNames' => $trendingNames,
            'searchQuery' => $request->name ?? '',
            'totalNames' => Name::count()
        ]);
    }

    public function show(Name $name)
    {
        // Increment view count
        $name->increment('views');

        return response()->json([
            'name' => $name->load('category')
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:names,name',
            'meaning' => 'required|string',
            'origin' => 'required|string|max:255',
            'description' => 'required|string',
            'name_category_id' => 'required|integer|exists:name_categories,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $name = Name::create($request->all());

            return response()->json([
                'success' => true,
                'message' => 'Nama berhasil diunggah ke database',
                'data' => $name->load('category')
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal menyimpan nama ke database'
            ], 500);
        }
    }
}