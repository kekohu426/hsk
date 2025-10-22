import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft,
  Target,
  TrendingUp,
  Clock,
  BookOpen,
  CheckCircle,
  Star,
  BarChart3,
  Activity
} from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';

interface UserDetails {
  user: {
    id: string;
    username: string;
    email: string;
    avatar: string | null;
    role: string;
    createdAt: string;
    lastLoginAt: string;
    streakDays: number;
  };
  stats: {
    totalWords: number;
    byStatus: {
      NEW: number;
      LEARNING: number;
      MASTERED: number;
    };
    byHSK: {
      [key: number]: number;
    };
    accuracy: number;
    streakDays: number;
    totalSessions: number;
  };
  learningCurve: Array<{
    date: string;
    wordsAdded: number;
    reviewsDone: number;
    timeSpent: number;
  }>;
  recentSessions: Array<{
    id: string;
    startTime: string;
    endTime: string | null;
    wordsReviewed: number;
    correctAnswers: number;
  }>;
  recentWords: Array<{
    word: string;
    status: string;
    addedAt: string;
  }>;
}

interface UserWord {
  id: string;
  status: 'NEW' | 'LEARNING' | 'MASTERED';
  isFavorite: boolean;
  repetitions: number;
  correctCount: number;
  wrongCount: number;
  addedAt: string;
  wordEntry: {
    id: string;
    word: string;
    hskLevel: number;
  };
}

