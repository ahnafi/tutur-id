'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Layout from '@/layouts/layout';
import { Head, router } from '@inertiajs/react';
import { Crown, Medal, Star, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';

interface LeaderboardUser {
    id: number;
    name: string;
    score: number;
    storiesRead: number;
    quizzesTaken: number;
    rank: number;
    badge: string;
    weeklyGain: number;
}

interface CurrentUser {
    rank: number;
    score: number;
    badge: string;
    storiesRead: number;
    quizzesTaken: number;
    weeklyGain: number;
}

interface WeeklyProgress {
    current: number;
    target: number;
    completed: boolean;
}

interface Props {
    leaderboard: LeaderboardUser[];
    currentUser: CurrentUser | null;
    timeFilter: string;
    badgeDescriptions: Record<string, string>;
    weeklyProgress: WeeklyProgress | null;
}

export default function LeaderboardPage({ leaderboard, currentUser, timeFilter: initialTimeFilter, badgeDescriptions, weeklyProgress }: Props) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [timeFilter, setTimeFilter] = useState<'weekly' | 'monthly' | 'alltime'>(initialTimeFilter as any);

    useEffect(() => {
        if (timeFilter !== initialTimeFilter) {
            router.get(
                route('leaderboard.index'),
                { timeFilter },
                {
                    preserveState: true,
                    preserveScroll: true,
                },
            );
        }
    }, [timeFilter]);

    const getRankIcon = (rank: number) => {
        switch (rank) {
            case 1:
                return <Crown className="h-6 w-6 text-yellow-500" />;
            case 2:
                return <Medal className="h-6 w-6 text-gray-400" />;
            case 3:
                return <Medal className="h-6 w-6 text-amber-600" />;
            default:
                return (
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-sm font-bold text-amber-800">{rank}</div>
                );
        }
    };

    const getBadgeColor = (badge: string) => {
        const colors = {
            'Penjelajah Cerita': 'bg-blue-100 text-blue-800',
            'Kolektor Nama': 'bg-green-100 text-green-800',
            'Ahli Budaya': 'bg-purple-100 text-purple-800',
            'Pencinta Tradisi': 'bg-red-100 text-red-800',
            'Penjaga Warisan': 'bg-amber-100 text-amber-800',
            'Pemula Budaya': 'bg-gray-100 text-gray-800',
        };
        return colors[badge as keyof typeof colors] || 'bg-gray-100 text-gray-800';
    };

    return (
        <Layout>
            <Head title="Papan Peringkat" />

            <div className="section-padding-x min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 py-8">
                <div className="container max-w-screen-xl">
                    {/* Header */}
                    <div className="mb-8 text-center">
                        <h1 className="mb-4 text-4xl font-bold text-balance text-amber-900 md:text-5xl">Papan Peringkat</h1>
                        <p className="mx-auto max-w-2xl text-lg text-pretty text-amber-700">
                            Lihat siapa yang paling aktif dalam menjelajahi warisan budaya Indonesia
                        </p>
                    </div>

                    {/* Time Filter */}
                    <div className="mb-8 flex justify-center">
                        <div className="flex rounded-lg border border-amber-200 bg-white p-1">
                            {[
                                { key: 'weekly', label: 'Mingguan' },
                                { key: 'monthly', label: 'Bulanan' },
                                { key: 'alltime', label: 'Sepanjang Masa' },
                            ].map((filter) => (
                                <Button
                                    key={filter.key}
                                    variant={timeFilter === filter.key ? 'default' : 'ghost'}
                                    size="sm"
                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                    onClick={() => setTimeFilter(filter.key as any)}
                                    className={
                                        timeFilter === filter.key ? 'bg-amber-600 hover:bg-amber-700' : 'hover:bg-amber-50 hover:text-amber-700'
                                    }
                                >
                                    {filter.label}
                                </Button>
                            ))}
                        </div>
                    </div>

                    <div className="grid gap-8 lg:grid-cols-4">
                        {/* Main Leaderboard */}
                        <div className="lg:col-span-3">
                            {/* Top 3 Podium */}
                            {leaderboard.length >= 3 && (
                                <div className="mb-8 grid gap-4 md:grid-cols-3">
                                    {leaderboard.slice(0, 3).map((user, index) => (
                                        <Card
                                            key={user.id}
                                            className={`border-2 ${index === 0 ? 'border-yellow-300 bg-gradient-to-br from-yellow-50 to-amber-50' : index === 1 ? 'border-gray-300 bg-gradient-to-br from-gray-50 to-slate-50' : 'border-amber-300 bg-gradient-to-br from-amber-50 to-orange-50'} ${index === 0 ? 'transform md:order-2 md:scale-105' : index === 1 ? 'md:order-1' : 'md:order-3'}`}
                                        >
                                            <CardContent className="p-6 text-center">
                                                <div className="mb-4">{getRankIcon(user.rank)}</div>
                                                <Avatar className="mx-auto mb-3 h-16 w-16">
                                                    <AvatarFallback className="bg-amber-600 text-lg font-bold text-white">
                                                        {user.name
                                                            .split(' ')
                                                            .map((n) => n[0])
                                                            .join('')}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <h3 className="mb-1 font-bold text-amber-900">{user.name}</h3>
                                                <div className="mb-2 text-2xl font-bold text-amber-800">{user.score.toLocaleString()}</div>
                                                <Badge className={getBadgeColor(user.badge)}>{user.badge}</Badge>
                                                <div className="mt-2 flex items-center justify-center gap-1 text-green-600">
                                                    <TrendingUp className="h-4 w-4" />
                                                    <span className="text-sm">+{user.weeklyGain}</span>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}

                            {/* Rest of Leaderboard */}
                            <Card className="border-amber-200">
                                <CardHeader>
                                    <CardTitle className="text-amber-900">Peringkat Lengkap</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {leaderboard.map((user) => (
                                            <div key={user.id} className="flex items-center gap-4 rounded-lg p-4 transition-colors hover:bg-amber-50">
                                                <div className="flex w-8 items-center justify-center">{getRankIcon(user.rank)}</div>
                                                <Avatar className="h-10 w-10">
                                                    <AvatarFallback className="bg-amber-600 font-bold text-white">
                                                        {user.name
                                                            .split(' ')
                                                            .map((n) => n[0])
                                                            .join('')}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1">
                                                    <h4 className="font-semibold text-amber-900">{user.name}</h4>
                                                    <div className="flex items-center gap-4 text-sm text-amber-600">
                                                        <span>{user.storiesRead} cerita</span>
                                                        <span>{user.quizzesTaken} kuis</span>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-bold text-amber-900">{user.score.toLocaleString()}</div>
                                                    <div className="flex items-center gap-1 text-sm text-green-600">
                                                        <TrendingUp className="h-3 w-3" />+{user.weeklyGain}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {leaderboard.length === 0 && (
                                            <div className="py-8 text-center text-amber-600">Belum ada data leaderboard untuk periode ini.</div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Your Rank */}
                            {currentUser && (
                                <Card className="border-amber-200">
                                    <CardHeader>
                                        <CardTitle className="text-amber-900">Peringkat Anda</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-center">
                                            <div className="mb-2 text-3xl font-bold text-amber-900">#{currentUser.rank}</div>
                                            <div className="mb-2 text-lg font-semibold text-amber-800">{currentUser.score.toLocaleString()} poin</div>
                                            <Badge className={`${getBadgeColor(currentUser.badge)} mb-3`}>{currentUser.badge}</Badge>
                                            <div className="text-sm text-amber-600">
                                                <div>{currentUser.storiesRead} cerita dibaca</div>
                                                <div>{currentUser.quizzesTaken} kuis diselesaikan</div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Achievement System */}
                            <Card className="border-amber-200">
                                <CardHeader>
                                    <CardTitle className="text-amber-900">Sistem Badge</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {Object.entries(badgeDescriptions).map(([badge, description]) => (
                                            <div key={badge} className="flex items-center gap-3">
                                                <Star className="h-5 w-5 text-yellow-500" />
                                                <div>
                                                    <div className="font-medium text-amber-900">{badge}</div>
                                                    <div className="text-xs text-amber-600">{description}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Weekly Challenge */}
                            {weeklyProgress && (
                                <Card className="border-amber-200">
                                    <CardHeader>
                                        <CardTitle className="text-amber-900">Tantangan Mingguan</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-amber-700">Baca 5 cerita</span>
                                                <span className="text-sm font-medium text-amber-900">
                                                    {weeklyProgress.current}/{weeklyProgress.target}
                                                </span>
                                            </div>
                                            <div className="h-2 w-full rounded-full bg-amber-100">
                                                <div
                                                    className="h-2 rounded-full bg-amber-600 transition-all duration-300"
                                                    style={{ width: `${(weeklyProgress.current / weeklyProgress.target) * 100}%` }}
                                                ></div>
                                            </div>
                                            <div className="text-xs text-amber-600">
                                                {weeklyProgress.completed ? (
                                                    <span className="font-medium text-green-600">✓ Tantangan selesai! +100 poin bonus</span>
                                                ) : (
                                                    'Reward: +100 poin bonus'
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
