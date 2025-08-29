<?php

namespace App\Http\Controllers;

use App\Models\Name;
use Illuminate\Http\Request;

class NameController extends Controller
{
    public function index(Request $request) 
    {
        $query = Name::with('category');
        
        // Search functionality
        if ($request->has('name') && $request->name) {
            $searchTerm = $request->name;
            $query->where(function($q) use ($searchTerm) {
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
        
        return inertia('nama-nusantara/index', [
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
}