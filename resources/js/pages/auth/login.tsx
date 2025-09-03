'use client';

import AuthenticatedSessionController from '@/actions/App/Http/Controllers/Auth/AuthenticatedSessionController';
import AuthLayout from '@/components/auth/layout';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Layout from '@/layouts/layout';
import { Form, Head, Link } from '@inertiajs/react';
import { Eye, EyeOff, LoaderCircle } from 'lucide-react';
import { useState } from 'react';

interface LoginPageProps {
    status?: string;
    canResetPassword: boolean;
}

export default function LoginPage({ status, canResetPassword }: LoginPageProps) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <Layout>
            <Head title="Masuk" />
            <AuthLayout
                title="Selamat Datang Kembali"
                subtitle="Masuk ke akun Tutur.id Anda untuk melanjutkan perjalanan budaya"
                imageSrc="/img/banner/indonesian-wayang-puppet-shadow-art-with-warm-gold.png"
                imageAlt="Wayang shadow puppet art representing Indonesian storytelling tradition"
            >
                <Card className="border-border/50 shadow-sm">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-center text-2xl">Masuk</CardTitle>
                        <CardDescription className="text-center">Masukkan email dan kata sandi Anda</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...AuthenticatedSessionController.store.form()} resetOnSuccess={['password']} className="space-y-4">
                            {({ processing, errors }) => (
                                <>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            name="email"
                                            autoFocus
                                            tabIndex={1}
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
                                                name="password"
                                                tabIndex={2}
                                                autoComplete="current-password"
                                                type={showPassword ? 'text' : 'password'}
                                                placeholder="Masukkan kata sandi"
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
                                    <div className="flex justify-between">
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="remember"
                                                name="remember"
                                                tabIndex={3}
                                                className="h-4 w-4 rounded border-border text-primary"
                                            />
                                            <Label htmlFor="remember" className="text-sm">
                                                Ingat saya
                                            </Label>
                                        </div>
                                        {canResetPassword && (
                                            <div className="flex items-center justify-between">
                                                <Link
                                                    href={route('password.request')}
                                                    className="text-sm text-secondary transition-colors hover:text-secondary/80"
                                                >
                                                    Lupa kata sandi?
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                    <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={processing}>
                                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                        Masuk
                                    </Button>
                                </>
                            )}
                        </Form>
                        {status && <div className="mt-2 text-center text-sm text-green-600">{status}</div>}
                        <div className="mt-6 text-center text-sm">
                            <span className="text-muted-foreground">Belum punya akun? </span>
                            <Link href={route('register')} className="font-medium text-secondary transition-colors hover:text-secondary/80">
                                Daftar sekarang
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </AuthLayout>
        </Layout>
    );
}
