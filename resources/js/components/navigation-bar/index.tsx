'use client';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Link } from '@inertiajs/react';
import { BookOpen, Menu, Search, Trophy } from 'lucide-react';
import { useState } from 'react';

export function Navigation() {
    const [isOpen, setIsOpen] = useState(false);

    const navItems = [
        { href: '/', label: 'Beranda', icon: BookOpen },
        { href: '/cerita', label: 'Cerita', icon: BookOpen },
        { href: '/nama-nusantara', label: 'Nama Nusantara', icon: Search },
        { href: '/leaderboard', label: 'Leaderboard', icon: Trophy },
    ];

    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 section-padding-x">
            <div className="container flex h-16 items-center justify-between max-w-screen-xl mx-auto">
                {/* Logo */}
                <Link href="/" className="flex items-center space-x-2">
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

                {/* Auth Buttons */}
                <div className="hidden items-center space-x-2 md:flex">
                    <Button variant="ghost" asChild>
                        <Link href="/login">Masuk</Link>
                    </Button>
                    <Button asChild>
                        <Link href="/register">Daftar</Link>
                    </Button>
                </div>

                {/* Mobile Menu */}
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger asChild className="md:hidden">
                        <Button variant="ghost" size="icon">
                            <Menu className="h-5 w-5" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-80">
                        <div className="mt-8 flex flex-col space-y-4">
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
                            <div className="space-y-2 border-t pt-4">
                                <Button variant="ghost" className="w-full justify-start" asChild>
                                    <Link href="/login" onClick={() => setIsOpen(false)}>
                                        Masuk
                                    </Link>
                                </Button>
                                <Button className="w-full" asChild>
                                    <Link href="/register" onClick={() => setIsOpen(false)}>
                                        Daftar
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </nav>
    );
}
