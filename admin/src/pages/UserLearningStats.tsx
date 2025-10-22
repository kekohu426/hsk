import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { 
  Users, 
  Search, 
  TrendingUp, 
  Clock, 
  Target,
  UserCheck,
  UserX,
  Sparkles,
  Eye
} from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';

interface UserStats {
  id: string;
  username: string;
  email: string;
  avatar: string | null;
  role: string;
  createdAt: string;
  lastActiveAt: string;
  streakDays: number;
  
  totalWords: number;
  masteredWords: number;
  learningWords: number;
  newWords: number;
  favoriteWords: number;
  
  totalReviews: number;
  totalSessions: number;
  totalLearningTime: number;
  accuracy: number;
  
  isActive: boolean;
  isNewbie: boolean;
  isAdvanced: boolean;
  daysSinceLastActive: number;
}

interface OverallStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  newbieUsers: number;
  advancedUsers: number;
  totalLearningTime: number;
  totalReviews: number;
  avgWordsPerUser: number;
  avgAccuracy: number;
}

export function UserLearningStats() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserStats[]>([]);
  const [stats, setStats] = useState<OverallStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('all');
  const [sortBy, setSortBy] = useState('lastActive');

  useEffect(() => {
    fetchStats();
  }, [selectedGroup, sortBy]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/admin/user-learning-stats', {
        params: {
          page: 1,
          limit: 100,
          sortBy,
          order: 'desc',
          group: selectedGroup
        }
      });
      setStats(response.data.stats);
      setUsers(response.data.users);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      toast.error('加载数据失败');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const groups = [
    { value: 'all', label: 'All Users', count: stats?.totalUsers || 0, icon: Users, color: '#3b82f6' },
    { value: 'active', label: 'Active (7d)', count: stats?.activeUsers || 0, icon: UserCheck, color: '#10b981' },
    { value: 'inactive', label: 'Inactive', count: stats?.inactiveUsers || 0, icon: UserX, color: '#6b7280' },
    { value: 'newbie', label: 'Newbie (30d)', count: stats?.newbieUsers || 0, icon: Sparkles, color: '#f59e0b' },
    { value: 'advanced', label: 'Advanced (100+)', count: stats?.advancedUsers || 0, icon: Target, color: '#8b5cf6' }
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
        <div style={{ color: '#94a3b8', fontSize: '14px' }}>加载中...</div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1400px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <TrendingUp style={{ width: '20px', height: '20px', color: '#2563eb' }} />
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#0f172a' }}>
            用户学习数据
          </h1>
        </div>
        <p style={{ fontSize: '14px', color: '#64748b' }}>
          查看所有用户的学习统计和进度分析
        </p>
      </div>

      {/* Overall Stats Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '16px', 
        marginBottom: '24px' 
      }}>
        <div style={{ 
          padding: '20px', 
          background: 'white', 
          borderRadius: '8px', 
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '10px', background: '#eff6ff', borderRadius: '8px' }}>
              <Clock style={{ width: '20px', height: '20px', color: '#2563eb' }} />
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#0f172a' }}>
                {formatTime(stats?.totalLearningTime || 0)}
              </div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>总学习时长</div>
            </div>
          </div>
        </div>

        <div style={{ 
          padding: '20px', 
          background: 'white', 
          borderRadius: '8px', 
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '10px', background: '#f0fdf4', borderRadius: '8px' }}>
              <TrendingUp style={{ width: '20px', height: '20px', color: '#16a34a' }} />
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#0f172a' }}>
                {stats?.totalReviews.toLocaleString() || 0}
              </div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>总复习次数</div>
            </div>
          </div>
        </div>

        <div style={{ 
          padding: '20px', 
          background: 'white', 
          borderRadius: '8px', 
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '10px', background: '#faf5ff', borderRadius: '8px' }}>
              <Users style={{ width: '20px', height: '20px', color: '#9333ea' }} />
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#0f172a' }}>
                {stats?.avgWordsPerUser || 0}
              </div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>平均词汇量</div>
            </div>
          </div>
        </div>

        <div style={{ 
          padding: '20px', 
          background: 'white', 
          borderRadius: '8px', 
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '10px', background: '#fff7ed', borderRadius: '8px' }}>
              <Target style={{ width: '20px', height: '20px', color: '#ea580c' }} />
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#0f172a' }}>
                {stats?.avgAccuracy || 0}%
              </div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>平均准确率</div>
            </div>
          </div>
        </div>
      </div>

      {/* Group Filter Tabs */}
      <div style={{ 
        display: 'flex', 
        gap: '8px', 
        marginBottom: '24px',
        overflowX: 'auto',
        paddingBottom: '8px'
      }}>
              {groups.map(group => {
                const GroupIcon = group.icon;
                return (
                  <button
                    key={group.value}
                    onClick={() => setSelectedGroup(group.value)}
                    style={{
              padding: '12px 20px',
              background: selectedGroup === group.value ? group.color : 'white',
              color: selectedGroup === group.value ? 'white' : '#64748b',
              border: `2px solid ${selectedGroup === group.value ? group.color : '#e5e7eb'}`,
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
                    transition: 'all 0.2s',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <GroupIcon style={{ width: '16px', height: '16px' }} />
                  <span>{group.label}</span>
                  <span style={{ 
                    padding: '2px 8px', 
                    background: selectedGroup === group.value ? 'rgba(255,255,255,0.2)' : '#f1f5f9',
                    color: selectedGroup === group.value ? 'white' : '#64748b',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '700'
                  }}>
                    {group.count}
                  </span>
                </button>
              );
            })}
      </div>

      {/* Search and Sort */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search style={{ 
            position: 'absolute', 
            left: '12px', 
            top: '50%', 
            transform: 'translateY(-50%)', 
            width: '16px', 
            height: '16px', 
            color: '#94a3b8' 
          }} />
          <Input
            type="text"
            placeholder="搜索用户..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '40px' }}
          />
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{
            padding: '8px 16px',
            border: '1px solid #e5e7eb',
            borderRadius: '6px',
            fontSize: '14px',
            background: 'white',
            color: '#0f172a',
            cursor: 'pointer'
          }}
        >
          <option value="lastActive">最近活跃</option>
          <option value="totalWords">词汇量</option>
          <option value="accuracy">准确率</option>
          <option value="totalLearningTime">学习时长</option>
          <option value="createdAt">注册时间</option>
        </select>
      </div>

      {/* Users Table */}
      <div style={{ 
        background: 'white', 
        borderRadius: '8px', 
        border: '1px solid #e5e7eb',
        overflow: 'hidden'
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e5e7eb' }}>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#64748b' }}>用户</th>
                <th style={{ padding: '12px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#64748b' }}>词汇</th>
                <th style={{ padding: '12px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#64748b' }}>掌握</th>
                <th style={{ padding: '12px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#64748b' }}>准确率</th>
                <th style={{ padding: '12px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#64748b' }}>连续</th>
                <th style={{ padding: '12px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#64748b' }}>时长</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#64748b' }}>最近活跃</th>
                <th style={{ padding: '12px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#64748b' }}>状态</th>
                <th style={{ padding: '12px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#64748b' }}>操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <tr 
                  key={user.id}
                  style={{ 
                    borderBottom: index < filteredUsers.length - 1 ? '1px solid #f1f5f9' : 'none',
                    cursor: 'pointer',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e: React.MouseEvent<HTMLTableRowElement>) => e.currentTarget.style.background = '#f8fafc'}
                  onMouseLeave={(e: React.MouseEvent<HTMLTableRowElement>) => e.currentTarget.style.background = 'white'}
                >
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ 
                        width: '40px', 
                        height: '40px', 
                        borderRadius: '50%', 
                        background: '#e0e7ff', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        fontSize: '16px',
                        fontWeight: '600',
                        color: '#4338ca'
                      }}>
                        {user.username[0].toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: '600', color: '#0f172a', fontSize: '14px' }}>{user.username}</div>
                        <div style={{ fontSize: '12px', color: '#94a3b8' }}>{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px', textAlign: 'center' }}>
                    <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '18px' }}>{user.totalWords}</div>
                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                      {user.learningWords}学习中
                    </div>
                  </td>
                  <td style={{ padding: '16px', textAlign: 'center' }}>
                    <div style={{ fontWeight: '600', color: '#10b981', fontSize: '16px' }}>{user.masteredWords}</div>
                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                      {user.totalWords > 0 ? Math.round(user.masteredWords * 100 / user.totalWords) : 0}%
                    </div>
                  </td>
                  <td style={{ padding: '16px', textAlign: 'center' }}>
                    <div style={{ 
                      display: 'inline-block',
                      padding: '4px 12px',
                      background: user.accuracy >= 80 ? '#dcfce7' : user.accuracy >= 60 ? '#fef3c7' : '#fee2e2',
                      color: user.accuracy >= 80 ? '#166534' : user.accuracy >= 60 ? '#92400e' : '#991b1b',
                      borderRadius: '12px',
                      fontSize: '13px',
                      fontWeight: '600'
                    }}>
                      {user.accuracy}%
                    </div>
                  </td>
                  <td style={{ padding: '16px', textAlign: 'center' }}>
                    <div style={{ fontWeight: '600', color: '#f97316', fontSize: '16px' }}>{user.streakDays}</div>
                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>天</div>
                  </td>
                  <td style={{ padding: '16px', textAlign: 'center' }}>
                    <div style={{ fontSize: '14px', color: '#0f172a' }}>{formatTime(user.totalLearningTime)}</div>
                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                      {user.totalSessions} sessions
                    </div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ fontSize: '14px', color: '#0f172a' }}>{formatDate(user.lastActiveAt)}</div>
                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                      {user.daysSinceLastActive === 0 ? 'Today' : `${user.daysSinceLastActive}d ago`}
                    </div>
                  </td>
                  <td style={{ padding: '16px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                      {user.isActive && (
                        <span style={{ 
                          padding: '2px 8px', 
                          background: '#dcfce7', 
                          color: '#166534',
                          borderRadius: '12px',
                          fontSize: '11px',
                          fontWeight: '600'
                        }}>
                          Active
                        </span>
                      )}
                      {user.isNewbie && (
                        <span style={{ 
                          padding: '2px 8px', 
                          background: '#fef3c7', 
                          color: '#92400e',
                          borderRadius: '12px',
                          fontSize: '11px',
                          fontWeight: '600'
                        }}>
                          New
                        </span>
                      )}
                      {user.isAdvanced && (
                        <span style={{ 
                          padding: '2px 8px', 
                          background: '#f3e8ff', 
                          color: '#6b21a8',
                          borderRadius: '12px',
                          fontSize: '11px',
                          fontWeight: '600'
                        }}>
                          Pro
                        </span>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: '16px', textAlign: 'center' }}>
                    <button
                      onClick={() => navigate(`/users/${user.id}/learning-details`)}
                      style={{
                        padding: '6px 12px',
                        background: '#2563eb',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => e.currentTarget.style.background = '#1d4ed8'}
                      onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => e.currentTarget.style.background = '#2563eb'}
                    >
                      <Eye style={{ width: '14px', height: '14px' }} />
                      详情
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>
            没有找到用户数据
          </div>
        )}
      </div>
    </div>
  );
}

