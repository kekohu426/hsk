'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { WordEntryRenderer } from '@/components/word/WordEntryRenderer';
import { UserLearningTools } from '@/components/word/UserLearningTools';
import { Loader2 } from 'lucide-react';

// API基础URL
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';


// 词条详情页组件（客户端渲染）
export default function WordEntryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/api/words/published/${slug}`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!res.ok) {
          throw new Error('Word not found');
        }
        
        const response = await res.json();
        setData(response.data);
      } catch (error) {
        console.error('Failed to fetch word entry:', error);
        setError('Word not found');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchData();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Word Not Found</h1>
        <p className="text-gray-600">The word you're looking for doesn't exist.</p>
      </div>
    );
  }

  const { word, content, userProgress } = data;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 面包屑导航 */}
      <div className="container mx-auto px-4 py-3">
        <nav className="text-sm text-gray-600" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li><a href="/" className="hover:text-blue-600">Home</a></li>
            <li><span className="mx-2">/</span></li>
            <li><a href="/dashboard/hsk-library" className="hover:text-blue-600">HSK Library</a></li>
            <li><span className="mx-2">/</span></li>
            <li><a href={`/dashboard/hsk-library/level/${content?.level?.replace('HSK', '')}`} className="hover:text-blue-600">
              {content?.level || 'HSK'}
            </a></li>
            <li><span className="mx-2">/</span></li>
            <li className="text-blue-600 font-medium">{word}</li>
          </ol>
        </nav>
      </div>

      {/* 主内容 */}
      <div className="container mx-auto px-4 py-6">
        {/* 学习工具 */}
        <UserLearningTools 
          word={{
            id: data.wordEntryId || '',
            chinese: word,
            slug: slug
          }}
          userProgress={userProgress}
          onUpdate={() => {
            // 重新获取数据
            window.location.reload();
          }}
        />
        
        <WordEntryRenderer 
          content={content}
          word={word}
          slug={slug}
        />
      </div>
    </div>
  );
}
