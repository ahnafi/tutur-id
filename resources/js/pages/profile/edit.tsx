'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import Layout from '@/layouts/layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Eye, EyeOff, Save, User } from 'lucide-react';
import { useState } from 'react';

interface User {
    id: number;
    name: string;
    email: string;
    avatar: string;
    location: string;
    bio: string;
    isVerified: boolean;
}

interface Props {
    user: User;
    provinces: string[];
}

export default function EditProfile({ user, provinces }: Props) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { data, setData, put, processing, errors, reset } = useForm({
        name: user.name,
        email: user.email,
        location: user.location,
        bio: user.bio,
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        put('profil', {
            onSuccess: () => {
                // Reset password fields after successful update
                setData({
                    ...data,
                    current_password: '',
                    password: '',
                    password_confirmation: '',
                });
            },
        });
    };

    return (
        <Layout>
            <Head title="Edit Profil" />

            <div className="container max-w-4xl py-8">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/profil" className="mb-4 inline-flex items-center gap-2 text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="h-4 w-4" />
                        Kembali ke Profil
                    </Link>

                    <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback className="text-xl">{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h1 className="text-2xl font-bold">Edit Profil</h1>
                            <p className="text-muted-foreground">Kelola informasi profil dan pengaturan akun Anda</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Personal Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Informasi Pribadi
                            </CardTitle>
                            <CardDescription>Informasi dasar yang akan ditampilkan di profil publik Anda</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nama Lengkap *</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className={errors.name ? 'border-red-500' : ''}
                                        placeholder="Masukkan nama lengkap"
                                    />
                                    {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email *</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className={errors.email ? 'border-red-500' : ''}
                                        placeholder="Masukkan alamat email"
                                    />
                                    {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="location">Lokasi</Label>
                                <Select value={data.location} onValueChange={(value) => setData('location', value)}>
                                    <SelectTrigger className={errors.location ? 'border-red-500' : ''}>
                                        <SelectValue placeholder="Pilih provinsi asal" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {provinces.map((province) => (
                                            <SelectItem key={province} value={province}>
                                                {province}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.location && <p className="text-sm text-red-500">{errors.location}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="bio">Bio</Label>
                                <Textarea
                                    id="bio"
                                    value={data.bio}
                                    onChange={(e) => setData('bio', e.target.value)}
                                    className={errors.bio ? 'border-red-500' : ''}
                                    placeholder="Ceritakan sedikit tentang diri Anda..."
                                    rows={4}
                                    maxLength={500}
                                />
                                <div className="flex justify-between text-sm text-muted-foreground">
                                    {errors.bio && <span className="text-red-500">{errors.bio}</span>}
                                    <span className="ml-auto">{data.bio.length}/500</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Change Password */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Ubah Password</CardTitle>
                            <CardDescription>Kosongkan jika tidak ingin mengubah password</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="current_password">Password Saat Ini</Label>
                                <div className="relative">
                                    <Input
                                        id="current_password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={data.current_password}
                                        onChange={(e) => setData('current_password', e.target.value)}
                                        className={errors.current_password ? 'border-red-500' : ''}
                                        placeholder="Masukkan password saat ini"
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute top-0 right-0 h-full px-3 hover:bg-transparent"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </Button>
                                </div>
                                {errors.current_password && <p className="text-sm text-red-500">{errors.current_password}</p>}
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="password">Password Baru</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        className={errors.password ? 'border-red-500' : ''}
                                        placeholder="Masukkan password baru"
                                    />
                                    {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password_confirmation">Konfirmasi Password Baru</Label>
                                    <div className="relative">
                                        <Input
                                            id="password_confirmation"
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            value={data.password_confirmation}
                                            onChange={(e) => setData('password_confirmation', e.target.value)}
                                            placeholder="Konfirmasi password baru"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute top-0 right-0 h-full px-3 hover:bg-transparent"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        >
                                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-md bg-blue-50 p-4">
                                <div className="text-sm text-blue-800">
                                    <p className="mb-1 font-medium">Tips Password Aman:</p>
                                    <ul className="space-y-1 text-xs">
                                        <li>• Minimal 8 karakter</li>
                                        <li>• Kombinasi huruf besar, kecil, angka, dan simbol</li>
                                        <li>• Hindari penggunaan informasi pribadi</li>
                                    </ul>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Action Buttons */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
                                <div className="text-sm text-muted-foreground">* Field wajib diisi</div>

                                <div className="flex gap-3">
                                    <Link href="/profil">
                                        <Button type="button" variant="outline">
                                            Batal
                                        </Button>
                                    </Link>

                                    <Button type="submit" disabled={processing} className="min-w-[120px]">
                                        {processing ? (
                                            <div className="flex items-center gap-2">
                                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                                Menyimpan...
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <Save className="h-4 w-4" />
                                                Simpan Perubahan
                                            </div>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </form>
            </div>
        </Layout>
    );
}
