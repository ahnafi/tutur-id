'use client';

import EmailVerificationNotificationController from '@/actions/App/Http/Controllers/Auth/EmailVerificationNotificationController';
import AuthLayout from '@/components/auth/layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Layout from '@/layouts/layout';
import { Form, Head, Link } from '@inertiajs/react';
import { AlertCircle, CheckCircle, LoaderCircle, Mail } from 'lucide-react';

export default function VerifyEmailPage({ status }: { status?: string }) {
    if (status === 'verification-link-sent') {
        return (
            <AuthLayout
                title="Email Terverifikasi"
                subtitle="Selamat! Email Anda telah berhasil diverifikasi"
                imageSrc="/indonesian-traditional-celebration-with-cultural-d.png"
                imageAlt="Indonesian traditional celebration"
            >
                <Card className="border-border/50 shadow-sm">
                    <CardHeader className="space-y-1 text-center">
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-secondary/10">
                            <CheckCircle className="h-6 w-6 text-secondary" />
                        </div>
                        <CardTitle className="text-2xl">Link Verifikasi Berhasil Dikirim!</CardTitle>
                        <CardDescription>Link verifikasi telah dikirim ke email Anda. Silakan periksa kotak masuk Anda.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Link href={route('login')}>
                            <Button className="w-full bg-primary hover:bg-primary/90">Lanjut ke Login</Button>
                        </Link>
                        <div className="text-center">
                            <p className="text-sm text-muted-foreground">Selamat datang di Tutur.id! Mulai jelajahi kekayaan budaya Indonesia.</p>
                        </div>
                    </CardContent>
                </Card>
            </AuthLayout>
        );
    }

    return (
        <Layout>
            <Head title="Verifikasi Gagal" />

            <AuthLayout
                title="Verifikasi Gagal"
                subtitle="Terjadi masalah saat memverifikasi email Anda"
                imageSrc="/indonesian-traditional-warning-symbol-with-cultura.png"
                imageAlt="Traditional Indonesian warning symbol"
            >
                <Card className="border-border/50 shadow-sm">
                    <CardHeader className="space-y-1 text-center">
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                            <AlertCircle className="h-6 w-6 text-destructive" />
                        </div>
                        <CardTitle className="text-2xl">Kirim Email Verifikasi</CardTitle>
                        <CardDescription>Link verifikasi akan dikirim ke email Anda. Silakan periksa kotak masuk Anda.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Form {...EmailVerificationNotificationController.store.form()}>
                            {({ processing }) => (
                                <>
                                    <div className="space-y-2 text-center">
                                        <p className="text-sm text-muted-foreground">
                                            Email verifikasi belum datang? Tidak masalah! Kami dapat mengirimkan link verifikasi baru ke email Anda.
                                        </p>
                                    </div>
                                    <Button disabled={processing} className="w-full bg-primary hover:bg-primary/90">
                                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                        <Mail className="mr-2 h-4 w-4" />
                                        Kirim Ulang Email Verifikasi
                                    </Button>
                                </>
                            )}
                        </Form>
                        <div className="text-center">
                            <Link href={route('login')} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                                Kembali ke Login
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </AuthLayout>
        </Layout>
    );
}
