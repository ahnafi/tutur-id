'use client';

import { Pagination } from '@/components/pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Layout from '@/layouts/layout';
import { PaginatedData, Story, StoryCategory } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { debounce } from 'lodash';
import { BookOpen, Clock, Eye, MapPin, Search, Star, Users } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

interface CeritaPageProps {
    stories: PaginatedData<Story>;
    trendingStories: Story[];
    regions: string[];
    categories: StoryCategory[];
    filters: {
        search: string;
        region: string;
        category: string;
        type: string;
        sort: string;
    };
    totalStories: number;
}

export default function CeritaPage({ stories, trendingStories, regions, categories, filters, totalStories }: CeritaPageProps) {
    const [searchQuery, setSearchQuery] = useState(filters.search);
    const [selectedRegion, setSelectedRegion] = useState(filters.region);
    const [selectedCategory, setSelectedCategory] = useState(filters.category);
    const [selectedType, setSelectedType] = useState(filters.type);
    const [sortBy, setSortBy] = useState(filters.sort);

    // Debounced search function
    const debouncedSearch = useCallback(
        debounce((searchTerm: string) => {
            updateFilters({ search: searchTerm });
        }, 700),
        [],
    );

    // Effect for auto-search
    useEffect(() => {
        debouncedSearch(searchQuery);
        return () => {
            debouncedSearch.cancel();
        };
    }, [searchQuery, debouncedSearch]);

    const updateFilters = (newFilters: Partial<typeof filters>) => {
        const url = new URL(window.location.href);
        const params = new URLSearchParams();

        // Merge current filters with new ones
        const updatedFilters = { ...filters, ...newFilters };

        // Set parameters, skip 'all' values and empty strings
        Object.entries(updatedFilters).forEach(([key, value]) => {
            if (value && value !== 'all' && value !== '') {
                params.set(key, value);
            }
        });

        // Reset to page 1 when filters change
        params.delete('page');

        router.get(
            `${url.pathname}?${params.toString()}`,
            {},
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const handleFilterChange = (filterType: string, value: string) => {
        switch (filterType) {
            case 'region':
                setSelectedRegion(value);
                updateFilters({ region: value });
                break;
            case 'category':
                setSelectedCategory(value);
                updateFilters({ category: value });
                break;
            case 'type':
                setSelectedType(value);
                updateFilters({ type: value });
                break;
            case 'sort':
                setSortBy(value);
                updateFilters({ sort: value });
                break;
        }
    };

    const resetFilters = () => {
        setSearchQuery('');
        setSelectedRegion('all');
        setSelectedCategory('all');
        setSelectedType('all');
        setSortBy('popular');

        router.get(
            '/cerita',
            {},
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const getReadTime = (content: string) => {
        const wordsPerMinute = 200;
        const wordCount = content.split(' ').length;
        const readTime = Math.ceil(wordCount / wordsPerMinute);
        return `${readTime} menit`;
    };

    const officialStories = stories.data.filter((story) => story.is_official);
    const communityStories = stories.data.filter((story) => !story.is_official);

    return (
        <Layout>
            <Head title="Cerita Rakyat Nusantara" />
            <div className="section-padding-x">
                <div className="container max-w-screen-xl space-y-8 py-8">
                    {/* Header */}
                    <div className="space-y-4">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <div>
                                <h1 className="text-3xl font-bold">Cerita Rakyat Nusantara</h1>
                                <p className="text-muted-foreground">Jelajahi kekayaan cerita tradisional Indonesia</p>
                            </div>
                            <Button asChild>
                                <Link href="/kontribusi">
                                    <Users className="mr-2 h-4 w-4" />
                                    Kontribusi Cerita
                                </Link>
                            </Button>
                        </div>

                        {/* Search and Filters */}
                        <div className="flex flex-col gap-4 md:flex-row">
                            <div className="relative flex-1">
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                                <Input
                                    placeholder="Cari cerita atau daerah..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            <Select value={selectedRegion} onValueChange={(value) => handleFilterChange('region', value)}>
                                <SelectTrigger className="w-full md:w-48">
                                    <SelectValue placeholder="Pilih Daerah" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Daerah</SelectItem>
                                    {regions.map((region) => (
                                        <SelectItem key={region} value={region}>
                                            {region}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select value={selectedCategory} onValueChange={(value) => handleFilterChange('category', value)}>
                                <SelectTrigger className="w-full md:w-48">
                                    <SelectValue placeholder="Kategori" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Kategori</SelectItem>
                                    {categories.map((category) => (
                                        <SelectItem key={category.id} value={category.id.toString()}>
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select value={sortBy} onValueChange={(value) => handleFilterChange('sort', value)}>
                                <SelectTrigger className="w-full md:w-48">
                                    <SelectValue placeholder="Urutkan" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="popular">Terpopuler</SelectItem>
                                    <SelectItem value="newest">Terbaru</SelectItem>
                                    <SelectItem value="reads">Paling Banyak Dibaca</SelectItem>
                                    <SelectItem value="alphabetical">A-Z</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Active Filters */}
                        {(filters.search || filters.region !== 'all' || filters.category !== 'all') && (
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="text-sm text-muted-foreground">Filter aktif:</span>
                                {filters.search && (
                                    <Badge variant="secondary">
                                        Pencarian: "{filters.search}"
                                    </Badge>
                                )}
                                {filters.region !== 'all' && (
                                    <Badge variant="secondary">
                                        Daerah: {filters.region}
                                    </Badge>
                                )}
                                {filters.category !== 'all' && (
                                    <Badge variant="secondary">
                                        Kategori: {categories.find((c) => c.id.toString() === filters.category)?.name}
                                    </Badge>
                                )}
                                <Button variant="outline" size="sm" onClick={resetFilters}>
                                    Reset Filter
                                </Button>
                            </div>
                        )}
                    </div>

                    <div className="grid gap-8 lg:grid-cols-4">
                        {/* Main Content */}
                        <div className="space-y-6 lg:col-span-3">
                            {/* Tabs for Official vs Community Stories */}
                            <Tabs value={selectedType} onValueChange={(value) => handleFilterChange('type', value)}>
                                <TabsList className="grid w-full grid-cols-3">
                                    <TabsTrigger value="all" className="flex items-center gap-2 text-xs md:text-sm">
                                        <BookOpen className="h-3 w-3 md:h-4 md:w-4" />
                                        Semua ({stories.total})
                                    </TabsTrigger>
                                    <TabsTrigger value="official" className="flex items-center gap-2 text-xs md:text-sm">
                                        <Star className="h-3 w-3 md:h-4 md:w-4" />
                                        Resmi ({officialStories.length})
                                    </TabsTrigger>
                                    <TabsTrigger value="community" className="flex items-center gap-2 text-xs md:text-sm">
                                        <Users className="h-3 w-3 md:h-4 md:w-4" />
                                        Komunitas ({communityStories.length})
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="all" className="space-y-6">
                                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                                        {stories.data.map((story) => (
                                            <Card key={story.id} className="overflow-hidden transition-shadow hover:shadow-lg">
                                                <div className="relative h-48">
                                                    <img
                                                        src={story.image ? `/storage${story.image}` : '/placeholder.svg'}
                                                        alt={story.title}
                                                        className="h-full w-full object-cover"
                                                    />
                                                    <div className="absolute top-3 left-3">
                                                        <Badge className={story.is_official ? 'bg-primary/90' : 'bg-secondary'}>
                                                            {story.is_official ? 'Resmi' : 'Komunitas'}
                                                        </Badge>
                                                    </div>
                                                    {story.story_category && (
                                                        <div className="absolute top-3 right-3">
                                                            <Badge variant="secondary">
                                                                {story.story_category.name}
                                                            </Badge>
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
                                                        <div className="flex items-center gap-1">
                                                            <Clock className="h-4 w-4" />
                                                            <span>{getReadTime(story.content)}</span>
                                                        </div>
                                                        {!story.is_official && story.creator && (
                                                            <div className="flex items-center gap-1">
                                                                <Users className="h-4 w-4" />
                                                                <span>oleh {story.creator.name}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </CardHeader>
                                                <CardContent>
                                                    <Button asChild className="w-full">
                                                        <Link href={`/cerita/${story.slug}`}>
                                                            <BookOpen className="mr-2 h-4 w-4" />
                                                            Baca Cerita
                                                        </Link>
                                                    </Button>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>

                                    {/* Pagination */}
                                    <div className="mt-8">
                                        <Pagination data={stories} />
                                    </div>
                                </TabsContent>

                                <TabsContent value="official" className="space-y-6">
                                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                                        {officialStories.map((story) => (
                                            <Card key={story.id} className="overflow-hidden transition-shadow hover:shadow-lg">
                                                <div className="relative h-48">
                                                    <img
                                                        src={story.image ? `/storage${story.image}` : '/placeholder.svg'}
                                                        alt={story.title}
                                                        className="h-full w-full object-cover"
                                                    />
                                                    <div className="absolute top-3 left-3">
                                                        <Badge className="bg-primary/90">Resmi</Badge>
                                                    </div>
                                                    {story.story_category && (
                                                        <div className="absolute top-3 right-3">
                                                            <Badge variant="secondary">
                                                                {story.story_category.name}
                                                            </Badge>
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
                                                        <div className="flex items-center gap-1">
                                                            <Clock className="h-4 w-4" />
                                                            <span>{getReadTime(story.content)}</span>
                                                        </div>
                                                    </div>
                                                </CardHeader>
                                                <CardContent>
                                                    <Button asChild className="w-full">
                                                        <Link href={`/cerita/${story.slug}`}>
                                                            <BookOpen className="mr-2 h-4 w-4" />
                                                            Baca Cerita
                                                        </Link>
                                                    </Button>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </TabsContent>

                                <TabsContent value="community" className="space-y-6">
                                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                                        {communityStories.map((story) => (
                                            <Card key={story.id} className="overflow-hidden transition-shadow hover:shadow-lg">
                                                <div className="relative h-48">
                                                    <img
                                                        src={story.image ? `/storage${story.image}` : '/placeholder.svg'}
                                                        alt={story.title}
                                                        className="h-full w-full object-cover"
                                                    />
                                                    <div className="absolute top-3 left-3">
                                                        <Badge variant="secondary">Komunitas</Badge>
                                                    </div>
                                                    {story.story_category && (
                                                        <div className="absolute top-3 right-3">
                                                            <Badge variant="secondary">
                                                                {story.story_category.name}
                                                            </Badge>
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
                                                        <div className="flex items-center gap-1">
                                                            <Clock className="h-4 w-4" />
                                                            <span>{getReadTime(story.content)}</span>
                                                        </div>
                                                        {story.creator && (
                                                            <div className="flex items-center gap-1">
                                                                <Users className="h-4 w-4" />
                                                                <span>oleh {story.creator.name}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </CardHeader>
                                                <CardContent>
                                                    <Button asChild className="w-full">
                                                        <Link href={`/cerita/${story.slug}`}>
                                                            <BookOpen className="mr-2 h-4 w-4" />
                                                            Baca Cerita
                                                        </Link>
                                                    </Button>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </TabsContent>
                            </Tabs>

                            {/* Empty State */}
                            {stories.data.length === 0 && (
                                <div className="py-12 text-center">
                                    <BookOpen className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                                    <h3 className="mb-2 text-lg font-medium">Tidak ada cerita ditemukan</h3>
                                    <p className="mb-4 text-muted-foreground">Coba ubah kata kunci pencarian atau filter yang dipilih</p>
                                    <Button variant="outline" onClick={resetFilters}>
                                        Reset Filter
                                    </Button>
                                </div>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Trending Stories */}
                            <Card className="shadow-lg">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Star className="h-5 w-5" />
                                        Cerita Trending
                                    </CardTitle>
                                    <CardDescription>Cerita yang paling banyak dibaca</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {trendingStories.map((story, index) => (
                                            <Link
                                                key={story.id}
                                                href={`/cerita/${story.slug}`}
                                                className="block rounded-lg p-3 transition-colors hover:bg-muted/50"
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                                                        {index + 1}
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="line-clamp-2 font-medium">{story.title}</p>
                                                        <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                                                            <span>{story.origin_place}</span>
                                                            <span>•</span>
                                                            <div className="flex items-center gap-1">
                                                                <Eye className="h-3 w-3" />
                                                                <span>{story.total_reads}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Quick Stats */}
                            <Card className="shadow-lg">
                                <CardContent className="p-6">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold">{totalStories}</div>
                                        <div className="text-sm text-muted-foreground">Total Cerita</div>
                                    </div>
                                    <div className="mt-4 grid grid-cols-2 gap-4 border-t border-border pt-4">
                                        <div className="text-center">
                                            <div className="text-lg font-semibold">
                                                {stories.data.filter((s) => s.is_official).length}
                                            </div>
                                            <div className="text-xs text-muted-foreground">Resmi</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-lg font-semibold">
                                                {stories.data.filter((s) => !s.is_official).length}
                                            </div>
                                            <div className="text-xs text-muted-foreground">Komunitas</div>
                                        </div>
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