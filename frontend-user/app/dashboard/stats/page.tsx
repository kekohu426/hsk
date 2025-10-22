'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Clock, 
  Target, 
  Award, 
  Calendar,
  Flame,
  BookOpen,
  BarChart3,
  Loader2
} from 'lucide-react';
import api from '@/lib/api';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { format, subDays, startOfDay, eachDayOfInterval } from 'date-fns';

interface Stats {
  totalWords: number;
  masteredWords: number;
  learningWords: number;
  newWords: number;
  streakDays: number;
  totalStudyTime: number;
  totalReviews: number;
  averageAccuracy: number;
  hskDistribution: { level: number; count: number }[];
  recentActivity: Array<{
    date: string;
    reviewCount: number;
    newWords: number;
    accuracy: number;
    timeSpent: number;
  }>;
  sessions: Array<{
    id: string;
    date: string;
    wordsReviewed: number;
    timeSpent: number;
    accuracy: number;
  }>;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function StatsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/user/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  // Generate heatmap data for the last 90 days
  const generateHeatmapData = () => {
    if (!stats) return [];
    
    const today = startOfDay(new Date());
    const days = eachDayOfInterval({
      start: subDays(today, 89),
      end: today,
    });

    return days.map(day => {
      const dateStr = format(day, 'yyyy-MM-dd');
      const activity = stats.recentActivity?.find(a => a.date === dateStr);
      return {
        date: dateStr,
        count: activity?.reviewCount || 0,
        displayDate: format(day, 'MMM dd'),
      };
    });
  };

  const heatmapData = generateHeatmapData();

  // Calculate week data for heatmap display
  const weekData = [];
  for (let i = 0; i < heatmapData.length; i += 7) {
    weekData.push(heatmapData.slice(i, i + 7));
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <p className="text-gray-600">Failed to load statistics</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Learning Statistics</h1>
        <p className="text-gray-600">
          Track your progress and celebrate your achievements
        </p>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Words</p>
                <p className="text-3xl font-bold">{stats.totalWords}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Mastered</p>
                <p className="text-3xl font-bold">{stats.masteredWords}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Award className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Study Streak</p>
                <p className="text-3xl font-bold">{stats.streakDays}</p>
                <p className="text-xs text-gray-500">days</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <Flame className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Avg Accuracy</p>
                <p className="text-3xl font-bold">{stats.averageAccuracy}%</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Study Heatmap */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                90-Day Study Activity
              </CardTitle>
              <CardDescription>
                Your learning consistency over the past 3 months
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <div className="inline-grid gap-1" style={{ gridTemplateColumns: `repeat(${weekData[0]?.length || 7}, 1fr)` }}>
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
                    <div key={day} className="text-xs text-gray-500 text-center w-8 h-8 flex items-center justify-center">
                      {day[0]}
                    </div>
                  ))}
                  
                  {heatmapData.map((day, i) => {
                    let colorClass = 'bg-gray-100';
                    if (day.count > 0) colorClass = 'bg-green-200';
                    if (day.count >= 5) colorClass = 'bg-green-400';
                    if (day.count >= 10) colorClass = 'bg-green-600';
                    if (day.count >= 20) colorClass = 'bg-green-800';

                    return (
                      <div
                        key={i}
                        className={`w-8 h-8 rounded ${colorClass} hover:ring-2 hover:ring-blue-400 cursor-pointer transition-all`}
                        title={`${day.displayDate}: ${day.count} reviews`}
                      />
                    );
                  })}
                </div>
                <div className="flex items-center gap-2 mt-4 text-xs text-gray-600">
                  <span>Less</span>
                  <div className="w-4 h-4 bg-gray-100 rounded"></div>
                  <div className="w-4 h-4 bg-green-200 rounded"></div>
                  <div className="w-4 h-4 bg-green-400 rounded"></div>
                  <div className="w-4 h-4 bg-green-600 rounded"></div>
                  <div className="w-4 h-4 bg-green-800 rounded"></div>
                  <span>More</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* HSK Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>HSK Level Distribution</CardTitle>
                <CardDescription>Words by HSK level</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={stats.hskDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ level, count }) => `HSK${level}: ${count}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {stats.hskDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Word Status */}
            <Card>
              <CardHeader>
                <CardTitle>Word Mastery Progress</CardTitle>
                <CardDescription>Your learning status breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Mastered</span>
                      <span className="text-sm text-gray-600">{stats.masteredWords}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-green-500 h-3 rounded-full transition-all"
                        style={{ width: `${(stats.masteredWords / stats.totalWords) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Learning</span>
                      <span className="text-sm text-gray-600">{stats.learningWords}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-yellow-500 h-3 rounded-full transition-all"
                        style={{ width: `${(stats.learningWords / stats.totalWords) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">New</span>
                      <span className="text-sm text-gray-600">{stats.newWords}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-blue-500 h-3 rounded-full transition-all"
                        style={{ width: `${(stats.newWords / stats.totalWords) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold">Overall Progress</span>
                      <Badge variant="secondary" className="text-base">
                        {Math.round((stats.masteredWords / stats.totalWords) * 100)}%
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity" className="space-y-6">
          {/* 7-Day Activity Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Last 7 Days Activity
              </CardTitle>
              <CardDescription>Daily review counts and accuracy</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.recentActivity?.slice(-7) || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tickFormatter={(value) => format(new Date(value), 'MMM dd')} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="reviewCount" fill="#3b82f6" name="Reviews" />
                  <Bar dataKey="newWords" fill="#10b981" name="New Words" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Accuracy Trend */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Accuracy Trend
              </CardTitle>
              <CardDescription>Your performance over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={stats.recentActivity?.slice(-14) || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tickFormatter={(value) => format(new Date(value), 'MM/dd')} />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="accuracy" 
                    stroke="#8b5cf6" 
                    strokeWidth={2}
                    name="Accuracy (%)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Recent Study Sessions
              </CardTitle>
              <CardDescription>Your learning history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.sessions && stats.sessions.length > 0 ? (
                  stats.sessions.slice(0, 10).map((session) => (
                    <div
                      key={session.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span className="font-medium">
                            {format(new Date(session.date), 'PPP')}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <BookOpen className="w-3 h-3" />
                            {session.wordsReviewed} words
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {session.timeSpent} min
                          </span>
                        </div>
                      </div>
                      <Badge
                        variant={session.accuracy >= 80 ? 'default' : 'secondary'}
                        className="text-base"
                      >
                        {session.accuracy}%
                      </Badge>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No study sessions yet</p>
                    <p className="text-sm">Start learning to see your history here</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}