export function UserLearningDetails() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [details, setDetails] = useState<UserDetails | null>(null);
  const [userWords, setUserWords] = useState<UserWord[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'vocabulary'>('overview');
  const [vocabFilter, setVocabFilter] = useState<'ALL' | 'NEW' | 'LEARNING' | 'MASTERED' | 'FAVORITE'>('ALL');

  useEffect(() => {
    if (userId) {
      fetchUserDetails();
      fetchUserVocabulary();
    }
  }, [userId]);

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/admin/users/${userId}/learning-details`);
      setDetails(response.data);
    } catch (error) {
      console.error('Failed to fetch user details:', error);
      toast.error('加载用户详情失败');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserVocabulary = async () => {
    try {
      const response = await api.get(`/api/admin/users/${userId}`);
      setUserWords(response.data.user.userWords || []);
    } catch (error) {
      console.error('Failed to fetch user vocabulary:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getAccuracyForWord = (word: UserWord) => {
    const total = word.correctCount + word.wrongCount;
    if (total === 0) return 0;
    return Math.round((word.correctCount * 100) / total);
  };

  const filteredVocabulary = userWords.filter(word => {
    if (vocabFilter === 'ALL') return true;
    if (vocabFilter === 'FAVORITE') return word.isFavorite;
    return word.status === vocabFilter;
  });

  if (loading || !details) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
        <div style={{ color: '#94a3b8', fontSize: '14px' }}>加载中...</div>
      </div>
    );
  }

  const { user, stats, learningCurve, recentSessions } = details;

  return (
    <div style={{ maxWidth: '1400px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <button
          onClick={() => navigate('/user-learning-stats')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            background: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '6px',
            fontSize: '14px',
            color: '#64748b',
            cursor: 'pointer',
            marginBottom: '16px',
            transition: 'all 0.2s'
          }}
        >
          <ArrowLeft style={{ width: '16px', height: '16px' }} />
          返回用户列表
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
          <div style={{ 
            width: '60px', 
            height: '60px', 
            borderRadius: '50%', 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            fontSize: '24px',
            fontWeight: '700',
            color: 'white'
          }}>
            {user.username[0].toUpperCase()}
          </div>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#0f172a', marginBottom: '4px' }}>
              {user.username}
            </h1>
            <p style={{ fontSize: '14px', color: '#64748b' }}>
              {user.email} • 注册于 {formatDate(user.createdAt)}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '16px', 
        marginBottom: '32px' 
      }}>
        <div style={{ padding: '20px', background: 'white', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '10px', background: '#eff6ff', borderRadius: '8px' }}>
              <BookOpen style={{ width: '20px', height: '20px', color: '#2563eb' }} />
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#0f172a' }}>
                {stats.totalWords}
              </div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>总词汇量</div>
            </div>
          </div>
        </div>

        <div style={{ padding: '20px', background: 'white', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '10px', background: '#f0fdf4', borderRadius: '8px' }}>
              <CheckCircle style={{ width: '20px', height: '20px', color: '#16a34a' }} />
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#0f172a' }}>
                {stats.byStatus.MASTERED}
              </div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>已掌握</div>
            </div>
          </div>
        </div>

        <div style={{ padding: '20px', background: 'white', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '10px', background: '#fff7ed', borderRadius: '8px' }}>
              <Target style={{ width: '20px', height: '20px', color: '#ea580c' }} />
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#0f172a' }}>
                {stats.accuracy}%
              </div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>准确率</div>
            </div>
          </div>
        </div>

        <div style={{ padding: '20px', background: 'white', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '10px', background: '#fef3c7', borderRadius: '8px' }}>
              <Activity style={{ width: '20px', height: '20px', color: '#f59e0b' }} />
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#0f172a' }}>
                {stats.streakDays}
              </div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>连续天数</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: '2px solid #e5e7eb' }}>
        <button
          onClick={() => setActiveTab('overview')}
          style={{
            padding: '12px 24px',
            background: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'overview' ? '2px solid #2563eb' : '2px solid transparent',
            color: activeTab === 'overview' ? '#2563eb' : '#64748b',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            marginBottom: '-2px',
            transition: 'all 0.2s'
          }}
        >
          学习概览
        </button>
        <button
          onClick={() => setActiveTab('vocabulary')}
          style={{
            padding: '12px 24px',
            background: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'vocabulary' ? '2px solid #2563eb' : '2px solid transparent',
            color: activeTab === 'vocabulary' ? '#2563eb' : '#64748b',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            marginBottom: '-2px',
            transition: 'all 0.2s'
          }}
        >
          词库详情 ({stats.totalWords})
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gap: '24px' }}>
          {/* HSK Distribution */}
          <div style={{ background: 'white', borderRadius: '8px', border: '1px solid #e5e7eb', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <BarChart3 style={{ width: '20px', height: '20px', color: '#2563eb' }} />
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#0f172a' }}>HSK级别分布</h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '12px' }}>
              {[1, 2, 3, 4, 5, 6].map(level => (
                <div key={level} style={{ textAlign: 'center' }}>
                  <div style={{ 
                    height: '120px', 
                    background: '#f1f5f9', 
                    borderRadius: '8px',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: `${stats.totalWords > 0 ? (stats.byHSK[level] || 0) / stats.totalWords * 100 : 0}%`,
                      background: `hsl(${(level - 1) * 60}, 70%, 50%)`,
                      transition: 'height 0.3s'
                    }} />
                    <div style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      fontSize: '20px',
                      fontWeight: '700',
                      color: '#0f172a',
                      zIndex: 1
                    }}>
                      {stats.byHSK[level] || 0}
                    </div>
                  </div>
                  <div style={{ marginTop: '8px', fontSize: '12px', fontWeight: '600', color: '#64748b' }}>
                    HSK {level}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Learning Curve */}
          <div style={{ background: 'white', borderRadius: '8px', border: '1px solid #e5e7eb', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <TrendingUp style={{ width: '20px', height: '20px', color: '#2563eb' }} />
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#0f172a' }}>30天学习曲线</h3>
            </div>
            <div style={{ height: '200px', display: 'flex', alignItems: 'flex-end', gap: '4px' }}>
              {learningCurve.map((day, index) => {
                const maxActivity = Math.max(...learningCurve.map(d => d.wordsAdded + d.reviewsDone));
                const height = maxActivity > 0 ? ((day.wordsAdded + day.reviewsDone) / maxActivity * 100) : 0;
                
                return (
                  <div
                    key={index}
                    style={{
                      flex: 1,
                      height: `${height}%`,
                      minHeight: height > 0 ? '4px' : '2px',
                      background: height > 0 ? '#2563eb' : '#f1f5f9',
                      borderRadius: '2px',
                      position: 'relative',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    title={`${day.date}: ${day.wordsAdded}新词, ${day.reviewsDone}复习`}
                  />
                );
              })}
            </div>
            <div style={{ marginTop: '12px', fontSize: '12px', color: '#94a3b8', textAlign: 'center' }}>
              最近30天活动记录
            </div>
          </div>

          {/* Recent Sessions */}
          <div style={{ background: 'white', borderRadius: '8px', border: '1px solid #e5e7eb', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Clock style={{ width: '20px', height: '20px', color: '#2563eb' }} />
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#0f172a' }}>最近学习记录</h3>
            </div>
            <div style={{ display: 'grid', gap: '8px' }}>
              {recentSessions.slice(0, 5).map(session => (
                <div 
                  key={session.id}
                  style={{
                    padding: '12px',
                    background: '#f8fafc',
                    borderRadius: '6px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '14px', color: '#0f172a', fontWeight: '500' }}>
                      {formatDate(session.startTime)}
                    </div>
                    <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                      复习 {session.wordsReviewed} 个词汇
                    </div>
                  </div>
                  <div style={{
                    padding: '4px 12px',
                    background: session.correctAnswers >= session.wordsReviewed * 0.8 ? '#dcfce7' : '#fef3c7',
                    color: session.correctAnswers >= session.wordsReviewed * 0.8 ? '#166534' : '#92400e',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    {session.wordsReviewed > 0 
                      ? Math.round((session.correctAnswers / session.wordsReviewed) * 100) 
                      : 0}% 正确
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'vocabulary' && (
        <div>
          {/* Vocabulary Filters */}
          <div style={{ 
            display: 'flex', 
            gap: '8px', 
            marginBottom: '24px',
            overflowX: 'auto',
            paddingBottom: '8px'
          }}>
            {[
              { value: 'ALL', label: '全部', count: userWords.length },
              { value: 'NEW', label: '待学习', count: stats.byStatus.NEW },
              { value: 'LEARNING', label: '学习中', count: stats.byStatus.LEARNING },
              { value: 'MASTERED', label: '已掌握', count: stats.byStatus.MASTERED },
              { value: 'FAVORITE', label: '收藏', count: userWords.filter(w => w.isFavorite).length }
            ].map(filter => (
              <button
                key={filter.value}
                onClick={() => setVocabFilter(filter.value as any)}
                style={{
                  padding: '8px 16px',
                  background: vocabFilter === filter.value ? '#2563eb' : 'white',
                  color: vocabFilter === filter.value ? 'white' : '#64748b',
                  border: `2px solid ${vocabFilter === filter.value ? '#2563eb' : '#e5e7eb'}`,
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap'
                }}
              >
                {filter.label} ({filter.count})
              </button>
            ))}
          </div>

          {/* Vocabulary List */}
          <div style={{ background: 'white', borderRadius: '8px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e5e7eb' }}>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#64748b' }}>词汇</th>
                  <th style={{ padding: '12px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#64748b' }}>HSK</th>
                  <th style={{ padding: '12px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#64748b' }}>状态</th>
                  <th style={{ padding: '12px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#64748b' }}>复习次数</th>
                  <th style={{ padding: '12px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#64748b' }}>准确率</th>
                  <th style={{ padding: '12px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#64748b' }}>添加时间</th>
                </tr>
              </thead>
              <tbody>
                {filteredVocabulary.map((userWord, index) => (
                  <tr 
                    key={userWord.id}
                    style={{ 
                      borderBottom: index < filteredVocabulary.length - 1 ? '1px solid #f1f5f9' : 'none'
                    }}
                  >
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a' }}>
                          {userWord.wordEntry.word}
                        </span>
                        {userWord.isFavorite && (
                          <Star style={{ width: '16px', height: '16px', fill: '#fbbf24', color: '#fbbf24' }} />
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <span style={{ 
                        padding: '4px 8px',
                        background: '#f1f5f9',
                        color: '#64748b',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}>
                        HSK {userWord.wordEntry.hskLevel}
                      </span>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <span style={{
                        padding: '4px 12px',
                        background: 
                          userWord.status === 'MASTERED' ? '#dcfce7' :
                          userWord.status === 'LEARNING' ? '#fef3c7' : '#e0e7ff',
                        color:
                          userWord.status === 'MASTERED' ? '#166534' :
                          userWord.status === 'LEARNING' ? '#92400e' : '#4338ca',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}>
                        {userWord.status === 'MASTERED' ? '已掌握' : 
                         userWord.status === 'LEARNING' ? '学习中' : '待学习'}
                      </span>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center', fontSize: '14px', color: '#0f172a' }}>
                      {userWord.repetitions}
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <span style={{
                        padding: '4px 12px',
                        background: getAccuracyForWord(userWord) >= 80 ? '#dcfce7' : 
                                   getAccuracyForWord(userWord) >= 60 ? '#fef3c7' : '#fee2e2',
                        color: getAccuracyForWord(userWord) >= 80 ? '#166534' : 
                               getAccuracyForWord(userWord) >= 60 ? '#92400e' : '#991b1b',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}>
                        {getAccuracyForWord(userWord)}%
                      </span>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center', fontSize: '14px', color: '#64748b' }}>
                      {new Date(userWord.addedAt).toLocaleDateString('zh-CN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredVocabulary.length === 0 && (
              <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>
                没有找到词汇
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

