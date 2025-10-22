import { Metadata } from 'next';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  title: 'Chinese Word Guides - Complete Learning Resources | ChineseMaster',
  description: 'Browse our comprehensive collection of Chinese word guides. Each guide includes detailed explanations, examples, cultural insights, and pronunciation tips.',
  keywords: ['Chinese vocabulary', 'HSK words', 'Chinese learning', 'Mandarin words', 'Chinese characters']
};

// 获取所有已发布的落地页
async function getLandingPages() {
  try {
    const res = await fetch(`${API_BASE}/api/landing-pages?limit=100`, {
      next: { revalidate: 3600 } // ISR: 1小时
    });
    
    if (!res.ok) {
      return { pages: [], total: 0 };
    }
    
    const data = await res.json();
    return { 
      pages: data.pages || [], 
      total: data.pagination?.total || 0 
    };
  } catch (error) {
    console.error('Failed to fetch landing pages:', error);
    return { pages: [], total: 0 };
  }
}

export default async function WordsListPage() {
  const { pages, total } = await getLandingPages();

  // 按HSK等级分组
  const pagesByLevel: Record<number, any[]> = {};
  pages.forEach((page: any) => {
    const level = page.hskLevel || 1;
    if (!pagesByLevel[level]) {
      pagesByLevel[level] = [];
    }
    pagesByLevel[level].push(page);
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero 区 */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <h1 className="text-5xl font-bold mb-4">
            📚 Chinese Word Guides
          </h1>
          <p className="text-2xl mb-6 text-blue-100">
            Complete learning resources with 850+ words of detailed explanations
          </p>
          <div className="flex gap-8 text-lg">
            <div>
              <span className="text-4xl font-bold">{total}</span>
              <span className="ml-2 text-blue-100">Complete Guides</span>
            </div>
            <div>
              <span className="text-4xl font-bold">{Object.keys(pagesByLevel).length}</span>
              <span className="ml-2 text-blue-100">HSK Levels</span>
            </div>
          </div>
        </div>
      </section>

      {/* 主内容区 */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        
        {pages.length === 0 ? (
          // 空状态
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📖</div>
            <h2 className="text-2xl font-bold text-gray-700 mb-2">
              No word guides available yet
            </h2>
            <p className="text-gray-600">
              Check back soon! We're constantly adding new comprehensive word guides.
            </p>
          </div>
        ) : (
          // 按HSK等级显示
          <div className="space-y-12">
            {[1, 2, 3, 4, 5, 6].map(level => {
              const levelPages = pagesByLevel[level] || [];
              if (levelPages.length === 0) return null;

              return (
                <section key={level}>
                  <div className="flex items-center gap-4 mb-6">
                    <Badge className="text-xl px-4 py-2 bg-blue-600">
                      HSK {level}
                    </Badge>
                    <h2 className="text-3xl font-bold text-gray-900">
                      {levelPages.length} {levelPages.length === 1 ? 'Guide' : 'Guides'}
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {levelPages.map((page: any) => (
                      <Link 
                        key={page.slug} 
                        href={`/word/${page.slug}`}
                        className="block hover:scale-105 transition-transform"
                      >
                        <Card className="h-full hover:shadow-lg transition-shadow">
                          <CardContent className="p-6">
                            <div className="text-5xl font-bold text-gray-900 mb-2">
                              {page.word}
                            </div>
                            <div className="flex items-center gap-2 mb-4">
                              <Badge variant="secondary">HSK {page.hskLevel}</Badge>
                              <span className="text-sm text-gray-500">
                                Updated {new Date(page.updatedAt).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="text-blue-600 hover:text-blue-700 font-medium">
                              View Complete Guide →
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}

        {/* 底部CTA */}
        {pages.length > 0 && (
          <div className="mt-16 bg-gradient-to-r from-purple-100 to-blue-100 rounded-2xl p-10 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to start learning?
            </h2>
            <p className="text-xl text-gray-700 mb-6">
              Sign up to save words, track your progress, and get personalized review reminders.
            </p>
            <div className="flex gap-4 justify-center">
              <Link 
                href="/auth/signup"
                className="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
              >
                Sign Up Free
              </Link>
              <Link 
                href="/dashboard"
                className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold border-2 border-purple-600 hover:bg-purple-50 transition"
              >
                Explore Dashboard
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}




