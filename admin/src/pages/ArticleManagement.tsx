import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileText, Search, Edit, Trash2, Eye, Plus } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';
import type { Article } from '@/types';

export function ArticleManagement() {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');

  useEffect(() => {
    fetchArticles();
  }, [filter]);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/admin/articles', {
        params: { status: filter === 'all' ? undefined : filter },
      });
      setArticles(response.data.articles);
    } catch (error) {
      console.error('Failed to fetch articles:', error);
      toast.error('加载文章失败');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这篇文章吗？此操作无法撤销。')) return;

    try {
      await api.delete(`/api/admin/articles/${id}`);
      toast.success('文章已删除');
      fetchArticles();
    } catch (error) {
      console.error('Delete failed:', error);
      toast.error('删除失败');
    }
  };

  const filteredArticles = articles.filter((article) =>
    article.title.toLowerCase().includes(search.toLowerCase()) ||
    article.chineseContent.includes(search)
  );

  const filterOptions = [
    { value: 'all', label: '全部' },
    { value: 'PUBLISHED', label: '已发布' },
    { value: 'DRAFT', label: '草稿' },
  ];

  return (
    <div style={{ maxWidth: '1400px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <FileText style={{ width: '20px', height: '20px', color: '#16a34a' }} />
            <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#0f172a' }}>
              文章库
            </h1>
          </div>
          <p style={{ fontSize: '14px', color: '#64748b' }}>
            管理所有学习文章和草稿
          </p>
        </div>
        <Button 
          onClick={() => navigate('/article-generator')}
          style={{ backgroundColor: '#2563eb', color: 'white', height: '40px' }}
        >
          <Plus style={{ width: '16px', height: '16px', marginRight: '8px' }} />
          新建文章
        </Button>
      </div>

      {/* Filters */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        padding: '20px',
        marginBottom: '24px'
      }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1 }}>
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
              placeholder="搜索文章标题或内容..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '40px', borderColor: '#e2e8f0' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {filterOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setFilter(option.value as any)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: '1px solid',
                  borderColor: filter === option.value ? '#2563eb' : '#e2e8f0',
                  backgroundColor: filter === option.value ? '#eff6ff' : 'white',
                  color: filter === option.value ? '#2563eb' : '#64748b',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Articles List */}
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
      ) : filteredArticles.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredArticles.map((article) => (
            <div
              key={article.id}
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
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '10px',
                  backgroundColor: '#f0fdf4',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <FileText style={{ width: '24px', height: '24px', color: '#16a34a' }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#0f172a', marginBottom: '8px' }}>
                    {article.title}
                  </h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      backgroundColor: article.status === 'PUBLISHED' ? '#dcfce7' : '#fef3c7',
                      color: article.status === 'PUBLISHED' ? '#16a34a' : '#ea580c',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      {article.status === 'PUBLISHED' ? '已发布' : '草稿'}
                    </span>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      border: '1px solid #e2e8f0',
                      backgroundColor: 'white',
                      color: '#64748b',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      {article.difficulty === 'Beginner' ? '初级' : article.difficulty === 'Intermediate' ? '中级' : '高级'}
                    </span>
                    <span style={{ fontSize: '13px', color: '#94a3b8' }}>•</span>
                    <span style={{ fontSize: '13px', color: '#64748b' }}>{article.views} 次浏览</span>
                    <span style={{ fontSize: '13px', color: '#94a3b8' }}>•</span>
                    <span style={{ fontSize: '13px', color: '#64748b' }}>{article.newWords?.length || 0} 个生词</span>
                    <span style={{ fontSize: '13px', color: '#94a3b8' }}>•</span>
                    <span style={{ fontSize: '13px', color: '#64748b' }}>{new Date(article.createdAt).toLocaleDateString('zh-CN')}</span>
                  </div>
                  <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.6', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    {article.chineseContent}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                  <button
                    onClick={() => window.open(`http://localhost:3001/dashboard/articles/${article.slug}`, '_blank')}
                    title="在用户端预览文章"
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      backgroundColor: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                  >
                    <Eye style={{ width: '16px', height: '16px', color: '#64748b' }} />
                  </button>
                  <button
                    onClick={() => navigate(`/articles/edit/${article.id}`)}
                    title="编辑文章"
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      backgroundColor: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                  >
                    <Edit style={{ width: '16px', height: '16px', color: '#64748b' }} />
                  </button>
                  <button
                    onClick={() => handleDelete(article.id)}
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      border: '1px solid #fee2e2',
                      backgroundColor: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                  >
                    <Trash2 style={{ width: '16px', height: '16px', color: '#ef4444' }} />
                  </button>
                </div>
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
            <FileText style={{ width: '24px', height: '24px', color: '#cbd5e1' }} />
          </div>
          <p style={{ fontSize: '14px', fontWeight: '500', color: '#475569', marginBottom: '4px' }}>
            未找到文章
          </p>
          <p style={{ fontSize: '13px', color: '#94a3b8' }}>
            尝试调整筛选条件或搜索关键词
          </p>
        </div>
      )}
    </div>
  );
}
