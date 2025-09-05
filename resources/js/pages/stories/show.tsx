'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Toaster } from '@/components/ui/toaster';
import Layout from '@/layouts/layout';
import { Comment, Story, User } from '@/types';
import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';
import { Head, Link, usePage } from '@inertiajs/react';
import axios from 'axios';
import {
    AlertCircle,
    ArrowLeft,
    BookOpen,
    Clock,
    Edit3,
    ExternalLink,
    Eye,
    Loader2,
    MapPin,
    MessageCircle,
    Pause,
    Play,
    Reply,
    Send,
    Share2,
    Square,
    Trash2,
    Users,
    Volume2,
} from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
import { toast } from 'sonner';

interface StoryDetailPageProps {
    story: Story;
    relatedStories: Story[];
}

export default function StoryDetailPage({ story, relatedStories }: StoryDetailPageProps) {
    const { props } = usePage<{ auth: { user?: User } }>();
    const user = props.auth?.user;

    const [comments, setComments] = useState<Comment[]>(story.comments || []);
    const [newComment, setNewComment] = useState('');
    const [replyTo, setReplyTo] = useState<number | null>(null);
    const [replyContent, setReplyContent] = useState('');
    const [editingComment, setEditingComment] = useState<number | null>(null);
    const [editContent, setEditContent] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [deletingComment, setDeletingComment] = useState<number | null>(null);

    const getReadTime = (content: string) => {
        const wordsPerMinute = 200;
        const wordCount = content.split(' ').length;
        const readTime = Math.ceil(wordCount / wordsPerMinute);
        return `${readTime} menit`;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatCommentDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffHours < 1) {
            const diffMins = Math.floor(diffMs / (1000 * 60));
            return `${diffMins} menit yang lalu`;
        } else if (diffHours < 24) {
            return `${diffHours} jam yang lalu`;
        } else if (diffDays < 7) {
            return `${diffDays} hari yang lalu`;
        } else {
            return date.toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
            });
        }
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: story.title,
                    text: `Baca cerita "${story.title}" dari ${story.origin_place}`,
                    url: window.location.href,
                });
            } catch (error) {
                toast.error('Error sharing: ' + error);
            }
        } else {
            navigator.clipboard.writeText(window.location.href);
            toast.success('Link berhasil disalin ke clipboard!');
        }
    };

    const submitComment = async () => {
        if (!newComment.trim()) return;

        setSubmitting(true);
        try {
            const response = await axios.post(`/cerita/${story.slug}/komentar`, {
                content: newComment,
            });

            if (response.data.success) {
                const newCommentData = response.data.comment;
                setComments([newCommentData, ...comments]);
                setNewComment('');
                toast.success('Komentar berhasil ditambahkan!');
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Terjadi kesalahan saat menambah komentar';
            toast.error(errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    const submitReply = async (parentId: number) => {
        if (!replyContent.trim()) return;

        setSubmitting(true);
        try {
            const response = await axios.post(`/cerita/${story.slug}/komentar`, {
                content: replyContent,
                parent_id: parentId,
            });

            if (response.data.success) {
                // Add reply to the parent comment dynamically
                const newReply = response.data.comment;

                const updateCommentsWithReply = (comments: Comment[]): Comment[] => {
                    return comments.map((comment) => {
                        if (comment.id === parentId) {
                            return {
                                ...comment,
                                replies: [...(comment.replies || []), newReply],
                            };
                        } else if (comment.replies && comment.replies.length > 0) {
                            return {
                                ...comment,
                                replies: updateCommentsWithReply(comment.replies),
                            };
                        }
                        return comment;
                    });
                };

                setComments(updateCommentsWithReply(comments));
                setReplyTo(null);
                setReplyContent('');
                toast.success('Balasan berhasil ditambahkan!');
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Terjadi kesalahan saat menambah balasan';
            toast.error(errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    const deleteComment = async (commentId: number) => {
        setDeletingComment(commentId);
        try {
            const response = await axios.delete(`/komentar/${commentId}`);
            if (response.data.success) {
                // Remove comment dynamically
                const removeCommentFromList = (comments: Comment[]): Comment[] => {
                    return comments.filter((comment) => {
                        if (comment.id === commentId) {
                            return false;
                        }
                        if (comment.replies && comment.replies.length > 0) {
                            comment.replies = removeCommentFromList(comment.replies);
                        }
                        return true;
                    });
                };

                setComments(removeCommentFromList(comments));
                toast.success('Komentar berhasil dihapus!');
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Terjadi kesalahan saat menghapus komentar';
            toast.error(errorMessage);
        } finally {
            setDeletingComment(null);
        }
    };

    const updateComment = async (commentId: number) => {
        if (!editContent.trim()) return;

        try {
            const response = await axios.put(`/komentar/${commentId}`, {
                content: editContent,
            });

            if (response.data.success) {
                // Update comment dynamically
                const updateCommentInList = (comments: Comment[]): Comment[] => {
                    return comments.map((comment) => {
                        if (comment.id === commentId) {
                            return {
                                ...comment,
                                content: editContent,
                                updated_at: new Date().toISOString(),
                            };
                        } else if (comment.replies && comment.replies.length > 0) {
                            return {
                                ...comment,
                                replies: updateCommentInList(comment.replies),
                            };
                        }
                        return comment;
                    });
                };

                setComments(updateCommentInList(comments));
                setEditingComment(null);
                setEditContent('');
                toast.success('Komentar berhasil diperbarui!');
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Terjadi kesalahan saat mengupdate komentar';
            toast.error(errorMessage);
        }
    };

    const renderComment = useCallback(
        (comment: Comment, depth: number = 0) => (
            <div key={comment.id} className={`${depth > 0 ? 'ml-8 border-l-2 border-gray-200 pl-4' : ''}`}>
                <div className="space-y-3">
                    <div className="flex items-start gap-3">
                        <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">{comment.user.name}</span>
                                <span className="text-xs text-muted-foreground">{formatCommentDate(comment.created_at)}</span>
                                {comment.updated_at !== comment.created_at && <span className="text-xs text-muted-foreground italic">(diedit)</span>}
                            </div>

                            {editingComment === comment.id ? (
                                <div className="space-y-2">
                                    <Textarea
                                        value={editContent}
                                        onChange={(e) => setEditContent(e.target.value)}
                                        placeholder="Edit komentar..."
                                        className="min-h-[80px]"
                                    />
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            onClick={() => updateComment(comment.id)}
                                            disabled={!editContent.trim() || editContent.length > 1000}
                                        >
                                            Simpan
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => {
                                                setEditingComment(null);
                                                setEditContent('');
                                            }}
                                        >
                                            Batal
                                        </Button>
                                    </div>
                                    <div className="text-xs text-muted-foreground">{editContent.length}/1000 karakter</div>
                                </div>
                            ) : (
                                <>
                                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{comment.content}</p>

                                    <div className="flex flex-wrap items-center gap-3">
                                        {user && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => {
                                                    setReplyTo(comment.id);
                                                    setReplyContent('');
                                                }}
                                                className="h-auto p-0 py-1 text-xs text-muted-foreground"
                                            >
                                                <Reply className="mr-1 h-3 w-3" />
                                                Balas
                                            </Button>
                                        )}

                                        {user && comment.user_id === user.id && (
                                            <>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => {
                                                        setEditingComment(comment.id);
                                                        setEditContent(comment.content);
                                                    }}
                                                    className="h-auto p-0 py-1 text-xs text-muted-foreground hover:bg-green-600 hover:text-gray-50"
                                                >
                                                    <Edit3 className="mr-1 h-3 w-3" />
                                                    Edit
                                                </Button>

                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-auto p-0 py-1 text-xs text-red-600 hover:bg-red-600 hover:text-gray-50"
                                                            disabled={deletingComment === comment.id}
                                                        >
                                                            {deletingComment === comment.id ? (
                                                                <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                                                            ) : (
                                                                <Trash2 className="mr-1 h-3 w-3" />
                                                            )}
                                                            Hapus
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Hapus Komentar</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Apakah Anda yakin ingin menghapus komentar ini? Tindakan ini tidak dapat dibatalkan.
                                                                {comment.replies && comment.replies.length > 0 && (
                                                                    <span className="mt-2 block text-red-600">
                                                                        Komentar ini memiliki {comment.replies.length} balasan yang juga akan ikut
                                                                        terhapus.
                                                                    </span>
                                                                )}
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Batal</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                onClick={() => deleteComment(comment.id)}
                                                                className="bg-red-600 hover:bg-red-700"
                                                            >
                                                                Hapus Komentar
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </>
                                        )}
                                    </div>

                                    {replyTo === comment.id && (
                                        <div className="mt-3 space-y-2">
                                            <Textarea
                                                value={replyContent}
                                                onChange={(e) => setReplyContent(e.target.value)}
                                                placeholder={`Balas komentar ${comment.user.name}...`}
                                                className="min-h-[80px]"
                                            />
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs text-muted-foreground">{replyContent.length}/1000 karakter</span>
                                                <div className="flex gap-2">
                                                    <Button
                                                        size="sm"
                                                        onClick={() => submitReply(comment.id)}
                                                        disabled={submitting || !replyContent.trim() || replyContent.length > 1000}
                                                    >
                                                        {submitting ? (
                                                            <>
                                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                                Mengirim...
                                                            </>
                                                        ) : (
                                                            'Kirim Balasan'
                                                        )}
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => {
                                                            setReplyTo(null);
                                                            setReplyContent('');
                                                        }}
                                                    >
                                                        Batal
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    {/* Render replies */}
                    {comment.replies && comment.replies.length > 0 && (
                        <div className="mt-4 space-y-4">{comment.replies.map((reply) => renderComment(reply, depth + 1))}</div>
                    )}
                </div>
            </div>
        ),
        [comments, editingComment, editContent, replyTo, replyContent, submitting, deletingComment, user],
    );

    // Calculate total comments including replies
    const getTotalCommentCount = (comments: Comment[]): number => {
        return comments.reduce((total, comment) => {
            return total + 1 + (comment.replies ? getTotalCommentCount(comment.replies) : 0);
        }, 0);
    };

    const totalComments = getTotalCommentCount(comments);

    // Di bagian state dan refs, ubah menjadi:
    const [ttsLoading, setTtsLoading] = useState(false);
    const [ttsPlaying, setTtsPlaying] = useState(false);
    const [ttsPaused, setTtsPaused] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Ubah konfigurasi ElevenLabs dan handler-nya:
    const elevenlabs = new ElevenLabsClient({
        apiKey: import.meta.env.VITE_ELEVENLABS_API_KEY || '',
    });

    const voiceId = 'JBFqnCBsd6RMkjVDRZzb';

    const handleTextToSpeech = async () => {
        setTtsLoading(true);
        try {
            // Batasi teks jika terlalu panjang (ElevenLabs ada limit)
            let text = story.content.replace(/\n+/g, ' ').trim();

            // Batasi hingga 2500 karakter untuk menghindari error
            if (text.length > 2500) {
                text = text.substring(0, 2500) + '...';
            }

            console.log('Mengirim text ke ElevenLabs:', text.substring(0, 100) + '...');

            const audioStream = await elevenlabs.textToSpeech.convert(voiceId, {
                text,
                modelId: 'eleven_multilingual_v2',
                outputFormat: 'mp3_44100_128',
            });

            console.log('Audio stream diterima:', audioStream);

            // Konversi stream ke blob untuk dimainkan di browser
            const chunks: Uint8Array[] = [];
            const reader = audioStream.getReader();

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                chunks.push(value);
            }

            // Gabungkan chunks menjadi satu blob
            const audioBlob = new Blob(chunks, { type: 'audio/mpeg' });
            const audioUrl = URL.createObjectURL(audioBlob);

            // Buat audio element baru
            const audio = new Audio(audioUrl);
            audioRef.current = audio;

            // Setup event listeners
            audio.onloadstart = () => console.log('Audio loading started');
            audio.oncanplay = () => console.log('Audio can play');
            audio.onplay = () => {
                console.log('Audio playing');
                setTtsPlaying(true);
                setTtsPaused(false);
            };
            audio.onpause = () => {
                console.log('Audio paused');
                setTtsPlaying(false);
                setTtsPaused(true);
            };
            audio.onended = () => {
                console.log('Audio ended');
                setTtsPlaying(false);
                setTtsPaused(false);
                URL.revokeObjectURL(audioUrl); // Cleanup
            };
            audio.onerror = (e) => {
                console.error('Audio error:', e);
                toast.error('Error memutar audio');
                setTtsPlaying(false);
            };

            // Mulai putar audio
            await audio.play();
        } catch (error) {
            console.error('TTS Error:', error);
            toast.error('Gagal mengkonversi teks ke audio: ' + (error as Error).message);
        } finally {
            setTtsLoading(false);
        }
    };

    const handlePauseTTS = () => {
        if (audioRef.current) {
            if (ttsPlaying) {
                audioRef.current.pause();
            } else if (ttsPaused) {
                audioRef.current.play();
            }
        }
    };

    const handleStopTTS = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            setTtsPlaying(false);
            setTtsPaused(false);
        }
    };

    return (
        <Layout>
            <Toaster />

            <Head title={`${story.title} - Cerita Rakyat Nusantara`} />

            <div className="section-padding-x py-8">
                <div className="container max-w-screen-xl">
                    {/* Back Button */}
                    <Button variant="ghost" asChild className="mb-6">
                        <Link href={route('stories.index')}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Kembali ke Daftar Cerita
                        </Link>
                    </Button>

                    {/* Story Header */}
                    <div className="space-y-6">
                        <div className="relative h-64 overflow-hidden rounded-xl md:h-80">
                            <img
                                src={story.image ? `/storage${story.image}` : '/img/stories/default.jpg'}
                                alt={story.title}
                                className="h-full w-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                            <div className="absolute bottom-6 left-6 text-white">
                                <div className="mb-2 flex items-center gap-2">
                                    {Boolean(story.is_official) && <Badge className="bg-primary/90">Cerita Resmi</Badge>}
                                    {story.story_category && <Badge variant="secondary">{story.story_category.name}</Badge>}
                                    <Badge variant="outline" className="border-white/30 bg-white/10 text-white">
                                        {story.origin_place}
                                    </Badge>
                                </div>
                                <h1 className="mb-2 text-3xl font-bold md:text-4xl">{story.title}</h1>
                                <div className="flex flex-wrap items-center gap-4 text-sm">
                                    <div className="flex items-center gap-1">
                                        <Clock className="h-4 w-4" />
                                        <span>{getReadTime(story.content)}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Eye className="h-4 w-4" />
                                        <span>{story.total_reads} pembaca</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <MessageCircle className="h-4 w-4" />
                                        <span>{totalComments} komentar</span>
                                    </div>
                                    {!story.is_official && story.creator && (
                                        <div className="flex items-center gap-1">
                                            <Users className="h-4 w-4" />
                                            <span>oleh {story.creator.name}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-3">
                            {story.quizzes && story.quizzes.length > 0 && (
                                <Button asChild>
                                    <Link href={route('stories.quiz', story.slug)}>
                                        <Play className="mr-2 h-4 w-4" />
                                        Ikuti Kuis ({story.quizzes.length} Soal)
                                    </Link>
                                </Button>
                            )}
                            {/* Text to Speech Controls */}
                            {!ttsPlaying && !ttsPaused && (
                                <Button variant="outline" onClick={handleTextToSpeech} disabled={ttsLoading}>
                                    {ttsLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Memproses Audio...
                                        </>
                                    ) : (
                                        <>
                                            <Volume2 className="mr-2 h-4 w-4" />
                                            Dengarkan Audio
                                        </>
                                    )}
                                </Button>
                            )}

                            {(ttsPlaying || ttsPaused) && (
                                <>
                                    <Button variant="outline" onClick={handlePauseTTS}>
                                        {ttsPlaying ? (
                                            <>
                                                <Pause className="mr-2 h-4 w-4" />
                                                Hentikan Audio
                                            </>
                                        ) : (
                                            <>
                                                <Play className="mr-2 h-4 w-4" />
                                                Lanjutkan Audio
                                            </>
                                        )}
                                    </Button>
                                    <Button variant="outline" onClick={handleStopTTS}>
                                        <Square className="mr-2 h-4 w-4" />
                                        Stop Audio
                                    </Button>
                                </>
                            )}
                            <Button variant="outline" size="icon" onClick={handleShare}>
                                <Share2 className="h-4 w-4" />
                            </Button>
                            {story.gmaps_link && (
                                <Button variant="outline" asChild>
                                    <a href={story.gmaps_link} target="_blank">
                                        <ExternalLink className="mr-2 h-4 w-4" />
                                        Lihat Lokasi
                                    </a>
                                </Button>
                            )}
                        </div>
                    </div>

                    <div className="mt-8 grid gap-8 lg:grid-cols-3">
                        {/* Main Content */}
                        <div className="space-y-6 lg:col-span-2">
                            {/* Story Content */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <BookOpen className="h-5 w-5" />
                                        Cerita Lengkap
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="prose prose-gray max-w-none">
                                        {story.content.split('\n\n').map((paragraph, index) => (
                                            <p key={index} className="mb-4 leading-relaxed text-foreground">
                                                {paragraph}
                                            </p>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Quiz CTA */}
                            {story.quizzes && story.quizzes.length > 0 && (
                                <Card className="border-primary/20 bg-primary/5">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-primary">
                                            <Play className="h-5 w-5" />
                                            Uji Pemahamanmu!
                                        </CardTitle>
                                        <CardDescription>Ikuti kuis interaktif untuk menguji seberapa baik kamu memahami cerita ini</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <Button asChild>
                                            <Link href={route('stories.quiz', story.slug)}>Mulai Kuis ({story.quizzes.length} Soal)</Link>
                                        </Button>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Comments Section */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <MessageCircle className="h-5 w-5" />
                                        Komentar ({totalComments})
                                    </CardTitle>
                                    <CardDescription>Bagikan pemikiran Anda tentang cerita ini</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {/* Comment Form */}
                                    {user ? (
                                        <div className="space-y-4">
                                            <div className="flex items-start gap-3">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} />
                                                    <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1 space-y-3">
                                                    <Textarea
                                                        value={newComment}
                                                        onChange={(e) => setNewComment(e.target.value)}
                                                        placeholder="Tulis komentar Anda tentang cerita ini..."
                                                        className="min-h-[100px]"
                                                    />
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs text-muted-foreground">{newComment.length}/1000 karakter</span>
                                                        <Button
                                                            onClick={submitComment}
                                                            disabled={submitting || !newComment.trim() || newComment.length > 1000}
                                                            size="sm"
                                                        >
                                                            {submitting ? (
                                                                <>
                                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                                    Mengirim...
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Send className="mr-2 h-4 w-4" />
                                                                    Kirim Komentar
                                                                </>
                                                            )}
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <Alert>
                                            <AlertCircle className="h-4 w-4" />
                                            <AlertDescription>
                                                <Link href={route('login')} className="font-medium text-primary hover:underline">
                                                    Masuk
                                                </Link>{' '}
                                                untuk dapat memberikan komentar pada cerita ini.
                                            </AlertDescription>
                                        </Alert>
                                    )}

                                    {/* Comments List */}
                                    {comments.length > 0 ? (
                                        <div className="space-y-6">
                                            <Separator />
                                            <div className="space-y-6">{comments.map((comment) => renderComment(comment))}</div>
                                        </div>
                                    ) : (
                                        <div className="py-8 text-center">
                                            <MessageCircle className="mx-auto mb-3 h-12 w-12 text-muted-foreground" />
                                            <h3 className="mb-1 font-medium">Belum ada komentar</h3>
                                            <p className="text-sm text-muted-foreground">
                                                Jadilah orang pertama yang memberikan komentar pada cerita ini
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Story Info */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <MapPin className="h-5 w-5" />
                                        Informasi Cerita
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <h4 className="mb-1 font-medium">Asal Daerah</h4>
                                        <p className="text-sm text-muted-foreground">{story.origin_place}</p>
                                    </div>
                                    <Separator />
                                    <div>
                                        <h4 className="mb-1 font-medium">Kategori</h4>
                                        <p className="text-sm text-muted-foreground">{story.story_category?.name || 'Tidak dikategorikan'}</p>
                                    </div>
                                    <Separator />
                                    <div>
                                        <h4 className="mb-1 font-medium">Waktu Baca</h4>
                                        <p className="text-sm text-muted-foreground">{getReadTime(story.content)}</p>
                                    </div>
                                    <Separator />
                                    <div>
                                        <h4 className="mb-1 font-medium">Total Pembaca</h4>
                                        <div className="flex items-center gap-1">
                                            <Eye className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm">{story.total_reads} orang</span>
                                        </div>
                                    </div>
                                    <Separator />
                                    <div>
                                        <h4 className="mb-1 font-medium">Total Komentar</h4>
                                        <div className="flex items-center gap-1">
                                            <MessageCircle className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm">{totalComments} komentar</span>
                                        </div>
                                    </div>
                                    <Separator />
                                    <div>
                                        <h4 className="mb-1 font-medium">Tanggal Publikasi</h4>
                                        <p className="text-sm text-muted-foreground">{formatDate(story.created_at)}</p>
                                    </div>
                                    {!story.is_official && story.creator && (
                                        <>
                                            <Separator />
                                            <div>
                                                <h4 className="mb-1 font-medium">Kontributor</h4>
                                                <p className="text-sm text-muted-foreground">{story.creator.name}</p>
                                            </div>
                                        </>
                                    )}
                                    {story.quizzes && story.quizzes.length > 0 && (
                                        <>
                                            <Separator />
                                            <div>
                                                <h4 className="mb-1 font-medium">Kuis Tersedia</h4>
                                                <div className="flex items-center gap-1">
                                                    <Play className="h-4 w-4 text-green-600" />
                                                    <span className="text-sm font-medium text-green-600">{story.quizzes.length} soal kuis</span>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Related Stories */}
                            {relatedStories.length > 0 && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Cerita Serupa</CardTitle>
                                        <CardDescription>
                                            Cerita lain dari {story.origin_place} atau kategori {story.story_category?.name}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            {relatedStories.map((relatedStory) => (
                                                <Link
                                                    key={relatedStory.id}
                                                    href={route('stories.show', relatedStory.slug)}
                                                    className="block rounded-lg p-3 transition-colors hover:bg-accent/50"
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20">
                                                            <BookOpen className="h-4 w-4" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <h4 className="line-clamp-2 text-sm font-medium">{relatedStory.title}</h4>
                                                            <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                                                                <span>{relatedStory.origin_place}</span>
                                                                <span>•</span>
                                                                <div className="flex items-center gap-1">
                                                                    <Eye className="h-3 w-3" />
                                                                    <span>{relatedStory.total_reads}</span>
                                                                </div>
                                                            </div>
                                                            {relatedStory.story_category && (
                                                                <Badge variant="outline" className="mt-1 text-xs">
                                                                    {relatedStory.story_category.name}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Navigation */}
                            <Card>
                                <CardContent className="p-4">
                                    <div className="space-y-2">
                                        <Button variant="outline" asChild className="w-full justify-start">
                                            <Link href={route('stories.index')}>
                                                <BookOpen className="mr-2 h-4 w-4" />
                                                Jelajahi Cerita Lain
                                            </Link>
                                        </Button>
                                        {story.quizzes && story.quizzes.length > 0 && (
                                            <Button asChild className="w-full justify-start">
                                                <Link href={route('stories.quiz', story.slug)}>
                                                    <Play className="mr-2 h-4 w-4" />
                                                    Ikuti Kuis
                                                </Link>
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
