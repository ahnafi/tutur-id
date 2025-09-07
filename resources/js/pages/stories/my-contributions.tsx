'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Layout from '@/layouts/layout';
import { PaginatedData, Story } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { BookOpen, Edit, Eye, MessageCircle, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface MyContributionsPageProps {
    stories: PaginatedData<Story>;
}

export default function MyContributionsPage({ stories }: MyContributionsPageProps) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [deletingStory, setDeletingStory] = useState<Story | null>(null);

    const handleDelete = (story: Story) => {
        router.delete(route('stories.destroy', story.id), {
            onSuccess: () => {
                setDeletingStory(null);
            },
        });
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const getExcerpt = (content: string, maxLength: number = 150) => {
        if (content.length <= maxLength) return content;
        return content.substring(0, maxLength) + '...';
    };

    return (
        <Layout>
            <Head title="Kontribusi Cerita Saya" />

            <div className="section-padding-x py-8">
                <div className="container max-w-screen-xl">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold">Kontribusi Cerita Saya</h1>
                                <p className="mt-2 text-muted-foreground">Kelola semua cerita yang telah Anda kontribusikan ke platform Tutur.id</p>
                            </div>
                            <Button asChild>
                                <Link href={route('stories.create')}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Tambah Cerita Baru
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Statistics Card */}
                    <Card className="mb-8">
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-primary">{stories.total}</div>
                                    <div className="text-sm text-muted-foreground">Total Cerita</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-blue-600">{stories.data.filter((s) => s.is_official).length}</div>
                                    <div className="text-sm text-muted-foreground">Cerita Resmi</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-green-600">
                                        {stories.data.reduce((sum, story) => sum + story.total_reads, 0)}
                                    </div>
                                    <div className="text-sm text-muted-foreground">Total Pembaca</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-orange-600">
                                        {stories.data.reduce((sum, story) => sum + (story.all_comments_count || 0), 0)}
                                    </div>
                                    <div className="text-sm text-muted-foreground">Total Komentar</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Stories List */}
                    {stories.data.length === 0 ? (
                        <Card>
                            <CardContent className="py-16 text-center">
                                <BookOpen className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
                                <h3 className="mb-2 text-lg font-semibold">Belum Ada Cerita</h3>
                                <p className="mb-6 text-muted-foreground">
                                    Anda belum memiliki cerita yang dikontribusikan. Mulai berbagi cerita budaya Indonesia!
                                </p>
                                <Button asChild>
                                    <Link href={route('stories.create')}>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Tulis Cerita Pertama
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-6">
                            {stories.data.map((story) => (
                                <Card key={story.id}>
                                    <CardContent className="p-6">
                                        <div className="flex gap-6">
                                            {/* Image */}
                                            <div className="flex-shrink-0">
                                                <div className="relative h-32 w-48 overflow-hidden rounded-lg">
                                                    {story.image ? (
                                                        <img
                                                            src={`/storage${story.image}`}
                                                            alt={story.title}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
                                                            <BookOpen className="h-8 w-8 text-primary/60" />
                                                        </div>
                                                    )}
                                                    <div className="absolute bottom-2 left-2">
                                                        <Badge className={story.is_official ? 'bg-primary/90' : 'bg-secondary'}>
                                                            {story.is_official ? 'Resmi' : 'Komunitas'}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 space-y-3">
                                                <div>
                                                    <div className="mb-2 flex items-start justify-between">
                                                        <div>
                                                            <h3 className="text-xl font-semibold">{story.title}</h3>
                                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                                <span>{story.origin_place}</span>
                                                                {story.story_category && (
                                                                    <>
                                                                        <span>•</span>
                                                                        <span>{story.story_category.name}</span>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <Button variant="outline" size="sm" asChild>
                                                                <Link href={route('stories.show', story.slug)}>
                                                                    <Eye className="mr-2 h-4 w-4" />
                                                                    Lihat
                                                                </Link>
                                                            </Button>
                                                            <Button variant="outline" size="sm" asChild>
                                                                <Link href={route('stories.edit', story.id)}>
                                                                    <Edit className="mr-2 h-4 w-4" />
                                                                    Edit
                                                                </Link>
                                                            </Button>
                                                            <Dialog>
                                                                <DialogTrigger asChild>
                                                                    <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50">
                                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                                        Hapus
                                                                    </Button>
                                                                </DialogTrigger>
                                                                <DialogContent>
                                                                    <DialogHeader>
                                                                        <DialogTitle>Hapus Cerita</DialogTitle>
                                                                        <DialogDescription>
                                                                            Apakah Anda yakin ingin menghapus cerita "{story.title}"? Tindakan ini
                                                                            tidak dapat dibatalkan.
                                                                        </DialogDescription>
                                                                    </DialogHeader>
                                                                    <DialogFooter>
                                                                        <Button className='hover:bg-red-600' variant="outline">Batal</Button>
                                                                        <Button variant="destructive" onClick={() => handleDelete(story)}>
                                                                            Ya, Hapus
                                                                        </Button>
                                                                    </DialogFooter>
                                                                </DialogContent>
                                                            </Dialog>
                                                        </div>
                                                    </div>
                                                    <p className="text-muted-foreground">{getExcerpt(story.content)}</p>
                                                </div>

                                                {/* Stats */}
                                                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                                                    <div className="flex items-center gap-1">
                                                        <Eye className="h-4 w-4" />
                                                        <span>{story.total_reads} pembaca</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <MessageCircle className="h-4 w-4" />
                                                        <span>{story.all_comments_count} komentar</span>
                                                    </div>
                                                    <div>
                                                        <span>Dibuat: {formatDate(story.created_at)}</span>
                                                    </div>
                                                    {story.updated_at !== story.created_at && (
                                                        <div>
                                                            <span>Diperbarui: {formatDate(story.updated_at)}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}

                            {/* Pagination */}
                            {stories.last_page > 1 && (
                                <div className="mt-8 flex justify-center">
                                    <div className="flex items-center gap-2">
                                        {stories.links.map((link, index) => (
                                            <Button
                                                key={index}
                                                variant={link.active ? 'default' : 'outline'}
                                                size="sm"
                                                disabled={!link.url}
                                                onClick={() => link.url && router.get(link.url)}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}
