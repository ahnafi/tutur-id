import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Layout from '@/layouts/layout';
import { Head, Link } from '@inertiajs/react';
import { BookOpen, Clock, MapPin, Play, Search, Star, Trophy, Users } from 'lucide-react';

export default function HomePage() {
    const featuredStories = [
        {
            title: 'Malin Kundang',
            origin: 'Sumatera Barat',
            readTime: '2 menit',
            rating: 4.8,
            image: '/img/stories/indonesian-folklore-malin-kundang-traditional-art.png',
        },
        {
            title: 'Sangkuriang',
            origin: 'Jawa Barat',
            readTime: '3 menit',
            rating: 4.9,
            image: '/img/stories/indonesian-folklore-sangkuriang-traditional-art.png',
        },
        {
            title: 'Keong Mas',
            origin: 'Jawa Timur',
            readTime: '2 menit',
            rating: 4.7,
            image: '/img/stories/indonesian-folklore-keong-mas-traditional-art.png',
        },
    ];

    const popularNames = [
        { name: 'Arjuna', meaning: 'Putih bersih, suci', origin: 'Jawa' },
        { name: 'Sari', meaning: 'Inti, yang terbaik', origin: 'Sanskrit' },
        { name: 'Bayu', meaning: 'Angin', origin: 'Jawa' },
        { name: 'Dewi', meaning: 'Bidadari', origin: 'Sanskrit' },
    ];

    return (
        <Layout>
            <Head title="Selamat Datang" />

            <div className="space-y-16">
                {/* Hero Section */}
                <section className="section-padding-x relative overflow-hidden pt-16">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
                    <div className="relative container max-w-screen-xl">
                        <div className="grid items-center gap-12 lg:grid-cols-2">
                            <div className="space-y-8">
                                <div className="space-y-4">
                                    <Badge variant="secondary" className="w-fit">
                                        Platform Budaya Indonesia
                                    </Badge>
                                    <h1 className="text-4xl font-bold text-balance lg:text-6xl">
                                        Dari Kata ke Makna, Dari Cerita ke <span className="text-primary">Jiwa</span>
                                    </h1>
                                    <p className="text-xl text-balance text-muted-foreground">
                                        Jelajahi ribuan cerita rakyat Nusantara dan temukan makna nama tradisional Indonesia dalam format modern yang
                                        interaktif.
                                    </p>
                                </div>

                                <div className="flex flex-col gap-4 sm:flex-row">
                                    <Button size="lg" asChild>
                                        <Link href="/register">
                                            <BookOpen className="mr-2 h-5 w-5" />
                                            Mulai Jelajahi
                                        </Link>
                                    </Button>
                                    <Button size="lg" variant="outline" asChild>
                                        <Link href="/cerita">
                                            <Play className="mr-2 h-5 w-5" />
                                            Lihat Cerita
                                        </Link>
                                    </Button>
                                </div>

                                <div className="flex items-center gap-8 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                        <BookOpen className="h-4 w-4" />
                                        <span>500+ Cerita</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Users className="h-4 w-4" />
                                        <span>10K+ Pengguna</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Star className="h-4 w-4" />
                                        <span>4.9 Rating</span>
                                    </div>
                                </div>
                            </div>

                            <div className="relative">
                                <div className="relative h-96 w-full overflow-hidden rounded-2xl shadow-2xl lg:h-[500px]">
                                    <img
                                        src="/img/banner/indonesian-traditional-wayang-puppet-show-cultural.png"
                                        alt="Indonesian Cultural Heritage"
                                        className="h-full w-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="section-padding-x pt-16">
                    <div className="container max-w-screen-xl">
                        <div className="mb-12 space-y-4 text-center">
                            <h2 className="text-3xl font-bold lg:text-4xl">Fitur Unggulan</h2>
                            <p className="text-xl text-balance text-muted-foreground">
                                Eksplorasi budaya Indonesia dengan cara yang modern dan interaktif
                            </p>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                            <Card className="text-center">
                                <CardHeader>
                                    <BookOpen className="mx-auto mb-4 h-12 w-12 text-primary" />
                                    <CardTitle>Cerita Rakyat</CardTitle>
                                    <CardDescription>Baca cerita rakyat singkat dalam format 60 detik dengan kuis interaktif</CardDescription>
                                </CardHeader>
                            </Card>

                            <Card className="text-center">
                                <CardHeader>
                                    <Search className="mx-auto mb-4 h-12 w-12 text-primary" />
                                    <CardTitle>Nama Nusantara</CardTitle>
                                    <CardDescription>Temukan arti dan asal daerah nama tradisional Indonesia</CardDescription>
                                </CardHeader>
                            </Card>

                            <Card className="text-center">
                                <CardHeader>
                                    <Trophy className="mx-auto mb-4 h-12 w-12 text-primary" />
                                    <CardTitle>Leaderboard</CardTitle>
                                    <CardDescription>Kompetisi seru dengan sistem poin dari kuis edukatif</CardDescription>
                                </CardHeader>
                            </Card>

                            <Card className="text-center">
                                <CardHeader>
                                    <Users className="mx-auto mb-4 h-12 w-12 text-primary" />
                                    <CardTitle>Komunitas</CardTitle>
                                    <CardDescription>Berbagi cerita dari daerahmu dan bergabung dengan komunitas</CardDescription>
                                </CardHeader>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* Featured Stories */}
                <section className="section-padding-x bg-card/50 pt-16">
                    <div className="container max-w-screen-xl">
                        <div className="mb-8 flex items-center justify-between">
                            <div>
                                <h2 className="mb-2 text-3xl font-bold">Cerita Populer</h2>
                                <p className="text-muted-foreground">Cerita rakyat yang paling disukai pembaca</p>
                            </div>
                            <Button variant="outline" asChild>
                                <Link href="/cerita">Lihat Semua</Link>
                            </Button>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {featuredStories.map((story, index) => (
                                <Card key={index} className="overflow-hidden transition-shadow hover:shadow-lg">
                                    <img src={story.image || '/placeholder.svg'} alt={story.title} className="w-full object-cover max-h-64" />
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <Badge variant="secondary">{story.origin}</Badge>
                                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                <Star className="h-4 w-4 fill-current text-yellow-500" />
                                                <span>{story.rating}</span>
                                            </div>
                                        </div>
                                        <CardTitle className="text-lg">{story.title}</CardTitle>
                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <Clock className="h-4 w-4" />
                                                <span>{story.readTime}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <MapPin className="h-4 w-4" />
                                                <span>{story.origin}</span>
                                            </div>
                                        </div>
                                    </CardHeader>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Popular Names */}
                <section className="section-padding-x pt-16">
                    <div className="container max-w-screen-xl">
                        <div className="mb-8 flex items-center justify-between">
                            <div>
                                <h2 className="mb-2 text-3xl font-bold">Nama Populer</h2>
                                <p className="text-muted-foreground">Nama tradisional Indonesia yang paling dicari</p>
                            </div>
                            <Button variant="outline" asChild>
                                <Link href="/nama-nusantara">Jelajahi Nama</Link>
                            </Button>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            {popularNames.map((name, index) => (
                                <Card key={index} className="p-4 transition-shadow hover:shadow-md">
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-lg font-semibold">{name.name}</h3>
                                            <Badge variant="outline" className="text-xs">
                                                {name.origin}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground">{name.meaning}</p>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="section-padding-x bg-primary py-20 text-primary-foreground">
                    <div className="container max-w-screen-xl text-center">
                        <div className="mx-auto max-w-2xl space-y-6">
                            <h2 className="text-3xl font-bold lg:text-4xl">Mulai Perjalanan Budayamu</h2>
                            <p className="text-xl opacity-90">
                                Bergabunglah dengan ribuan orang yang telah menemukan kembali kekayaan budaya Indonesia
                            </p>
                            <div className="flex flex-col justify-center gap-4 sm:flex-row">
                                <Button size="lg" variant="secondary" asChild>
                                    <Link href="/register">Daftar Gratis</Link>
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="border-primary-foreground bg-transparent text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                                    asChild
                                >
                                    <Link href="/cerita">Mulai Membaca</Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </Layout>
    );
}
