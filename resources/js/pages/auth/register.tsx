'use client';

import RegisteredUserController from '@/actions/App/Http/Controllers/Auth/RegisteredUserController';
import AuthLayout from '@/components/auth/layout';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Layout from '@/layouts/layout';
import { Form, Head, Link } from '@inertiajs/react';
import { Eye, EyeOff, LoaderCircle } from 'lucide-react';
import { useState } from 'react';

export default function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    return (
        <Layout>
            <Head title="Daftar" />

            <AuthLayout
                title="Bergabung dengan Tutur.id"
                subtitle="Mulai perjalanan Anda menjelajahi kekayaan budaya Indonesia"
                imageSrc="/img/banner/indonesian-traditional-dancers-in-colorful-batik-w.png"
                imageAlt="Indonesian traditional dancers representing cultural heritage"
                reverse={true}
            >
                <Card className="border-border/50 shadow-sm">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-center text-2xl">Daftar Akun</CardTitle>
                        <CardDescription className="text-center">Buat akun baru untuk mengakses semua fitur</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form
                            {...RegisteredUserController.store.form()}
                            resetOnSuccess={['password', 'password_confirmation']}
                            disableWhileProcessing
                            className="space-y-4"
                        >
                            {({ processing, errors }) => (
                                <>
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Nama Lengkap</Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            name="name"
                                            autoFocus
                                            tabIndex={1}
                                            autoComplete="name"
                                            placeholder="Masukkan nama lengkap"
                                            required
                                            className="border-border bg-input"
                                        />
                                        <InputError message={errors.name} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            name="email"
                                            tabIndex={2}
                                            autoComplete="email"
                                            placeholder="nama@email.com"
                                            required
                                            className="border-border bg-input"
                                        />
                                        <InputError message={errors.email} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="password">Kata Sandi</Label>
                                        <div className="relative">
                                            <Input
                                                id="password"
                                                type={showPassword ? 'text' : 'password'}
                                                placeholder="Minimal 8 karakter"
                                                tabIndex={3}
                                                autoComplete="new-password"
                                                name="password"
                                                required
                                                className="border-border bg-input pr-10"
                                            />
                                            <InputError message={errors.password} />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                                                ) : (
                                                    <Eye className="h-4 w-4 text-muted-foreground" />
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="password_confirmation">Konfirmasi Kata Sandi</Label>
                                        <div className="relative">
                                            <Input
                                                id="password_confirmation"
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                placeholder="Ulangi kata sandi"
                                                name="password_confirmation"
                                                tabIndex={4}
                                                autoComplete="new-password"
                                                required
                                                className="border-border bg-input pr-10"
                                            />
                                            <InputError message={errors.password_confirmation} />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            >
                                                {showConfirmPassword ? (
                                                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                                                ) : (
                                                    <Eye className="h-4 w-4 text-muted-foreground" />
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                    <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={processing} tabIndex={5}>
                                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                        Daftar Sekarang
                                    </Button>
                                </>
                            )}
                        </Form>
                        <div className="mt-6 text-center text-sm">
                            <span className="text-muted-foreground">Sudah punya akun? </span>
                            <Link href={route('login')} className="font-medium text-secondary transition-colors hover:text-secondary/80">
                                Masuk di sini
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </AuthLayout>
        </Layout>
    );
}