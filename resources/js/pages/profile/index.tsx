'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import Layout from '@/layouts/layout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    Award,
    BookOpen,
    Calendar,
    Check,
    Edit,
    Eye,
    EyeOff,
    Lock,
    MapPin,
    MessageCircle,
    Save,
    Settings,
    Star,
    Trash2,
    TrendingUp,
    Trophy,
    X,
} from 'lucide-react';
import { useState } from 'react';

interface User {
    id: number;
    name: string;
    email: string;
    avatar: string;
    joinedAt: string;
    location: string;
    bio: string;
    isVerified: boolean;
    currentBadge: string;
}

interface Stats {
    storiesContributed: number;
    commentsPosted: number;
    quizzesTaken: number;
    totalScore: number;
    averageScore: number;
    storiesRead: number;
    favoriteStories: number;
    achievements: number;
}

interface Contribution {
    id: number;
    title: string;
    slug: string;
    type: string;
    status: string;
    submittedAt: string;
    reads: number;
    rating: number | null;
    comments: number;
}

interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string;
    earned: boolean;
    earnedAt: string | null;
    progress: number;
    target: number;
}

interface Activity {
    id: string;
    type: string;
    action: string;
    target: string;
    target_link?: string;
    score?: number;
    timestamp: string;
}

interface ProfilePageProps {
    user: User;
    stats: Stats;
    contributions: Contribution[];
    achievements: Achievement[];
    recentActivity: Activity[];
    provinces: string[];
}

