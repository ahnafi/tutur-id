<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class NameCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $nameCategories = [
            'Tradisional',
            'Modern',
            'Unik',
            'Alkitabiah',
            'Mitologis',
            'Terinspirasi Alam',
            'Berbasis Kebajikan',
            'Budaya',
            'Sejarah',
            'Terinspirasi Selebriti',
        ];

        foreach ($nameCategories as $category) {
            \App\Models\NameCategory::create([
                'name' => $category,
            ]);
        }
    }
}
