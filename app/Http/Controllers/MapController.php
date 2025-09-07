<?php

namespace App\Http\Controllers;

use App\Models\Story;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MapController extends Controller
{
    public function index()
    {
        // Get stories grouped by province with coordinates
        $provinceStories = $this->getProvinceStoriesWithCoordinates();
        
        // Get total stories count per province
        $provinceStats = Story::selectRaw('origin_place, COUNT(*) as story_count')
            ->where('verification_status', 'approved')
            ->whereIn('origin_place', array_keys($provinceStories))
            ->groupBy('origin_place')
            ->pluck('story_count', 'origin_place')
            ->toArray();

        // Format data for frontend
        $mapData = [];
        foreach ($provinceStories as $province => $data) {
            $mapData[] = [
                'province' => $province,
                'coordinates' => $data['coordinates'],
                'story_count' => $provinceStats[$province] ?? 0,
                'stories' => $data['stories']
            ];
        }

        return Inertia::render('map/index', [
            'mapData' => $mapData,
            'totalProvinces' => count($mapData),
            'totalStories' => array_sum($provinceStats)
        ]);
    }

    public function getStoriesByProvince(Request $request, $province)
    {
        $stories = Story::with(['storyCategory', 'creator'])
            ->where('origin_place', $province)
            ->where('verification_status', 'approved')
            ->orderBy('total_reads', 'desc')
            ->paginate(12);

        return response()->json([
            'province' => $province,
            'stories' => $stories
        ]);
    }

    private function getProvinceStoriesWithCoordinates()
    {
        // Koordinat provinsi Indonesia (lat, lng)
        $provinces = [
            'Aceh' => [-4.695135, 96.7493993],
            'Sumatera Utara' => [2.1153547, 99.5450974],
            'Sumatera Barat' => [-0.7399397, 100.8000051],
            'Riau' => [0.2933469, 101.7068294],
            'Kepulauan Riau' => [0.9088397, 104.4563167],
            'Jambi' => [-1.4851831, 103.6150183],
            'Sumatera Selatan' => [-3.3194374, 103.9145785],
            'Bangka Belitung' => [-2.7410513, 106.4405872],
            'Bengkulu' => [-3.8004735, 102.2655183],
            'Lampung' => [-4.5585849, 105.4068079],
            'DKI Jakarta' => [-6.2087634, 106.845599],
            'Jawa Barat' => [-6.914744, 107.609344],
            'Jawa Tengah' => [-7.150975, 110.1402594],
            'DI Yogyakarta' => [-7.7955798, 110.3694896],
            'Jawa Timur' => [-7.5360639, 112.2384017],
            'Banten' => [-6.4058172, 106.0640179],
            'Bali' => [-8.4095178, 115.188916],
            'Nusa Tenggara Barat' => [-8.6529334, 117.3616476],
            'Nusa Tenggara Timur' => [-8.6573819, 121.0793705],
            'Kalimantan Barat' => [-0.2787808, 111.4752851],
            'Kalimantan Tengah' => [-1.6814878, 113.3823545],
            'Kalimantan Selatan' => [-3.0926415, 115.2837585],
            'Kalimantan Timur' => [1.6406296, 116.419389],
            'Kalimantan Utara' => [3.0730929, 116.0413889],
            'Sulawesi Utara' => [1.2384169, 124.8413164],
            'Sulawesi Tengah' => [-1.4300254, 121.4456179],
            'Sulawesi Selatan' => [-3.6687994, 119.9740534],
            'Sulawesi Tenggara' => [-4.14491, 122.174605],
            'Gorontalo' => [0.6999372, 122.4467238],
            'Sulawesi Barat' => [-2.8441371, 119.2320784],
            'Maluku' => [-3.2384616, 130.1452734],
            'Maluku Utara' => [1.5709993, 127.8087693],
            'Papua' => [-4.269928, 138.0803529],
            'Papua Barat' => [-1.3361154, 133.1747162],
            'Papua Selatan' => [-6.08688, 140.692497],
            'Papua Tengah' => [-3.373056, 136.308594],
            'Papua Pegunungan' => [-4.081, 138.252]
        ];

        $result = [];
        
        foreach ($provinces as $province => $coordinates) {
            $stories = Story::with(['storyCategory', 'creator'])
                ->where('origin_place', $province)
                ->where('verification_status', 'approved')
                ->orderBy('total_reads', 'desc')
                ->limit(10)
                ->get()
                ->map(function ($story) {
                    return [
                        'id' => $story->id,
                        'title' => $story->title,
                        'slug' => $story->slug,
                        'image' => $story->image,
                        'total_reads' => $story->total_reads,
                        'is_official' => $story->is_official,
                        'category' => $story->storyCategory?->name,
                        'creator' => $story->creator?->name
                    ];
                });

            if ($stories->count() > 0) {
                $result[$province] = [
                    'coordinates' => $coordinates,
                    'stories' => $stories
                ];
            }
        }

        return $result;
    }
}