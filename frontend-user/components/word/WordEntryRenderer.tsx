'use client';

import { Volume2, Star, Share2, BookOpen, Link as LinkIcon, InfoIcon, AlertTriangle, FileText, MessageCircle, Globe } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface WordEntryRendererProps {
  content: any; // WordEntry的content JSON
  word: string;
  slug: string;
}

export function WordEntryRenderer({ content, word, slug }: WordEntryRendererProps) {
  if (!content) {
    return (
      <Card className="shadow-lg">
        <CardContent className="text-center py-16">
          <div className="max-w-md mx-auto">
            <div className="text-6xl mb-6">📝</div>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">词条内容正在准备中</h2>
            <p className="text-gray-600 mb-6">
              这个词条 <span className="font-bold text-blue-600">"{word}"</span> 的详细内容还在生成中。
            </p>
            <p className="text-sm text-gray-500 mb-6">
              我们的团队正在使用 AI 技术为每个词条生成丰富的学习内容，包括例句、搭配、文化背景等。请稍后再来查看！
            </p>
            <div className="flex gap-3 justify-center">
              <Button 
                onClick={() => window.history.back()}
                variant="outline"
              >
                返回词库
              </Button>
              <Button 
                onClick={() => window.location.href = '/dashboard'}
                className="bg-blue-600 hover:bg-blue-700"
              >
                去学习中心
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const handlePlayAudio = () => {
    if (content.audioUrl) {
      const audio = new Audio(content.audioUrl);
      audio.play();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 md:p-10 text-white mb-10 shadow-xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-bold mb-3 drop-shadow-lg">{content.word || word}</h1>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Badge className="bg-white/20 text-white px-4 py-2 text-lg backdrop-blur-sm">
                {content.pinyin}
                <span className="text-sm ml-2 opacity-80">({content.pinyinWithTones})</span>
              </Badge>
              <Badge className="bg-white/20 text-white px-4 py-2 text-lg backdrop-blur-sm">
                {content.english?.split('(')[0].trim()}
              </Badge>
              <Badge className="bg-white/20 text-white px-4 py-2 text-lg backdrop-blur-sm">
                {content.level}
              </Badge>
              <Badge className="bg-white/20 text-white px-4 py-2 text-lg backdrop-blur-sm">
                {content.partOfSpeech?.cn} ({content.partOfSpeech?.en})
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-yellow-300 text-xl">
                {content.testFrequency?.cn?.includes('★') 
                  ? content.testFrequency.cn.match(/★+/)?.[0]
                  : '★★★★'
                }
              </div>
              <span className="text-white/90">
                {content.testFrequency?.cn?.replace(/★/g, '').trim() || 'HSK高频词汇'}
              </span>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={handlePlayAudio}
              className="bg-white text-blue-600 hover:bg-white/90 rounded-full p-4 shadow-lg"
              size="icon"
            >
              <Volume2 className="w-6 h-6" />
            </Button>
            <Button
              className="bg-white/20 hover:bg-white/30 text-white rounded-full p-4 shadow-lg backdrop-blur-sm"
              size="icon"
            >
              <Star className="w-6 h-6" />
            </Button>
            <Button
              className="bg-white/20 hover:bg-white/30 text-white rounded-full p-4 shadow-lg backdrop-blur-sm"
              size="icon"
            >
              <Share2 className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Core Definition */}
          <Card className="shadow-md hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <BookOpen className="w-6 h-6 text-blue-600" />
                核心含义
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">中文解释</h3>
                <p className="text-gray-700 leading-relaxed">{content.definition?.cn}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">English Definition</h3>
                <p className="text-gray-700 leading-relaxed">{content.definition?.en}</p>
              </div>
            </CardContent>
          </Card>

          {/* Collocations */}
          {content.collocations && content.collocations.length > 0 && (
            <Card className="shadow-md hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <LinkIcon className="w-6 h-6 text-blue-600" />
                  常见搭配
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {content.collocations.map((collocation: any, index: number) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
                      <p className="text-xl font-medium mb-1">{collocation.cn}</p>
                      <p className="text-gray-600 mb-2 text-sm">{collocation.pinyin}</p>
                      <p className="text-gray-700">{collocation.en}</p>
                      {collocation.scene && (
                        <p className="text-xs text-gray-500 mt-2 italic">场景：{collocation.scene}</p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Detailed Explanation and Confusion Points */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Detailed Explanation */}
            <Card className="shadow-md hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <InfoIcon className="w-5 h-5 text-blue-600" />
                  详细说明
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-gray-700 leading-relaxed text-sm">{content.detailedExplanation?.cn}</p>
                <p className="text-gray-600 leading-relaxed text-sm italic">{content.detailedExplanation?.en}</p>
              </CardContent>
            </Card>

            {/* Confusion Points */}
            {content.confusionPoints && (
              <Card className="shadow-md hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                    易错点
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded">
                    <p className="text-red-700 font-medium text-sm mb-1">❌ 错误</p>
                    <p className="text-gray-700 text-sm">{content.confusionPoints.cnWrong}</p>
                  </div>
                  <div className="p-3 bg-green-50 border-l-4 border-green-500 rounded">
                    <p className="text-green-700 font-medium text-sm mb-1">✅ 正确</p>
                    <p className="text-gray-700 text-sm">{content.confusionPoints.cnCorrect}</p>
                  </div>
                  <p className="text-gray-600 text-xs leading-relaxed">
                    {content.confusionPoints.enExplanation}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Example Sentences */}
          {content.examples && content.examples.length > 0 && (
            <Card className="shadow-md hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <FileText className="w-6 h-6 text-blue-600" />
                  真题例句
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {content.examples.map((example: any, index: number) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                    <p className="text-lg font-medium text-gray-900 mb-1">{example.cn}</p>
                    <p className="text-gray-600 mb-1 text-sm">{example.pinyin}</p>
                    <p className="text-gray-700 mb-2 italic">{example.en}</p>
                    {example.source && (
                      <p className="text-xs text-gray-500">来源：{example.source}</p>
                    )}
                    {example.tip && (
                      <div className="mt-2 p-2 bg-yellow-50 rounded text-xs text-gray-700">
                        💡 {example.tip}
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Practice Questions */}
          {content.practiceQuestions && content.practiceQuestions.length > 0 && (
            <Card className="shadow-md hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <MessageCircle className="w-6 h-6 text-blue-600" />
                  练习题
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {content.practiceQuestions.map((question: any, qIndex: number) => (
                  <div key={qIndex} className="space-y-3">
                    <p className="font-medium text-gray-900">{question.question?.cn}</p>
                    <p className="text-gray-600 text-sm italic mb-3">{question.question?.en}</p>
                    <div className="space-y-2">
                      {question.options?.map((option: any, oIndex: number) => (
                        <div
                          key={oIndex}
                          className={`p-3 rounded border-2 ${
                            option.isCorrect
                              ? 'bg-green-50 border-green-500'
                              : 'bg-gray-50 border-gray-200'
                          }`}
                        >
                          <p className="font-medium text-sm">
                            {option.label}. {option.cn}
                          </p>
                          {option.isCorrect && (
                            <p className="text-xs text-green-700 mt-1">
                              ✅ {option.explain}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Cultural Tips */}
          {content.culturalTips && (
            <Card className="shadow-md hover:shadow-xl transition-shadow duration-300 bg-gradient-to-r from-purple-50 to-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Globe className="w-6 h-6 text-purple-600" />
                  文化背景
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-gray-700 leading-relaxed">{content.culturalTips.cn}</p>
                <p className="text-gray-600 leading-relaxed italic text-sm">{content.culturalTips.en}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Related Words and CTA */}
        <div className="lg:col-span-1 space-y-6">
          {/* Related Words */}
          {content.relatedWords && content.relatedWords.length > 0 && (
            <Card className="shadow-md sticky top-4">
              <CardHeader>
                <CardTitle className="text-xl">相关词汇</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {content.relatedWords.map((related: any, index: number) => (
                  <a
                    key={index}
                    href={related.url || `#`}
                    className="block p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors border border-gray-200 hover:border-blue-300"
                  >
                    <p className="font-medium text-gray-900">{related.cn}</p>
                    <p className="text-sm text-gray-600">{related.en}</p>
                    {related.relation && (
                      <p className="text-xs text-gray-500 mt-1">{related.relation}</p>
                    )}
                  </a>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Study Tips */}
          <Card className="shadow-md bg-gradient-to-br from-yellow-50 to-orange-50">
            <CardHeader>
              <CardTitle className="text-xl">学习建议</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <span className="text-2xl">🎯</span>
                <div>
                  <p className="font-medium mb-1">高频词汇</p>
                  <p className="text-gray-600">此词在HSK考试中经常出现，务必熟练掌握</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-2xl">📝</span>
                <div>
                  <p className="font-medium mb-1">多练习</p>
                  <p className="text-gray-600">完成上方的练习题，巩固理解</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-2xl">🔊</span>
                <div>
                  <p className="font-medium mb-1">听力训练</p>
                  <p className="text-gray-600">多听标准发音，提高听力水平</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

