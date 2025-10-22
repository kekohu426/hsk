import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeft, Save, Plus, Trash2, HelpCircle } from 'lucide-react';
import api from '../lib/api';

export function ArticleEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [article, setArticle] = useState({
    title: '',
    titleEn: '',
    content: [],
    excerpt: '',
    level: 'BEGINNER',
    hskLevel: 'HSK 1',
    readTime: 5,
    wordCount: 0,
    coverImage: '',
    audioUrl: '',
    metaTitle: '',
    metaDescription: '',
    status: 'DRAFT',
    newWords: [],
    quiz: []
  });

  useEffect(() => {
    loadArticle();
  }, [id]);

  const loadArticle = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/api/admin/articles/${id}`);
      
      // Parse JSON content if it's a string
      let parsedArticle = { ...data.article };
      if (typeof parsedArticle.content === 'string') {
        try {
          parsedArticle.content = JSON.parse(parsedArticle.content);
        } catch (e) {
          parsedArticle.content = [];
        }
      }
      if (typeof parsedArticle.newWords === 'string') {
        try {
          parsedArticle.newWords = JSON.parse(parsedArticle.newWords);
        } catch (e) {
          parsedArticle.newWords = [];
        }
      }
      if (typeof parsedArticle.quiz === 'string') {
        try {
          parsedArticle.quiz = JSON.parse(parsedArticle.quiz);
        } catch (e) {
          parsedArticle.quiz = [];
        }
      }
      
      setArticle(parsedArticle);
    } catch (error) {
      console.error('Failed to load article:', error);
      toast.error('加载文章失败');
      navigate('/articles');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await api.put(`/api/admin/articles/${id}`, article);
      toast.success('文章保存成功！');
      navigate('/articles');
    } catch (error) {
      console.error('Failed to save article:', error);
      toast.error('保存文章失败：' + (error.response?.data?.message || error.message));
    } finally {
      setSaving(false);
    }
  };

  // Content management functions
  const addParagraph = () => {
    setArticle({
      ...article,
      content: [...article.content, { type: 'paragraph', cn: '', pinyin: '', en: '' }]
    });
  };

  const updateParagraph = (index, field, value) => {
    const newContent = [...article.content];
    newContent[index] = { ...newContent[index], [field]: value };
    setArticle({ ...article, content: newContent });
  };

  const deleteParagraph = (index) => {
    const newContent = article.content.filter((_, i) => i !== index);
    setArticle({ ...article, content: newContent });
  };

  // New Words management functions
  const addNewWord = () => {
    setArticle({
      ...article,
      newWords: [...article.newWords, { word: '', pinyin: '', meaning: '' }]
    });
  };

  const updateNewWord = (index, field, value) => {
    const newWords = [...article.newWords];
    newWords[index] = { ...newWords[index], [field]: value };
    setArticle({ ...article, newWords });
  };

  const deleteNewWord = (index) => {
    const newWords = article.newWords.filter((_, i) => i !== index);
    setArticle({ ...article, newWords });
  };

  // Quiz management functions
  const addQuizQuestion = () => {
    setArticle({
      ...article,
      quiz: [...article.quiz, { 
        question: '', 
        options: ['', '', '', ''], 
        answer: 0, 
        explanation: '' 
      }]
    });
  };

  const updateQuizQuestion = (index, field, value) => {
    const quiz = [...article.quiz];
    quiz[index] = { ...quiz[index], [field]: value };
    setArticle({ ...article, quiz });
  };

  const updateQuizOption = (qIndex, oIndex, value) => {
    const quiz = [...article.quiz];
    const options = [...quiz[qIndex].options];
    options[oIndex] = value;
    quiz[qIndex] = { ...quiz[qIndex], options };
    setArticle({ ...article, quiz });
  };

  const deleteQuizQuestion = (index) => {
    const quiz = article.quiz.filter((_, i) => i !== index);
    setArticle({ ...article, quiz });
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <div style={{ fontSize: '16px', color: '#64748b' }}>加载中...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => navigate('/articles')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              backgroundColor: 'white',
              fontSize: '14px',
              color: '#64748b',
              cursor: 'pointer'
            }}
          >
            <ArrowLeft style={{ width: '16px', height: '16px' }} />
            返回列表
          </button>
          <h1 style={{ fontSize: '28px', fontWeight: '600', color: '#0f172a', margin: 0 }}>编辑文章</h1>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            borderRadius: '8px',
            border: 'none',
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            color: 'white',
            fontSize: '14px',
            fontWeight: '500',
            cursor: saving ? 'not-allowed' : 'pointer',
            opacity: saving ? 0.6 : 1
          }}
        >
          <Save style={{ width: '16px', height: '16px' }} />
          {saving ? '保存中...' : '保存'}
        </button>
      </div>

      {/* Form */}
      <div style={{ display: 'grid', gap: '24px' }}>
        {/* Title & TitleEn */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#334155', marginBottom: '8px' }}>
              中文标题 *
            </label>
            <input
              type="text"
              value={article.title}
              onChange={(e) => setArticle({ ...article, title: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                fontSize: '14px'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#334155', marginBottom: '8px' }}>
              英文标题
            </label>
            <input
              type="text"
              value={article.titleEn || ''}
              onChange={(e) => setArticle({ ...article, titleEn: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                fontSize: '14px'
              }}
            />
          </div>
        </div>

        {/* Visual Content Editor */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <label style={{ fontSize: '14px', fontWeight: '500', color: '#334155' }}>
              文章内容（段落列表）*
            </label>
            <button
              onClick={addParagraph}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '6px',
                border: '1px solid #3b82f6',
                backgroundColor: 'white',
                color: '#3b82f6',
                fontSize: '13px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              <Plus style={{ width: '14px', height: '14px' }} />
              添加段落
            </button>
          </div>

          {/* Paragraphs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {article.content && article.content.length > 0 ? (
              article.content.map((para, index) => (
                <div
                  key={index}
                  style={{
                    padding: '16px',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    backgroundColor: '#f8fafc'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: '#64748b' }}>
                      段落 {index + 1}
                    </span>
                    <button
                      onClick={() => deleteParagraph(index)}
                      style={{
                        padding: '4px 8px',
                        borderRadius: '6px',
                        border: '1px solid #ef4444',
                        backgroundColor: 'white',
                        color: '#ef4444',
                        fontSize: '12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <Trash2 style={{ width: '12px', height: '12px' }} />
                      删除
                    </button>
                  </div>
                  <div style={{ display: 'grid', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#64748b', marginBottom: '4px' }}>
                        中文
                      </label>
                      <textarea
                        value={para.cn || ''}
                        onChange={(e) => updateParagraph(index, 'cn', e.target.value)}
                        rows={2}
                        style={{
                          width: '100%',
                          padding: '8px',
                          borderRadius: '6px',
                          border: '1px solid #e2e8f0',
                          fontSize: '14px',
                          resize: 'vertical',
                          backgroundColor: 'white'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#64748b', marginBottom: '4px' }}>
                        拼音
                      </label>
                      <textarea
                        value={para.pinyin || ''}
                        onChange={(e) => updateParagraph(index, 'pinyin', e.target.value)}
                        rows={2}
                        style={{
                          width: '100%',
                          padding: '8px',
                          borderRadius: '6px',
                          border: '1px solid #e2e8f0',
                          fontSize: '14px',
                          resize: 'vertical',
                          backgroundColor: 'white'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#64748b', marginBottom: '4px' }}>
                        英文翻译
                      </label>
                      <textarea
                        value={para.en || ''}
                        onChange={(e) => updateParagraph(index, 'en', e.target.value)}
                        rows={2}
                        style={{
                          width: '100%',
                          padding: '8px',
                          borderRadius: '6px',
                          border: '1px solid #e2e8f0',
                          fontSize: '14px',
                          resize: 'vertical',
                          backgroundColor: 'white'
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div style={{
                padding: '40px',
                textAlign: 'center',
                border: '2px dashed #e2e8f0',
                borderRadius: '8px',
                color: '#94a3b8'
              }}>
                <p style={{ margin: 0, fontSize: '14px' }}>暂无内容，点击上方"添加段落"开始编辑</p>
              </div>
            )}
          </div>
        </div>

        {/* Excerpt */}
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#334155', marginBottom: '8px' }}>
            摘要
          </label>
          <textarea
            value={article.excerpt}
            onChange={(e) => setArticle({ ...article, excerpt: e.target.value })}
            rows={3}
            placeholder="文章的简短描述..."
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              fontSize: '14px',
              resize: 'vertical'
            }}
          />
        </div>

        {/* Level, HSK Level, Read Time, Status */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#334155', marginBottom: '8px' }}>
              难度等级 *
            </label>
            <select
              value={article.level}
              onChange={(e) => setArticle({ ...article, level: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                fontSize: '14px',
                cursor: 'pointer',
                backgroundColor: 'white'
              }}
            >
              <option value="BEGINNER">初级</option>
              <option value="INTERMEDIATE">中级</option>
              <option value="ADVANCED">高级</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#334155', marginBottom: '8px' }}>
              HSK 等级
            </label>
            <input
              type="text"
              value={article.hskLevel}
              onChange={(e) => setArticle({ ...article, hskLevel: e.target.value })}
              placeholder="HSK 1-2"
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                fontSize: '14px'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#334155', marginBottom: '8px' }}>
              阅读时长 (分钟)
            </label>
            <input
              type="number"
              value={article.readTime}
              onChange={(e) => setArticle({ ...article, readTime: parseInt(e.target.value) || 5 })}
              min="1"
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                fontSize: '14px'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#334155', marginBottom: '8px' }}>
              状态 *
            </label>
            <select
              value={article.status}
              onChange={(e) => setArticle({ ...article, status: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                fontSize: '14px',
                cursor: 'pointer',
                backgroundColor: 'white'
              }}
            >
              <option value="DRAFT">草稿</option>
              <option value="PUBLISHED">已发布</option>
            </select>
          </div>
        </div>

        {/* Cover Image & Audio URL */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              <label style={{ fontSize: '14px', fontWeight: '500', color: '#334155' }}>
                封面图片 URL
              </label>
              <div style={{ position: 'relative', display: 'inline-block' }} title="文章封面图片链接，用于列表缩略图和详情页顶部大图">
                <HelpCircle style={{ width: '14px', height: '14px', color: '#94a3b8', cursor: 'help' }} />
              </div>
            </div>
            <input
              type="text"
              value={article.coverImage || ''}
              onChange={(e) => setArticle({ ...article, coverImage: e.target.value })}
              placeholder="/images/articles/cover.jpg"
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                fontSize: '14px'
              }}
            />
            <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#64748b' }}>
              用途：文章列表缩略图、详情页封面
            </p>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              <label style={{ fontSize: '14px', fontWeight: '500', color: '#334155' }}>
                音频 URL
              </label>
              <div style={{ position: 'relative', display: 'inline-block' }} title="文章朗读音频文件链接，如不填写则使用浏览器语音合成">
                <HelpCircle style={{ width: '14px', height: '14px', color: '#94a3b8', cursor: 'help' }} />
              </div>
            </div>
            <input
              type="text"
              value={article.audioUrl || ''}
              onChange={(e) => setArticle({ ...article, audioUrl: e.target.value })}
              placeholder="/audio/articles/audio.mp3"
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                fontSize: '14px'
              }}
            />
            <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#64748b' }}>
              用途：用户端"播放朗读"功能（可选）
            </p>
          </div>
        </div>

        {/* New Words Editor */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <label style={{ fontSize: '14px', fontWeight: '500', color: '#334155' }}>
              生词列表
            </label>
            <button
              onClick={addNewWord}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '6px',
                border: '1px solid #10b981',
                backgroundColor: 'white',
                color: '#10b981',
                fontSize: '13px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              <Plus style={{ width: '14px', height: '14px' }} />
              添加生词
            </button>
          </div>

          {/* New Words List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {article.newWords && article.newWords.length > 0 ? (
              article.newWords.map((word, index) => (
                <div
                  key={index}
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    backgroundColor: '#f8fafc'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: '#64748b' }}>
                      生词 {index + 1}
                    </span>
                    <button
                      onClick={() => deleteNewWord(index)}
                      style={{
                        padding: '4px 8px',
                        borderRadius: '6px',
                        border: '1px solid #ef4444',
                        backgroundColor: 'white',
                        color: '#ef4444',
                        fontSize: '12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <Trash2 style={{ width: '12px', height: '12px' }} />
                      删除
                    </button>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr', gap: '8px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#64748b', marginBottom: '4px' }}>
                        词语
                      </label>
                      <input
                        type="text"
                        value={word.word || ''}
                        onChange={(e) => updateNewWord(index, 'word', e.target.value)}
                        placeholder="中文词语"
                        style={{
                          width: '100%',
                          padding: '6px 8px',
                          borderRadius: '6px',
                          border: '1px solid #e2e8f0',
                          fontSize: '14px',
                          backgroundColor: 'white'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#64748b', marginBottom: '4px' }}>
                        拼音
                      </label>
                      <input
                        type="text"
                        value={word.pinyin || ''}
                        onChange={(e) => updateNewWord(index, 'pinyin', e.target.value)}
                        placeholder="pīnyīn"
                        style={{
                          width: '100%',
                          padding: '6px 8px',
                          borderRadius: '6px',
                          border: '1px solid #e2e8f0',
                          fontSize: '14px',
                          backgroundColor: 'white'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#64748b', marginBottom: '4px' }}>
                        释义
                      </label>
                      <input
                        type="text"
                        value={word.meaning || ''}
                        onChange={(e) => updateNewWord(index, 'meaning', e.target.value)}
                        placeholder="English meaning"
                        style={{
                          width: '100%',
                          padding: '6px 8px',
                          borderRadius: '6px',
                          border: '1px solid #e2e8f0',
                          fontSize: '14px',
                          backgroundColor: 'white'
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div style={{
                padding: '30px',
                textAlign: 'center',
                border: '2px dashed #e2e8f0',
                borderRadius: '8px',
                color: '#94a3b8'
              }}>
                <p style={{ margin: 0, fontSize: '14px' }}>暂无生词，点击上方"添加生词"开始添加</p>
              </div>
            )}
          </div>
        </div>

        {/* Quiz Editor */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <label style={{ fontSize: '14px', fontWeight: '500', color: '#334155' }}>
              测试题
            </label>
            <button
              onClick={addQuizQuestion}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '6px',
                border: '1px solid #8b5cf6',
                backgroundColor: 'white',
                color: '#8b5cf6',
                fontSize: '13px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              <Plus style={{ width: '14px', height: '14px' }} />
              添加测试题
            </button>
          </div>

          {/* Quiz Questions List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {article.quiz && article.quiz.length > 0 ? (
              article.quiz.map((question, qIndex) => (
                <div
                  key={qIndex}
                  style={{
                    padding: '16px',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    backgroundColor: '#f8fafc'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: '#64748b' }}>
                      测试题 {qIndex + 1}
                    </span>
                    <button
                      onClick={() => deleteQuizQuestion(qIndex)}
                      style={{
                        padding: '4px 8px',
                        borderRadius: '6px',
                        border: '1px solid #ef4444',
                        backgroundColor: 'white',
                        color: '#ef4444',
                        fontSize: '12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <Trash2 style={{ width: '12px', height: '12px' }} />
                      删除
                    </button>
                  </div>
                  
                  {/* Question */}
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#64748b', marginBottom: '4px' }}>
                      问题
                    </label>
                    <input
                      type="text"
                      value={question.question || ''}
                      onChange={(e) => updateQuizQuestion(qIndex, 'question', e.target.value)}
                      placeholder="请输入问题..."
                      style={{
                        width: '100%',
                        padding: '8px',
                        borderRadius: '6px',
                        border: '1px solid #e2e8f0',
                        fontSize: '14px',
                        backgroundColor: 'white'
                      }}
                    />
                  </div>

                  {/* Options */}
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#64748b', marginBottom: '8px' }}>
                      选项
                    </label>
                    <div style={{ display: 'grid', gap: '6px' }}>
                      {question.options && question.options.map((option, oIndex) => (
                        <div key={oIndex} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ 
                            width: '24px', 
                            height: '24px', 
                            borderRadius: '50%', 
                            backgroundColor: question.answer === oIndex ? '#3b82f6' : '#e2e8f0',
                            color: question.answer === oIndex ? 'white' : '#64748b',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '12px',
                            fontWeight: '500',
                            flexShrink: 0
                          }}>
                            {String.fromCharCode(65 + oIndex)}
                          </span>
                          <input
                            type="text"
                            value={option || ''}
                            onChange={(e) => updateQuizOption(qIndex, oIndex, e.target.value)}
                            placeholder={`选项 ${String.fromCharCode(65 + oIndex)}`}
                            style={{
                              flex: 1,
                              padding: '6px 8px',
                              borderRadius: '6px',
                              border: '1px solid #e2e8f0',
                              fontSize: '14px',
                              backgroundColor: 'white'
                            }}
                          />
                          <input
                            type="radio"
                            name={`answer-${qIndex}`}
                            checked={question.answer === oIndex}
                            onChange={() => updateQuizQuestion(qIndex, 'answer', oIndex)}
                            style={{ cursor: 'pointer' }}
                            title="设为正确答案"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Explanation */}
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#64748b', marginBottom: '4px' }}>
                      答案解析
                    </label>
                    <textarea
                      value={question.explanation || ''}
                      onChange={(e) => updateQuizQuestion(qIndex, 'explanation', e.target.value)}
                      rows={2}
                      placeholder="请输入答案解析..."
                      style={{
                        width: '100%',
                        padding: '8px',
                        borderRadius: '6px',
                        border: '1px solid #e2e8f0',
                        fontSize: '14px',
                        resize: 'vertical',
                        backgroundColor: 'white'
                      }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div style={{
                padding: '30px',
                textAlign: 'center',
                border: '2px dashed #e2e8f0',
                borderRadius: '8px',
                color: '#94a3b8'
              }}>
                <p style={{ margin: 0, fontSize: '14px' }}>暂无测试题，点击上方"添加测试题"开始添加</p>
              </div>
            )}
          </div>
        </div>

        {/* SEO Fields */}
        <div style={{ display: 'grid', gap: '16px', padding: '20px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#0f172a' }}>SEO 优化</h3>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#334155', marginBottom: '8px' }}>
              SEO 标题
            </label>
            <input
              type="text"
              value={article.metaTitle || ''}
              onChange={(e) => setArticle({ ...article, metaTitle: e.target.value })}
              placeholder="文章标题 - ChineseMaster"
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                fontSize: '14px',
                backgroundColor: 'white'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#334155', marginBottom: '8px' }}>
              SEO 描述
            </label>
            <textarea
              value={article.metaDescription || ''}
              onChange={(e) => setArticle({ ...article, metaDescription: e.target.value })}
              rows={2}
              placeholder="文章的 SEO 描述..."
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                fontSize: '14px',
                resize: 'vertical',
                backgroundColor: 'white'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
