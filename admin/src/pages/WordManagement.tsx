import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BookOpen, Search, Upload, Play, Eye, Trash2, CheckCircle, XCircle, Clock, Loader2 } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';
import { WordImportDialog } from '@/components/WordImportDialog';
import { WordGenerationProgress } from '@/components/WordGenerationProgress';

interface WordEntry {
  id: string;
  word: string;
  slug: string;
  hskLevel: number;
  status: 'PENDING_IMPORT' | 'GENERATING' | 'GENERATED' | 'PUBLISHED' | 'FAILED';
  seoScore: number | null;
  wordCount: number | null;
  importedAt: string;
  generatedAt: string | null;
  publishedAt: string | null;
  generateError: string | null;
}

const STATUS_CONFIG = {
  PENDING_IMPORT: { label: '待生成', color: '#94a3b8', icon: Clock },
  GENERATING: { label: '生成中', color: '#3b82f6', icon: Loader2 },
  GENERATED: { label: '已生成', color: '#22c55e', icon: CheckCircle },
  PUBLISHED: { label: '已发布', color: '#8b5cf6', icon: CheckCircle },
  FAILED: { label: '生成失败', color: '#ef4444', icon: XCircle },
};

export function WordManagement() {
  const navigate = useNavigate();
  const [words, setWords] = useState<WordEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [hskFilter, setHskFilter] = useState<string>('all');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  
  // Dialog states
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showGenerationProgress, setShowGenerationProgress] = useState(false);
  const [generatingIds, setGeneratingIds] = useState<string[]>([]);

  useEffect(() => {
    fetchWords();
  }, [statusFilter, hskFilter]);

  const fetchWords = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (statusFilter !== 'all') params.status = statusFilter;
      if (hskFilter !== 'all') params.hskLevel = hskFilter;
      
      const response = await api.get('/api/admin/words', { params });
      setWords(response.data.data);
    } catch (error) {
      console.error('Failed to fetch words:', error);
      toast.error('加载词条失败');
    } finally {
      setLoading(false);
    }
  };

  const handleImportSuccess = (importedWords: any[]) => {
    toast.success(`成功导入 ${importedWords.length} 个词汇`);
    setShowImportDialog(false);
    fetchWords();
  };

  const handleGenerate = async () => {
    if (selectedIds.size === 0) {
      toast.error('请先选择要生成的词条');
      return;
    }

    if (selectedIds.size > 10) {
      toast.error('单次生成不能超过10个词条');
      return;
    }

    setGeneratingIds(Array.from(selectedIds));
    setShowGenerationProgress(true);
  };

  const handleGenerationComplete = () => {
    setShowGenerationProgress(false);
    setSelectedIds(new Set());
    setGeneratingIds([]);
    fetchWords();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这个词条吗？此操作无法撤销。')) return;

    try {
      await api.delete(`/api/admin/words/${id}`);
      toast.success('词条已删除');
      fetchWords();
    } catch (error: any) {
      console.error('Delete failed:', error);
      toast.error(error.response?.data?.error || '删除失败');
    }
  };

  const handlePublish = async (id: string) => {
    try {
      await api.post(`/api/admin/words/${id}/publish`);
      toast.success('词条已发布');
      fetchWords();
    } catch (error: any) {
      console.error('Publish failed:', error);
      toast.error(error.response?.data?.error || '发布失败');
    }
  };

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredWords.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredWords.map(w => w.id)));
    }
  };

  const filteredWords = words.filter((word) =>
    word.word.includes(search)
  );

  const StatusBadge = ({ status }: { status: WordEntry['status'] }) => {
    const config = STATUS_CONFIG[status];
    const Icon = config.icon;
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          padding: '4px 8px',
          borderRadius: '6px',
          fontSize: '12px',
          fontWeight: '500',
          backgroundColor: `${config.color}15`,
          color: config.color,
        }}
      >
        <Icon 
          style={{ 
            width: '14px', 
            height: '14px',
            ...(status === 'GENERATING' && { animation: 'spin 1s linear infinite' })
          }} 
        />
        {config.label}
      </span>
    );
  };

  return (
    <>
      <div style={{ maxWidth: '1400px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <BookOpen style={{ width: '20px', height: '20px', color: '#8b5cf6' }} />
              <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#0f172a' }}>
                词汇管理
              </h1>
            </div>
            <p style={{ fontSize: '14px', color: '#64748b' }}>
              批量导入词汇，AI自动生成词条内容
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Button
              onClick={() => setShowImportDialog(true)}
              style={{ backgroundColor: '#8b5cf6', color: 'white', height: '40px' }}
            >
              <Upload style={{ width: '16px', height: '16px', marginRight: '8px' }} />
              批量导入
            </Button>
            <Button
              onClick={handleGenerate}
              disabled={selectedIds.size === 0}
              style={{ 
                backgroundColor: selectedIds.size > 0 ? '#2563eb' : '#e2e8f0', 
                color: selectedIds.size > 0 ? 'white' : '#94a3b8',
                height: '40px' 
              }}
            >
              <Play style={{ width: '16px', height: '16px', marginRight: '8px' }} />
              生成词条 {selectedIds.size > 0 && `(${selectedIds.size})`}
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div style={{ 
          display: 'flex', 
          gap: '12px', 
          marginBottom: '24px',
          padding: '16px',
          backgroundColor: 'white',
          borderRadius: '8px',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search 
              style={{ 
                position: 'absolute', 
                left: '12px', 
                top: '50%', 
                transform: 'translateY(-50%)',
                width: '16px',
                height: '16px',
                color: '#94a3b8'
              }} 
            />
            <Input
              placeholder="搜索词汇..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '40px' }}
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: '0 12px',
              borderRadius: '6px',
              border: '1px solid #e2e8f0',
              backgroundColor: 'white',
              fontSize: '14px',
              cursor: 'pointer',
              minWidth: '120px'
            }}
          >
            <option value="all">全部状态</option>
            <option value="PENDING_IMPORT">待生成</option>
            <option value="GENERATING">生成中</option>
            <option value="GENERATED">已生成</option>
            <option value="PUBLISHED">已发布</option>
            <option value="FAILED">生成失败</option>
          </select>
          <select
            value={hskFilter}
            onChange={(e) => setHskFilter(e.target.value)}
            style={{
              padding: '0 12px',
              borderRadius: '6px',
              border: '1px solid #e2e8f0',
              backgroundColor: 'white',
              fontSize: '14px',
              cursor: 'pointer',
              minWidth: '120px'
            }}
          >
            <option value="all">全部等级</option>
            <option value="1">HSK 1</option>
            <option value="2">HSK 2</option>
            <option value="3">HSK 3</option>
            <option value="4">HSK 4</option>
            <option value="5">HSK 5</option>
            <option value="6">HSK 6</option>
          </select>
        </div>

        {/* Table */}
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '8px', 
          border: '1px solid #e2e8f0',
          overflow: 'hidden'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <tr>
                <th style={{ padding: '12px 16px', textAlign: 'left', width: '40px' }}>
                  <input
                    type="checkbox"
                    checked={selectedIds.size === filteredWords.length && filteredWords.length > 0}
                    onChange={toggleSelectAll}
                    style={{ cursor: 'pointer' }}
                  />
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#64748b' }}>
                  词汇
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#64748b' }}>
                  HSK等级
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#64748b' }}>
                  状态
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#64748b' }}>
                  导入时间
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '12px', fontWeight: '600', color: '#64748b' }}>
                  操作
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ padding: '48px', textAlign: 'center', color: '#94a3b8' }}>
                    <Loader2 style={{ width: '24px', height: '24px', margin: '0 auto 8px', animation: 'spin 1s linear infinite' }} />
                    <div>加载中...</div>
                  </td>
                </tr>
              ) : filteredWords.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '48px', textAlign: 'center', color: '#94a3b8' }}>
                    暂无数据
                  </td>
                </tr>
              ) : (
                filteredWords.map((word) => (
                  <tr key={word.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '16px' }}>
                      <input
                        type="checkbox"
                        checked={selectedIds.has(word.id)}
                        onChange={() => toggleSelect(word.id)}
                        style={{ cursor: 'pointer' }}
                      />
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ fontSize: '14px', fontWeight: '500', color: '#0f172a' }}>
                        {word.word}
                      </div>
                      <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                        {word.slug}
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '500',
                        backgroundColor: '#f0f9ff',
                        color: '#0284c7'
                      }}>
                        HSK {word.hskLevel}
                      </span>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <StatusBadge status={word.status} />
                      {word.generateError && (
                        <div style={{ fontSize: '11px', color: '#ef4444', marginTop: '4px', maxWidth: '200px' }}>
                          {word.generateError}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '16px', fontSize: '14px', color: '#64748b' }}>
                      {new Date(word.importedAt).toLocaleDateString('zh-CN')}
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        {word.status === 'GENERATED' && (
                          <>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => navigate(`/words/preview/${word.id}`)}
                              style={{ padding: '4px 8px' }}
                            >
                              <Eye style={{ width: '14px', height: '14px', marginRight: '4px' }} />
                              预览
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handlePublish(word.id)}
                              style={{ 
                                padding: '4px 12px',
                                backgroundColor: '#8b5cf6',
                                color: 'white'
                              }}
                            >
                              发布
                            </Button>
                          </>
                        )}
                        {word.status === 'PUBLISHED' && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => navigate(`/words/preview/${word.id}`)}
                            style={{ padding: '4px 8px' }}
                          >
                            <Eye style={{ width: '14px', height: '14px', marginRight: '4px' }} />
                            查看
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(word.id)}
                          style={{ padding: '4px 8px', color: '#ef4444' }}
                        >
                          <Trash2 style={{ width: '14px', height: '14px' }} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dialogs */}
      <WordImportDialog
        open={showImportDialog}
        onClose={() => setShowImportDialog(false)}
        onSuccess={handleImportSuccess}
      />

      <WordGenerationProgress
        open={showGenerationProgress}
        wordIds={generatingIds}
        onClose={handleGenerationComplete}
      />

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}




