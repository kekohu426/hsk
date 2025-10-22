import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle, Eye, FileJson } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';

interface WordEntry {
  id: string;
  word: string;
  slug: string;
  hskLevel: number;
  status: string;
  seoScore: number | null;
  wordCount: number | null;
  content: any;
}

export function WordPreview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [entry, setEntry] = useState<WordEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'preview' | 'json'>('preview');

  useEffect(() => {
    if (id) {
      fetchWordEntry();
    }
  }, [id]);

  const fetchWordEntry = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/admin/words/${id}`);
      setEntry(response.data.data);
    } catch (error) {
      console.error('Failed to fetch word entry:', error);
      toast.error('加载词条失败');
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!entry) return;

    try {
      await api.post(`/api/admin/words/${entry.id}/publish`);
      toast.success('词条已发布');
      navigate('/words');
    } catch (error: any) {
      console.error('Publish failed:', error);
      toast.error(error.response?.data?.error || '发布失败');
    }
  };

  if (loading) {
    return (
      <div style={{ maxWidth: '1200px', padding: '48px', textAlign: 'center' }}>
        <div style={{ fontSize: '14px', color: '#94a3b8' }}>加载中...</div>
      </div>
    );
  }

  if (!entry) {
    return (
      <div style={{ maxWidth: '1200px', padding: '48px', textAlign: 'center' }}>
        <div style={{ fontSize: '14px', color: '#94a3b8' }}>词条不存在</div>
      </div>
    );
  }

  const content = entry.content || {};

  return (
    <div style={{ maxWidth: '1200px' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <Button
          variant="ghost"
          onClick={() => navigate('/words')}
          style={{ marginBottom: '16px', padding: '8px 12px' }}
        >
          <ArrowLeft style={{ width: '16px', height: '16px', marginRight: '8px' }} />
          返回词汇管理
        </Button>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>
              {entry.word}
            </h1>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <span style={{
                padding: '4px 12px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: '500',
                backgroundColor: '#f0f9ff',
                color: '#0284c7'
              }}>
                HSK {entry.hskLevel}
              </span>
              {entry.seoScore && (
                <span style={{ fontSize: '14px', color: '#64748b' }}>
                  SEO评分: {entry.seoScore}/100
                </span>
              )}
              {entry.wordCount && (
                <span style={{ fontSize: '14px', color: '#64748b' }}>
                  字数: {entry.wordCount}
                </span>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <Button
              variant="ghost"
              onClick={() => setViewMode(viewMode === 'preview' ? 'json' : 'preview')}
            >
              {viewMode === 'preview' ? <FileJson style={{ width: '16px', height: '16px', marginRight: '8px' }} /> : <Eye style={{ width: '16px', height: '16px', marginRight: '8px' }} />}
              {viewMode === 'preview' ? 'JSON' : '预览'}
            </Button>
            {entry.status === 'GENERATED' && (
              <Button
                onClick={handlePublish}
                style={{ backgroundColor: '#8b5cf6', color: 'white' }}
              >
                <CheckCircle style={{ width: '16px', height: '16px', marginRight: '8px' }} />
                发布词条
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      {viewMode === 'json' ? (
        <div style={{
          backgroundColor: '#1e293b',
          color: '#e2e8f0',
          padding: '24px',
          borderRadius: '8px',
          overflow: 'auto',
          maxHeight: '800px'
        }}>
          <pre style={{ margin: 0, fontSize: '13px', lineHeight: '1.6' }}>
            {JSON.stringify(content, null, 2)}
          </pre>
        </div>
      ) : (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
          overflow: 'hidden'
        }}>
          <WordContentPreview content={content} />
        </div>
      )}
    </div>
  );
}

// 词条内容预览组件
function WordContentPreview({ content }: { content: any }) {
  if (!content || Object.keys(content).length === 0) {
    return (
      <div style={{ padding: '48px', textAlign: 'center', color: '#94a3b8' }}>
        暂无内容
      </div>
    );
  }

  return (
    <div style={{ padding: '32px' }}>
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '12px',
        padding: '32px',
        color: 'white',
        marginBottom: '32px'
      }}>
        <h1 style={{ fontSize: '36px', fontWeight: '700', marginBottom: '12px' }}>
          {content.word}
        </h1>
        <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' }}>
          <span style={{
            padding: '6px 12px',
            borderRadius: '20px',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            fontSize: '16px'
          }}>
            {content.pinyin}
          </span>
          <span style={{
            padding: '6px 12px',
            borderRadius: '20px',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            fontSize: '16px'
          }}>
            {content.pinyinWithTones}
          </span>
          <span style={{
            padding: '6px 12px',
            borderRadius: '20px',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            fontSize: '16px'
          }}>
            {content.english}
          </span>
          <span style={{
            padding: '6px 12px',
            borderRadius: '20px',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            fontSize: '16px'
          }}>
            {content.level}
          </span>
          {content.partOfSpeech && (
            <span style={{
              padding: '6px 12px',
              borderRadius: '20px',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              fontSize: '16px'
            }}>
              {content.partOfSpeech.cn} ({content.partOfSpeech.en})
            </span>
          )}
        </div>
      </div>

      {/* Definition */}
      {content.definition && (
        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#0f172a', marginBottom: '16px' }}>
            核心含义
          </h2>
          <div style={{ padding: '16px', backgroundColor: '#f8fafc', borderRadius: '8px', borderLeft: '4px solid #3b82f6' }}>
            <p style={{ fontSize: '14px', color: '#475569', marginBottom: '8px' }}>
              {content.definition.cn}
            </p>
            <p style={{ fontSize: '14px', color: '#64748b', fontStyle: 'italic' }}>
              {content.definition.en}
            </p>
          </div>
        </section>
      )}

      {/* Collocations */}
      {content.collocations && content.collocations.length > 0 && (
        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#0f172a', marginBottom: '16px' }}>
            常见搭配
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            {content.collocations.map((col: any, idx: number) => (
              <div key={idx} style={{
                padding: '12px',
                backgroundColor: '#f0f9ff',
                borderRadius: '8px',
                border: '1px solid #bae6fd'
              }}>
                <div style={{ fontSize: '16px', fontWeight: '500', color: '#0f172a', marginBottom: '4px' }}>
                  {col.cn}
                </div>
                <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '2px' }}>
                  {col.pinyin}
                </div>
                <div style={{ fontSize: '12px', color: '#0284c7' }}>
                  {col.en}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Examples */}
      {content.examples && content.examples.length > 0 && (
        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#0f172a', marginBottom: '16px' }}>
            真题例句
          </h2>
          {content.examples.map((ex: any, idx: number) => (
            <div key={idx} style={{
              padding: '16px',
              backgroundColor: '#fefce8',
              borderRadius: '8px',
              marginBottom: '12px',
              borderLeft: '4px solid #eab308'
            }}>
              <p style={{ fontSize: '16px', fontWeight: '500', color: '#0f172a', marginBottom: '4px' }}>
                {ex.cn}
              </p>
              <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '4px' }}>
                {ex.pinyin}
              </p>
              <p style={{ fontSize: '14px', color: '#854d0e', fontStyle: 'italic', marginBottom: '8px' }}>
                {ex.en}
              </p>
              {ex.tip && (
                <p style={{ fontSize: '12px', color: '#a16207', backgroundColor: 'rgba(234, 179, 8, 0.1)', padding: '8px', borderRadius: '4px' }}>
                  💡 {ex.tip}
                </p>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Practice Questions */}
      {content.practiceQuestions && content.practiceQuestions.length > 0 && (
        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#0f172a', marginBottom: '16px' }}>
            练习题
          </h2>
          {content.practiceQuestions.map((q: any, idx: number) => (
            <div key={idx} style={{
              padding: '16px',
              backgroundColor: 'white',
              borderRadius: '8px',
              marginBottom: '16px',
              border: '1px solid #e2e8f0'
            }}>
              <p style={{ fontSize: '16px', fontWeight: '500', color: '#0f172a', marginBottom: '12px' }}>
                {q.question.cn}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {q.options && q.options.map((opt: any, optIdx: number) => (
                  <div key={optIdx} style={{
                    padding: '12px',
                    borderRadius: '6px',
                    backgroundColor: opt.isCorrect ? '#f0fdf4' : '#f8fafc',
                    border: `1px solid ${opt.isCorrect ? '#86efac' : '#e2e8f0'}`
                  }}>
                    <div style={{ fontSize: '14px', color: '#0f172a' }}>
                      {opt.label}. {opt.cn}
                    </div>
                    {opt.isCorrect && (
                      <div style={{ fontSize: '12px', color: '#16a34a', marginTop: '4px' }}>
                        ✓ {opt.explain}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Related Words */}
      {content.relatedWords && content.relatedWords.length > 0 && (
        <section>
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#0f172a', marginBottom: '16px' }}>
            相关词汇
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            {content.relatedWords.map((word: any, idx: number) => (
              <div key={idx} style={{
                padding: '8px 16px',
                backgroundColor: '#f5f3ff',
                borderRadius: '20px',
                border: '1px solid #e9d5ff',
                fontSize: '14px',
                color: '#6b21a8'
              }}>
                {word.cn} ({word.en})
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}




