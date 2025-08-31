<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class StoryCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $storyCategories = [
            ['name' => 'Legenda'],
            ['name' => 'Mitos'],
            ['name' => 'Fabel'],
            ['name' => 'Cerita Rakyat'],
            ['name' => 'Dongeng'],
            ['name' => 'Sage'],
            ['name' => 'Epos'],
            ['name' => 'Cerita Jenaka'],
            ['name' => 'Cerita Petualangan'],
            ['name' => 'Cerita Sejarah'],
        ];

        foreach ($storyCategories as $category) {
            \App\Models\StoryCategory::create($category);
        }
    }
}
