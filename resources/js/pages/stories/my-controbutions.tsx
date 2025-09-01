'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Layout from '@/layouts/layout';
import { PaginatedData, Story } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { BookOpen, Eye, MapPin, Plus } from 'lucide-react';

interface MyContributionsPageProps {
    stories: PaginatedData<Story>;
}

export default function MyContributionsPage({ stories }: MyContributionsPageProps) {
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

    return (
        <Layout>
            <Head title="Kontribusi Saya" />

            <div className="container max-w-6xl py-8">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Kontribusi Saya</h1>
                        <p className="text-muted-foreground">Cerita yang telah Anda bagikan di Tutur.id</p>
                    </div>
                    <Button asChild>
                        <Link href="/kontribusi">
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Cerita
                        </Link>
                    </Button>
                </div>

                {stories.data.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                            <BookOpen className="mb-4 h-12 w-12 text-muted-foreground" />
                            <h3 className="mb-2 text-lg font-medium">Belum Ada Kontribusi</h3>
                            <p className="mb-4 text-muted-foreground">
                                Anda belum memiliki cerita yang dikontribusikan. Mulai bagikan cerita dari daerah Anda!
                            </p>
                            <Button asChild>
                                <Link href="/kontribusi">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Kontribusi Cerita Pertama
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {stories.data.map((story) => (
                                <Card key={story.id} className="overflow-hidden transition-shadow hover:shadow-lg">
                                    <div className="relative h-48">
                                        <img src={story.image || '/placeholder.svg'} alt={story.title} className="h-full w-full object-cover" />
                                        <div className="absolute top-3 left-3">
                                            <Badge className={story.is_official ? 'bg-primary/90' : 'bg-secondary'}>
                                                {story.is_official ? 'Resmi' : 'Komunitas'}
                                            </Badge>
                                        </div>
                                        {story.story_category && (
                                            <div className="absolute top-3 right-3">
                                                <Badge variant="secondary">{story.story_category.name}</Badge>
                                            </div>
                                        )}
                                    </div>
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <Badge variant="outline" className="flex items-center gap-1">
                                                <MapPin className="h-3 w-3" />
                                                {story.origin_place}
                                            </Badge>
                                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                <Eye className="h-4 w-4" />
                                                <span>{story.total_reads}</span>
                                            </div>
                                        </div>
                                        <CardTitle className="text-lg">{story.title}</CardTitle>
                                        <CardDescription className="line-clamp-2">{story.content}</CardDescription>
                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                            <span>{getReadTime(story.content)}</span>
                                            <span>•</span>
                                            <span>{formatDate(story.created_at)}</span>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <Button asChild className="w-full">
                                            <Link href={`/cerita/${story.slug}`}>
                                                <BookOpen className="mr-2 h-4 w-4" />
                                                Lihat Cerita
                                            </Link>
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Pagination would go here if needed */}
                        {stories.total > stories.per_page && <div className="mt-8 flex justify-center">{/* Add pagination component */}</div>}
                    </div>
                )}
            </div>
        </Layout>
    );
}
