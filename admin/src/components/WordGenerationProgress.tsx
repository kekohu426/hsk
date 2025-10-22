import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { X, CheckCircle, XCircle, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface WordGenerationProgressProps {
  open: boolean;
  wordIds: string[];
  onClose: () => void;
}

interface ProgressItem {
  id: string;
  word?: string;
  status: 'pending' | 'generating' | 'success' | 'failed';
  error?: string;
}

export function WordGenerationProgress({ open, wordIds, onClose }: WordGenerationProgressProps) {
  const [progress, setProgress] = useState<ProgressItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (open && wordIds.length > 0) {
      startGeneration();
    }

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, [open, wordIds]);

  const startGeneration = async () => {
    setProgress(wordIds.map(id => ({ id, status: 'pending' })));
    setCurrentIndex(0);
    setIsComplete(false);
    setIsCancelled(false);

    const token = localStorage.getItem('admin_token');
    
    try {
      // 使用fetch发送POST请求，接收SSE流
      const response = await fetch('http://localhost:3000/api/admin/words/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ wordIds })
      });

      if (!response.ok) {
        throw new Error('生成请求失败');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('无法读取响应流');
      }

      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = JSON.parse(line.slice(6));
            
            if (data.type === 'complete') {
              handleComplete(data.results);
              break;
            } else if (data.type === 'error') {
              toast.error(data.message);
              setIsComplete(true);
            } else {
              updateProgress(data);
            }
          }
        }
      }

    } catch (error: any) {
      console.error('Generation failed:', error);
      toast.error(error.message || '生成失败');
      setIsComplete(true);
    }
  };

  const updateProgress = (data: any) => {
    setCurrentIndex(data.current);
    
    setProgress(prev => {
      const newProgress = [...prev];
      
      // 更新当前项为生成中
      if (data.current <= wordIds.length) {
        const currentIdx = data.current - 1;
        if (newProgress[currentIdx]) {
          newProgress[currentIdx] = {
            ...newProgress[currentIdx],
            status: data.error ? 'failed' : 'generating',
            word: data.currentWord,
            error: data.error
          };
        }
      }

      // 更新之前的项为成功或失败
      for (let i = 0; i < data.current - 1; i++) {
        if (newProgress[i] && newProgress[i].status !== 'success' && newProgress[i].status !== 'failed') {
          newProgress[i] = {
            ...newProgress[i],
            status: 'success'
          };
        }
      }

      return newProgress;
    });
  };

  const handleComplete = (results: any[]) => {
    setProgress(prev => 
      prev.map((item, idx) => {
        const result = results[idx];
        return {
          ...item,
          status: result?.success ? 'success' : 'failed',
          word: result?.word,
          error: result?.error
        };
      })
    );
    setIsComplete(true);

    const successCount = results.filter(r => r.success).length;
    const failedCount = results.filter(r => !r.success).length;

    if (successCount > 0) {
      toast.success(`成功生成 ${successCount} 个词条`);
    }
    if (failedCount > 0) {
      toast.error(`${failedCount} 个词条生成失败`);
    }
  };

  if (!open) return null;

  const total = wordIds.length;
  const successCount = progress.filter(p => p.status === 'success').length;
  const failedCount = progress.filter(p => p.status === 'failed').length;
  const percentage = total > 0 ? Math.round((currentIndex / total) * 100) : 0;
  const estimatedTimeRemaining = total > 0 && currentIndex > 0
    ? Math.ceil(((total - currentIndex) * 2) / 60) // 每个词约2秒
    : 0;

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
        onClick={isComplete ? onClose : undefined}
      >
        {/* Dialog */}
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            width: '100%',
            maxWidth: '600px',
            padding: '24px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            maxHeight: '80vh',
            overflow: 'auto'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#0f172a' }}>
              {isComplete ? '生成完成' : '正在生成词条...'}
            </h2>
            {isComplete && (
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
            )}
          </div>

          {/* Progress Bar */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '14px', color: '#64748b' }}>
                进度：{currentIndex}/{total}
              </span>
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>
                {percentage}%
              </span>
            </div>
            <div style={{
              width: '100%',
              height: '8px',
              backgroundColor: '#f1f5f9',
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${percentage}%`,
                height: '100%',
                backgroundColor: '#3b82f6',
                transition: 'width 0.3s ease',
                borderRadius: '4px'
              }} />
            </div>
          </div>

          {/* Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '12px',
            marginBottom: '20px'
          }}>
            <div style={{
              padding: '12px',
              borderRadius: '8px',
              backgroundColor: '#f0f9ff',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '20px', fontWeight: '700', color: '#0284c7' }}>
                {currentIndex}
              </div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>已处理</div>
            </div>
            <div style={{
              padding: '12px',
              borderRadius: '8px',
              backgroundColor: '#f0fdf4',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '20px', fontWeight: '700', color: '#22c55e' }}>
                {successCount}
              </div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>成功</div>
            </div>
            <div style={{
              padding: '12px',
              borderRadius: '8px',
              backgroundColor: '#fef2f2',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '20px', fontWeight: '700', color: '#ef4444' }}>
                {failedCount}
              </div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>失败</div>
            </div>
          </div>

          {/* Word List */}
          <div style={{
            maxHeight: '300px',
            overflowY: 'auto',
            marginBottom: '20px',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '12px'
          }}>
            {progress.map((item, index) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '8px',
                  marginBottom: '4px',
                  borderRadius: '6px',
                  backgroundColor: item.status === 'generating' ? '#f0f9ff' : 'transparent'
                }}
              >
                {item.status === 'pending' && (
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '2px solid #e2e8f0' }} />
                )}
                {item.status === 'generating' && (
                  <Loader2 style={{ width: '20px', height: '20px', color: '#3b82f6', animation: 'spin 1s linear infinite' }} />
                )}
                {item.status === 'success' && (
                  <CheckCircle style={{ width: '20px', height: '20px', color: '#22c55e' }} />
                )}
                {item.status === 'failed' && (
                  <XCircle style={{ width: '20px', height: '20px', color: '#ef4444' }} />
                )}
                
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: '500', color: '#0f172a' }}>
                    {item.word || `词汇 ${index + 1}`}
                  </div>
                  {item.status === 'generating' && (
                    <div style={{ fontSize: '12px', color: '#3b82f6' }}>生成中...</div>
                  )}
                  {item.status === 'failed' && item.error && (
                    <div style={{ fontSize: '12px', color: '#ef4444' }}>{item.error}</div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Time Estimate */}
          {!isComplete && estimatedTimeRemaining > 0 && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px',
              backgroundColor: '#fef3c7',
              borderRadius: '8px',
              marginBottom: '20px'
            }}>
              <AlertCircle style={{ width: '16px', height: '16px', color: '#f59e0b' }} />
              <span style={{ fontSize: '14px', color: '#92400e' }}>
                预计剩余时间：约 {estimatedTimeRemaining} 分钟
              </span>
            </div>
          )}

          {/* Footer */}
          {isComplete && (
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                onClick={onClose}
                style={{
                  backgroundColor: '#3b82f6',
                  color: 'white',
                }}
              >
                完成
              </Button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}




