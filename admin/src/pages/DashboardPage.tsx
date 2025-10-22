import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FileText, BookOpen, TrendingUp, Activity, ArrowUp } from 'lucide-react';
import api from '@/lib/api';
import type { Stats } from '@/types';

export function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/api/admin/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
        <div style={{ color: '#94a3b8', fontSize: '14px' }}>加载中...</div>
      </div>
    );
  }

  const statCards = [
    {
      title: '总用户数',
      value: stats?.totalUsers || 0,
      change: '+12%',
      icon: Users,
      iconBg: '#eff6ff',
      iconColor: '#2563eb',
    },
    {
      title: '文章总数',
      value: stats?.totalArticles || 0,
      change: '+8',
      icon: FileText,
      iconBg: '#f0fdf4',
      iconColor: '#16a34a',
    },
    {
      title: '词汇库',
      value: stats?.totalWords || 0,
      subtitle: 'HSK 1-6',
      icon: BookOpen,
      iconBg: '#faf5ff',
      iconColor: '#9333ea',
    },
    {
      title: '今日活跃',
      value: stats?.todayActive || 0,
      change: '+23%',
      icon: Activity,
      iconBg: '#fff7ed',
      iconColor: '#ea580c',
    },
  ];

  return (
    <div style={{ maxWidth: '1400px' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#0f172a', marginBottom: '4px' }}>
          数据概览
        </h1>
        <p style={{ fontSize: '14px', color: '#64748b' }}>
          实时监控平台运营数据
        </p>
      </div>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '16px',
        marginBottom: '32px'
      }}>
        {statCards.map((stat, index) => (
          <div
            key={index}
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              padding: '20px',
              transition: 'all 0.2s',
              cursor: 'default'
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
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div>
                <p style={{ fontSize: '13px', fontWeight: '500', color: '#64748b', marginBottom: '8px' }}>
                  {stat.title}
                </p>
                <p style={{ fontSize: '28px', fontWeight: '700', color: '#0f172a', lineHeight: '1' }}>
                  {stat.value.toLocaleString()}
                </p>
              </div>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                backgroundColor: stat.iconBg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <stat.icon style={{ width: '20px', height: '20px', color: stat.iconColor }} />
              </div>
            </div>
            {stat.change && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <ArrowUp style={{ width: '14px', height: '14px', color: '#16a34a' }} />
                <span style={{ fontSize: '13px', fontWeight: '500', color: '#16a34a' }}>
                  {stat.change}
                </span>
                <span style={{ fontSize: '13px', color: '#64748b', marginLeft: '4px' }}>
                  vs 上月
                </span>
              </div>
            )}
            {stat.subtitle && (
              <p style={{ fontSize: '13px', color: '#64748b', marginTop: '8px' }}>
                {stat.subtitle}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        overflow: 'hidden'
      }}>
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp style={{ width: '18px', height: '18px', color: '#64748b' }} />
            <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#0f172a' }}>
              最近活动
            </h2>
          </div>
        </div>
        <div style={{ padding: '12px' }}>
          {stats?.recentActivity && stats.recentActivity.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {stats.recentActivity.map((activity, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px',
                    borderRadius: '8px',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: '#2563eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '600',
                    flexShrink: 0
                  }}>
                    {activity.user?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '14px', fontWeight: '500', color: '#0f172a', marginBottom: '2px' }}>
                      {activity.action}
                    </p>
                    <p style={{ fontSize: '13px', color: '#64748b' }}>
                      {activity.user}
                    </p>
                  </div>
                  <p style={{ fontSize: '13px', color: '#94a3b8', flexShrink: 0 }}>
                    {activity.time}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
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
                <FileText style={{ width: '24px', height: '24px', color: '#cbd5e1' }} />
              </div>
              <p style={{ fontSize: '14px', fontWeight: '500', color: '#475569', marginBottom: '4px' }}>
                暂无活动记录
              </p>
              <p style={{ fontSize: '13px', color: '#94a3b8' }}>
                当有用户活动时，将在此处显示
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
