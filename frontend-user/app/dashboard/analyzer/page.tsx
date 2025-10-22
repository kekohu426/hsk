'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { textApi, userApi } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  FileText,
  Zap,
  BookPlus,
  TrendingUp,
  Loader2,
  CheckCircle2,
} from 'lucide-react';

export default function TextAnalyzerPage() {
  const [text, setText] = useState('');
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [selectedWords, setSelectedWords] = useState<Set<string>>(new Set());

  // Analyze text mutation
  const analyzeMutation = useMutation({
    mutationFn: async (textToAnalyze: string) => {
      const response = await textApi.analyzeText(textToAnalyze);
      return response.data;
    },
    onSuccess: (data) => {
      setAnalysisResult(data);
    },
  });

  // Add words to bank mutation
  const addWordsMutation = useMutation({
    mutationFn: async (wordIds: string[]) => {
      const promises = wordIds.map((id) => 
        userApi.addWordToBank(id, 'Text Analyzer')
      );
      return Promise.all(promises);
    },
  });

  const handleAnalyze = () => {
    if (text.trim()) {
      analyzeMutation.mutate(text);
      setSelectedWords(new Set());
    }
  };

  const handleSelectWord = (wordId: string) => {
    setSelectedWords((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(wordId)) {
        newSet.delete(wordId);
      } else {
        newSet.add(wordId);
      }
      return newSet;
    });
  };

  const handleAddSelected = () => {
    if (selectedWords.size > 0) {
      addWordsMutation.mutate(Array.from(selectedWords));
    }
  };

  const exampleTexts = [
    {
      title: '日常对话',
      text: '你好！我叫李明。我是学生。你呢？',
    },
    {
      title: '自我介绍',
      text: '我今年二十五岁，来自北京。我喜欢学习中文和看电影。',
    },
    {
      title: '购物',
      text: '这个多少钱？太贵了！能便宜一点吗？',
    },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Text Analyzer ✍️</h1>
        <p className="text-muted-foreground">
          Paste any Chinese text to get instant word analysis, pinyin, and vocabulary breakdown
        </p>
      </div>

      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle>Input Text</CardTitle>
          <CardDescription>
            Enter or paste Chinese text to analyze
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="在这里输入或粘贴中文文本... (Paste Chinese text here)"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-[150px] text-lg font-serif"
          />

          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {text.length} characters
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setText('')}
                disabled={!text}
              >
                Clear
              </Button>
              <Button
                onClick={handleAnalyze}
                disabled={!text.trim() || analyzeMutation.isPending}
                className="gap-2"
              >
                {analyzeMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4" />
                    Analyze
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Example Texts */}
          <div>
            <p className="text-sm font-medium mb-2">Quick Examples:</p>
            <div className="flex gap-2 flex-wrap">
              {exampleTexts.map((example, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setText(example.text)}
                >
                  {example.title}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {analysisResult && (
        <Tabs defaultValue="words" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="words">
              <BookPlus className="h-4 w-4 mr-2" />
              Words ({analysisResult.words?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="stats">
              <TrendingUp className="h-4 w-4 mr-2" />
              Statistics
            </TabsTrigger>
            <TabsTrigger value="text">
              <FileText className="h-4 w-4 mr-2" />
              Annotated Text
            </TabsTrigger>
          </TabsList>

          {/* Words Tab */}
          <TabsContent value="words" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Vocabulary Breakdown</CardTitle>
                    <CardDescription>
                      {selectedWords.size} word(s) selected
                    </CardDescription>
                  </div>
                  <Button
                    onClick={handleAddSelected}
                    disabled={selectedWords.size === 0 || addWordsMutation.isPending}
                    className="gap-2"
                  >
                    {addWordsMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <BookPlus className="h-4 w-4" />
                    )}
                    Add Selected ({selectedWords.size})
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {analysisResult.words?.map((word: any, index: number) => (
                    <div key={index}>
                      {index > 0 && <Separator className="my-3" />}
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <input
                            type="checkbox"
                            checked={selectedWords.has(word.id || `word-${index}`)}
                            onChange={() => handleSelectWord(word.id || `word-${index}`)}
                            className="mt-1"
                          />
                          <div className="space-y-1 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-2xl font-serif">
                                {word.chinese}
                              </span>
                              <span className="text-muted-foreground">
                                {word.pinyin}
                              </span>
                              {word.hskLevel && (
                                <Badge variant="outline">
                                  HSK {word.hskLevel}
                                </Badge>
                              )}
                              {word.frequency && word.frequency > 800 && (
                                <Badge variant="secondary">Common</Badge>
                              )}
                            </div>
                            <p className="text-sm">{word.meaning}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {addWordsMutation.isSuccess && (
                  <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-md flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-600 dark:text-green-400">
                      Words added to your word bank successfully!
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Statistics Tab */}
          <TabsContent value="stats">
            <Card>
              <CardHeader>
                <CardTitle>Text Statistics</CardTitle>
                <CardDescription>
                  Analysis of your text
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Characters</p>
                    <p className="text-3xl font-bold">{text.length}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Unique Words</p>
                    <p className="text-3xl font-bold">
                      {analysisResult.words?.length || 0}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">HSK 1-2</p>
                    <p className="text-3xl font-bold">
                      {analysisResult.words?.filter((w: any) => w.hskLevel <= 2)
                        .length || 0}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">HSK 3+</p>
                    <p className="text-3xl font-bold">
                      {analysisResult.words?.filter((w: any) => w.hskLevel > 2)
                        .length || 0}
                    </p>
                  </div>
                </div>

                <Separator className="my-6" />

                <div>
                  <h4 className="font-semibold mb-3">HSK Level Distribution</h4>
                  <div className="space-y-3">
                    {[1, 2, 3, 4, 5, 6].map((level) => {
                      const count =
                        analysisResult.words?.filter(
                          (w: any) => w.hskLevel === level
                        ).length || 0;
                      const percentage =
                        (count / (analysisResult.words?.length || 1)) * 100;

                      return (
                        <div key={level} className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span>HSK {level}</span>
                            <span className="text-muted-foreground">
                              {count} words ({percentage.toFixed(0)}%)
                            </span>
                          </div>
                          <div className="h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Annotated Text Tab */}
          <TabsContent value="text">
            <Card>
              <CardHeader>
                <CardTitle>Annotated Text</CardTitle>
                <CardDescription>
                  Text with pinyin and HSK levels
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl leading-relaxed font-serif">
                  {/* This would show the text with inline annotations */}
                  <p className="whitespace-pre-wrap">{text}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {/* Error State */}
      {analyzeMutation.isError && (
        <Card className="border-red-200 bg-red-50 dark:bg-red-900/20">
          <CardContent className="pt-6">
            <p className="text-red-600 dark:text-red-400">
              Failed to analyze text. Please try again.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}



