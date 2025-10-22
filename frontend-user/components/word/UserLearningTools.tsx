'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Volume2, Share2, BookmarkPlus, BookmarkCheck, ExternalLink, Star, CheckCircle2, BookOpen, Trash2, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/lib/store';
import { userApi } from '@/lib/api';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface UserProgress {
  id: string;
  status: 'NEW' | 'LEARNING' | 'MASTERED';
  isFavorite: boolean;
  repetitions: number;
  easeFactor: number;
  interval: number;
  nextReviewDate: string;
  correctCount: number;
  wrongCount: number;
  notes?: string;
  addedAt: string;
  wordEntryId: string;
}

interface UserLearningToolsProps {
  word: {
    id: string;
    chinese: string;
    slug: string;
  };
  userProgress: UserProgress | null;
  onUpdate: () => void;
}

export function UserLearningTools({ word, userProgress, onUpdate }: UserLearningToolsProps) {
  const queryClient = useQueryClient();
  const { token } = useAuthStore();

  // Local state for UI feedback
  const [currentStatus, setCurrentStatus] = useState(userProgress?.status || 'NONE');
  const [isFavorite, setIsFavorite] = useState(userProgress?.isFavorite || false);

  // Mutations for updating user word status
  const addWordMutation = useMutation({
    mutationFn: async (status: 'NEW' | 'LEARNING' | 'MASTERED') => {
      return userApi.addWordToBank(word.id, 'WordDetail', status);
    },
    onSuccess: (data) => {
      setCurrentStatus(data.userWord.status);
      setIsFavorite(data.userWord.isFavorite);
      toast.success(`"${word.chinese}" 已加入词库`);
      queryClient.invalidateQueries({ queryKey: ['my-words'] });
      queryClient.invalidateQueries({ queryKey: ['learn-stats'] });
      onUpdate();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || '加入失败');
    },
  });

  const updateWordMutation = useMutation({
    mutationFn: async (data: { status?: 'NEW' | 'LEARNING' | 'MASTERED'; isFavorite?: boolean }) => {
      if (!userProgress?.id) throw new Error('UserWord ID is missing');
      return userApi.updateWordStatus(userProgress.id, data);
    },
    onSuccess: (data) => {
      setCurrentStatus(data.userWord.status);
      setIsFavorite(data.userWord.isFavorite);
      toast.success(`"${word.chinese}" 状态已更新`);
      queryClient.invalidateQueries({ queryKey: ['my-words'] });
      queryClient.invalidateQueries({ queryKey: ['learn-stats'] });
      onUpdate();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || '更新失败');
    },
  });

  const deleteWordMutation = useMutation({
    mutationFn: async () => {
      if (!userProgress?.id) throw new Error('UserWord ID is missing');
      return userApi.deleteWord(userProgress.id);
    },
    onSuccess: () => {
      setCurrentStatus('NONE');
      setIsFavorite(false);
      toast.success(`"${word.chinese}" 已从词库移除`);
      queryClient.invalidateQueries({ queryKey: ['my-words'] });
      queryClient.invalidateQueries({ queryKey: ['learn-stats'] });
      onUpdate();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || '移除失败');
    },
  });

  const handleAction = (action: 'add' | 'master' | 'learn' | 'favorite' | 'remove') => {
    if (!token) {
      toast.error('请先登录');
      return;
    }

    if (action === 'add') {
      addWordMutation.mutate('NEW'); // Default to NEW when adding
    } else if (action === 'master') {
      updateWordMutation.mutate({ status: 'MASTERED' });
    } else if (action === 'learn') {
      updateWordMutation.mutate({ status: 'LEARNING' });
    } else if (action === 'favorite') {
      updateWordMutation.mutate({ isFavorite: !isFavorite });
    } else if (action === 'remove') {
      deleteWordMutation.mutate();
    }
  };

  const isLoading = addWordMutation.isPending || updateWordMutation.isPending || deleteWordMutation.isPending;

  const getNextReviewDate = () => {
    if (!userProgress?.nextReviewDate) return null;
    const date = new Date(userProgress.nextReviewDate);
    const now = new Date();

    if (date < now) {
      return <span className="text-orange-600 font-medium">今日待复习!</span>;
    }

    return (
      <span className="text-gray-600">
        下次复习: {date.toLocaleDateString()}
      </span>
    );
  };

  return (
    <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between flex-wrap gap-4">
        {/* 左侧：状态按钮 */}
        <div className="flex items-center gap-2 flex-wrap">
          {currentStatus === 'NONE' ? (
            <Button
              onClick={() => handleAction('add')}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <BookmarkPlus className="w-4 h-4 mr-2" />}
              加入学习
            </Button>
          ) : (
            <>
              <Button
                onClick={() => handleAction('master')}
                disabled={isLoading || currentStatus === 'MASTERED'}
                variant={currentStatus === 'MASTERED' ? 'secondary' : 'outline'}
                className={currentStatus === 'MASTERED' ? 'bg-green-100 text-green-700 border-green-300' : ''}
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                已掌握
              </Button>
              <Button
                onClick={() => handleAction('learn')}
                disabled={isLoading || currentStatus === 'LEARNING'}
                variant={currentStatus === 'LEARNING' ? 'secondary' : 'outline'}
                className={currentStatus === 'LEARNING' ? 'bg-yellow-100 text-yellow-700 border-yellow-300' : ''}
              >
                <BookOpen className="w-4 h-4 mr-2" />
                学习中
              </Button>
              <Button
                onClick={() => handleAction('favorite')}
                disabled={isLoading}
                variant={isFavorite ? 'secondary' : 'outline'}
                className={isFavorite ? 'bg-yellow-100 text-yellow-700 border-yellow-300' : ''}
              >
                <Star className={`w-4 h-4 mr-2 ${isFavorite ? 'fill-yellow-500 text-yellow-500' : ''}`} />
                收藏
              </Button>
              <Button
                onClick={() => handleAction('remove')}
                disabled={isLoading}
                variant="destructive"
                size="sm"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                移除
              </Button>
            </>
          )}
        </div>

        {/* 学习进度 */}
        {userProgress && currentStatus !== 'NONE' && (
          <div className="flex items-center gap-3 text-sm text-gray-700">
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              状态: {currentStatus === 'NEW' ? '待学习' : currentStatus === 'LEARNING' ? '学习中' : '已掌握'}
            </Badge>
            <span className="flex items-center gap-1">
              📊 {userProgress.repetitions} 次复习
            </span>
            <span className="flex items-center gap-1">
              ✅ {userProgress.correctCount} 正确
            </span>
            {getNextReviewDate()}
          </div>
        )}

        {/* 右侧：其他工具 */}
        <div className="flex gap-2 mt-4 md:mt-0">
          <Button variant="ghost" size="sm" onClick={() => {
            const url = `${window.location.origin}/word/${word.slug}`;
            navigator.clipboard.writeText(url);
            toast.success('链接已复制');
          }}>
            <Share2 className="w-4 h-4 mr-2" />
            分享
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.open(`/dashboard/learn`, '_blank')}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            练习模式
          </Button>
        </div>
      </div>
    </div>
  );
}
