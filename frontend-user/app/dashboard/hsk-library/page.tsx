'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, TrendingUp, GraduationCap } from 'lucide-react';

const levels = [
  { 
    level: 1, 
    words: 150, 
    color: 'bg-gradient-to-br from-blue-400 to-blue-600',
    description: 'Beginner - Daily conversations',
    detail: 'Basic greetings, numbers, and everyday expressions',
    icon: '📚'
  },
  { 
    level: 2, 
    words: 300, 
    color: 'bg-gradient-to-br from-green-400 to-green-600',
    description: 'Elementary - Basic topics',
    detail: 'Simple sentences, family, weather, and basic needs',
    icon: '🌱'
  },
  { 
    level: 3, 
    words: 600, 
    color: 'bg-gradient-to-br from-yellow-400 to-yellow-600',
    description: 'Intermediate - Complex topics',
    detail: 'Express opinions, describe events, and daily activities',
    icon: '🌟'
  },
  { 
    level: 4, 
    words: 1200, 
    color: 'bg-gradient-to-br from-orange-400 to-orange-600',
    description: 'Upper Intermediate',
    detail: 'Discuss abstract topics and Chinese culture',
    icon: '🔥'
  },
  { 
    level: 5, 
    words: 2500, 
    color: 'bg-gradient-to-br from-red-400 to-red-600',
    description: 'Advanced - Fluency',
    detail: 'Read newspapers, watch TV shows, and write essays',
    icon: '🚀'
  },
  { 
    level: 6, 
    words: 5000, 
    color: 'bg-gradient-to-br from-purple-400 to-purple-600',
    description: 'Proficiency - Native-like',
    detail: 'Comprehend and express yourself fluently on any topic',
    icon: '👑'
  },
];

export default function HSKLibraryPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="inline-block p-3 bg-blue-100 rounded-full mb-4">
          <BookOpen className="w-12 h-12 text-blue-600" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
          HSK Vocabulary Library
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-4">
          Comprehensive Chinese vocabulary organized by HSK levels. Each word includes detailed explanations,
          examples, and memory techniques to help you master Chinese.
        </p>
        <div className="flex justify-center gap-6 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5" />
            <span>6 HSK Levels</span>
          </div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            <span>10,000+ Words</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            <span>Progressive Learning</span>
          </div>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="text-3xl">💡</div>
              <div>
                <h3 className="font-semibold mb-1">Smart Learning</h3>
                <p className="text-sm text-gray-600">
                  Each word comes with character breakdown, example sentences, and memory tips
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="text-3xl">🎯</div>
              <div>
                <h3 className="font-semibold mb-1">Exam Ready</h3>
                <p className="text-sm text-gray-600">
                  Official HSK vocabulary list aligned with the latest exam standards
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="text-3xl">📱</div>
              <div>
                <h3 className="font-semibold mb-1">Study Anywhere</h3>
                <p className="text-sm text-gray-600">
                  Add words to your personal bank and review with spaced repetition
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Level Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {levels.map((level) => (
          <Link key={level.level} href={`/dashboard/hsk-library/level/${level.level}`}>
            <Card className="hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer border-2 hover:border-blue-400 group">
              <CardHeader className={`${level.color} text-white relative overflow-hidden`}>
                <div className="absolute top-0 right-0 text-8xl opacity-20 -mt-4 -mr-4">
                  {level.icon}
                </div>
                <div className="relative z-10">
                  <CardTitle className="text-4xl font-bold mb-1">HSK {level.level}</CardTitle>
                  <CardDescription className="text-white/90 font-medium">
                    {level.description}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex items-baseline mb-3">
                  <p className="text-5xl font-bold text-gray-800">{level.words.toLocaleString()}</p>
                  <p className="text-sm text-gray-500 ml-2">words</p>
                </div>
                
                <p className="text-sm text-gray-600 mb-4 min-h-[40px]">
                  {level.detail}
                </p>
                
                <Button 
                  className="w-full group-hover:bg-blue-600 group-hover:text-white transition-colors"
                  variant="outline"
                >
                  Browse Words
                  <BookOpen className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="mt-12 text-center p-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
        <h2 className="text-2xl font-bold mb-2">Start Your Chinese Learning Journey Today</h2>
        <p className="text-gray-600 mb-4">
          Choose your HSK level and begin mastering Chinese vocabulary systematically
        </p>
        <div className="flex justify-center gap-3">
          <Button size="lg" asChild>
            <Link href="/dashboard/hsk-library/level/1">
              Start with HSK 1
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/dashboard/learn">
              Go to Learning Center
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}



