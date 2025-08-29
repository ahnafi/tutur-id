'use client';

import ConfirmablePasswordController from '@/actions/App/Http/Controllers/Auth/ConfirmablePasswordController';
import AuthLayout from '@/components/auth/layout';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Layout from '@/layouts/layout';
import { Form, Head } from '@inertiajs/react';
import { Eye, EyeOff, Shield } from 'lucide-react';
import { useState } from 'react';

export default function ConfirmPasswordPage() {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <Layout>
            <Head title="Konfirmasi Kata Sandi" />

            <AuthLayout
                title="Konfirmasi Kata Sandi"
                subtitle="Untuk keamanan, silakan konfirmasi kata sandi Anda"
                imageSrc="/indonesian-traditional-security-guardian-with-cult.png"
                imageAlt="Traditional Indonesian security guardian"
            >
                <Card className="border-border/50 shadow-sm">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-center text-2xl">Konfirmasi Identitas</CardTitle>
                        <CardDescription className="text-center">Masukkan kata sandi Anda untuk melanjutkan</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...ConfirmablePasswordController.store.form()} resetOnSuccess={['password']} className="space-y-4">
                            {({ processing, errors }) => (
                                <>
                                    <div className="space-y-2">
                                        <Label htmlFor="password">Kata Sandi</Label>
                                        <div className="relative">
                                            <Input
                                                id="password"
                                                name="password"
                                                type={showPassword ? 'text' : 'password'}
                                                placeholder="Masukkan kata sandi Anda"
                                                required
                                                autoComplete="current-password"
                                                autoFocus
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
                                    <div className="rounded-md bg-muted/50 p-3">
                                        <p className="text-xs text-muted-foreground">
                                            <Shield className="mr-1 inline h-3 w-3" />
                                            Kami memerlukan konfirmasi ini untuk melindungi akun Anda dari akses yang tidak sah.
                                        </p>
                                    </div>
                                    <Button disabled={processing} type="submit" className="w-full bg-primary hover:bg-primary/90">
                                        Konfirmasi
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
