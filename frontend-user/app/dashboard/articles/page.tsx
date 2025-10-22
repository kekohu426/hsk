'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { articlesApi } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { FileText, Clock, Eye, TrendingUp } from 'lucide-react';
import { useState } from 'react';

export default function ArticlesPage() {
  const [level, setLevel] = useState<string | undefined>(undefined);

  const { data, isLoading } = useQuery({
    queryKey: ['articles', level],
    queryFn: async () => {
      const response = await articlesApi.getArticles({ level });
      return response.data;
    },
  });

  const levels = [
    { value: undefined, label: 'All Levels' },
    { value: 'BEGINNER', label: 'Beginner' },
    { value: 'INTERMEDIATE', label: 'Intermediate' },
    { value: 'ADVANCED', label: 'Advanced' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Daily Articles 📰</h1>
        <p className="text-muted-foreground">
          Read authentic Chinese content with pinyin, translations, and vocabulary highlights
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {levels.map((l) => (
          <Button
            key={l.label}
            variant={level === l.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => setLevel(l.value)}
          >
            {l.label}
          </Button>
        ))}
      </div>

      {/* Articles Grid */}
      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2 mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : data && data.articles.length > 0 ? (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {data.articles.map((article: any) => (
              <Link key={article.id} href={`/dashboard/articles/${article.slug}`}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-lg line-clamp-2">
                        {article.title}
                      </CardTitle>
                      <Badge variant="secondary">{article.level}</Badge>
                    </div>
                    {article.titleEn && (
                      <CardDescription>{article.titleEn}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {article.excerpt}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {article.readTime} min
                      </div>
                      <div className="flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        {article.wordCount} words
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {article.viewCount}
                      </div>
                    </div>

                    {article.hskLevel && (
                      <Badge variant="outline" className="text-xs">
                        {article.hskLevel}
                      </Badge>
                    )}

                    {article.newWords && typeof article.newWords === 'string' && (
                      <div className="text-xs text-muted-foreground">
                        {JSON.parse(article.newWords).length} new words
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Pagination Info */}
          {data.pagination && (
            <div className="text-center text-sm text-muted-foreground">
              Showing {data.articles.length} of {data.pagination.total} articles
            </div>
          )}
        </>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No articles yet</h3>
            <p className="text-muted-foreground">
              Check back soon for new content!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}




