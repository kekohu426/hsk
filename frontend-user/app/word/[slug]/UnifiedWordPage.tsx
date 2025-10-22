'use client';

import { useState } from 'react';
import { useAuthStore } from '@/lib/store';
import { UserLearningTools } from '@/components/word/UserLearningTools';
import { BasicWordCard } from '@/components/word/BasicWordCard';
import { LandingPageContent } from '@/components/word/LandingPageContent';
import { LoginPrompt } from '@/components/word/LoginPrompt';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface UnifiedWordPageProps {
  word: any;
  landingPage: any;
  userProgress: any;
  hasLandingPage: boolean;
}

export function UnifiedWordPage({ 
  word, 
  landingPage, 
  userProgress, 
  hasLandingPage 
}: UnifiedWordPageProps) {
  const { isAuthenticated } = useAuthStore();
  const [, setRefreshKey] = useState(0);

  const handleUpdate = () => {
    // 触发数据刷新
    setRefreshKey(prev => prev + 1);
    // 在实际应用中，这里应该重新获取数据
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* 顶部工具栏（仅登录用户可见）*/}
        {isAuthenticated && (
          <UserLearningTools 
            word={word}
            userProgress={userProgress}
            onUpdate={handleUpdate}
          />
        )}

        {/* 视图切换（如果有完整落地页内容）*/}
        {hasLandingPage && landingPage?.content ? (
          <Tabs defaultValue="detailed" className="w-full">
            <TabsList className="mb-6 bg-white border">
              <TabsTrigger value="simple" className="text-lg px-6">
                📝 Quick View
              </TabsTrigger>
              <TabsTrigger value="detailed" className="text-lg px-6">
                📚 Complete Guide (850+ words)
              </TabsTrigger>
            </TabsList>

            {/* 简洁视图 */}
            <TabsContent value="simple">
              <BasicWordCard word={word} />
            </TabsContent>

            {/* 完整850字SEO内容 */}
            <TabsContent value="detailed">
              <LandingPageContent content={landingPage.content} />
              
              {/* SEO Metrics */}
              {landingPage.metrics && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex gap-6 text-sm text-gray-600">
                    <span>📊 SEO Score: {landingPage.metrics.seoScore}/100</span>
                    <span>📝 {landingPage.metrics.wordCount} words</span>
                    <span>💬 {landingPage.metrics.exampleCount} examples</span>
                    <span>❓ {landingPage.metrics.faqCount} FAQs</span>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        ) : (
          // 只有简洁视图（没有落地页内容）
          <div>
            <BasicWordCard word={word} />
            
            {/* 提示：没有完整指南 */}
            <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-sm text-gray-700">
                💡 <strong>Note:</strong> The complete 850+ word guide for this word is not yet available. 
                You're viewing the basic learning card.
              </p>
            </div>
          </div>
        )}

        {/* 未登录用户：引导注册 */}
        {!isAuthenticated && (
          <LoginPrompt 
            message="Want to save this word and track your learning progress?"
            ctaText="Sign up for free"
          />
        )}

        {/* 已登录但没有添加：引导添加到词汇本 */}
        {isAuthenticated && !userProgress && (
          <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border-2 border-blue-300">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              💡 Add "{word.chinese}" to your word bank?
            </h3>
            <p className="text-gray-700 mb-4">
              Track your learning progress, get personalized review reminders, and build your vocabulary systematically.
            </p>
            <p className="text-sm text-gray-600">
              👆 Click the "Add to Word Bank" button above to get started!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}




