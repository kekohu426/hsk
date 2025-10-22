import { useEffect } from 'react';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  FileText,
  BookOpen,
  Users,
  Settings,
  LogOut,
  Sparkles,
  TrendingUp
} from 'lucide-react';

const navigation = [
  { name: '仪表板', href: '/dashboard', icon: LayoutDashboard },
  { name: '文章生成', href: '/article-generator', icon: Sparkles },
  { name: '文章库', href: '/articles', icon: FileText },
  { name: '词汇管理', href: '/words', icon: BookOpen },
  { name: '用户管理', href: '/users', icon: Users },
  { name: '学习数据', href: '/user-learning-stats', icon: TrendingUp },
  { name: 'AI配置', href: '/ai-config', icon: Settings },
];

export function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {/* Top Bar */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '64px',
        backgroundColor: 'white',
        borderBottom: '1px solid #e2e8f0',
        zIndex: 40
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '100%',
          padding: '0 24px'
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: '#2563eb'
            }}>
              <BookOpen style={{ width: '20px', height: '20px', color: 'white' }} />
            </div>
            <div>
              <div style={{ fontSize: '18px', fontWeight: '600', color: '#0f172a' }}>ChineseMaster</div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>管理后台</div>
            </div>
          </div>

          {/* User Menu */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '8px 12px',
              borderRadius: '8px',
              backgroundColor: '#f8fafc'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: '500',
                fontSize: '14px'
              }}>
                {user?.username.charAt(0).toUpperCase()}
              </div>
              <div style={{ fontSize: '14px' }}>
                <div style={{ fontWeight: '500', color: '#0f172a' }}>{user?.username}</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>{user?.email}</div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              style={{ color: '#64748b' }}
            >
              <LogOut style={{ width: '16px', height: '16px', marginRight: '8px' }} />
              退出
            </Button>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div style={{
        position: 'fixed',
        left: 0,
        top: '64px',
        bottom: 0,
        width: '256px',
        backgroundColor: 'white',
        borderRight: '1px solid #e2e8f0',
        zIndex: 30,
        overflowY: 'auto'
      }}>
        <nav style={{ padding: '16px' }}>
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link key={item.name} to={item.href} style={{ display: 'block', marginBottom: '4px', textDecoration: 'none' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    backgroundColor: isActive ? '#eff6ff' : 'transparent',
                    color: isActive ? '#2563eb' : '#334155',
                    boxShadow: isActive ? '0 1px 2px rgba(0,0,0,0.05)' : 'none'
                  }}
                >
                  <item.icon style={{ width: '20px', height: '20px' }} />
                  <span>{item.name}</span>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div style={{
        marginLeft: '256px',
        marginTop: '64px',
        padding: '32px'
      }}>
        <Outlet />
      </div>
    </div>
  );
}
