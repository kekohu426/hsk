'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, Search, BookOpen, Loader2 } from 'lucide-react';
import api from '@/lib/api';

interface Word {
  id: string;
  word: string;  // 从WordEntry.word
  slug: string;
  hskLevel: number;
  seoScore: number | null;
  publishedAt: string;
}

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function HSKLevelPage() {
  const params = useParams();
  const router = useRouter();
  const level = parseInt(params.level as string);

  const [words, setWords] = useState<Word[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('frequency');
  const [currentPage, setCurrentPage] = useState(1);

  const levelInfo = {
    1: { name: 'Beginner', color: 'text-blue-600', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' },
    2: { name: 'Elementary', color: 'text-green-600', bgColor: 'bg-green-50', borderColor: 'border-green-200' },
    3: { name: 'Intermediate', color: 'text-yellow-600', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200' },
    4: { name: 'Upper Intermediate', color: 'text-orange-600', bgColor: 'bg-orange-50', borderColor: 'border-orange-200' },
    5: { name: 'Advanced', color: 'text-red-600', bgColor: 'bg-red-50', borderColor: 'border-red-200' },
    6: { name: 'Proficiency', color: 'text-purple-600', bgColor: 'bg-purple-50', borderColor: 'border-purple-200' },
  };

  const info = levelInfo[level as keyof typeof levelInfo] || levelInfo[1];

  useEffect(() => {
    fetchWords();
  }, [level, currentPage, searchQuery, sortBy]);

  const fetchWords = async () => {
    try {
      setLoading(true);
      const response = await api.get('http://localhost:3000/api/words/published', {
        params: {
          hskLevel: level,
          page: currentPage,
          limit: 30,
        },
      });
      setWords(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Failed to fetch words:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!levelInfo[level as keyof typeof levelInfo]) {
    return (
      <div className="container mx-auto py-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Invalid HSK Level</h1>
        <p className="text-gray-600 mb-6">Please choose a level between 1 and 6.</p>
        <Button onClick={() => router.push('/dashboard/hsk-library')}>
          Back to HSK Library
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-gray-600">
        <ol className="flex items-center gap-2">
          <li>
            <Link href="/dashboard" className="hover:text-blue-600">Dashboard</Link>
          </li>
          <li>/</li>
          <li>
            <Link href="/dashboard/hsk-library" className="hover:text-blue-600">HSK Library</Link>
          </li>
          <li>/</li>
          <li className={info.color}>HSK {level}</li>
        </ol>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => router.push('/dashboard/hsk-library')}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back to HSK Library
        </Button>

        <div className={`${info.bgColor} ${info.borderColor} border-2 rounded-xl p-6 mb-6`}>
          <h1 className={`text-4xl font-bold ${info.color} mb-2`}>
            HSK {level} Vocabulary
          </h1>
          <p className="text-gray-600 mb-3">
            {info.name} Level
          </p>
          {pagination && (
            <div className="flex items-center gap-2 text-gray-700">
              <BookOpen className="w-5 h-5" />
              <span className="font-semibold">{pagination.total.toLocaleString()}</span>
              <span>words in total</span>
            </div>
          )}
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search by Chinese or pinyin..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="frequency">Most Common</SelectItem>
              <SelectItem value="alphabetical">Alphabetical</SelectItem>
              <SelectItem value="length">Word Length</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      )}

      {/* Words Grid */}
      {!loading && words.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {words.map((word) => (
              <Link key={word.id} href={`/word/${word.slug}`}>
                <Card className="hover:border-blue-500 hover:shadow-lg transition-all duration-200 cursor-pointer h-full group">
                  <CardContent className="pt-5 pb-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-3xl font-bold group-hover:text-blue-600 transition-colors">
                        {word.word}
                      </h3>
                      <Badge variant="secondary" className={`${info.color} shrink-0`}>
                        HSK {word.hskLevel}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      Click to view full details →
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-2">
              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(pagination.totalPages, 7) }, (_, i) => {
                  let pageNumber;
                  if (pagination.totalPages <= 7) {
                    pageNumber = i + 1;
                  } else if (currentPage <= 4) {
                    pageNumber = i + 1;
                  } else if (currentPage >= pagination.totalPages - 3) {
                    pageNumber = pagination.totalPages - 6 + i;
                  } else {
                    pageNumber = currentPage - 3 + i;
                  }

                  return (
                    <Button
                      key={pageNumber}
                      variant={currentPage === pageNumber ? 'default' : 'outline'}
                      onClick={() => handlePageChange(pageNumber)}
                      className="w-10 h-10"
                    >
                      {pageNumber}
                    </Button>
                  );
                })}
              </div>

              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === pagination.totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}

      {/* Empty State */}
      {!loading && words.length === 0 && (
        <div className="text-center py-20">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No words found</h3>
          <p className="text-gray-500 mb-4">
            {searchQuery
              ? `No results for "${searchQuery}". Try a different search term.`
              : 'No vocabulary available for this level yet.'}
          </p>
          {searchQuery && (
            <Button onClick={() => setSearchQuery('')}>Clear Search</Button>
          )}
        </div>
      )}

      {/* Bottom CTA */}
      {!loading && words.length > 0 && (
        <div className="mt-12 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl text-center">
          <h3 className="text-xl font-bold mb-2">Start Learning These Words</h3>
          <p className="text-gray-600 mb-4">
            Add words to your personal bank and master them with spaced repetition
          </p>
          <Button asChild>
            <Link href="/dashboard/words">
              查看我的词库
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}



