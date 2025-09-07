'use client';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { User } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, LogOut, Map, Menu, Moon, Search, Sun, Trophy, User as UserIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

export function Navigation() {
    const [isOpen, setIsOpen] = useState(false);

    // Get user from inertia props
    const { props } = usePage<{ auth: { user?: User } }>();
    const user = props.auth?.user;

    const navItems = [
        { href: route('home'), label: 'Beranda', icon: BookOpen },
        { href: route('stories.index'), label: 'Cerita', icon: BookOpen },
        { href: route('names.index'), label: 'Nama Nusantara', icon: Search },
        { href: route('leaderboard.index'), label: 'Leaderboard', icon: Trophy },
        { href: route('map.index'), label: 'Peta', icon: Map },
    ];

    const [theme, setTheme] = useState<'light' | 'dark'>('light');

    useEffect(() => {
        // Cek preferensi awal
        const saved = localStorage.getItem('appearance');
        if (saved === 'dark' || (saved === null && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            setTheme('dark');
            document.documentElement.classList.add('dark');
        } else {
            setTheme('light');
            document.documentElement.classList.remove('dark');
        }
    }, []);

    const toggleTheme = () => {
        if (theme === 'light') {
            setTheme('dark');
            document.documentElement.classList.add('dark');
            localStorage.setItem('appearance', 'dark');
        } else {
            setTheme('light');
            document.documentElement.classList.remove('dark');
            localStorage.setItem('appearance', 'light');
        }
    };

    return (
        <nav className="section-padding-x sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-16 max-w-screen-xl items-center justify-between">
                {/* Logo */}
                <Link href={route('home')} className="flex items-center space-x-2">
                    <img src="/img/logo/tutur-with-text.png" alt="Tutur.id" className="h-8" />
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden items-center space-x-6 lg:flex">
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
                <div className="hidden items-center space-x-2 lg:flex">
                    {user ? (
                        <>
                            <Button variant="ghost" asChild>
                                <Link href={route('profile.index')} className="flex items-center space-x-2">
                                    <UserIcon className="h-4 w-4" />
                                    <span>Halo, {user.name}</span>
                                </Link>
                            </Button>
                            <Button variant="ghost" asChild className="bg-red-600 text-gray-50 hover:bg-red-700">
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
                    <Button
                        className={theme === 'light' ? `bg-gray-800 text-gray-50 hover:bg-gray-900` : `bg-gray-200 text-gray-800 hover:bg-gray-300 dark:text-gray-900 dark:hover:bg-gray-300`}
                        variant="ghost"
                        size="icon"
                        onClick={toggleTheme}
                        aria-label="Toggle theme"
                    >
                        {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                    </Button>
                </div>

                {/* Mobile Menu */}
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger asChild className="lg:hidden">
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
                                            <Link href={route('profile.index')} onClick={() => setIsOpen(false)}>
                                                <UserIcon className="mr-2 h-4 w-4" />
                                                Profile
                                            </Link>
                                        </Button>
                                        <Button variant="ghost" className="w-full justify-start bg-red-600 text-gray-50 hover:bg-red-700" asChild>
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
                                <Button variant="ghost" className={`w-full justify-start ${theme === 'light' ? `bg-gray-800 text-gray-50 hover:bg-gray-900` : `bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-900 dark:text-gray-50 dark:hover:bg-gray-800`}`} onClick={toggleTheme}>
                                    {theme === 'dark' ? (
                                        <>
                                            <Sun className="mr-2 h-4 w-4" />
                                            Light Mode
                                        </>
                                    ) : (
                                        <>
                                            <Moon className="mr-2 h-4 w-4" />
                                            Dark Mode
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </nav>
    );
}
