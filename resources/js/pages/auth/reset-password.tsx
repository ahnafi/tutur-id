'use client';

import NewPasswordController from '@/actions/App/Http/Controllers/Auth/NewPasswordController';
import AuthLayout from '@/components/auth/layout';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Layout from '@/layouts/layout';
import { Form, Head } from '@inertiajs/react';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

interface ResetPasswordProps {
    token: string;
    email: string;
}

export default function ResetPasswordPage({ token, email }: ResetPasswordProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    return (
        <Layout>
            <Head title="Reset Kata Sandi" />

            <AuthLayout
                title="Buat Kata Sandi Baru"
                subtitle="Masukkan kata sandi baru untuk akun Anda"
                imageSrc="/indonesian-traditional-lock-with-ornate-cultural-c.png"
                imageAlt="Traditional Indonesian ornate lock"
            >
                <Card className="border-border/50 shadow-sm">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-center text-2xl">Kata Sandi Baru</CardTitle>
                        <CardDescription className="text-center">Buat kata sandi yang kuat untuk keamanan akun Anda</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form
                            {...NewPasswordController.store.form()}
                            transform={(data) => ({ ...data, token, email })}
                            resetOnSuccess={['password', 'password_confirmation']}
                            className="space-y-4"
                        >
                            {({ processing, errors }) => (
                                <>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            name="email"
                                            autoComplete="email"
                                            value={email}
                                            readOnly
                                            className="border-border bg-input"
                                        />
                                        <InputError message={errors.email} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="password">Kata Sandi Baru</Label>
                                        <div className="relative">
                                            <Input
                                                id="password"
                                                name="password"
                                                type={showPassword ? 'text' : 'password'}
                                                placeholder="Minimal 8 karakter"
                                                required
                                                autoFocus
                                                autoComplete="new-password"
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
                                                name="password_confirmation"
                                                autoComplete="new-password"
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                placeholder="Ulangi kata sandi baru"
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
                                    <div className="space-y-1 text-xs text-muted-foreground">
                                        <p>Kata sandi harus mengandung:</p>
                                        <ul className="ml-2 list-inside list-disc space-y-1">
                                            <li>Minimal 8 karakter</li>
                                            <li>Kombinasi huruf besar dan kecil</li>
                                            <li>Minimal satu angka</li>
                                        </ul>
                                    </div>
                                    <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={processing}>
                                        Ubah Kata Sandi
                                    </Button>
                                </>
                            )}
                        </Form>
                    </CardContent>
                </Card>
            </AuthLayout>
        </Layout>
    );
}
