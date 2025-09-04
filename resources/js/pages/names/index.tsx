'use client';

import { GeneratedName, generateNameFromAI } from '@/api/gpt';
import { Pagination } from '@/components/pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Toaster } from '@/components/ui/toaster';
import Layout from '@/layouts/layout';
import { Name, PaginatedData } from '@/types';
import { Head, router } from '@inertiajs/react';
import axios from 'axios';
import { debounce } from 'lodash';
import { Bot, Eye, Loader2, MapPin, Search, Sparkles, Upload, X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

interface NamaNusantaraPageProps {
    names: PaginatedData<Name>;
    trendingNames: Name[];
    searchQuery: string;
    totalNames: number;
}

const NAME_CATEGORIES = [
    'Tradisional',
    'Modern',
    'Unik',
    'Alkitabiah',
    'Mitologis',
    'Terinspirasi Alam',
    'Berbasis Kebajikan',
    'Budaya',
    'Sejarah',
    'Terinspirasi Selebriti',
];

export default function NamaNusantaraPage({ names, trendingNames, searchQuery, totalNames }: NamaNusantaraPageProps) {
    const [query, setQuery] = useState(searchQuery);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [favorites, setFavorites] = useState<number[]>([]);
    const [selectedName, setSelectedName] = useState<Name | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [randomName, setRandomName] = useState<Name | null>(null);

    // AI Generation states
    const [isAIDialogOpen, setIsAIDialogOpen] = useState(false);
    const [characteristics, setCharacteristics] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedName, setGeneratedName] = useState<GeneratedName | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    // Debounced search function
    const debouncedSearch = useCallback(
        debounce((searchTerm: string) => {
            const url = new URL(window.location.href);
            if (searchTerm) {
                url.searchParams.set('name', searchTerm);
            } else {
                url.searchParams.delete('name');
            }
            // Reset to page 1 when searching
            url.searchParams.delete('page');

            router.get(
                url.pathname + url.search,
                {},
                {
                    preserveState: true,
                    preserveScroll: true,
                },
            );
        }, 700),
        [],
    );

    // Effect for auto-search
    useEffect(() => {
        debouncedSearch(query);
        return () => {
            debouncedSearch.cancel();
        };
    }, [query, debouncedSearch]);

    const handleNameClick = async (name: Name) => {
        try {
            const response = await fetch(`/nama-nusantara/${name.slug}`);
            const data = await response.json();
            setSelectedName(data.name);
            setIsDialogOpen(true);
        } catch (error) {
            console.error('Error fetching name details:', error);
        }
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const generateRandomName = () => {
        if (names.data.length > 0) {
            const randomIndex = Math.floor(Math.random() * names.data.length);
            setRandomName(names.data[randomIndex]);
        }
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const toggleFavorite = (nameId: number) => {
        setFavorites((prev) => (prev.includes(nameId) ? prev.filter((id) => id !== nameId) : [...prev, nameId]));
    };

    const handleManualSearch = () => {
        debouncedSearch.cancel();
        const url = new URL(window.location.href);
        if (query) {
            url.searchParams.set('name', query);
        } else {
            url.searchParams.delete('name');
        }
        // Reset to page 1 when searching
        url.searchParams.delete('page');

        router.get(
            url.pathname + url.search,
            {},
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const handleGenerateName = async () => {
        if (!characteristics.trim()) {
            toast.warning('Mohon masukkan karakteristik nama yang diinginkan');
            return;
        }

        setIsGenerating(true);
        try {
            const result = await generateNameFromAI(characteristics);
            setGeneratedName(result);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Gagal menghasilkan nama');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleUploadName = async () => {
        if (!generatedName) return;

        setIsUploading(true);
        try {
            const response = await axios.post('/nama-nusantara', generatedName);

            if (response.data.success) {
                toast.success('Nama berhasil diunggah ke database!');
                setIsAIDialogOpen(false);
                setGeneratedName(null);
                setCharacteristics('');

                // Refresh page to show new name
                router.reload();
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            const message = error.response?.data?.message || 'Gagal mengunggah nama';
            toast.error(message);
        } finally {
            setIsUploading(false);
        }
    };

    const resetAIDialog = () => {
        setGeneratedName(null);
        setCharacteristics('');
        setIsGenerating(false);
        setIsUploading(false);
    };

    return (
        <Layout>
            <Head title="Nama Nusantara" />
            <Toaster />

            <div className="section-padding-x min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 py-8">
                <div className="container max-w-screen-xl">
                    {/* Header */}
                    <div className="mb-12 text-center">
                        <h1 className="mb-4 text-4xl font-bold text-balance text-amber-900 md:text-5xl">Nama Nusantara</h1>
                        <p className="mx-auto max-w-2xl text-lg text-pretty text-amber-700">
                            Temukan makna mendalam dari nama-nama tradisional Indonesia. Jelajahi warisan budaya yang tersimpan dalam setiap nama.
                        </p>
                    </div>

                    <div className="grid gap-8 lg:grid-cols-3">
                        {/* Search Section */}
                        <div className="space-y-6 lg:col-span-2">
                            <Card className="border-amber-200 shadow-lg">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-amber-900">
                                        <Search className="h-5 w-5" />
                                        Cari Nama Tradisional
                                    </CardTitle>
                                    <CardDescription>
                                        Masukkan nama yang ingin Anda ketahui artinya (pencarian otomatis setelah 0.7 detik)
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-2">
                                        <Input
                                            placeholder="Contoh: Arjuna, Dewi, Bayu..."
                                            value={query}
                                            onChange={(e) => setQuery(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleManualSearch()}
                                            className="border-amber-200 focus:border-amber-400"
                                        />
                                        <Button onClick={handleManualSearch} className="bg-amber-600 hover:bg-amber-700">
                                            Cari
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Search Results */}
                            {names.data.length > 0 && (
                                <div className="space-y-4">
                                    <h3 className="text-xl font-semibold text-amber-900">
                                        {searchQuery ? `Hasil Pencarian "${searchQuery}" (${names.total})` : `Semua Nama (${names.total})`}
                                    </h3>

                                    <div className="grid gap-4">
                                        {names.data.map((name) => (
                                            <Card key={name.id} className="border-amber-200 transition-shadow hover:shadow-md">
                                                <CardContent className="p-6">
                                                    <div className="mb-3 flex items-start justify-between">
                                                        <div className="flex-1">
                                                            <h4 className="text-xl font-bold text-amber-900">{name.name}</h4>
                                                            <div className="mt-1 flex items-center gap-2 text-sm text-amber-600">
                                                                <MapPin className="h-4 w-4" />
                                                                {name.origin}
                                                                {name.views > 0 && (
                                                                    <>
                                                                        <span>•</span>
                                                                        <Eye className="h-4 w-4" />
                                                                        {name.views} views
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleNameClick(name)}
                                                                className="border-amber-300 text-amber-700 hover:bg-amber-50 hover:text-amber-700"
                                                            >
                                                                Lihat Detail
                                                            </Button>
                                                        </div>
                                                    </div>
                                                    <p className="mb-3 text-amber-800">{name.meaning}</p>
                                                    {name.category && (
                                                        <Badge variant="outline" className="border-amber-300 text-amber-700">
                                                            {name.category.name}
                                                        </Badge>
                                                    )}
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>

                                    {/* Pagination */}
                                    <div className="mt-6">
                                        <Pagination data={names} />
                                    </div>
                                </div>
                            )}

                            {names.data.length === 0 && searchQuery && (
                                <Card className="border-amber-200">
                                    <CardContent className="p-6 text-center">
                                        <p className="text-amber-700">Tidak ada hasil untuk pencarian "{searchQuery}"</p>
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* AI Name Generator */}
                            <Card className="border-amber-200 shadow-lg">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-amber-900">
                                        <Bot className="h-5 w-5" />
                                        Inspirasi Nama AI
                                    </CardTitle>
                                    <CardDescription>Dapatkan nama tradisional berdasarkan karakteristik yang Anda inginkan</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Button onClick={() => setIsAIDialogOpen(true)} className="w-full bg-purple-600 hover:bg-purple-700">
                                        <Sparkles className="mr-2 h-4 w-4" />
                                        Temukan Inspirasi
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Random Name Generator */}
                            {/* <Card className="border-amber-200 shadow-lg">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-amber-900">
                                        <Shuffle className="h-5 w-5" />
                                        Nama Acak
                                    </CardTitle>
                                    <CardDescription>Temukan nama tradisional secara acak</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Button onClick={generateRandomName} className="mb-4 w-full bg-green-600 hover:bg-green-700">
                                        <Sparkles className="mr-2 h-4 w-4" />
                                        Generate Nama
                                    </Button>

                                    {randomName && (
                                        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                                            <div className="mb-2 flex items-start justify-between">
                                                <h4 className="font-bold text-amber-900">{randomName.name}</h4>
                                                <div className="flex gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleNameClick(randomName)}
                                                        className="h-8 w-8 p-0 text-amber-600 hover:text-amber-700"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                            <p className="mb-2 text-sm text-amber-800">{randomName.meaning}</p>
                                            <div className="flex items-center gap-2 text-xs text-amber-600">
                                                <MapPin className="h-3 w-3" />
                                                {randomName.origin}
                                                {randomName.views > 0 && (
                                                    <>
                                                        <span>•</span>
                                                        <Eye className="h-3 w-3" />
                                                        {randomName.views}
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card> */}

                            {/* Trending Names */}
                            <Card className="border-amber-200 shadow-lg">
                                <CardHeader>
                                    <CardTitle className="text-amber-900">Nama Trending</CardTitle>
                                    <CardDescription>Nama-nama yang paling banyak dilihat</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {trendingNames.map((name, index) => (
                                            <div
                                                key={name.id}
                                                className="flex cursor-pointer items-center gap-3 rounded-lg p-2 transition-colors hover:bg-amber-50"
                                                onClick={() => handleNameClick(name)}
                                            >
                                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-600 text-xs font-bold text-white">
                                                    {index + 1}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-medium text-amber-900">{name.name}</p>
                                                    <div className="flex items-center gap-1 text-xs text-amber-600">
                                                        <span>{name.origin}</span>
                                                        {name.views > 0 && (
                                                            <>
                                                                <span>•</span>
                                                                <Eye className="h-3 w-3" />
                                                                <span>{name.views}</span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Quick Stats */}
                            <Card className="border-amber-200 shadow-lg">
                                <CardContent className="p-6">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-amber-900">{totalNames}</div>
                                        <div className="text-sm text-amber-600">Nama Tersedia</div>
                                    </div>
                                    <div className="mt-4 grid grid-cols-2 gap-4 border-t border-amber-200 pt-4">
                                        <div className="text-center">
                                            <div className="text-lg font-semibold text-amber-900">{favorites.length}</div>
                                            <div className="text-xs text-amber-600">Favorit Anda</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-lg font-semibold text-amber-900">{names.data.length}</div>
                                            <div className="text-xs text-amber-600">Hasil Halaman Ini</div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>

            {/* Detail Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={() => {}}>
                <DialogContent className="max-w-2xl [&>button]:hidden">
                    <DialogHeader>
                        <DialogTitle className="flex items-center justify-between text-2xl text-amber-900">
                            {selectedName?.name}
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsDialogOpen(false)}
                                className="text-red-600 hover:bg-red-600 hover:text-gray-50"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </DialogTitle>
                    </DialogHeader>

                    {selectedName && (
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 text-sm text-amber-600">
                                <div className="flex items-center gap-1">
                                    <MapPin className="h-4 w-4" />
                                    {selectedName.origin}
                                </div>
                                {selectedName.category && (
                                    <Badge variant="outline" className="border-amber-300 text-amber-700">
                                        {selectedName.category.name}
                                    </Badge>
                                )}
                            </div>

                            <div>
                                <h3 className="mb-2 text-lg font-semibold text-amber-900">Arti Nama</h3>
                                <p className="text-amber-800">{selectedName.meaning}</p>
                            </div>

                            {selectedName.description && (
                                <div>
                                    <h3 className="mb-2 text-lg font-semibold text-amber-900">Deskripsi</h3>
                                    <p className="leading-relaxed text-amber-800">{selectedName.description}</p>
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* AI Name Generator Dialog */}
            <Dialog
                open={isAIDialogOpen}
                onOpenChange={(open) => {
                    if (!open) {
                        setIsAIDialogOpen(false);
                        resetAIDialog();
                    }
                }}
            >
                <DialogContent className="max-w-3xl [&>button]:hidden">
                    <DialogHeader>
                        <DialogTitle className="flex items-center justify-between text-base text-purple-900 md:text-2xl">
                            <div className="flex items-center gap-2">
                                <Bot className="h-6 w-6" />
                                Temukan Inspirasi Nama
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    setIsAIDialogOpen(false);
                                    resetAIDialog();
                                }}
                                className="text-red-600 hover:bg-red-600 hover:text-gray-50"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-6">
                        {!generatedName ? (
                            <>
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-purple-900">Karakteristik nama yang diinginkan</label>
                                    <Textarea
                                        placeholder="Contoh: nama yang berkaitan dengan alam dan kekuatan mistis, nama yang melambangkan keberanian dan kebijaksanaan, dll..."
                                        value={characteristics}
                                        onChange={(e) => setCharacteristics(e.target.value)}
                                        className="border-purple-200 text-sm focus:border-purple-400 md:text-base"
                                        rows={4}
                                    />
                                </div>

                                <Button
                                    onClick={handleGenerateName}
                                    disabled={isGenerating || !characteristics.trim()}
                                    className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50"
                                >
                                    {isGenerating ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Menghasilkan nama...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="mr-2 h-4 w-4" />
                                            Generate Nama
                                        </>
                                    )}
                                </Button>
                            </>
                        ) : (
                            <div className="space-y-6">
                                <div className="rounded-lg border border-purple-200 bg-purple-50 p-6">
                                    <div className="mb-4 flex items-start justify-between">
                                        <h3 className="text-2xl font-bold text-purple-900">{generatedName.name}</h3>
                                        <Badge variant="outline" className="border-purple-300 text-purple-700">
                                            {NAME_CATEGORIES[generatedName.name_category_id - 1]}
                                        </Badge>
                                    </div>

                                    <div className="mb-3 flex items-center gap-2 text-sm text-purple-600">
                                        <MapPin className="h-4 w-4" />
                                        {generatedName.origin}
                                    </div>

                                    <div className="mb-4">
                                        <h4 className="mb-2 font-semibold text-purple-900">Arti Nama</h4>
                                        <p className="text-purple-800">{generatedName.meaning}</p>
                                    </div>

                                    <div>
                                        <h4 className="mb-2 font-semibold text-purple-900">Deskripsi</h4>
                                        <p className="leading-relaxed text-purple-800">{generatedName.description}</p>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <Button
                                        onClick={handleUploadName}
                                        disabled={isUploading}
                                        className="bg-green-600 hover:bg-green-700 disabled:opacity-50"
                                    >
                                        {isUploading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Mengunggah...
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="mr-2 h-4 w-4" />
                                                Unggah Nama
                                            </>
                                        )}
                                    </Button>

                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setGeneratedName(null);
                                            setCharacteristics('');
                                        }}
                                        className="border-purple-300 text-purple-700 hover:bg-purple-50"
                                    >
                                        Generate Lagi
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </Layout>
    );
}
