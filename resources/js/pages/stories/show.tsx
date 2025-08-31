'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Layout from '@/layouts/layout';
import { Story } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, BookOpen, Clock, ExternalLink, Eye, MapPin, Play, Share2, Users } from 'lucide-react';

interface StoryDetailPageProps {
    story: Story;
    relatedStories: Story[];
}

export default function StoryDetailPage({ story, relatedStories }: StoryDetailPageProps) {
    // const [isFavorited, setIsFavorited] = useState(false);

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

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: story.title,
                    text: `Baca cerita "${story.title}" dari ${story.origin_place}`,
                    url: window.location.href,
                });
            } catch (error) {
                console.log('Error sharing:', error);
            }
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(window.location.href);
            alert('Link berhasil disalin ke clipboard!');
        }
    };

    return (
        <Layout>
            <Head title={`${story.title} - Cerita Rakyat Nusantara`} />

            <div className="section-padding-x py-4 md:py-8">
                <div className="container max-w-screen-xl">
                    {/* Back Button */}
                    <Button variant="ghost" asChild className="mb-6">
                        <Link href="/cerita">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Kembali ke Daftar Cerita
                        </Link>
                    </Button>

                    {/* Story Header */}
                    <div className="space-y-6">
                        <div className="relative h-64 overflow-hidden rounded-xl md:h-80">
                            <img
                                src={story.image ? `/storage${story.image}` : '/placeholder.svg'}
                                alt={story.title}
                                className="h-full w-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                            <div className="absolute bottom-6 left-6 text-white">
                                <div className="mb-2 flex items-center gap-2">
                                    {story.is_official && <Badge className="bg-primary/90">Cerita Resmi</Badge>}
                                    {story.story_category && <Badge variant="secondary">{story.story_category.name}</Badge>}
                                    <Badge variant="outline" className="border-white/30 bg-white/10 text-white">
                                        {story.origin_place}
                                    </Badge>
                                </div>
                                <h1 className="mb-2 text-3xl font-bold md:text-4xl">{story.title}</h1>
                                <div className="flex items-center gap-4 text-sm">
                                    <div className="flex items-center gap-1">
                                        <Clock className="h-4 w-4" />
                                        <span>{getReadTime(story.content)}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Eye className="h-4 w-4" />
                                        <span>{story.total_reads} pembaca</span>
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
                                    <Link href={`/cerita/${story.slug}/kuis`}>
                                        <Play className="mr-2 h-4 w-4" />
                                        Ikuti Kuis ({story.quizzes.length} Soal)
                                    </Link>
                                </Button>
                            )}
                            {/* <Button variant="outline">
                            <Volume2 className="mr-2 h-4 w-4" />
                            Dengarkan Audio
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setIsFavorited(!isFavorited)}
                            className={isFavorited ? 'text-red-500 hover:text-red-600' : ''}
                        >
                            <Heart className={`h-4 w-4 ${isFavorited ? 'fill-current' : ''}`} />
                        </Button> */}
                            <Button variant="outline" size="icon" onClick={handleShare}>
                                <Share2 className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" asChild>
                                <a href={story.gmaps_link} target="_blank">
                                    <ExternalLink className="mr-2 h-4 w-4" />
                                    Lihat Lokasi
                                </a>
                            </Button>
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
                                            <Link href={`/cerita/${story.slug}/kuis`}>Mulai Kuis ({story.quizzes.length} Soal)</Link>
                                        </Button>
                                    </CardContent>
                                </Card>
                            )}
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
                                                    href={`/cerita/${relatedStory.slug}`}
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
                                            <Link href="/cerita">
                                                <BookOpen className="mr-2 h-4 w-4" />
                                                Jelajahi Cerita Lain
                                            </Link>
                                        </Button>
                                        {story.quizzes && story.quizzes.length > 0 && (
                                            <Button asChild className="w-full justify-start">
                                                <Link href={`/cerita/${story.slug}/kuis`}>
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
