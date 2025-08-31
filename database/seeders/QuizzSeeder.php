<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class QuizzSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $quizzes =
            [
                [
                    "story_id" => 1,
                    "question" => "Apa alasan Malin Kundang dikutuk menjadi batu?",
                    "option_a" => "Karena ia mencuri harta ibunya",
                    "option_b" => "Karena ia tidak mengakui ibunya",
                    "option_c" => "Karena ia merantau ke negeri seberang",
                    "option_d" => "Karena ia menikahi putri raja",
                    "correct_answer" => "option_b",
                ],
                [
                    "story_id" => 1,
                    "question" => "Dimana asal cerita Malin Kundang?",
                    "option_a" => "Jawa Barat",
                    "option_b" => "Sumatera Barat",
                    "option_c" => "Kalimantan Timur",
                    "option_d" => "Sulawesi Selatan",
                    "correct_answer" => "option_b",
                ],
                [
                    "story_id" => 2,
                    "question" => "Siapa sebenarnya Dayang Sumbi bagi Sangkuriang?",
                    "option_a" => "Ibunya",
                    "option_b" => "Saudaranya",
                    "option_c" => "Putri Raja",
                    "option_d" => "Guru Sangkuriang",
                    "correct_answer" => "option_a",
                ],
                [
                    "story_id" => 2,
                    "question" => "Apa syarat yang diberikan Dayang Sumbi kepada Sangkuriang?",
                    "option_a" => "Membuat danau dan perahu dalam semalam",
                    "option_b" => "Mencari harta karun",
                    "option_c" => "Menjadi raja",
                    "option_d" => "Menemukan batu ajaib",
                    "correct_answer" => "option_a",
                ],
            ];

        foreach ($quizzes as $quiz) {
            \App\Models\Quiz::create($quiz);
        }
    }
}
