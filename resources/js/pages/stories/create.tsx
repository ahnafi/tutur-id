'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Toaster } from '@/components/ui/toaster';
import Layout from '@/layouts/layout';
import { StoryCategory, User } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { AlertCircle, ArrowLeft, BookOpen, CheckCircle, Eye, ImagePlus, Send, X } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';

interface ContributionPageProps {
    categories: StoryCategory[];
    regions: string[];
}

export default function ContributionPage({ categories, regions }: ContributionPageProps) {
    const [showPreview, setShowPreview] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    console.log(categories, regions);

    // Get user from props
    const { props } = usePage<{ auth: { user?: User } }>();
    const user = props.auth?.user;
    const isAdmin = user?.roles?.some((role: { name: string }) => role.name === 'admin') ?? false;

    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        content: '',
        origin_place: '',
        story_category_id: '',
        gmaps_link: '',
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

        post('/kontribusi', {
            onSuccess: () => {
                setSubmitted(true);
                reset();
                setImagePreview(null);
                toast.success('Cerita berhasil dikirim! Terima kasih atas kontribusinya.');
            },
        });
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
        setImagePreview(null);
    };

    const estimatedReadTime = Math.ceil(data.content.trim().split(/\s+/).length / 200) || 1;

    if (submitted) {
        return (
            <Layout>
                <Toaster />

                <Head title="Cerita Berhasil Dikirim" />
                <div className="section-padding-x py-4 md:py-8">
                    <div className="container max-w-screen-xl">
                        <div className="space-y-6 text-center">
                            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-600">
                                <CheckCircle className="h-10 w-10 text-white" />
                            </div>
                            <div className="space-y-2">
                                <h1 className="text-3xl font-bold">{isAdmin ? 'Cerita Berhasil Dipublikasikan!' : 'Cerita Berhasil Dikirim!'}</h1>
                                <p className="text-muted-foreground">
                                    {isAdmin
                                        ? 'Cerita resmi berhasil ditambahkan ke koleksi Tutur.id'
                                        : 'Terima kasih telah berkontribusi untuk melestarikan budaya Indonesia'}
                                </p>
                            </div>

                            {!isAdmin && (
                                <Card>
                                    <CardContent className="space-y-4 p-6">
                                        <Alert>
                                            <AlertCircle className="h-4 w-4" />
                                            <AlertDescription>
                                                Cerita komunitas Anda telah dipublikasikan dan dapat dilihat oleh pengunjung lain. Cerita akan
                                                ditandai sebagai kontribusi komunitas.
                                            </AlertDescription>
                                        </Alert>
                                    </CardContent>
                                </Card>
                            )}

                            <div className="flex flex-col justify-center gap-3 sm:flex-row">
                                <Button onClick={() => setSubmitted(false)}>{isAdmin ? 'Tambah Cerita Lain' : 'Kirim Cerita Lain'}</Button>
                                <Button variant="outline" asChild>
                                    <Link href="/cerita">Lihat Cerita Lainnya</Link>
                                </Button>
                                {user && (
                                    <Button variant="outline" asChild>
                                        <Link href="/kontribusi-saya">Kontribusi Saya</Link>
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }

    if (showPreview) {
        return (
            <Layout>
                <Toaster />

                <Head title="Preview Cerita" />
                <div className="section-padding-x py-4 md:py-8">
                    <div className="container max-w-screen-xl">
                        <div className="mb-6 flex items-center justify-between">
                            <Button variant="ghost" onClick={() => setShowPreview(false)}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Kembali ke Form
                            </Button>
                            <Badge variant="secondary">Preview Cerita</Badge>
                        </div>

                        <div className="grid gap-8 lg:grid-cols-3">
                            <div className="space-y-6 lg:col-span-2">
                                <Card>
                                    <div className="relative h-48 overflow-hidden rounded-t-lg">
                                        {imagePreview ? (
                                            <img src={imagePreview} alt={data.title} className="h-full w-full object-cover" />
                                        ) : (
                                            <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
                                                <BookOpen className="h-16 w-16 text-primary/60" />
                                            </div>
                                        )}
                                        <div className="absolute bottom-4 left-4">
                                            <Badge className={isAdmin ? 'bg-primary/90' : 'bg-secondary'}>
                                                {isAdmin ? 'Cerita Resmi' : 'Cerita Komunitas'}
                                            </Badge>
                                        </div>
                                    </div>
                                    <CardHeader>
                                        <CardTitle className="text-2xl">{data.title}</CardTitle>
                                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                            {user && <span>oleh {user.name}</span>}
                                            {user && <span>•</span>}
                                            <span>{estimatedReadTime} menit baca</span>
                                            <span>•</span>
                                            <span>{data.origin_place}</span>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="prose prose-gray max-w-none">
                                            {data.content.split('\n\n').map((paragraph, index) => (
                                                <p key={index} className="mb-4 leading-relaxed text-foreground">
                                                    {paragraph}
                                                </p>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Informasi Cerita</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <h4 className="mb-1 font-medium">Asal Daerah</h4>
                                            <p className="text-sm text-muted-foreground">{data.origin_place}</p>
                                        </div>
                                        <Separator />
                                        <div>
                                            <h4 className="mb-1 font-medium">Kategori</h4>
                                            <p className="text-sm text-muted-foreground">
                                                {data.story_category_id
                                                    ? categories.find((c) => c.id.toString() === data.story_category_id)?.name
                                                    : 'Tidak dikategorikan'}
                                            </p>
                                        </div>
                                        <Separator />
                                        <div>
                                            <h4 className="mb-1 font-medium">Estimasi Waktu Baca</h4>
                                            <p className="text-sm text-muted-foreground">{estimatedReadTime} menit</p>
                                        </div>
                                        <Separator />
                                        <div>
                                            <h4 className="mb-1 font-medium">Jenis Cerita</h4>
                                            <p className="text-sm text-muted-foreground">{isAdmin ? 'Cerita Resmi' : 'Kontribusi Komunitas'}</p>
                                        </div>
                                    </CardContent>
                                </Card>

                                <div className="space-y-3">
                                    <Button onClick={handleSubmit} disabled={processing} className="w-full">
                                        {processing ? 'Mengirim...' : isAdmin ? 'Publikasikan Cerita' : 'Kirim Cerita'}
                                        <Send className="ml-2 h-4 w-4" />
                                    </Button>
                                    <Button variant="outline" onClick={() => setShowPreview(false)} className="w-full">
                                        Edit Cerita
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <Toaster />

            <Head title={isAdmin ? 'Tambah Cerita Resmi' : 'Kontribusi Cerita'} />
            <div className="section-padding-x py-4 md:py-8">
                <div className="container max-w-screen-xl">
                    <Button variant="ghost" asChild className="mb-6">
                        <Link href="/cerita">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Kembali ke Cerita
                        </Link>
                    </Button>

                    <div className="space-y-8">
                        <div className="grid gap-8 lg:grid-cols-3">
                            <div className="lg:col-span-2">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Informasi Cerita</CardTitle>
                                            <CardDescription>
                                                {isAdmin
                                                    ? 'Isi detail cerita resmi yang akan dipublikasikan'
                                                    : 'Isi detail cerita yang ingin Anda bagikan'}
                                            </CardDescription>
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
                                                    <Select
                                                        value={data.story_category_id}
                                                        onValueChange={(value) => setData('story_category_id', value)}
                                                    >
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
                                                                <p className="mt-1 text-sm text-muted-foreground">Upload gambar cerita</p>
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
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setShowPreview(true)}
                                            disabled={!data.title || !data.content}
                                            className="flex-1"
                                        >
                                            <Eye className="mr-2 h-4 w-4" />
                                            Preview Cerita
                                        </Button>
                                        <Button type="submit" disabled={processing} className="flex-1">
                                            {processing ? 'Mengirim...' : isAdmin ? 'Publikasikan' : 'Kirim Cerita'}
                                            <Send className="ml-2 h-4 w-4" />
                                        </Button>
                                    </div>
                                </form>
                            </div>

                            <div className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>{isAdmin ? 'Panduan Admin' : 'Panduan Menulis'}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <h4 className="text-sm font-medium">✨ Tips Cerita yang Baik:</h4>
                                            <ul className="space-y-1 text-sm text-muted-foreground">
                                                <li>• Cerita minimal 100 karakter</li>
                                                <li>• Gunakan bahasa yang mudah dipahami</li>
                                                <li>• Pisahkan paragraf dengan jelas</li>
                                                <li>• Upload gambar untuk menarik perhatian</li>
                                                {isAdmin && <li>• Pastikan konten sudah terverifikasi</li>}
                                            </ul>
                                        </div>
                                        {!isAdmin && (
                                            <>
                                                <Separator />
                                                <div className="space-y-2">
                                                    <h4 className="text-sm font-medium">📝 Status Publikasi:</h4>
                                                    <ul className="space-y-1 text-sm text-muted-foreground">
                                                        <li>• Cerita langsung dipublikasikan</li>
                                                        <li>• Ditandai sebagai kontribusi komunitas</li>
                                                        <li>• Dapat dilihat oleh semua pengunjung</li>
                                                    </ul>
                                                </div>
                                            </>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
