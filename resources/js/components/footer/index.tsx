import { Link } from '@inertiajs/react';
import { BookOpen, Facebook, Instagram, Mail, MapPin, Phone, Search, Trophy, Twitter } from 'lucide-react';

export function Footer() {
    return (
        <footer className="section-padding-x border-t bg-card">
            <div className="container max-w-screen-xl pt-12 pb-4">
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
                                href={route('stories.index')}
                                className="flex items-center space-x-2 text-sm text-muted-foreground transition-colors hover:text-primary"
                            >
                                <BookOpen className="h-4 w-4" />
                                <span>Cerita Rakyat</span>
                            </Link>
                            <Link
                                href={route('names.index')}
                                className="flex items-center space-x-2 text-sm text-muted-foreground transition-colors hover:text-primary"
                            >
                                <Search className="h-4 w-4" />
                                <span>Nama Nusantara</span>
                            </Link>
                            <Link
                                href={route('leaderboard.index')}
                                className="flex items-center space-x-2 text-sm text-muted-foreground transition-colors hover:text-primary"
                            >
                                <Trophy className="h-4 w-4" />
                                <span>Leaderboard</span>
                            </Link>
                        </div>
                    </div>

                    {/* Community */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-foreground">Sosial Media</h3>
                        <div className="space-y-2">
                            <Link
                                href="https://instagram.com/tutur.id"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-2 text-sm text-muted-foreground transition-colors hover:text-primary"
                            >
                                <Instagram className="h-4 w-4" />
                                <span>Instagram</span>
                            </Link>
                            <Link
                                href="https://twitter.com/tutur_id"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-2 text-sm text-muted-foreground transition-colors hover:text-primary"
                            >
                                <Twitter className="h-4 w-4" />
                                <span>Twitter</span>
                            </Link>
                            <Link
                                href="https://www.facebook.com/tutur.id"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-2 text-sm text-muted-foreground transition-colors hover:text-primary"
                            >
                                <Facebook className="h-4 w-4" />
                                <span>Facebook</span>
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
                                <span>Purwokerto, Jawa Tengah, Indonesia</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                <span className="inline-flex items-center">
                                    <Phone className="h-4 w-4 mr-1" />
                                    <span>+62 812-3456-7890</span>
                                </span>
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
