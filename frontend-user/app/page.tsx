import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// 获取特色词汇
async function getFeaturedWords() {
  try {
    const res = await fetch(`${API_BASE}/api/landing-pages?limit=6`, {
      next: { revalidate: 3600 }
    });
    
    if (!res.ok) return [];
    
    const data = await res.json();
    return data.pages || [];
  } catch (error) {
    console.error('Failed to fetch featured words:', error);
    return [];
  }
}

export default async function HomePage() {
  const featuredWords = await getFeaturedWords();
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-950 dark:to-zinc-900">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold tracking-tight mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Master Chinese with AI
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Learn Chinese vocabulary, read authentic articles, and practice with spaced repetition system.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/register">
            <Button size="lg" className="text-lg px-8">
              Get Started Free
            </Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline" className="text-lg px-8">
              Sign In
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Why ChineseMaster?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>📚 HSK Vocabulary</CardTitle>
              <CardDescription>
                Comprehensive word bank covering HSK 1-6 with detailed examples and breakdowns
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>📰 Daily Articles</CardTitle>
              <CardDescription>
                Read authentic Chinese content with pinyin, translations, and vocabulary highlights
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>🧠 Spaced Repetition</CardTitle>
              <CardDescription>
                Smart review system that helps you remember words at the perfect time
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>✍️ Text Analyzer</CardTitle>
              <CardDescription>
                Paste any Chinese text to get instant word analysis and translations
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>📖 My Word Bank</CardTitle>
              <CardDescription>
                Build your personal vocabulary collection and track your progress
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>🎯 Learning Center</CardTitle>
              <CardDescription>
                Practice mode with flashcards, quizzes, and progress tracking
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Featured Word Guides Section */}
      {featuredWords.length > 0 && (
        <section className="container mx-auto px-4 py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">🎯 Featured Word Guides</h2>
              <p className="text-muted-foreground text-lg">
                Comprehensive 850+ word guides with examples, cultural insights, and usage tips
              </p>
            </div>
            <Link href="/words">
              <Button variant="outline" size="lg">
                View All Guides →
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredWords.map((word: any) => (
              <Link 
                key={word.slug} 
                href={`/word/${word.slug}`}
                className="block"
              >
                <Card className="h-full hover:shadow-xl hover:scale-105 transition-all border-2 hover:border-blue-400">
                  <CardHeader>
                    <div className="text-6xl font-bold text-gray-900 mb-3 text-center">
                      {word.word}
                    </div>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Badge className="bg-blue-600">HSK {word.hskLevel}</Badge>
                      <Badge variant="secondary">Complete Guide</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-blue-600 hover:text-blue-700 font-semibold text-lg">
                        Read Complete Guide →
                      </div>
                      <div className="text-xs text-gray-500 mt-2">
                        850+ words • Examples • Cultural Insights
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* 底部链接 */}
          <div className="text-center mt-8">
            <p className="text-muted-foreground mb-4">
              Looking for a specific word? Browse our complete collection
            </p>
            <Link href="/words">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                Browse All {featuredWords.length}+ Word Guides
              </Button>
            </Link>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <Card className="max-w-2xl mx-auto bg-gradient-to-r from-blue-600 to-purple-600 border-none text-white">
          <CardHeader>
            <CardTitle className="text-3xl">Ready to start learning?</CardTitle>
            <CardDescription className="text-white/90 text-lg">
              Join thousands of learners mastering Chinese every day
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/register">
              <Button size="lg" variant="secondary" className="text-lg px-8">
                Create Free Account
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2025 ChineseMaster. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
