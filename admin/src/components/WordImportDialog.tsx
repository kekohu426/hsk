import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';

interface WordImportDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (words: any[]) => void;
}

export function WordImportDialog({ open, onClose, onSuccess }: WordImportDialogProps) {
  const [wordsText, setWordsText] = useState('');
  const [hskLevel, setHskLevel] = useState(1);
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const wordList = wordsText
    .split(/[,，\n\r]+/)
    .map(w => w.trim())
    .filter(w => w.length > 0);
  
  const uniqueWords = [...new Set(wordList)];
  const wordCount = uniqueWords.length;

  const handleImport = async () => {
    if (wordCount === 0) {
      toast.error('请输入词汇');
      return;
    }

    if (wordCount > 100) {
      toast.error('单次导入不能超过100个词汇');
      return;
    }

    try {
      setLoading(true);
      const response = await api.post('/api/admin/words/import', {
        words: uniqueWords.join(','),
        hskLevel
      });

      if (response.data.success) {
        toast.success(response.data.message);
        onSuccess(response.data.data.imported);
        setWordsText('');
      }
    } catch (error: any) {
      console.error('Import failed:', error);
      toast.error(error.response?.data?.error || '导入失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50,
        }}
        onClick={onClose}
      >
        {/* Dialog */}
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            width: '100%',
            maxWidth: '500px',
            padding: '24px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#0f172a' }}>
              批量导入词汇
            </h2>
            <button
              onClick={onClose}
              style={{
                padding: '4px',
                borderRadius: '4px',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                color: '#94a3b8',
              }}
            >
              <X style={{ width: '20px', height: '20px' }} />
            </button>
          </div>

          {/* Content */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#0f172a', marginBottom: '8px' }}>
              HSK等级
            </label>
            <select
              value={hskLevel}
              onChange={(e) => setHskLevel(Number(e.target.value))}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #e2e8f0',
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              <option value={1}>HSK 1</option>
              <option value={2}>HSK 2</option>
              <option value={3}>HSK 3</option>
              <option value={4}>HSK 4</option>
              <option value={5}>HSK 5</option>
              <option value={6}>HSK 6</option>
            </select>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label style={{ fontSize: '14px', fontWeight: '500', color: '#0f172a' }}>
                词汇列表（逗号或换行分隔）
              </label>
              {wordCount > 0 && (
                <span style={{ fontSize: '12px', color: '#64748b' }}>
                  {wordCount} 个词汇
                </span>
              )}
            </div>
            <textarea
              value={wordsText}
              onChange={(e) => setWordsText(e.target.value)}
              placeholder="学校,老师,学生&#10;或每行一个词汇"
              rows={8}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '6px',
                border: '1px solid #e2e8f0',
                fontSize: '14px',
                fontFamily: 'inherit',
                resize: 'vertical',
              }}
            />
            <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
              支持中英文逗号、换行符分隔，自动去重
            </p>
          </div>

          {/* Footer */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <Button
              variant="ghost"
              onClick={onClose}
              disabled={loading}
            >
              取消
            </Button>
            <Button
              onClick={handleImport}
              disabled={loading || wordCount === 0}
              style={{
                backgroundColor: wordCount > 0 && !loading ? '#8b5cf6' : '#e2e8f0',
                color: wordCount > 0 && !loading ? 'white' : '#94a3b8',
              }}
            >
              {loading ? '导入中...' : `导入 (${wordCount} 个词汇)`}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}




