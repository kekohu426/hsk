'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Clock,
  Eye,
  Plus,
  Volume2,
  Loader2,
} from 'lucide-react';

import { articlesApi, userApi, api } from '@/lib/api';
import { toast } from 'sonner';
import { ArticleParagraph } from '@/components/article/PinyinText';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';

export default function ArticleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [showPinyin, setShowPinyin] = useState(true);
  const [showTranslation, setShowTranslation] = useState(true);
  const [quizMode, setQuizMode] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});

  // Fetch article
  const { data, isLoading } = useQuery({
    queryKey: ['article', slug],
    queryFn: async () => {
      const response = await articlesApi.getArticleBySlug(slug);
      return response.data;
    },
  });

  const article = data?.article;

  // Add word to bank mutation
  const addWordMutation = useMutation({
    mutationFn: async (wordId: string) => {
      return userApi.addWordToBank(wordId, 'Article');
    },
    onSuccess: () => {
      toast.success('词汇已加入学习');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || '加入失败');
    }
  });

  const handleAddWord = async (word: any) => {
    try {
      let wordId = word.wordId;
      
      // 如果没有 wordId，通过词汇查找
      if (!wordId) {
        const response = await api.get(`/words?search=${encodeURIComponent(word.word)}&limit=1`);
        const foundWord = response.data.words?.[0];
        
        if (foundWord) {
          wordId = foundWord.id;
        } else {
          toast.error(`词汇"${word.word}"未找到，请先在管理端生成`);
          return;
        }
      }
      
      addWordMutation.mutate(wordId);
    } catch (error) {
      console.error('Error finding word:', error);
      toast.error('查找词汇失败');
    }
  };

  const handleQuizAnswer = (questionIndex: number, answerIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: answerIndex,
    }));
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (!article) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <h3 className="text-lg font-semibold mb-2">Article not found</h3>
          <Link href="/dashboard/articles">
            <Button variant="link">← Back to articles</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  const content = typeof article.content === 'string' 
    ? JSON.parse(article.content) 
    : article.content;
  
  const newWords = typeof article.newWords === 'string'
    ? JSON.parse(article.newWords)
    : article.newWords;

  const quiz = article.quiz && typeof article.quiz === 'string'
    ? JSON.parse(article.quiz)
    : article.quiz;

  const structuredData = article
    ? {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: article.title,
        inLanguage: 'zh-CN',
        datePublished: article.publishedAt ?? article.createdAt,
        dateModified: article.updatedAt ?? article.createdAt,
        wordCount: article.wordCount,
        timeRequired: article.readTime ? `PT${article.readTime}M` : undefined,
        keywords: newWords?.map((item: any) => item.word).filter(Boolean) ?? [],
        educationalLevel: article.hskLevel ?? article.level,
        url:
          typeof window !== 'undefined' ? window.location.href : undefined,
      }
    : null;

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-6 lg:px-0">
      {/* Back Button */}
      <div className="grid gap-8 lg:grid-cols-[minmax(0,2.1fr)_minmax(280px,1fr)]">
        <article
          className="space-y-6"
          itemScope
          itemType="https://schema.org/Article"
        >
          <div className="flex items-center justify-between">
            <Link href="/dashboard/articles">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to articles
              </Button>
            </Link>
          </div>

          <header className="space-y-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold leading-tight" itemProp="headline">
                  {article.title}
                </h1>
                {article.titleEn && (
                  <p className="text-lg text-muted-foreground" itemProp="alternativeHeadline">
                    {article.titleEn}
                  </p>
                )}
              </div>
              <Badge variant="secondary" className="self-start text-base px-4 py-2">
                {article.level}
              </Badge>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-muted-foreground">
              <div className="flex items-center gap-1" itemProp="timeRequired">
                <Clock className="h-4 w-4" />
                {article.readTime} min read
              </div>
              <div className="flex items-center gap-1">
                <BookOpen className="h-4 w-4" />
                {article.wordCount} words
              </div>
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {article.viewCount} views
              </div>
              {article.hskLevel && (
                <Badge variant="outline">HSK {article.hskLevel}</Badge>
              )}
            </div>
          </header>

          <Separator />

          {/* Reading Controls */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="pinyin"
                    checked={showPinyin}
                    onCheckedChange={setShowPinyin}
                  />
                  <Label htmlFor="pinyin">Show Pinyin</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="translation"
                    checked={showTranslation}
                    onCheckedChange={setShowTranslation}
                  />
                  <Label htmlFor="translation">Show Translation</Label>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => {
                    if ('speechSynthesis' in window) {
                      window.speechSynthesis.cancel();
                      const paragraphs = content.map((p: any) => p.cn);
                      const fullText = paragraphs.join('。 ');
                      const utterance = new SpeechSynthesisUtterance(fullText);
                      utterance.lang = 'zh-CN';
                      utterance.rate = 0.85;
                      utterance.pitch = 1.0;
                      window.speechSynthesis.speak(utterance);
                    } else {
                      alert('您的浏览器不支持语音功能');
                    }
                  }}
                >
                  <Volume2 className="h-4 w-4" />
                  播放朗读
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Article Content */}
          <section className="rounded-lg border bg-card" itemProp="articleBody">
            <div className="px-6 py-8 space-y-6">
              {content.map((paragraph: any, index: number) => (
                <ArticleParagraph
                  key={index}
                  content={paragraph}
                  showPinyin={showPinyin}
                  showTranslation={showTranslation}
                />
              ))}
            </div>
          </section>

          {/* Navigation */}
          <nav className="flex justify-between pt-4" aria-label="Article navigation">
            <Link href="/dashboard/articles">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                All Articles
              </Button>
            </Link>
            <Button>
              Next Article
              <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
            </Button>
          </nav>

          {structuredData && (
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />
          )}
        </article>

        <aside className="space-y-6 lg:sticky lg:top-24" aria-label="Learning resources">
          {/* New Words */}
          {newWords && newWords.length > 0 && (
            <Card as="section" aria-labelledby="new-vocabulary">
              <CardHeader>
                <CardTitle id="new-vocabulary" className="text-xl">
                  重点词汇 ({newWords.length})
                </CardTitle>
                <CardDescription>
                  High-impact vocabulary for this reading
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {newWords.map((word: any, index: number) => (
                    <div key={index} className="flex items-start justify-between gap-3 rounded-lg border p-3">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-lg font-semibold">{word.word}</h3>
                          <span className="text-sm text-muted-foreground">
                            {word.pinyin}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            HSK {word.hsk}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {word.meaning}
                        </p>
                        {word.example && (
                          <p className="text-sm italic text-muted-foreground">
                            {word.example}
                          </p>
                        )}
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAddWord(word)}
                        disabled={addWordMutation.isPending}
                      >
                        {addWordMutation.isPending ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                            加入中
                          </>
                        ) : (
                          <>
                            <Plus className="h-4 w-4 mr-1" />
                            加入
                          </>
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quiz Section */}
          {quiz && quiz.length > 0 && (
            <Card as="section" aria-labelledby="reading-quiz">
              <CardHeader>
                <CardTitle id="reading-quiz" className="text-xl">
                  阅读理解测验
                </CardTitle>
                <CardDescription>
                  Assess comprehension & reinforce keyword usage
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {quiz.map((q: any, qIndex: number) => (
                  <div key={qIndex} className="space-y-3">
                    <h3 className="text-base font-medium">
                      {qIndex + 1}. {q.question}
                    </h3>
                    <div className="space-y-2">
                      {q.options.map((option: string, oIndex: number) => {
                        const isSelected = selectedAnswers[qIndex] === oIndex;
                        const isCorrect = q.answer === oIndex;
                        const showResult = selectedAnswers[qIndex] !== undefined;

                        return (
                          <Button
                            key={oIndex}
                            variant={
                              showResult
                                ? isCorrect
                                  ? 'default'
                                  : isSelected
                                  ? 'destructive'
                                  : 'outline'
                                : isSelected
                                ? 'secondary'
                                : 'outline'
                            }
                            className="w-full justify-start"
                            onClick={() => handleQuizAnswer(qIndex, oIndex)}
                          >
                            {String.fromCharCode(65 + oIndex)}. {option}
                            {showResult && isCorrect && (
                              <CheckCircle2 className="ml-auto h-4 w-4" />
                            )}
                          </Button>
                        );
                      })}
                    </div>
                    {selectedAnswers[qIndex] !== undefined && q.explanation && (
                      <p className="text-sm text-muted-foreground italic">
                        💡 {q.explanation}
                      </p>
                    )}
                  </div>
                ))}

                {Object.keys(selectedAnswers).length === quiz.length && (
                  <div className="pt-4 border-t">
                    <p className="text-center font-medium">
                      Score:{' '}
                      {
                        quiz.filter(
                          (q: any, i: number) => selectedAnswers[i] === q.answer
                        ).length
                      }{' '}
                      / {quiz.length}
                    </p>
                    <Progress
                      value={
                        (quiz.filter(
                          (q: any, i: number) => selectedAnswers[i] === q.answer
                        ).length /
                          quiz.length) *
                        100
                      }
                      className="mt-2"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </aside>
      </div>
    </main>
  );
}