export default function ProfilPage({ user, stats, contributions, achievements, recentActivity, provinces }: ProfilePageProps) {
    const getIcon = (iconName: string) => {
        const icons = {
            BookOpen,
            MessageCircle,
            Trophy,
            Star,
            Award,
            TrendingUp,
            Eye,
        };
        const IconComponent = icons[iconName as keyof typeof icons] || Star;
        return IconComponent;
    };

    const [activeTab, setActiveTab] = useState('overview');
    const [isEditing, setIsEditing] = useState(false);
    const [showPasswordDialog, setShowPasswordDialog] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [deletingContribution, setDeletingContribution] = useState<Contribution | null>(null);

    // Form for profile edit
    const profileForm = useForm({
        name: user.name,
        email: user.email,
        location: user.location === 'Tidak disebutkan' ? '' : user.location,
        bio: user.bio === 'Belum ada bio.' ? '' : user.bio,
    });

    // Form for password change
    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const handleProfileSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        profileForm.put('profil', {
            onSuccess: () => {
                setIsEditing(false);
            },
        });
    };

    const handleDelete = (contribution: Contribution) => {
        router.delete(`cerita/${contribution.slug}`, {
            onSuccess: () => {
                setDeletingContribution(null);
            },
        });
    };

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        passwordForm.put('profil/password', {
            onSuccess: () => {
                setShowPasswordDialog(false);
                passwordForm.reset();
            },
        });
    };

    const cancelEdit = () => {
        setIsEditing(false);
        profileForm.setData({
            name: user.name,
            email: user.email,
            location: user.location === 'Tidak disebutkan' ? '' : user.location,
            bio: user.bio === 'Belum ada bio.' ? '' : user.bio,
        });
        profileForm.clearErrors();
    };

    return (
        <Layout>
            <Head title="Profil Saya" />

            <div className="section-padding-x py-8">
                <div className="container max-w-screen-xl">
                    {/* Profile Header */}
                    <Card className="mb-8">
                        <CardContent className="p-6">
                            <div className="flex flex-col gap-6 md:flex-row">
                                <div className="flex flex-col items-center md:items-start">
                                    <Avatar className="mb-4 h-24 w-24">
                                        <AvatarImage src={user.avatar} alt={user.name} />
                                        <AvatarFallback className="text-2xl">{user.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            setActiveTab('settings');
                                        }}
                                    >
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit Profil
                                    </Button>
                                </div>

                                <div className="flex-1 space-y-4">
                                    <div>
                                        <div className="mb-2 flex items-center gap-2">
                                            <h1 className="text-2xl font-bold">{user.name}</h1>
                                            {user.isVerified && (
                                                <Badge className="bg-blue-500">
                                                    <Award className="mr-1 h-3 w-3" />
                                                    Terverifikasi
                                                </Badge>
                                            )}
                                            <Badge variant="secondary">{user.currentBadge}</Badge>
                                        </div>
                                        <p className="mb-2 text-muted-foreground">{user.bio}</p>
                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="h-4 w-4" />
                                                <span>{user.joinedAt}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <MapPin className="h-4 w-4" />
                                                <span>{user.location}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-primary">{stats.storiesContributed}</div>
                                            <div className="text-sm text-muted-foreground">Cerita</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-primary">{stats.commentsPosted}</div>
                                            <div className="text-sm text-muted-foreground">Komentar</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-primary">{stats.quizzesTaken}</div>
                                            <div className="text-sm text-muted-foreground">Kuis</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-primary">{stats.achievements}</div>
                                            <div className="text-sm text-muted-foreground">Achievement</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Main Content Tabs */}
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                        <TabsList className="flex w-full justify-start overflow-auto">
                            <TabsTrigger value="overview">Ringkasan</TabsTrigger>
                            <TabsTrigger value="contributions">Kontribusi</TabsTrigger>
                            <TabsTrigger value="achievements">Achievement</TabsTrigger>
                            <TabsTrigger value="activity">Aktivitas</TabsTrigger>
                            <TabsTrigger value="settings">Pengaturan</TabsTrigger>
                        </TabsList>

                        <TabsContent value="overview">
                            <div className="grid gap-6 lg:grid-cols-3">
                                <div className="space-y-6 lg:col-span-2">
                                    {/* Quiz Performance */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <Trophy className="h-5 w-5" />
                                                Performa Kuis
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm">Skor Rata-rata</span>
                                                <span className="text-lg font-bold">{stats.averageScore}%</span>
                                            </div>
                                            <Progress value={stats.averageScore} className="h-2" />
                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <span className="text-muted-foreground">Total Skor:</span>
                                                    <span className="ml-2 font-medium">{stats.totalScore}</span>
                                                </div>
                                                <div>
                                                    <span className="text-muted-foreground">Kuis Diikuti:</span>
                                                    <span className="ml-2 font-medium">{stats.quizzesTaken}</span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Recent Contributions */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Kontribusi Terbaru</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4">
                                                {contributions.slice(0, 3).map((contribution) => (
                                                    <div key={contribution.id} className="flex items-center gap-4 rounded-lg border p-3">
                                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                                            <BookOpen className="h-5 w-5 text-primary" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <h4 className="text-sm font-medium">{contribution.title}</h4>
                                                            <p className="text-xs text-muted-foreground">{contribution.submittedAt}</p>
                                                        </div>
                                                        <Badge
                                                            variant={
                                                                contribution.status === 'published' || contribution.status === 'official'
                                                                    ? 'default'
                                                                    : 'secondary'
                                                            }
                                                            className="text-xs"
                                                        >
                                                            {contribution.status === 'official'
                                                                ? 'Resmi'
                                                                : contribution.status === 'published'
                                                                  ? 'Dipublikasikan'
                                                                  : 'Menunggu Review'}
                                                        </Badge>
                                                    </div>
                                                ))}
                                                {contributions.length === 0 && (
                                                    <p className="py-4 text-center text-muted-foreground">Belum ada kontribusi.</p>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                <div className="space-y-6">
                                    {/* Reading Stats */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <BookOpen className="h-5 w-5" />
                                                Statistik Membaca
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="flex justify-between">
                                                <span className="text-sm">Cerita Dibaca</span>
                                                <span className="font-medium">{stats.storiesRead}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm">Total Poin</span>
                                                <span className="font-medium">{stats.totalScore}</span>
                                            </div>
                                            <Separator />
                                            <div className="text-center">
                                                <div className="mb-1 text-2xl font-bold text-primary">
                                                    {Math.round((stats.storiesRead / 100) * 100)}%
                                                </div>
                                                <div className="text-xs text-muted-foreground">Progress Penjelajah</div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Latest Achievements */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <Award className="h-5 w-5" />
                                                Achievement Terbaru
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-3">
                                                {achievements
                                                    .filter((a) => a.earned)
                                                    .slice(0, 3)
                                                    .map((achievement) => {
                                                        const IconComponent = getIcon(achievement.icon);
                                                        return (
                                                            <div key={achievement.id} className="flex items-center gap-3">
                                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100">
                                                                    <IconComponent className="h-4 w-4 text-yellow-600" />
                                                                </div>
                                                                <div className="flex-1">
                                                                    <h4 className="text-sm font-medium">{achievement.title}</h4>
                                                                    <p className="text-xs text-muted-foreground">{achievement.earnedAt}</p>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                {achievements.filter((a) => a.earned).length === 0 && (
                                                    <p className="py-4 text-center text-muted-foreground">Belum ada achievement.</p>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="contributions">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Riwayat Kontribusi</CardTitle>
                                    <CardDescription>Semua cerita yang telah Anda kontribusikan ke platform</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {contributions.map((contribution) => (
                                            <div key={contribution.id} className="relative rounded-lg border p-4">
                                                <div className="mb-3 flex items-start justify-between">
                                                    <div className="space-y-1">
                                                        <h3 className="font-medium">{contribution.title}</h3>
                                                        <p className="text-sm text-muted-foreground">Dikirim {contribution.submittedAt}</p>
                                                    </div>
                                                    <Badge
                                                        variant={
                                                            contribution.status === 'published' || contribution.status === 'official'
                                                                ? 'default'
                                                                : 'secondary'
                                                        }
                                                        className={
                                                            contribution.status === 'official'
                                                                ? 'bg-blue-500'
                                                                : contribution.status === 'published'
                                                                  ? 'bg-green-500'
                                                                  : 'bg-orange-500 text-white'
                                                        }
                                                    >
                                                        {contribution.status === 'official'
                                                            ? 'Resmi'
                                                            : contribution.status === 'published'
                                                              ? 'Dipublikasikan'
                                                              : 'Menunggu Review'}
                                                    </Badge>
                                                </div>

                                                {(contribution.status === 'published' || contribution.status === 'official') && (
                                                    <div className="grid grid-cols-3 gap-4 text-sm">
                                                        <div className="flex items-center gap-1">
                                                            <Eye className="h-4 w-4 text-muted-foreground" />
                                                            <span>{contribution.reads} pembaca</span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <MessageCircle className="h-4 w-4 text-muted-foreground" />
                                                            <span>{contribution.comments} komentar</span>
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="mt-2 flex gap-2">
                                                    <Button variant="outline" size="sm" asChild>
                                                        <Link href={route('stories.show', contribution.slug)}>
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            Lihat
                                                        </Link>
                                                    </Button>
                                                    <Button variant="outline" size="sm" asChild className="hover:bg-green-600 hover:text-gray-50">
                                                        <Link href={route('stories.edit', { slug: contribution.slug })}>
                                                            <Edit className="mr-2 h-4 w-4" />
                                                            Edit
                                                        </Link>
                                                    </Button>
                                                    <Dialog>
                                                        <DialogTrigger asChild>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="text-red-600 hover:bg-red-600"
                                                            >
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                Hapus
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent>
                                                            <DialogHeader>
                                                                <DialogTitle>Hapus Cerita</DialogTitle>
                                                                <DialogDescription>
                                                                    Apakah Anda yakin ingin menghapus cerita "{contribution.title}"? Tindakan ini
                                                                    tidak dapat dibatalkan.
                                                                </DialogDescription>
                                                            </DialogHeader>
                                                            <DialogFooter>
                                                                <Button className='hover:bg-red-600' variant="outline">Batal</Button>
                                                                <Button variant="destructive" onClick={() => handleDelete(contribution)}>
                                                                    Ya, Hapus
                                                                </Button>
                                                            </DialogFooter>
                                                        </DialogContent>
                                                    </Dialog>
                                                </div>
                                            </div>
                                        ))}
                                        {contributions.length === 0 && (
                                            <div className="py-8 text-center text-muted-foreground">
                                                <BookOpen className="mx-auto mb-4 h-12 w-12 opacity-50" />
                                                <p>Belum ada kontribusi cerita.</p>
                                                <Link href={route('stories.create')}>
                                                    <Button className="mt-4">
                                                        <BookOpen className="mr-2 h-4 w-4" />
                                                        Mulai Kontribusi
                                                    </Button>
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="achievements">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Achievement & Badge</CardTitle>
                                    <CardDescription>Koleksi pencapaian Anda dalam melestarikan budaya Indonesia</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid gap-4 md:grid-cols-2">
                                        {achievements.map((achievement) => {
                                            const IconComponent = getIcon(achievement.icon);
                                            return (
                                                <div
                                                    key={achievement.id}
                                                    className={`rounded-lg border p-4 ${
                                                        achievement.earned ? 'border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50' : ''
                                                    }`}
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <div
                                                            className={`flex h-12 w-12 items-center justify-center rounded-full ${
                                                                achievement.earned
                                                                    ? 'bg-yellow-100 text-yellow-600'
                                                                    : 'bg-muted text-muted-foreground'
                                                            }`}
                                                        >
                                                            <IconComponent className="h-6 w-6" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="mb-1 flex items-center gap-2">
                                                                <h3 className="font-medium">{achievement.title}</h3>
                                                                {achievement.earned && <Badge className="bg-yellow-500 text-xs">Earned</Badge>}
                                                            </div>
                                                            <p className="mb-2 text-sm text-muted-foreground">{achievement.description}</p>
                                                            {achievement.earned ? (
                                                                <p className="text-xs text-green-600">Diraih {achievement.earnedAt}</p>
                                                            ) : (
                                                                <div className="space-y-1">
                                                                    <div className="flex justify-between text-xs">
                                                                        <span>Progress</span>
                                                                        <span>
                                                                            {achievement.progress}/{achievement.target}
                                                                        </span>
                                                                    </div>
                                                                    <Progress
                                                                        value={(achievement.progress / achievement.target) * 100}
                                                                        className="h-2"
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="activity">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Aktivitas Terbaru</CardTitle>
                                    <CardDescription>Riwayat aktivitas Anda di platform Tutur.id</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {recentActivity.map((activity) => (
                                            <div key={activity.id} className="flex items-center gap-4 border-l-2 border-primary p-3 pl-4">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                                                    {activity.type === 'comment' && <MessageCircle className="h-4 w-4 text-primary" />}
                                                    {activity.type === 'quiz' && <Trophy className="h-4 w-4 text-primary" />}
                                                    {activity.type === 'story' && <BookOpen className="h-4 w-4 text-primary" />}
                                                    {activity.type === 'read' && <Eye className="h-4 w-4 text-primary" />}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm">
                                                        <span className="font-medium">{activity.action}</span>{' '}
                                                        {activity.target_link ? (
                                                            <Link href={activity.target_link} className="text-primary hover:underline">
                                                                {activity.target}
                                                            </Link>
                                                        ) : (
                                                            <span className="text-primary">{activity.target}</span>
                                                        )}
                                                        {activity.score && (
                                                            <Badge variant="secondary" className="ml-2">
                                                                Skor: {activity.score}
                                                            </Badge>
                                                        )}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                                                </div>
                                            </div>
                                        ))}
                                        {recentActivity.length === 0 && (
                                            <div className="py-8 text-center text-muted-foreground">
                                                <TrendingUp className="mx-auto mb-4 h-12 w-12 opacity-50" />
                                                <p>Belum ada aktivitas.</p>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="settings">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Settings className="h-5 w-5" />
                                        Pengaturan Profil
                                    </CardTitle>
                                    <CardDescription>Kelola informasi dan preferensi akun Anda</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <form onSubmit={handleProfileSubmit} className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-medium">Informasi Pribadi</h3>
                                            <div className="flex gap-2">
                                                {isEditing ? (
                                                    <>
                                                        <Button className='hover:bg-red-600' type="button" variant="outline" size="sm" onClick={cancelEdit}>
                                                            <X className="mr-2 h-4 w-4" />
                                                            Batal
                                                        </Button>
                                                        <Button type="submit" size="sm" disabled={profileForm.processing}>
                                                            {profileForm.processing ? (
                                                                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                                            ) : (
                                                                <Save className="mr-2 h-4 w-4" />
                                                            )}
                                                            Simpan
                                                        </Button>
                                                    </>
                                                ) : (
                                                    <Button
                                                        className="hover:bg-blue-600 hover:text-gray-50"
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => setIsEditing(true)}
                                                    >
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        Edit Informasi
                                                    </Button>
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid gap-4">
                                            <div className="grid gap-4 md:grid-cols-2">
                                                <div className="space-y-2">
                                                    <Label htmlFor="name">Nama Lengkap</Label>
                                                    {isEditing ? (
                                                        <Input
                                                            id="name"
                                                            value={profileForm.data.name}
                                                            onChange={(e) => profileForm.setData('name', e.target.value)}
                                                            className={profileForm.errors.name ? 'border-red-500' : ''}
                                                        />
                                                    ) : (
                                                        <p className="py-2 text-sm text-muted-foreground">{user.name}</p>
                                                    )}
                                                    {profileForm.errors.name && <p className="text-sm text-red-500">{profileForm.errors.name}</p>}
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="email">Email</Label>
                                                    {isEditing ? (
                                                        <Input
                                                            id="email"
                                                            type="email"
                                                            value={profileForm.data.email}
                                                            onChange={(e) => profileForm.setData('email', e.target.value)}
                                                            className={profileForm.errors.email ? 'border-red-500' : ''}
                                                        />
                                                    ) : (
                                                        <p className="py-2 text-sm text-muted-foreground">{user.email}</p>
                                                    )}
                                                    {profileForm.errors.email && <p className="text-sm text-red-500">{profileForm.errors.email}</p>}
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="location">Lokasi</Label>
                                                {isEditing ? (
                                                    <Select
                                                        value={profileForm.data.location}
                                                        onValueChange={(value) => profileForm.setData('location', value)}
                                                    >
                                                        <SelectTrigger className={profileForm.errors.location ? 'border-red-500' : ''}>
                                                            <SelectValue placeholder="Pilih provinsi asal" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {provinces.map((province) => (
                                                                <SelectItem key={province} value={province}>
                                                                    {province}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                ) : (
                                                    <p className="py-2 text-sm text-muted-foreground">{user.location}</p>
                                                )}
                                                {profileForm.errors.location && <p className="text-sm text-red-500">{profileForm.errors.location}</p>}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="bio">Bio</Label>
                                                {isEditing ? (
                                                    <div className="space-y-1">
                                                        <Textarea
                                                            id="bio"
                                                            value={profileForm.data.bio}
                                                            onChange={(e) => profileForm.setData('bio', e.target.value)}
                                                            className={profileForm.errors.bio ? 'border-red-500' : ''}
                                                            placeholder="Ceritakan sedikit tentang diri Anda..."
                                                            rows={3}
                                                            maxLength={500}
                                                        />
                                                        <div className="flex justify-between text-sm text-muted-foreground">
                                                            {profileForm.errors.bio && <span className="text-red-500">{profileForm.errors.bio}</span>}
                                                            <span className="ml-auto">{profileForm.data.bio.length}/500</span>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <p className="py-2 text-sm text-muted-foreground">{user.bio}</p>
                                                )}
                                            </div>
                                        </div>
                                    </form>

                                    <Separator />

                                    {/* Password Change */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="font-medium">Keamanan</h3>
                                                <p className="text-sm text-muted-foreground">Kelola password dan keamanan akun</p>
                                            </div>
                                            <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
                                                <DialogTrigger asChild>
                                                    <Button className="hover:bg-red-600 hover:text-gray-50" variant="outline" size="sm">
                                                        <Lock className="mr-2 h-4 w-4" />
                                                        Ubah Password
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>Ubah Password</DialogTitle>
                                                        <DialogDescription>Masukkan password saat ini dan password baru Anda.</DialogDescription>
                                                    </DialogHeader>
                                                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                                                        <div className="space-y-2">
                                                            <Label htmlFor="current_password">Password Saat Ini</Label>
                                                            <div className="relative">
                                                                <Input
                                                                    id="current_password"
                                                                    type={showPassword ? 'text' : 'password'}
                                                                    value={passwordForm.data.current_password}
                                                                    onChange={(e) => passwordForm.setData('current_password', e.target.value)}
                                                                    className={passwordForm.errors.current_password ? 'border-red-500' : ''}
                                                                />
                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="absolute top-0 right-0 h-full px-3 hover:bg-transparent"
                                                                    onClick={() => setShowPassword(!showPassword)}
                                                                >
                                                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                                </Button>
                                                            </div>
                                                            {passwordForm.errors.current_password && (
                                                                <p className="text-sm text-red-500">{passwordForm.errors.current_password}</p>
                                                            )}
                                                        </div>

                                                        <div className="space-y-2">
                                                            <Label htmlFor="password">Password Baru</Label>
                                                            <Input
                                                                id="password"
                                                                type="password"
                                                                value={passwordForm.data.password}
                                                                onChange={(e) => passwordForm.setData('password', e.target.value)}
                                                                className={passwordForm.errors.password ? 'border-red-500' : ''}
                                                            />
                                                            {passwordForm.errors.password && (
                                                                <p className="text-sm text-red-500">{passwordForm.errors.password}</p>
                                                            )}
                                                        </div>

                                                        <div className="space-y-2">
                                                            <Label htmlFor="password_confirmation">Konfirmasi Password Baru</Label>
                                                            <div className="relative">
                                                                <Input
                                                                    id="password_confirmation"
                                                                    type={showConfirmPassword ? 'text' : 'password'}
                                                                    value={passwordForm.data.password_confirmation}
                                                                    onChange={(e) => passwordForm.setData('password_confirmation', e.target.value)}
                                                                />
                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="absolute top-0 right-0 h-full px-3 hover:bg-transparent"
                                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                                >
                                                                    {showConfirmPassword ? (
                                                                        <EyeOff className="h-4 w-4" />
                                                                    ) : (
                                                                        <Eye className="h-4 w-4" />
                                                                    )}
                                                                </Button>
                                                            </div>
                                                        </div>

                                                        <div className="flex justify-end gap-3 pt-4">
                                                            <Button
                                                                className='hover:bg-red-600'
                                                                type="button"
                                                                variant="outline"
                                                                onClick={() => {
                                                                    setShowPasswordDialog(false);
                                                                    passwordForm.reset();
                                                                }}
                                                            >
                                                                Batal
                                                            </Button>
                                                            <Button type="submit" disabled={passwordForm.processing}>
                                                                {passwordForm.processing ? (
                                                                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                                                ) : (
                                                                    <Check className="mr-2 h-4 w-4" />
                                                                )}
                                                                Simpan Password
                                                            </Button>
                                                        </div>
                                                    </form>
                                                </DialogContent>
                                            </Dialog>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </Layout>
    );
}
