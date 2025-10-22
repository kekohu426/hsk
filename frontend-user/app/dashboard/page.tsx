'use client';

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store';
import { learnApi, userApi } from '@/lib/api';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  BookOpen,
  FileText,
  GraduationCap,
  Target,
  TrendingUp,
  Flame,
  Library,
  BarChart3,
  User,
  Clock,
  Award,
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  // Fetch learning stats
  const { data: stats, isLoading } = useQuery({
    queryKey: ['learn-stats'],
    queryFn: async () => {
      const response = await learnApi.getStats();
      return response.data;
    },
    retry: 1,
  });

  // Fetch user words
  const { data: wordsData } = useQuery({
    queryKey: ['user-words'],
    queryFn: async () => {
      const response = await userApi.getUserWords({ limit: 5 });
      return response.data;
    },
    retry: 1,
  });

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold mb-2">
          {greeting}, {user?.username}! 👋
        </h1>
        <p className="text-muted-foreground">
          Ready to continue your Chinese learning journey?
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Words"
          value={stats?.totalWords || 0}
          icon={BookOpen}
          description={`${stats?.newWords || 0} new this week`}
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Mastered"
          value={stats?.masteredWords || 0}
          icon={Award}
          description="Words you've mastered"
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="Today Reviewed"
          value={stats?.todayReviewed || 0}
          icon={Target}
          description="Great progress today!"
        />
        <StatsCard
          title="Day Streak"
          value={stats?.streakDays || 0}
          icon={Flame}
          description="Keep it up! 🔥"
          trend={{ value: 5, isPositive: true }}
        />
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary" />
              <CardTitle>Review Words</CardTitle>
            </div>
            <CardDescription>
              {stats?.nextReviewCount || 0} words ready for review
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/learn">
              <Button className="w-full" size="lg">
                Start Learning
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <CardTitle>Daily Article</CardTitle>
            </div>
            <CardDescription>
              Read today's article
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/articles">
              <Button className="w-full" size="lg" variant="outline">
                Read Now
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Library className="h-5 w-5 text-primary" />
              <CardTitle>HSK Library</CardTitle>
            </div>
            <CardDescription>
              Browse HSK 1-6 vocabulary
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/hsk-library">
              <Button className="w-full" size="lg" variant="outline">
                Explore
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              <CardTitle>Statistics</CardTitle>
            </div>
            <CardDescription>
              View your learning progress
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/stats">
              <Button className="w-full" size="lg" variant="outline">
                View Stats
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              <CardTitle>Profile</CardTitle>
            </div>
            <CardDescription>
              Manage your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/profile">
              <Button className="w-full" size="lg" variant="outline">
                Edit Profile
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Learning Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Learning Progress</CardTitle>
          <CardDescription>Your vocabulary mastery breakdown</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>New Words</span>
              <span className="font-medium">{stats?.newWords || 0}</span>
            </div>
            <Progress 
              value={((stats?.newWords || 0) / (stats?.totalWords || 1)) * 100} 
              className="h-2" 
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Learning</span>
              <span className="font-medium">{stats?.learningWords || 0}</span>
            </div>
            <Progress 
              value={((stats?.learningWords || 0) / (stats?.totalWords || 1)) * 100} 
              className="h-2 bg-yellow-100"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Mastered</span>
              <span className="font-medium">{stats?.masteredWords || 0}</span>
            </div>
            <Progress 
              value={((stats?.masteredWords || 0) / (stats?.totalWords || 1)) * 100} 
              className="h-2 bg-green-100"
            />
          </div>
        </CardContent>
      </Card>

      {/* Recent Words */}
      {wordsData && wordsData.words && wordsData.words.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recently Added Words</CardTitle>
            <CardDescription>Keep practicing these words</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {wordsData.words.slice(0, 5).map((userWord: any, index: number) => (
                <div key={userWord.id}>
                  {index > 0 && <Separator />}
                  <div className="flex items-center justify-between py-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-medium">
                          {userWord.word?.chinese}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {userWord.word?.pinyin}
                        </span>
                        <Badge variant="outline">HSK {userWord.word?.hskLevel}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {userWord.word?.englishDefinition}
                      </p>
                    </div>
                    <Badge 
                      variant={
                        userWord.status === 'MASTERED' ? 'default' :
                        userWord.status === 'LEARNING' ? 'secondary' : 'outline'
                      }
                    >
                      {userWord.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/dashboard/words">
              <Button variant="link" className="w-full mt-4">
                View All Words →
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

