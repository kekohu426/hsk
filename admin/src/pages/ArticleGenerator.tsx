import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Loader2, Save, Send } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';

export function ArticleGenerator() {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const [keywords, setKeywords] = useState('');
  const [wordCount, setWordCount] = useState(300);
  const [generating, setGenerating] = useState(false);
  const [article, setArticle] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  const handleGenerate = async () => {
    if (!topic) {
      toast.error('请输入文章主题');
      return;
    }

    try {
      setGenerating(true);
      const response = await api.post('/api/admin/articles/generate', {
        topic,
        difficulty,
        keywords: keywords.split(',').map(k => k.trim()).filter(Boolean),
        wordCount,
      });
      setArticle(response.data.article);
      toast.success('文章生成成功！');
    } catch (error: any) {
      console.error('Generation failed:', error);
      toast.error(error.response?.data?.error || '文章生成失败');
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = async (status: 'draft' | 'published') => {
    if (!article) return;

    try {
      setSaving(true);
      const articleToSave = {
        ...article,
        status: status === 'published' ? 'PUBLISHED' : 'DRAFT'
      };
      await api.post('/api/admin/articles', articleToSave);
      toast.success(`文章已${status === 'published' ? '发布' : '保存为草稿'}！`);
      setArticle(null);
      setTopic('');
      setKeywords('');
    } catch (error: any) {
      console.error('Save failed:', error);
      toast.error(error.response?.data?.error || '文章保存失败');
    } finally {
      setSaving(false);
    }
  };

  const difficultyOptions = [
    { value: 'Beginner', label: '初级', color: '#16a34a' },
    { value: 'Intermediate', label: '中级', color: '#ea580c' },
    { value: 'Advanced', label: '高级', color: '#dc2626' },
  ];

  return (
    <div style={{ maxWidth: '1400px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <Sparkles style={{ width: '20px', height: '20px', color: '#2563eb' }} />
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#0f172a' }}>
            文章生成器
          </h1>
        </div>
        <p style={{ fontSize: '14px', color: '#64748b' }}>
          使用 AI 快速生成高质量的中文学习文章
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Input Form */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          padding: '24px'
        }}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#0f172a', marginBottom: '20px' }}>
            生成设置
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <Label style={{ fontSize: '13px', fontWeight: '500', color: '#475569', marginBottom: '8px', display: 'block' }}>
                文章主题 <span style={{ color: '#ef4444' }}>*</span>
              </Label>
              <Input
                placeholder="例如：我的一天、去超市购物"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                style={{ borderColor: '#e2e8f0' }}
              />
            </div>

            <div>
              <Label style={{ fontSize: '13px', fontWeight: '500', color: '#475569', marginBottom: '12px', display: 'block' }}>
                难度等级
              </Label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                {difficultyOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setDifficulty(option.value as any)}
                    style={{
                      padding: '10px',
                      borderRadius: '8px',
                      border: difficulty === option.value ? `2px solid ${option.color}` : '1px solid #e2e8f0',
                      backgroundColor: difficulty === option.value ? `${option.color}10` : 'white',
                      color: difficulty === option.value ? option.color : '#64748b',
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

            <div>
              <Label style={{ fontSize: '13px', fontWeight: '500', color: '#475569', marginBottom: '8px', display: 'block' }}>
                关键词（逗号分隔）
              </Label>
              <Input
                placeholder="早上, 学校, 朋友"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                style={{ borderColor: '#e2e8f0' }}
              />
            </div>

            <div>
              <Label style={{ fontSize: '13px', fontWeight: '500', color: '#475569', marginBottom: '8px', display: 'block' }}>
                目标字数
              </Label>
              <Input
                type="number"
                min="100"
                max="1000"
                value={wordCount}
                onChange={(e) => setWordCount(parseInt(e.target.value))}
                style={{ borderColor: '#e2e8f0' }}
              />
            </div>

            <Button
              onClick={handleGenerate}
              disabled={generating || !topic}
              style={{
                backgroundColor: '#2563eb',
                color: 'white',
                height: '44px',
                fontSize: '14px',
                fontWeight: '500',
                marginTop: '8px'
              }}
            >
              {generating ? (
                <>
                  <Loader2 style={{ width: '16px', height: '16px', marginRight: '8px' }} className="animate-spin" />
                  生成中...
                </>
              ) : (
                <>
                  <Sparkles style={{ width: '16px', height: '16px', marginRight: '8px' }} />
                  生成文章
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Preview */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          padding: '24px'
        }}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#0f172a', marginBottom: '20px' }}>
            生成结果
          </h2>

          {article ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{
                padding: '16px',
                backgroundColor: '#f8fafc',
                borderRadius: '8px',
                border: '1px solid #e2e8f0'
              }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#0f172a', marginBottom: '8px' }}>
                  {article.title}
                  {article.titleEn && (
                    <span style={{ fontSize: '14px', color: '#64748b', fontWeight: '400', marginLeft: '8px' }}>
                      / {article.titleEn}
                    </span>
                  )}
                </h3>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{
                    display: 'inline-block',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    backgroundColor: article.level === 'BEGINNER' ? '#dcfce7' : article.level === 'INTERMEDIATE' ? '#fed7aa' : '#fecaca',
                    color: article.level === 'BEGINNER' ? '#16a34a' : article.level === 'INTERMEDIATE' ? '#ea580c' : '#dc2626',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>
                    {article.level === 'BEGINNER' ? '初级' : article.level === 'INTERMEDIATE' ? '中级' : '高级'}
                  </span>
                  <span style={{
                    display: 'inline-block',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    border: '1px solid #e2e8f0',
                    backgroundColor: 'white',
                    color: '#64748b',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>
                    {article.hskLevel}
                  </span>
                  <span style={{
                    display: 'inline-block',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    border: '1px solid #e2e8f0',
                    backgroundColor: 'white',
                    color: '#64748b',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>
                    {article.wordCount} 字 • {article.readTime} 分钟
                  </span>
                </div>
              </div>

              <div>
                <Label style={{ fontSize: '13px', fontWeight: '500', color: '#475569', marginBottom: '8px', display: 'block' }}>
                  文章内容（结构化）
                </Label>
                <div style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '16px',
                  backgroundColor: '#f8fafc',
                  maxHeight: '400px',
                  overflowY: 'auto'
                }}>
                  {article.content && Array.isArray(article.content) && article.content.map((para: any, i: number) => (
                    <div key={i} style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: i < article.content.length - 1 ? '1px solid #e2e8f0' : 'none' }}>
                      <p style={{ fontSize: '15px', lineHeight: '1.8', color: '#0f172a', marginBottom: '8px' }}>
                        {para.cn}
                      </p>
                      <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>
                        {para.pinyin}
                      </p>
                      <p style={{ fontSize: '13px', color: '#6b7280', fontStyle: 'italic' }}>
                        {para.en}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {article.newWords && article.newWords.length > 0 && (
                <div>
                  <Label style={{ fontSize: '13px', fontWeight: '500', color: '#475569', marginBottom: '8px', display: 'block' }}>
                    生词（{article.newWords.length}）
                  </Label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {article.newWords.map((word: any, i: number) => (
                      <span
                        key={i}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '6px',
                          backgroundColor: '#f3f4f6',
                          color: '#374151',
                          fontSize: '13px'
                        }}
                      >
                        {word.word} ({word.pinyin}) - {word.meaning}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {article.quiz && article.quiz.length > 0 && (
                <div>
                  <Label style={{ fontSize: '13px', fontWeight: '500', color: '#475569', marginBottom: '12px', display: 'block' }}>
                    测试题（{article.quiz.length}）
                  </Label>
                  {article.quiz.map((q: any, i: number) => (
                    <div key={i} style={{
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      marginBottom: '12px'
                    }}>
                      <p style={{ fontSize: '14px', fontWeight: '500', color: '#0f172a', marginBottom: '8px' }}>
                        {i + 1}. {q.question}
                      </p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '8px' }}>
                        {q.options.map((opt: string, j: number) => (
                          <div key={j} style={{
                            padding: '6px 10px',
                            borderRadius: '6px',
                            backgroundColor: j === q.answer ? '#dcfce7' : 'white',
                            border: `1px solid ${j === q.answer ? '#16a34a' : '#e2e8f0'}`,
                            fontSize: '13px',
                            color: j === q.answer ? '#16a34a' : '#64748b'
                          }}>
                            {String.fromCharCode(65 + j)}. {opt} {j === q.answer && '✓'}
                          </div>
                        ))}
                      </div>
                      {q.explanation && (
                        <p style={{ fontSize: '12px', color: '#6b7280', fontStyle: 'italic' }}>
                          说明：{q.explanation}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '8px' }}>
                <Button
                  onClick={() => handleSave('draft')}
                  disabled={saving}
                  variant="outline"
                  style={{ borderColor: '#e2e8f0' }}
                >
                  <Save style={{ width: '16px', height: '16px', marginRight: '8px' }} />
                  保存草稿
                </Button>
                <Button
                  onClick={() => handleSave('published')}
                  disabled={saving}
                  style={{ backgroundColor: '#16a34a', color: 'white' }}
                >
                  <Send style={{ width: '16px', height: '16px', marginRight: '8px' }} />
                  立即发布
                </Button>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '80px 20px', color: '#94a3b8' }}>
              <Sparkles style={{ width: '48px', height: '48px', margin: '0 auto 16px', opacity: 0.3 }} />
              <p style={{ fontSize: '14px', fontWeight: '500', color: '#64748b', marginBottom: '4px' }}>
                等待生成
              </p>
              <p style={{ fontSize: '13px' }}>
                填写左侧表单并点击"生成文章"
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
