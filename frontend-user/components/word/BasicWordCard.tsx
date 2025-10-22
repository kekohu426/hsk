'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Volume2 } from 'lucide-react';

interface ExampleSentence {
  cn: string;
  pinyin: string;
  en: string;
  usageNote?: string;
}

interface Word {
  chinese: string;
  pinyin: string;
  pinyinNumeric?: string;
  englishDefinition: string;
  hskLevel: number;
  exampleSentences?: ExampleSentence[];
  keywords?: string[];
  relatedWords?: {
    synonyms?: { chinese: string; pinyin: string; meaning: string }[];
    antonyms?: { chinese: string; pinyin: string; meaning: string }[];
  };
}

interface BasicWordCardProps {
  word: Word;
}

export function BasicWordCard({ word }: BasicWordCardProps) {
  const playAudio = () => {
    // 使用浏览器的TTS功能
    const utterance = new SpeechSynthesisUtterance(word.chinese);
    utterance.lang = 'zh-CN';
    utterance.rate = 0.8;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="space-y-6">
      {/* 大字展示 */}
      <div className="text-center bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-12 border-2 border-blue-200">
        <div className="flex items-center justify-center gap-4 mb-4">
          <h1 className="text-9xl font-bold text-gray-900">{word.chinese}</h1>
          <Button
            variant="ghost"
            size="lg"
            onClick={playAudio}
            className="hover:bg-blue-100"
          >
            <Volume2 className="w-8 h-8 text-blue-600" />
          </Button>
        </div>
        <p className="text-5xl text-gray-600 mt-6 mb-4 font-light">{word.pinyin}</p>
        {word.pinyinNumeric && (
          <p className="text-2xl text-gray-500 mb-4">{word.pinyinNumeric}</p>
        )}
        <Badge className="text-lg px-4 py-1 bg-blue-600">HSK {word.hskLevel}</Badge>
      </div>

      {/* 定义 */}
      <Card>
        <CardContent className="p-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">📖 Definition</h2>
          <p className="text-3xl leading-relaxed text-gray-900">{word.englishDefinition}</p>
        </CardContent>
      </Card>

      {/* 关键词标签 */}
      {word.keywords && word.keywords.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-700">🏷️ Keywords</h3>
            <div className="flex flex-wrap gap-2">
              {word.keywords.map((keyword, i) => (
                <Badge key={i} variant="secondary" className="text-sm">
                  {keyword}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 例句 */}
      {word.exampleSentences && word.exampleSentences.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">💬 Example Sentences</h2>
          {word.exampleSentences.map((ex, i) => (
            <Card key={i} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <Badge className="mt-1 bg-purple-600">{i + 1}</Badge>
                  <div className="flex-1">
                    <p className="text-2xl mb-2 text-gray-900">{ex.cn}</p>
                    <p className="text-lg text-gray-600 mb-2">{ex.pinyin}</p>
                    <p className="text-lg text-gray-700 border-l-4 border-blue-400 pl-4">
                      {ex.en}
                    </p>
                    {ex.usageNote && (
                      <div className="mt-3 p-3 bg-yellow-50 rounded border-l-4 border-yellow-400">
                        <p className="text-sm text-gray-700">
                          <span className="font-semibold">💡 Note: </span>
                          {ex.usageNote}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* 相关词汇 */}
      {word.relatedWords && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {word.relatedWords.synonyms && word.relatedWords.synonyms.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                  🔄 Synonyms
                </h3>
                <div className="space-y-3">
                  {word.relatedWords.synonyms.map((syn, i) => (
                    <div key={i} className="p-3 bg-green-50 rounded-lg">
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-medium text-gray-900">
                          {syn.chinese}
                        </span>
                        <span className="text-sm text-gray-600">{syn.pinyin}</span>
                      </div>
                      <p className="text-sm text-gray-700 mt-1">{syn.meaning}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {word.relatedWords.antonyms && word.relatedWords.antonyms.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                  ↔️ Antonyms
                </h3>
                <div className="space-y-3">
                  {word.relatedWords.antonyms.map((ant, i) => (
                    <div key={i} className="p-3 bg-red-50 rounded-lg">
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-medium text-gray-900">
                          {ant.chinese}
                        </span>
                        <span className="text-sm text-gray-600">{ant.pinyin}</span>
                      </div>
                      <p className="text-sm text-gray-700 mt-1">{ant.meaning}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}




