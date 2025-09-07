import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Layout from '@/layouts/layout';
import { Head, Link } from '@inertiajs/react';
import { BookOpen, Clock, Eye, Play, Search, Star, Trophy, Users } from 'lucide-react';

interface FeaturedStory {
    id: number;
    title: string;
    slug: string;
    origin_place: string;
    image?: string;
    total_reads: number;
    comments_count: number;
    category?: string;
    is_official: boolean;
    read_time: number;
    rating: number;
}

interface PopularName {
    id: number;
    name: string;
    slug: string;
    meaning: string;
    origin: string;
    category: string;
    views: number;
}

interface RecentStory {
    id: number;
    title: string;
    slug: string;
    origin_place: string;
    image?: string;
    created_at: string;
    creator: string;
    category?: string;
    excerpt: string;
}

interface Stats {
    total_stories: number;
    total_names: number;
    total_users: number;
    total_reads: number;
}

interface HomePageProps {
    featuredStories: FeaturedStory[];
    popularNames: PopularName[];
    stats: Stats;
    recentStories: RecentStory[];
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function HomePage({ featuredStories, popularNames, stats, recentStories }: HomePageProps) {
    const formatNumber = (num: number) => {
        if (num >= 1000000) {
            return Math.floor(num / 1000000) + 'M+';
        }
        if (num >= 1000) {
            return Math.floor(num / 1000) + 'K+';
        }
        return num.toString();
    };

    return (
        <Layout>
            <Head title="Selamat Datang di Tutur.id" />

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
                                        <span>{formatNumber(stats.total_stories)} Cerita</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Users className="h-4 w-4" />
                                        <span>{formatNumber(stats.total_users)} Pengguna</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Eye className="h-4 w-4" />
                                        <span>{formatNumber(stats.total_reads)} Pembaca</span>
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
                            {featuredStories.slice(0, 6).map((story) => (
                                <Card key={story.id} className="overflow-hidden transition-shadow hover:shadow-lg">
                                    <Link href={`/cerita/${story.slug}`}>
                                        <div className="relative">
                                            {story.image ? (
                                                <img src={`/storage${story.image}`} alt={story.title} className="h-48 w-full object-cover" />
                                            ) : (
                                                <div className="flex h-48 w-full items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
                                                    <BookOpen className="h-12 w-12 text-primary/60" />
                                                </div>
                                            )}
                                            <div className="absolute top-2 left-2">
                                                <Badge className={story.is_official ? 'bg-primary' : 'bg-secondary'}>
                                                    {story.is_official ? 'Resmi' : 'Komunitas'}
                                                </Badge>
                                            </div>
                                        </div>
                                        <CardHeader>
                                            <div className="flex items-center justify-between pt-4">
                                                <Badge variant="secondary">{story.origin_place}</Badge>
                                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                    <Star className="h-4 w-4 fill-current text-yellow-500" />
                                                    <span>{story.rating}</span>
                                                </div>
                                            </div>
                                            <CardTitle className="text-lg transition-colors hover:text-primary">{story.title}</CardTitle>
                                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-1">
                                                    <Clock className="h-4 w-4" />
                                                    <span>{story.read_time} menit</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Eye className="h-4 w-4" />
                                                    <span>{formatNumber(story.total_reads)}</span>
                                                </div>
                                            </div>
                                        </CardHeader>
                                    </Link>
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
                            {popularNames.slice(0, 8).map((name) => (
                                <Card key={name.id} className="p-4 transition-shadow hover:shadow-md">
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-lg font-semibold">{name.name}</h3>
                                            <Badge variant="outline" className="text-xs">
                                                {name.origin}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground">{name.meaning}</p>
                                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                                            <span>{name.category}</span>
                                            <div className="flex items-center gap-1">
                                                <Eye className="h-3 w-3" />
                                                <span>{formatNumber(name.views)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Recent Stories */}
                {/* <section className="section-padding-x bg-card/50 pt-16">
                    <div className="container max-w-screen-xl">
                        <div className="mb-8">
                            <h2 className="mb-2 text-3xl font-bold">Cerita Terbaru</h2>
                            <p className="text-muted-foreground">Kontribusi terbaru dari komunitas</p>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {recentStories.map((story) => (
                                <Card key={story.id} className="transition-shadow hover:shadow-lg">
                                    <Link href={`/cerita/${story.slug}`}>
                                        <CardContent className="p-6">
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <Badge variant="outline">{story.origin_place}</Badge>
                                                    <span className="text-xs text-muted-foreground">{story.created_at}</span>
                                                </div>
                                                <h3 className="text-lg font-semibold transition-colors hover:text-primary">{story.title}</h3>
                                                <p className="line-clamp-3 text-sm text-muted-foreground">{story.excerpt}</p>
                                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                                    <span>oleh {story.creator}</span>
                                                    {story.category && <span>{story.category}</span>}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Link>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section> */}

                {/* CTA Section */}
                <section className="section-padding-x bg-primary py-20 text-primary-foreground">
                    <div className="container max-w-screen-xl text-center">
                        <div className="mx-auto max-w-2xl space-y-6">
                            <h2 className="text-3xl font-bold lg:text-4xl dark:text-gray-50">Mulai Perjalanan Budayamu</h2>
                            <p className="text-xl opacity-90 dark:text-gray-200">
                                Bergabunglah dengan {formatNumber(stats.total_users)} orang yang telah menemukan kembali kekayaan budaya Indonesia
                            </p>
                            <div className="flex flex-col justify-center gap-4 sm:flex-row">
                                <Button size="lg" variant="secondary" asChild>
                                    <Link href="/register">Daftar Gratis</Link>
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="border-primary-foreground bg-transparent text-primary-foreground hover:bg-primary-foreground hover:text-primary dark:text-gray-50 dark:hover:bg-gray-50 dark:hover:text-primary dark:border-gray-50"
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
