import { BookOpen, Mail, MapPin, Search, Trophy, Users } from 'lucide-react';
import { Link } from '@inertiajs/react';

export function Footer() {
    return (
        <footer className="border-t bg-card section-padding-x">
            <div className="container pt-12 pb-4 max-w-screen-xl">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                    {/* Brand Section */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80">
                                <span className="text-sm font-bold text-primary-foreground">T</span>
                            </div>
                            <span className="text-xl font-bold text-primary">Tutur.id</span>
                        </div>
                        <p className="text-sm text-balance text-muted-foreground">
                            Dari Kata ke Makna, Dari Cerita ke Jiwa. Platform interaktif untuk melestarikan budaya Indonesia.
                        </p>
                    </div>

                    {/* Navigation Links */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-foreground">Jelajahi</h3>
                        <div className="space-y-2">
                            <Link
                                href="/cerita"
                                className="flex items-center space-x-2 text-sm text-muted-foreground transition-colors hover:text-primary"
                            >
                                <BookOpen className="h-4 w-4" />
                                <span>Cerita Rakyat</span>
                            </Link>
                            <Link
                                href="/nama-nusantara"
                                className="flex items-center space-x-2 text-sm text-muted-foreground transition-colors hover:text-primary"
                            >
                                <Search className="h-4 w-4" />
                                <span>Nama Nusantara</span>
                            </Link>
                            <Link
                                href="/leaderboard"
                                className="flex items-center space-x-2 text-sm text-muted-foreground transition-colors hover:text-primary"
                            >
                                <Trophy className="h-4 w-4" />
                                <span>Leaderboard</span>
                            </Link>
                        </div>
                    </div>

                    {/* Community */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-foreground">Komunitas</h3>
                        <div className="space-y-2">
                            <Link
                                href="/cerita/komunitas"
                                className="flex items-center space-x-2 text-sm text-muted-foreground transition-colors hover:text-primary"
                            >
                                <Users className="h-4 w-4" />
                                <span>Cerita Komunitas</span>
                            </Link>
                            <Link
                                href="/kontribusi"
                                className="flex items-center space-x-2 text-sm text-muted-foreground transition-colors hover:text-primary"
                            >
                                <BookOpen className="h-4 w-4" />
                                <span>Kontribusi Cerita</span>
                            </Link>
                        </div>
                    </div>

                    {/* Contact */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-foreground">Kontak</h3>
                        <div className="space-y-2">
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                <Mail className="h-4 w-4" />
                                <span>info@tutur.id</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                <MapPin className="h-4 w-4" />
                                <span>Indonesia</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 border-t pt-8 text-center">
                    <p className="text-sm text-muted-foreground">© 2024 Tutur.id. Dibuat dengan cinta untuk melestarikan budaya Indonesia.</p>
                </div>
            </div>
        </footer>
    );
}
