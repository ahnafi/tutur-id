import { InteractiveMap } from '@/components/map/interactive-map';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Layout from '@/layouts/layout';
import { Head, Link } from '@inertiajs/react';
import { BookOpen, Eye, MapPin, Star, Users } from 'lucide-react';
import { useState } from 'react';

interface Story {
    id: number;
    title: string;
    slug: string;
    image?: string;
    total_reads: number;
    is_official: boolean;
    category?: string;
    creator?: string;
}

interface MapData {
    province: string;
    coordinates: [number, number];
    story_count: number;
    stories: Story[];
}

interface MapPageProps {
    mapData: MapData[];
    totalProvinces: number;
    totalStories: number;
}

export default function MapPage({ mapData, totalProvinces, totalStories }: MapPageProps) {
    const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
    const [selectedStories, setSelectedStories] = useState<Story[]>([]);

    const handleProvinceClick = (province: string, stories: Story[]) => {
        setSelectedProvince(province);
        setSelectedStories(stories);
    };

    const resetSelection = () => {
        setSelectedProvince(null);
        setSelectedStories([]);
    };

    const formatNumber = (num: number) => {
        if (num >= 1000) {
            return Math.floor(num / 1000) + 'K+';
        }
        return num.toString();
    };

    return (
        <Layout>
            <Head title="Peta Cerita Interaktif - Tutur.id" />

            <div className="section-padding-x py-8">
                <div className="container max-w-screen-xl space-y-8">
                    {/* Header */}
                    <div className="space-y-4 text-center">
                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold lg:text-4xl">Peta Cerita Interaktif</h1>
                            <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
                                Jelajahi kekayaan cerita rakyat Indonesia berdasarkan wilayah geografis
                            </p>
                        </div>

                        {/* Stats */}
                        <div className="flex justify-center gap-8 text-sm">
                            <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-primary" />
                                <span>{totalProvinces} Provinsi</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <BookOpen className="h-4 w-4 text-primary" />
                                <span>{totalStories} Cerita</span>
                            </div>
                        </div>
                    </div>

                    {/* Map Container */}
                    <div className="space-y-6">
                        <InteractiveMap mapData={mapData} onProvinceClick={handleProvinceClick} />

                        {/* Instructions */}
                        <div className="text-center text-sm text-muted-foreground">
                            <p>Klik pada marker di peta untuk melihat cerita dari provinsi tersebut</p>
                        </div>
                    </div>

                    {/* Selected Province Stories */}
                    {selectedProvince && (
                        <div className="space-y-6">
                            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                                <div>
                                    <h2 className="flex items-center gap-2 text-2xl font-bold">
                                        <MapPin className="h-6 w-6 text-primary" />
                                        Cerita dari {selectedProvince}
                                    </h2>
                                    <p className="text-muted-foreground">{selectedStories.length} cerita ditemukan</p>
                                </div>
                                <Button variant="outline" onClick={resetSelection}>
                                    Lihat Semua Provinsi
                                </Button>
                            </div>

                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {selectedStories.map((story) => (
                                    <Card key={story.id} className="overflow-hidden transition-shadow hover:shadow-lg">
                                        <Link href={route('stories.show', story.slug)}>
                                            <div className="relative h-48">
                                                {story.image ? (
                                                    <img src={`/storage${story.image}`} alt={story.title} className="h-full w-full object-cover" />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
                                                        <BookOpen className="h-12 w-12 text-primary/60" />
                                                    </div>
                                                )}
                                                <div className="absolute top-3 left-3">
                                                    <Badge className={story.is_official ? 'bg-primary/90' : 'bg-secondary'}>
                                                        {story.is_official ? 'Resmi' : 'Komunitas'}
                                                    </Badge>
                                                </div>
                                                {story.category && (
                                                    <div className="absolute top-3 right-3">
                                                        <Badge variant="secondary">{story.category}</Badge>
                                                    </div>
                                                )}
                                            </div>
                                            <CardHeader>
                                                <CardTitle className="line-clamp-2 text-lg transition-colors hover:text-primary">
                                                    {story.title}
                                                </CardTitle>
                                                <div className="flex items-center justify-between text-sm text-muted-foreground">
                                                    <div className="flex items-center gap-1">
                                                        <Eye className="h-4 w-4" />
                                                        <span>{formatNumber(story.total_reads)}</span>
                                                    </div>
                                                    {!story.is_official && story.creator && (
                                                        <div className="flex items-center gap-1">
                                                            <Users className="h-4 w-4" />
                                                            <span className="truncate">{story.creator}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </CardHeader>
                                        </Link>
                                    </Card>
                                ))}
                            </div>

                            {selectedStories.length === 0 && (
                                <div className="py-12 text-center">
                                    <BookOpen className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                                    <h3 className="mb-2 text-lg font-medium">Belum ada cerita</h3>
                                    <p className="mb-4 text-muted-foreground">Provinsi {selectedProvince} belum memiliki cerita yang tersedia</p>
                                    <Button asChild>
                                        <Link href={route('stories.create')}>Kontribusi Cerita</Link>
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Province Overview - Only show if no province selected */}
                    {!selectedProvince && (
                        <div className="space-y-6">
                            <div className="text-center">
                                <h2 className="mb-2 text-2xl font-bold">Provinsi dengan Cerita</h2>
                                <p className="text-muted-foreground">Jelajahi cerita berdasarkan provinsi di Indonesia</p>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {mapData.map((data) => (
                                    <Card
                                        key={data.province}
                                        className="cursor-pointer transition-all hover:border-primary/50 hover:shadow-md"
                                        onClick={() => handleProvinceClick(data.province, data.stories)}
                                    >
                                        <CardContent className="p-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h3 className="text-sm font-semibold">{data.province}</h3>
                                                    <p className="text-xs text-muted-foreground">{data.story_count} cerita</p>
                                                </div>
                                                <div className="flex items-center gap-1 text-primary">
                                                    <Star className="h-4 w-4 fill-current" />
                                                    <MapPin className="h-4 w-4" />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* CTA Section */}
                    <div className="rounded-2xl bg-primary/5 p-8 text-center">
                        <div className="mx-auto max-w-2xl space-y-4">
                            <h2 className="text-2xl font-bold">Ceritamu Belum Ada di Peta?</h2>
                            <p className="text-muted-foreground">Bagikan cerita tradisional dari daerahmu dan bantu lengkapi peta budaya Indonesia</p>
                            <Button size="lg" asChild>
                                <Link href={route('stories.create')}>
                                    <Users className="mr-2 h-5 w-5" />
                                    Kontribusi Cerita
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
