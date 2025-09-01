<?php

namespace App\Http\Controllers;

use App\Models\Quiz;
use App\Models\QuizResult;
use App\Models\Story;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class QuizController extends Controller
{
    public function show($slug)
    {
        // Get story by slug
        $story = Story::where('slug', $slug)->firstOrFail();
        
        // Load story with quizzes
        $story->load(['storyCategory', 'creator', 'quizzes']);
        
        // Check if story has quizzes
        if ($story->quizzes->isEmpty()) {
            return redirect()->route('stories.show', $story->slug)
                ->with('error', 'Cerita ini belum memiliki kuis.');
        }

        // Get user's previous result if logged in
        $previousResult = null;
        if (Auth::check()) {
            $previousResult = QuizResult::where('story_id', $story->id)
                ->where('user_id', Auth::id())
                ->latest()
                ->first();
        }

        return inertia('stories/quiz', [
            'story' => $story,
            'previousResult' => $previousResult
        ]);
    }

    public function submit(Request $request, $slug)
    {
        $story = Story::where('slug', $slug)->firstOrFail();
        $story->load('quizzes');

        $request->validate([
            'answers' => 'required|array',
            'answers.*' => 'required|string|in:option_a,option_b,option_c,option_d'
        ]);

        $answers = $request->answers;
        $correctCount = 0;
        $totalQuestions = $story->quizzes->count();

        // Calculate score
        foreach ($story->quizzes as $index => $quiz) {
            if (isset($answers[$index]) && $answers[$index] === $quiz->correct_answer) {
                $correctCount++;
            }
        }

        $score = round(($correctCount / $totalQuestions) * 100);

        // Save result if user is logged in
        if (Auth::check()) {
            QuizResult::create([
                'story_id' => $story->id,
                'user_id' => Auth::id(),
                'score' => $score
            ]);
        }

        return response()->json([
            'success' => true,
            'score' => $score,
            'correctCount' => $correctCount,
            'totalQuestions' => $totalQuestions,
            'answers' => $answers
        ]);
    }
}