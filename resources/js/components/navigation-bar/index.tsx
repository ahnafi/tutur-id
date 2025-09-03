'use client';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { User } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, LogOut, Menu, Search, Trophy, User as UserIcon } from 'lucide-react';
import { useState } from 'react';

interface NavigationProps {
    auth: {
        user?: User;
    };
}

export function Navigation({ auth }: NavigationProps) {
    const [isOpen, setIsOpen] = useState(false);

    // Get user from inertia props
    const user = auth?.user;

    const navItems = [
        { href: route('home'), label: 'Beranda', icon: BookOpen },
        { href: route('stories.index'), label: 'Cerita', icon: BookOpen },
        { href: route('names.index'), label: 'Nama Nusantara', icon: Search },
        { href: route('leaderboard.index'), label: 'Leaderboard', icon: Trophy },
    ];

    return (
        <nav className="section-padding-x sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-16 max-w-screen-xl items-center justify-between">
                {/* Logo */}
                <Link href={route('home')} className="flex items-center space-x-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80">
                        <span className="text-sm font-bold text-primary-foreground">T</span>
                    </div>
                    <span className="text-xl font-bold text-primary">Tutur.id</span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden items-center space-x-6 md:flex">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center space-x-1 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                        >
                            <item.icon className="h-4 w-4" />
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </div>

                {/* Auth Buttons - Desktop */}
                <div className="hidden items-center space-x-2 md:flex">
                    {user ? (
                        <>
                            <Button variant="ghost" asChild>
                                <Link href={route('profile.index')} className="flex items-center space-x-2">
                                    <UserIcon className="h-4 w-4" />
                                    <span>Halo, {user.name}</span>
                                </Link>
                            </Button>
                            <Button variant="ghost" asChild>
                                <Link href={route('logout')} method="post" as="button" className="flex items-center space-x-2">
                                    <LogOut className="h-4 w-4" />
                                    <span>Keluar</span>
                                </Link>
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button variant="ghost" asChild>
                                <Link href={route('login')}>Masuk</Link>
                            </Button>
                            <Button asChild>
                                <Link href={route('register')}>Daftar</Link>
                            </Button>
                        </>
                    )}
                </div>

                {/* Mobile Menu */}
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger asChild className="md:hidden">
                        <Button variant="ghost" size="icon">
                            <Menu className="h-5 w-5" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-80 px-4">
                        <div className="mt-8 flex flex-col space-y-4">
                            {/* User info for mobile */}
                            {user && (
                                <div className="border-b pb-4">
                                    <p className="text-sm text-muted-foreground">Selamat datang,</p>
                                    <p className="font-medium">{user.name}</p>
                                </div>
                            )}

                            {/* Navigation items */}
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="flex items-center space-x-3 rounded-lg p-2 text-sm font-medium transition-colors hover:bg-accent"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <item.icon className="h-4 w-4" />
                                    <span>{item.label}</span>
                                </Link>
                            ))}

                            {/* Auth buttons for mobile */}
                            <div className="space-y-2 border-t pt-4">
                                {user ? (
                                    <>
                                        <Button variant="ghost" className="w-full justify-start" asChild>
                                            <Link href={route('profile')} onClick={() => setIsOpen(false)}>
                                                <UserIcon className="mr-2 h-4 w-4" />
                                                Profile
                                            </Link>
                                        </Button>
                                        <Button variant="ghost" className="w-full justify-start" asChild>
                                            <Link href={route('logout')} method="post" as="button" onClick={() => setIsOpen(false)}>
                                                <LogOut className="mr-2 h-4 w-4" />
                                                Keluar
                                            </Link>
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Button variant="ghost" className="w-full justify-start" asChild>
                                            <Link href={route('login')} onClick={() => setIsOpen(false)}>
                                                Masuk
                                            </Link>
                                        </Button>
                                        <Button className="w-full justify-start" asChild>
                                            <Link href={route('register')} onClick={() => setIsOpen(false)}>
                                                Daftar
                                            </Link>
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </nav>
    );
}
