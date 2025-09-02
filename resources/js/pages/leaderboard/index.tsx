"use client"

import { useState } from "react"
import { Trophy, Medal, Crown, Star, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

// Mock leaderboard data
const mockLeaderboard = [
  {
    id: 1,
    name: "Sari Dewi",
    score: 2450,
    storiesRead: 45,
    quizzesTaken: 38,
    rank: 1,
    badge: "Penjelajah Cerita",
    weeklyGain: 150,
  },
  {
    id: 2,
    name: "Budi Santoso",
    score: 2380,
    storiesRead: 42,
    quizzesTaken: 35,
    rank: 2,
    badge: "Kolektor Nama",
    weeklyGain: 120,
  },
  {
    id: 3,
    name: "Maya Kusuma",
    score: 2250,
    storiesRead: 38,
    quizzesTaken: 32,
    rank: 3,
    badge: "Ahli Budaya",
    weeklyGain: 95,
  },
  {
    id: 4,
    name: "Andi Pratama",
    score: 2100,
    storiesRead: 35,
    quizzesTaken: 28,
    rank: 4,
    badge: "Pencinta Tradisi",
    weeklyGain: 80,
  },
  {
    id: 5,
    name: "Rina Sari",
    score: 1950,
    storiesRead: 32,
    quizzesTaken: 25,
    rank: 5,
    badge: "Penjaga Warisan",
    weeklyGain: 65,
  },
]

export default function LeaderboardPage() {
  const [timeFilter, setTimeFilter] = useState<"weekly" | "monthly" | "alltime">("weekly")

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-500" />
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />
      case 3:
        return <Medal className="h-6 w-6 text-amber-600" />
      default:
        return (
          <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 text-sm font-bold flex items-center justify-center">
            {rank}
          </div>
        )
    }
  }

  const getBadgeColor = (badge: string) => {
    const colors = {
      "Penjelajah Cerita": "bg-blue-100 text-blue-800",
      "Kolektor Nama": "bg-green-100 text-green-800",
      "Ahli Budaya": "bg-purple-100 text-purple-800",
      "Pencinta Tradisi": "bg-red-100 text-red-800",
      "Penjaga Warisan": "bg-amber-100 text-amber-800",
    }
    return colors[badge as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-amber-900 mb-4 text-balance">Papan Peringkat</h1>
          <p className="text-lg text-amber-700 max-w-2xl mx-auto text-pretty">
            Lihat siapa yang paling aktif dalam menjelajahi warisan budaya Indonesia
          </p>
        </div>

        {/* Time Filter */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-white rounded-lg p-1 border border-amber-200">
            {[
              { key: "weekly", label: "Mingguan" },
              { key: "monthly", label: "Bulanan" },
              { key: "alltime", label: "Sepanjang Masa" },
            ].map((filter) => (
              <Button
                key={filter.key}
                variant={timeFilter === filter.key ? "default" : "ghost"}
                size="sm"
                onClick={() => setTimeFilter(filter.key as any)}
                className={timeFilter === filter.key ? "bg-amber-600 hover:bg-amber-700" : "hover:bg-amber-50"}
              >
                {filter.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Leaderboard */}
          <div className="lg:col-span-3">
            {/* Top 3 Podium */}
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              {mockLeaderboard.slice(0, 3).map((user, index) => (
                <Card
                  key={user.id}
                  className={`border-2 ${index === 0 ? "border-yellow-300 bg-gradient-to-br from-yellow-50 to-amber-50" : index === 1 ? "border-gray-300 bg-gradient-to-br from-gray-50 to-slate-50" : "border-amber-300 bg-gradient-to-br from-amber-50 to-orange-50"} ${index === 0 ? "md:order-2 transform md:scale-105" : index === 1 ? "md:order-1" : "md:order-3"}`}
                >
                  <CardContent className="p-6 text-center">
                    <div className="mb-4">{getRankIcon(user.rank)}</div>
                    <Avatar className="w-16 h-16 mx-auto mb-3">
                      <AvatarFallback className="bg-amber-600 text-white text-lg font-bold">
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="font-bold text-amber-900 mb-1">{user.name}</h3>
                    <div className="text-2xl font-bold text-amber-800 mb-2">{user.score.toLocaleString()}</div>
                    <Badge className={getBadgeColor(user.badge)}>{user.badge}</Badge>
                    <div className="flex items-center justify-center gap-1 mt-2 text-green-600">
                      <TrendingUp className="h-4 w-4" />
                      <span className="text-sm">+{user.weeklyGain}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Rest of Leaderboard */}
            <Card className="border-amber-200">
              <CardHeader>
                <CardTitle className="text-amber-900">Peringkat Lengkap</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockLeaderboard.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center gap-4 p-4 rounded-lg hover:bg-amber-50 transition-colors"
                    >
                      <div className="flex items-center justify-center w-8">{getRankIcon(user.rank)}</div>
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-amber-600 text-white font-bold">
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
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
                        <div className="flex items-center gap-1 text-green-600 text-sm">
                          <TrendingUp className="h-3 w-3" />+{user.weeklyGain}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Your Rank */}
            <Card className="border-amber-200">
              <CardHeader>
                <CardTitle className="text-amber-900">Peringkat Anda</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-amber-900 mb-2">#12</div>
                  <div className="text-lg font-semibold text-amber-800 mb-2">1,650 poin</div>
                  <Badge className="bg-blue-100 text-blue-800 mb-3">Pemula Budaya</Badge>
                  <div className="text-sm text-amber-600">
                    <div>18 cerita dibaca</div>
                    <div>15 kuis diselesaikan</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Achievement System */}
            <Card className="border-amber-200">
              <CardHeader>
                <CardTitle className="text-amber-900">Sistem Badge</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Star className="h-5 w-5 text-yellow-500" />
                    <div>
                      <div className="font-medium text-amber-900">Penjelajah Cerita</div>
                      <div className="text-xs text-amber-600">Baca 40+ cerita</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Trophy className="h-5 w-5 text-amber-500" />
                    <div>
                      <div className="font-medium text-amber-900">Kolektor Nama</div>
                      <div className="text-xs text-amber-600">Simpan 25+ nama favorit</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Crown className="h-5 w-5 text-purple-500" />
                    <div>
                      <div className="font-medium text-amber-900">Ahli Budaya</div>
                      <div className="text-xs text-amber-600">Skor kuis rata-rata 90%</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Weekly Challenge */}
            <Card className="border-amber-200">
              <CardHeader>
                <CardTitle className="text-amber-900">Tantangan Mingguan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-amber-700">Baca 5 cerita</span>
                    <span className="text-sm font-medium text-amber-900">3/5</span>
                  </div>
                  <div className="w-full bg-amber-100 rounded-full h-2">
                    <div className="bg-amber-600 h-2 rounded-full" style={{ width: "60%" }}></div>
                  </div>
                  <div className="text-xs text-amber-600">Reward: +100 poin bonus</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
