<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Story;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CommentController extends Controller
{
    public function store(Request $request, $storySlug)
    {
        $request->validate([
            'content' => 'required|string|min:5|max:1000',
            'parent_id' => 'nullable|exists:comments,id'
        ], [
            'content.required' => 'Komentar tidak boleh kosong.',
            'content.min' => 'Komentar minimal 5 karakter.',
            'content.max' => 'Komentar maksimal 1000 karakter.',
            'parent_id.exists' => 'Komentar yang dibalas tidak valid.'
        ]);

        $story = Story::where('slug', $storySlug)->firstOrFail();

        // Check if parent comment belongs to the same story
        if ($request->parent_id) {
            $parentComment = Comment::where('id', $request->parent_id)
                ->where('story_id', $story->id)
                ->firstOrFail();
        }

        $comment = Comment::create([
            'content' => $request->content,
            'story_id' => $story->id,
            'user_id' => Auth::id(),
            'parent_id' => $request->parent_id,
            'is_approved' => true // Auto approve for now
        ]);

        $comment->load('user');

        return response()->json([
            'success' => true,
            'message' => 'Komentar berhasil ditambahkan!',
            'comment' => $comment
        ]);
    }

    public function destroy($id)
    {
        $comment = Comment::findOrFail($id);

        // Only allow user to delete their own comments or admin
        if ($comment->user_id !== Auth::id() && !Auth::user()->hasRole('admin')) {
            return response()->json([
                'success' => false,
                'message' => 'Anda tidak memiliki izin untuk menghapus komentar ini.'
            ], 403);
        }

        $comment->delete();

        return response()->json([
            'success' => true,
            'message' => 'Komentar berhasil dihapus!'
        ]);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'content' => 'required|string|min:5|max:1000'
        ], [
            'content.required' => 'Komentar tidak boleh kosong.',
            'content.min' => 'Komentar minimal 5 karakter.',
            'content.max' => 'Komentar maksimal 1000 karakter.'
        ]);

        $comment = Comment::findOrFail($id);

        // Only allow user to edit their own comments
        if ($comment->user_id !== Auth::id()) {
            return response()->json([
                'success' => false,
                'message' => 'Anda tidak memiliki izin untuk mengedit komentar ini.'
            ], 403);
        }

        $comment->update([
            'content' => $request->content
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Komentar berhasil diperbarui!',
            'comment' => $comment
        ]);
    }
}