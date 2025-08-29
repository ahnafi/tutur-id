'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from '@inertiajs/react';
import { BookOpen, Clock, Play, Search, Star, Users } from 'lucide-react';
import { useState } from 'react';

export default function CeritaPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRegion, setSelectedRegion] = useState('all');
    const [sortBy, setSortBy] = useState('popular');

    // Mock data - in real app this would come from database
    const officialStories = [
        {
            id: 1,
            title: 'Malin Kundang',
            content: 'Cerita tentang seorang anak yang durhaka kepada ibunya dan dikutuk menjadi batu...',
            origin: 'Sumatera Barat',
            readTime: '2 menit',
            rating: 4.8,
            totalReads: 1250,
            hasQuiz: true,
            image: '/indonesian-folklore-malin-kundang-traditional-art.png',
            gmapsLink: 'https://maps.google.com/?q=Sumatera+Barat',
        },
        {
            id: 2,
            title: 'Sangkuriang',
            content: 'Legenda tentang seorang pemuda yang tanpa sadar melamar ibunya sendiri...',
            origin: 'Jawa Barat',
            readTime: '3 menit',
            rating: 4.9,
            totalReads: 980,
            hasQuiz: true,
            image: '/indonesian-folklore-sangkuriang-traditional-art.png',
            gmapsLink: 'https://maps.google.com/?q=Jawa+Barat',
        },
        {
            id: 3,
            title: 'Keong Mas',
            content: 'Kisah putri yang dikutuk menjadi keong emas oleh ibu tirinya yang jahat...',
            origin: 'Jawa Timur',
            readTime: '2 menit',
            rating: 4.7,
            totalReads: 750,
            hasQuiz: true,
            image: '/indonesian-folklore-keong-mas-traditional-art.png',
            gmapsLink: 'https://maps.google.com/?q=Jawa+Timur',
        },
        {
            id: 4,
            title: 'Timun Mas',
            content: 'Cerita tentang seorang gadis kecil yang melarikan diri dari raksasa...',
            origin: 'Jawa Tengah',
            readTime: '2 menit',
            rating: 4.6,
            totalReads: 890,
            hasQuiz: true,
            image: '/indonesian-folklore-timun-mas-traditional-art.png',
            gmapsLink: 'https://maps.google.com/?q=Jawa+Tengah',
        },
    ];

    const communityStories = [
        {
            id: 5,
            title: 'Legenda Danau Toba Versi Kakek',
            content: 'Versi cerita Danau Toba yang diturunkan dari kakek saya di Batak...',
            origin: 'Sumatera Utara',
            readTime: '4 menit',
            rating: 4.5,
            totalReads: 320,
            hasQuiz: false,
            author: 'Rina Simbolon',
            image: '/indonesian-folklore-danau-toba-community-version.png',
            gmapsLink: 'https://maps.google.com/?q=Danau+Toba',
        },
        {
            id: 6,
            title: 'Cerita Rakyat Kampung Halaman',
            content: 'Cerita turun temurun dari kampung saya tentang asal usul nama desa...',
            origin: 'Jawa Tengah',
            readTime: '3 menit',
            rating: 4.3,
            totalReads: 180,
            hasQuiz: false,
            author: 'Budi Santoso',
            image: '/indonesian-folklore-village-origin-community.png',
            gmapsLink: 'https://maps.google.com/?q=Jawa+Tengah',
        },
    ];

    const regions = ['Sumatera Barat', 'Sumatera Utara', 'Jawa Barat', 'Jawa Tengah', 'Jawa Timur', 'Bali', 'Kalimantan', 'Sulawesi', 'Papua'];

    const filteredOfficialStories = officialStories.filter((story) => {
        const matchesSearch =
            story.title.toLowerCase().includes(searchQuery.toLowerCase()) || story.origin.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRegion = selectedRegion === 'all' || story.origin === selectedRegion;
        return matchesSearch && matchesRegion;
    });

    const filteredCommunityStories = communityStories.filter((story) => {
        const matchesSearch =
            story.title.toLowerCase().includes(searchQuery.toLowerCase()) || story.origin.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRegion = selectedRegion === 'all' || story.origin === selectedRegion;
        return matchesSearch && matchesRegion;
    });

    return (
        <div className="container space-y-8 py-8">
            {/* Header */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
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
                    <Select value={selectedRegion} onValueChange={setSelectedRegion}>
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
                    <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-full md:w-48">
                            <SelectValue placeholder="Urutkan" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="popular">Terpopuler</SelectItem>
                            <SelectItem value="newest">Terbaru</SelectItem>
                            <SelectItem value="rating">Rating Tertinggi</SelectItem>
                            <SelectItem value="alphabetical">A-Z</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Tabs for Official vs Community Stories */}
            <Tabs defaultValue="official" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="official" className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        Cerita Resmi ({filteredOfficialStories.length})
                    </TabsTrigger>
                    <TabsTrigger value="community" className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Cerita Komunitas ({filteredCommunityStories.length})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="official" className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {filteredOfficialStories.map((story) => (
                            <Card key={story.id} className="overflow-hidden transition-shadow hover:shadow-lg">
                                <div className="relative h-48">
                                    <img src={story.image || '/placeholder.svg'} alt={story.title} className="object-cover w-full h-full" />
                                    <div className="absolute top-3 left-3">
                                        <Badge className="bg-primary/90">Resmi</Badge>
                                    </div>
                                    {story.hasQuiz && (
                                        <div className="absolute top-3 right-3">
                                            <Badge variant="secondary">Ada Kuis</Badge>
                                        </div>
                                    )}
                                </div>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <Badge variant="outline">{story.origin}</Badge>
                                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                            <Star className="h-4 w-4 fill-current text-yellow-500" />
                                            <span>{story.rating}</span>
                                        </div>
                                    </div>
                                    <CardTitle className="text-lg">{story.title}</CardTitle>
                                    <CardDescription className="line-clamp-2">{story.content}</CardDescription>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <Clock className="h-4 w-4" />
                                            <span>{story.readTime}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <BookOpen className="h-4 w-4" />
                                            <span>{story.totalReads} pembaca</span>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex gap-2">
                                        <Button asChild className="flex-1">
                                            <Link href={`/cerita/${story.id}`}>
                                                <BookOpen className="mr-2 h-4 w-4" />
                                                Baca Cerita
                                            </Link>
                                        </Button>
                                        {story.hasQuiz && (
                                            <Button variant="outline" size="icon" asChild>
                                                <Link href={`/cerita/${story.id}/kuis`}>
                                                    <Play className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="community" className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {filteredCommunityStories.map((story) => (
                            <Card key={story.id} className="overflow-hidden transition-shadow hover:shadow-lg">
                                <div className="relative h-48">
                                    <img src={story.image || '/placeholder.svg'} alt={story.title} className="object-cover w-full h-full" />
                                    <div className="absolute top-3 left-3">
                                        <Badge variant="secondary">Komunitas</Badge>
                                    </div>
                                </div>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <Badge variant="outline">{story.origin}</Badge>
                                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                            <Star className="h-4 w-4 fill-current text-yellow-500" />
                                            <span>{story.rating}</span>
                                        </div>
                                    </div>
                                    <CardTitle className="text-lg">{story.title}</CardTitle>
                                    <CardDescription className="line-clamp-2">{story.content}</CardDescription>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <Clock className="h-4 w-4" />
                                            <span>{story.readTime}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Users className="h-4 w-4" />
                                            <span>oleh {story.author}</span>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <Button asChild className="w-full">
                                        <Link href={`/cerita/${story.id}`}>
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
            {filteredOfficialStories.length === 0 && filteredCommunityStories.length === 0 && (
                <div className="py-12 text-center">
                    <BookOpen className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                    <h3 className="mb-2 text-lg font-medium">Tidak ada cerita ditemukan</h3>
                    <p className="mb-4 text-muted-foreground">Coba ubah kata kunci pencarian atau filter yang dipilih</p>
                    <Button
                        variant="outline"
                        onClick={() => {
                            setSearchQuery('');
                            setSelectedRegion('all');
                        }}
                    >
                        Reset Filter
                    </Button>
                </div>
            )}
        </div>
    );
}
