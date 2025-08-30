'use client';

import PasswordResetLinkController from '@/actions/App/Http/Controllers/Auth/PasswordResetLinkController';
import AuthLayout from '@/components/auth/layout';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Layout from '@/layouts/layout';
import { Form, Head, Link } from '@inertiajs/react';
import { ArrowLeft, LoaderCircle, Mail } from 'lucide-react';
import { useState } from 'react';

export default function ForgotPasswordPage({ status }: { status?: string }) {
    const [isSubmitted, setIsSubmitted] = useState(false);

    if (isSubmitted) {
        return (
            <Layout>
                <Head title="Email Terkirim" />

                {status && <div className="mb-4 text-center text-sm font-medium text-green-600">{status}</div>}

                <AuthLayout
                    title="Email Terkirim"
                    subtitle="Kami telah mengirimkan instruksi reset kata sandi ke email Anda"
                    imageSrc="/img/banner/indonesian-traditional-envelope-with-batik-pattern.png"
                    imageAlt="Traditional Indonesian mail illustration"
                >
                    <Card className="border-border/50 shadow-sm">
                        <CardHeader className="space-y-1 text-center">
                            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-secondary/10">
                                <Mail className="h-6 w-6 text-secondary" />
                            </div>
                            <CardTitle className="text-2xl">Periksa Email Anda</CardTitle>
                            <CardDescription>
                                Kami telah mengirimkan link reset kata sandi ke email Anda
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2 text-center text-sm text-muted-foreground">
                                <p>Tidak menerima email? Periksa folder spam atau</p>
                                <Button variant="ghost" onClick={() => setIsSubmitted(false)} className="text-secondary hover:text-secondary/80">
                                    kirim ulang
                                </Button>
                            </div>
                            <div className="pt-4">
                                <Link href="/login">
                                    <Button variant="outline" className="w-full bg-transparent">
                                        <ArrowLeft className="mr-2 h-4 w-4" />
                                        Kembali ke Login
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </AuthLayout>
            </Layout>
        );
    }

    return (
        <Layout>
            <Head title="Email Terkirim" />
            {status && <div className="mb-4 text-center text-sm font-medium text-green-600">{status}</div>}

            <AuthLayout
                title="Lupa Kata Sandi"
                subtitle="Masukkan email Anda untuk menerima instruksi reset kata sandi"
                imageSrc="/img/banner/indonesian-traditional-key-with-ornate-cultural-de.png"
                imageAlt="Traditional Indonesian key representing password recovery"
            >
                <Card className="border-border/50 shadow-sm">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-center text-2xl">Reset Kata Sandi</CardTitle>
                        <CardDescription className="text-center">Masukkan email yang terdaftar di akun Anda</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...PasswordResetLinkController.store.form()} className="space-y-4">
                            {({ processing, errors }) => (
                                <>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            name="email"
                                            autoComplete="off"
                                            autoFocus
                                            placeholder="nama@email.com"
                                            required
                                            className="border-border bg-input"
                                        />
                                        <InputError message={errors.email} />
                                    </div>
                                    <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={processing}>
                                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                        Kirim Instruksi Reset
                                    </Button>
                                </>
                            )}
                        </Form>
                        <div className="mt-6 text-center">
                            <Link
                                href="/login"
                                className="inline-flex items-center text-sm text-muted-foreground transition-colors hover:text-foreground"
                            >
                                <ArrowLeft className="mr-1 h-4 w-4" />
                                Kembali ke Login
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </AuthLayout>
        </Layout>
    );
}
