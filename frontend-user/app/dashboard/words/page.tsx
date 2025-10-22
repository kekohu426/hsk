'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { userApi } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  BookOpen,
  Search,
  Star,
  Trash2,
  Filter,
  TrendingUp,
  Calendar,
  Target,
  Play,
  CheckCircle,
  Clock,
} from 'lucide-react';
import { getIntervalText } from '@/lib/srs';

export default function MyWordsPage() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [hskFilter, setHskFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('NEW');

  // Fetch user words
  const { data: wordsData, isLoading, error } = useQuery({
    queryKey: ['my-words'],
    queryFn: async () => {
      const response = await userApi.getUserWords({ limit: 100 });
      return response.data;
    },
  });

  // Debug: log data
  console.log('Words data:', wordsData);
  console.log('Is loading:', isLoading);
  console.log('Error:', error);

  // Handle error state
  if (error) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h3 className="text-lg font-semibold mb-2">无法加载词库</h3>
            <p className="text-muted-foreground mb-4">
              {error instanceof Error ? error.message : '请检查网络连接或重新登录'}
            </p>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => window.location.href = '/login'}>
                重新登录
              </Button>
              <Button variant="outline" onClick={() => window.location.reload()}>
                刷新页面
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Delete word mutation
  const deleteWordMutation = useMutation({
    mutationFn: async (wordId: string) => {
      return userApi.deleteWord(wordId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-words'] });
      queryClient.invalidateQueries({ queryKey: ['learn-stats'] });
    },
  });

  const words = wordsData?.words || [];

  // Show loading state at the top if still loading
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Word Bank 📚</h1>
          <p className="text-muted-foreground">
            Loading your vocabulary collection...
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-3">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardContent className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-muted-foreground">加载词库中...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Filter words
  const filteredWords = words.filter((userWord: any) => {
    const word = userWord.wordEntry;
    if (!word) return false;

    // Parse contentJson to get pinyin and english definition
    let pinyin = '';
    let englishDefinition = '';
    try {
      const content = JSON.parse(word.contentJson || '{}');
      pinyin = content.pinyin || '';
      englishDefinition = content.english || '';
    } catch (e) {
      // If parsing fails, use empty strings
    }

    const matchesSearch =
      word.word?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pinyin?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      englishDefinition?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesHSK =
      hskFilter === 'all' || word.hskLevel === parseInt(hskFilter);

    return matchesSearch && matchesHSK;
  });

  // Group by status
  const grouped = {
    NEW: filteredWords.filter((w: any) => w.status === 'NEW'),
    LEARNING: filteredWords.filter((w: any) => w.status === 'LEARNING'),
    MASTERED: filteredWords.filter((w: any) => w.status === 'MASTERED'),
    FAVORITE: filteredWords.filter((w: any) => w.isFavorite),
  };

  // Word card component
  const WordCard = ({ userWord }: { userWord: any }) => {
    // Parse contentJson to get pinyin and english definition
    let pinyin = '';
    let englishDefinition = '';
    try {
      const content = JSON.parse(userWord.wordEntry?.contentJson || '{}');
      pinyin = content.pinyin || '';
      englishDefinition = content.english || '';
    } catch (e) {
      // If parsing fails, use empty strings
    }

    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl font-serif font-bold">
                  {userWord.wordEntry?.word}
                </span>
                <Badge variant="outline" className="text-xs">
                  HSK {userWord.wordEntry?.hskLevel}
                </Badge>
                {userWord.isFavorite && (
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                )}
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                {pinyin}
              </p>
              <p className="text-sm mb-3">
                {englishDefinition}
              </p>
            </div>
          </div>

        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            Next: {getIntervalText(userWord.interval)}
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            {userWord.repetitions} reviews
          </div>
          <div className="flex items-center gap-1">
            <Target className="h-3 w-3" />
            {userWord.correctCount}/
            {userWord.correctCount + userWord.wrongCount} correct
          </div>
        </div>

        {userWord.notes && (
          <p className="text-sm italic text-muted-foreground mb-3">
            📝 {userWord.notes}
          </p>
        )}

        <div className="flex gap-2">
          <Link href={`/word/${userWord.wordEntry?.slug}`}>
            <Button size="sm" className="flex-1">
              <Play className="h-4 w-4 mr-1" />
              Learn
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => deleteWordMutation.mutate(userWord.id)}
            disabled={deleteWordMutation.isPending}
          >
            <Trash2 className="h-4 w-4 text-red-600" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">My Word Bank 📚</h1>
        <p className="text-muted-foreground">
          Manage your personal vocabulary collection
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Words
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{words.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              To Learn
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {grouped.NEW.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Learning
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">
              {grouped.LEARNING.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Mastered
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {grouped.MASTERED.length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search vocabulary..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={hskFilter} onValueChange={setHskFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All Levels" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="1">HSK 1</SelectItem>
            <SelectItem value="2">HSK 2</SelectItem>
            <SelectItem value="3">HSK 3</SelectItem>
            <SelectItem value="4">HSK 4</SelectItem>
            <SelectItem value="5">HSK 5</SelectItem>
            <SelectItem value="6">HSK 6</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="NEW">
            To Learn ({grouped.NEW.length})
          </TabsTrigger>
          <TabsTrigger value="LEARNING">
            Learning ({grouped.LEARNING.length})
          </TabsTrigger>
          <TabsTrigger value="MASTERED">
            Mastered ({grouped.MASTERED.length})
          </TabsTrigger>
          <TabsTrigger value="FAVORITE">
            ⭐ Favorites ({grouped.FAVORITE.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="NEW" className="space-y-4">
          {grouped.NEW.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No vocabulary to learn for now</h3>
                <p className="text-muted-foreground mb-4">
                  Start learning by adding vocabulary from articles, HSK library, or text analysis
                </p>
                <div className="flex gap-3 justify-center">
                  <Button asChild>
                    <Link href="/dashboard/hsk-library">Browse HSK Library</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/dashboard/analyzer">Analyze Text</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {grouped.NEW.map((userWord: any) => (
                <WordCard key={userWord.id} userWord={userWord} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="LEARNING" className="space-y-4">
          {grouped.LEARNING.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No words in learning</h3>
                <p className="text-muted-foreground">
                  Words you're currently learning will appear here
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {grouped.LEARNING.map((userWord: any) => (
                <WordCard key={userWord.id} userWord={userWord} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="MASTERED" className="space-y-4">
          {grouped.MASTERED.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No mastered words yet</h3>
                <p className="text-muted-foreground">
                  Words you've mastered will appear here
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {grouped.MASTERED.map((userWord: any) => (
                <WordCard key={userWord.id} userWord={userWord} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="FAVORITE" className="space-y-4">
          {grouped.FAVORITE.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4 fill-yellow-200" />
                <h3 className="text-lg font-semibold mb-2">No favorite words yet</h3>
                <p className="text-muted-foreground">
                  Mark words as favorites to see them here
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {grouped.FAVORITE.map((userWord: any) => (
                <WordCard key={userWord.id} userWord={userWord} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}