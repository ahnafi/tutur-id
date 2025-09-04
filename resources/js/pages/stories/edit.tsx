'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import Layout from '@/layouts/layout';
import { Story, StoryCategory } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, ImagePlus, Save, X } from 'lucide-react';
import { useState } from 'react';

interface EditStoryPageProps {
    story: Story;
    categories: StoryCategory[];
    regions: string[];
}

export default function EditStoryPage({ story, categories, regions }: EditStoryPageProps) {
    const [imagePreview, setImagePreview] = useState<string | null>(story.image ? `/storage${story.image}` : null);

    const { data, setData, put, processing, errors } = useForm({
        title: story.title,
        content: story.content,
        origin_place: story.origin_place,
        story_category_id: story.story_category_id?.toString() || '',
        gmaps_link: story.gmaps_link || '',
        image: null as File | null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (value !== null && value !== '') {
                formData.append(key, value as string | Blob);
            }
        });

        put(`/cerita/${story.slug}`);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('image', file);
            const reader = new FileReader();
            reader.onload = (e) => setImagePreview(e.target?.result as string);
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setData('image', null);
        setImagePreview(story.image ? `/storage${story.image}` : null);
    };

    const estimatedReadTime = Math.ceil(data.content.trim().split(/\s+/).length / 200) || 1;

    return (
        <Layout>
            <Head title={`Edit Cerita: ${story.title}`} />

            <div className="section-padding-x py-8">
                <div className="container max-w-screen-xl">
                    {/* Header */}
                    <div className="mb-8">
                        <Button variant="ghost" asChild className="mb-4">
                            <Link href={route('profile.index')}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Kembali ke Kontribusi Saya
                            </Link>
                        </Button>

                        <div>
                            <h1 className="text-3xl font-bold">Edit Cerita</h1>
                            <p className="mt-2 text-muted-foreground">Perbarui informasi cerita Anda</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <Card>
                            <CardHeader>
                                <CardTitle>Informasi Cerita</CardTitle>
                                <CardDescription>Edit detail cerita yang ingin Anda perbarui</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Judul Cerita *</Label>
                                    <Input
                                        id="title"
                                        placeholder="Contoh: Legenda Danau Toba"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        className={errors.title ? 'border-red-500' : ''}
                                    />
                                    {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="origin_place">Asal Daerah *</Label>
                                        <Select value={data.origin_place} onValueChange={(value) => setData('origin_place', value)}>
                                            <SelectTrigger className={errors.origin_place ? 'border-red-500' : ''}>
                                                <SelectValue placeholder="Pilih asal daerah cerita" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {regions.map((region) => (
                                                    <SelectItem key={region} value={region}>
                                                        {region}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.origin_place && <p className="text-sm text-red-500">{errors.origin_place}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="story_category_id">Kategori (Opsional)</Label>
                                        <Select value={data.story_category_id} onValueChange={(value) => setData('story_category_id', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih kategori" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories.map((category) => (
                                                    <SelectItem key={category.id} value={category.id.toString()}>
                                                        {category.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="image">Gambar Cerita (Opsional)</Label>
                                    <div className="space-y-2">
                                        {imagePreview ? (
                                            <div className="relative">
                                                <img src={imagePreview} alt="Preview" className="h-32 w-full rounded-lg object-cover" />
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="sm"
                                                    className="absolute top-2 right-2"
                                                    onClick={removeImage}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="flex h-32 items-center justify-center rounded-lg border-2 border-dashed border-border">
                                                <div className="text-center">
                                                    <ImagePlus className="mx-auto h-8 w-8 text-muted-foreground" />
                                                    <p className="mt-1 text-sm text-muted-foreground">Upload gambar cerita baru</p>
                                                </div>
                                            </div>
                                        )}
                                        <Input
                                            id="image"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className={errors.image ? 'border-red-500' : ''}
                                        />
                                        {errors.image && <p className="text-sm text-red-500">{errors.image}</p>}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="content">Isi Cerita *</Label>
                                    <Textarea
                                        id="content"
                                        placeholder="Tulis cerita lengkap di sini. Pisahkan paragraf dengan enter ganda untuk memudahkan pembacaan..."
                                        value={data.content}
                                        onChange={(e) => setData('content', e.target.value)}
                                        className={`min-h-[300px] ${errors.content ? 'border-red-500' : ''}`}
                                    />
                                    <div className="flex justify-between text-sm text-muted-foreground">
                                        <span>{data.content.length} karakter (minimal 100)</span>
                                        <span>~{estimatedReadTime} menit baca</span>
                                    </div>
                                    {errors.content && <p className="text-sm text-red-500">{errors.content}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="gmaps_link">Link Google Maps (Opsional)</Label>
                                    <Input
                                        id="gmaps_link"
                                        placeholder="https://maps.google.com/?q=lokasi+cerita"
                                        value={data.gmaps_link}
                                        onChange={(e) => setData('gmaps_link', e.target.value)}
                                        className={errors.gmaps_link ? 'border-red-500' : ''}
                                    />
                                    {errors.gmaps_link && <p className="text-sm text-red-500">{errors.gmaps_link}</p>}
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex gap-3">
                            <Button variant="outline" asChild className="flex-1 hover:bg-red-600 hover:text-gray-50">
                                <Link href={route('profile.index')}>Batal</Link>
                            </Button>
                            <Button type="submit" disabled={processing} className="flex-1">
                                {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                <Save className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
}
