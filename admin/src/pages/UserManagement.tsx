import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Users, Search, Mail, Shield, User as UserIcon, TrendingUp } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';
import type { User } from '@/types';

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/admin/users');
      setUsers(response.data.users);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      toast.error('加载用户失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmail = (email: string) => {
    window.location.href = `mailto:${email}`;
  };

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: users.length,
    totalWords: users.reduce((sum, u) => sum + (u.totalWords || 0), 0),
    avgStreak: users.length > 0 ? Math.round(users.reduce((sum, u) => sum + (u.streakDays || 0), 0) / users.length) : 0,
    activeToday: users.filter(u => u.lastActive && new Date(u.lastActive) > new Date(Date.now() - 86400000)).length,
  };

  const statCards = [
    { label: '总用户数', value: stats.total, icon: Users, bgColor: '#eff6ff', iconColor: '#2563eb' },
    { label: '总学习词汇', value: stats.totalWords, icon: TrendingUp, bgColor: '#ecfdf5', iconColor: '#059669' },
    { label: '平均连续天数', value: stats.avgStreak, icon: TrendingUp, bgColor: '#f5f3ff', iconColor: '#7c3aed' },
    { label: '今日活跃', value: stats.activeToday, icon: TrendingUp, bgColor: '#fff7ed', iconColor: '#ea580c' },
  ];

  return (
    <div style={{ maxWidth: '1400px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <Users style={{ width: '20px', height: '20px', color: '#2563eb' }} />
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#0f172a' }}>
            用户管理
          </h1>
        </div>
        <p style={{ fontSize: '14px', color: '#64748b' }}>
          管理所有平台用户及其学习数据
        </p>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gap: '24px', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', marginBottom: '24px' }}>
        {statCards.map((stat, i) => (
          <div
            key={i}
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              padding: '20px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              transition: 'all 0.2s ease-in-out',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'}
            onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)'}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <p style={{ fontSize: '14px', fontWeight: '500', color: '#475569' }}>{stat.label}</p>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: stat.bgColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <stat.icon style={{ width: '20px', height: '20px', color: stat.iconColor }} />
              </div>
            </div>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#0f172a' }}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        padding: '20px',
        marginBottom: '24px'
      }}>
        <div style={{ position: 'relative' }}>
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
            placeholder="搜索用户名或邮箱..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '40px', borderColor: '#e2e8f0' }}
          />
        </div>
      </div>

      {/* Users List */}
      {loading ? (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          padding: '60px 20px',
          textAlign: 'center',
          color: '#94a3b8'
        }}>
          加载中...
        </div>
      ) : filteredUsers.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                padding: '20px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.1)';
                e.currentTarget.style.borderColor = '#cbd5e1';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = '#e2e8f0';
              }}
            >
              <div style={{ display: 'flex', gap: '16px', alignItems: 'start' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: '#2563eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: '700',
                  fontSize: '18px',
                  flexShrink: 0
                }}>
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#0f172a' }}>{user.username}</h3>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      backgroundColor: user.role === 'ADMIN' ? '#f5f3ff' : '#eff6ff',
                      color: user.role === 'ADMIN' ? '#7c3aed' : '#2563eb',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      {user.role === 'ADMIN' ? (
                        <><Shield style={{ width: '12px', height: '12px' }} />管理员</>
                      ) : (
                        <><UserIcon style={{ width: '12px', height: '12px' }} />用户</>
                      )}
                    </span>
                  </div>
                  <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '12px' }}>{user.email}</p>
                  <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: '#94a3b8', flexWrap: 'wrap' }}>
                    <span>📚 {user.totalWords || 0} 词汇</span>
                    <span>•</span>
                    <span>🔥 {user.streakDays || 0} 天连续</span>
                    <span>•</span>
                    <span>加入于 {new Date(user.createdAt).toLocaleDateString('zh-CN')}</span>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => handleSendEmail(user.email)}
                  style={{
                    height: '36px',
                    padding: '0 16px',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    backgroundColor: 'white',
                    color: '#475569',
                    fontSize: '14px',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    flexShrink: 0
                  }}
                >
                  <Mail style={{ width: '16px', height: '16px' }} />
                  发邮件
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          padding: '80px 20px',
          textAlign: 'center'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: '#f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px'
          }}>
            <Users style={{ width: '24px', height: '24px', color: '#cbd5e1' }} />
          </div>
          <p style={{ fontSize: '14px', fontWeight: '500', color: '#475569', marginBottom: '4px' }}>
            未找到用户
          </p>
          <p style={{ fontSize: '13px', color: '#94a3b8' }}>
            尝试调整搜索关键词
          </p>
        </div>
      )}
    </div>
  );
}
