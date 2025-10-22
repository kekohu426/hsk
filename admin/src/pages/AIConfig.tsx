import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings, Save, CheckCircle, AlertCircle, Zap } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';
import type { AIConfig as AIConfigType } from '@/types';

export function AIConfig() {
  const [configs, setConfigs] = useState<AIConfigType[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchConfigs();
  }, []);

  const fetchConfigs = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/admin/ai-config');
      setConfigs(response.data.configs || []);
    } catch (error) {
      console.error('Failed to fetch configs:', error);
      toast.error('加载配置失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (config: AIConfigType) => {
    try {
      setSaving(true);
      // Only send model and apiKey to backend
      await api.put(`/api/admin/ai-config/${config.id}`, {
        model: config.model,
        apiKey: config.apiKey
      });
      toast.success('配置已保存');
      fetchConfigs();
    } catch (error: any) {
      console.error('Save failed:', error);
      toast.error(error.response?.data?.error || '保存失败');
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (id: string, isActive: boolean) => {
    try {
      await api.patch(`/api/admin/ai-config/${id}`, { isActive });
      toast.success(isActive ? 'AI 提供商已激活' : 'AI 提供商已停用');
      fetchConfigs();
    } catch (error) {
      console.error('Toggle failed:', error);
      toast.error('切换失败');
    }
  };

  const updateConfig = (id: string, field: string, value: any) => {
    setConfigs(configs.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const providers = [
    { 
      id: 'glm', 
      name: 'GLM-4 (智谱AI)', 
      models: ['glm-4', 'glm-4-air', 'glm-4-flash'],
      recommended: true,
      description: '推荐用于中文内容生成'
    },
    { 
      id: 'openai', 
      name: 'OpenAI', 
      models: ['gpt-4', 'gpt-4-turbo', 'gpt-3.5-turbo'],
      description: '强大的通用AI模型'
    },
    { 
      id: 'claude', 
      name: 'Anthropic Claude', 
      models: ['claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku'],
      description: '优秀的对话和写作能力'
    },
  ];

  return (
    <div style={{ maxWidth: '1000px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <Settings style={{ width: '20px', height: '20px', color: '#64748b' }} />
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#0f172a' }}>
            AI 配置
          </h1>
        </div>
        <p style={{ fontSize: '14px', color: '#64748b' }}>
          管理用于内容生成的 AI 提供商
        </p>
      </div>

      {/* Info Banner */}
      <div style={{
        backgroundColor: '#eff6ff',
        border: '1px solid #bfdbfe',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '32px'
      }}>
        <div style={{ display: 'flex', gap: '12px' }}>
          <AlertCircle style={{ width: '20px', height: '20px', color: '#2563eb', flexShrink: 0, marginTop: '2px' }} />
          <div style={{ flex: 1, fontSize: '14px', color: '#1e40af' }}>
            <p style={{ fontWeight: '600', marginBottom: '8px' }}>配置提示</p>
            <ul style={{ listStyle: 'disc', paddingLeft: '20px', color: '#3b82f6' }}>
              <li>同一时间只能激活一个 AI 提供商</li>
              <li>推荐使用 GLM-4 生成中文内容，效果更好</li>
              <li>保存后请测试配置确保正常工作</li>
              <li>API 密钥经过加密存储，不会泄露</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Providers */}
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
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {providers.map((provider) => {
            const config = configs.find(c => c.provider === provider.id) || {
              id: provider.id,
              provider: provider.id as any,
              model: provider.models[0],
              apiKey: '',
              isActive: false,
            };

            return (
              <div
                key={provider.id}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                  overflow: 'hidden'
                }}
              >
                {/* Header */}
                <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', gap: '16px' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#0f172a' }}>
                          {provider.name}
                        </h3>
                        {provider.recommended && (
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '4px 10px',
                            borderRadius: '6px',
                            backgroundColor: '#dcfce7',
                            color: '#16a34a',
                            fontSize: '12px',
                            fontWeight: '600'
                          }}>
                            <Zap style={{ width: '12px', height: '12px' }} />
                            推荐
                          </span>
                        )}
                        {config.isActive && (
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '4px 10px',
                            borderRadius: '6px',
                            backgroundColor: '#dbeafe',
                            color: '#2563eb',
                            fontSize: '12px',
                            fontWeight: '600'
                          }}>
                            <CheckCircle style={{ width: '12px', height: '12px' }} />
                            已激活
                          </span>
                        )}
                      </div>
                      <p style={{ fontSize: '14px', color: '#64748b' }}>{provider.description}</p>
                    </div>
                    <button
                      onClick={() => handleToggle(config.id, !config.isActive)}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '8px',
                        border: '1px solid',
                        borderColor: config.isActive ? '#fee2e2' : '#dcfce7',
                        backgroundColor: config.isActive ? 'white' : '#16a34a',
                        color: config.isActive ? '#dc2626' : 'white',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        flexShrink: 0
                      }}
                      onMouseEnter={(e) => {
                        if (config.isActive) {
                          e.currentTarget.style.backgroundColor = '#fef2f2';
                        } else {
                          e.currentTarget.style.backgroundColor = '#15803d';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (config.isActive) {
                          e.currentTarget.style.backgroundColor = 'white';
                        } else {
                          e.currentTarget.style.backgroundColor = '#16a34a';
                        }
                      }}
                    >
                      {config.isActive ? '停用' : '激活'}
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div style={{ padding: '20px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                    <div>
                      <Label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#475569', marginBottom: '8px' }}>
                        选择模型
                      </Label>
                      <select
                        value={config.model}
                        onChange={(e) => updateConfig(config.id, 'model', e.target.value)}
                        style={{
                          width: '100%',
                          height: '40px',
                          borderRadius: '8px',
                          border: '1px solid #e2e8f0',
                          backgroundColor: 'white',
                          padding: '0 12px',
                          fontSize: '14px',
                          color: '#0f172a',
                          cursor: 'pointer',
                          outline: 'none'
                        }}
                      >
                        {provider.models.map((model) => (
                          <option key={model} value={model}>
                            {model}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <Label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#475569', marginBottom: '8px' }}>
                        API 密钥
                      </Label>
                      <Input
                        type="password"
                        placeholder="sk-..."
                        value={config.apiKey}
                        onChange={(e) => updateConfig(config.id, 'apiKey', e.target.value)}
                        style={{ borderColor: '#e2e8f0' }}
                      />
                    </div>
                  </div>

                  <Button
                    onClick={() => handleSave(config)}
                    disabled={saving}
                    style={{
                      width: '100%',
                      height: '40px',
                      backgroundColor: '#2563eb',
                      color: 'white',
                      fontSize: '14px',
                      fontWeight: '500',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      cursor: saving ? 'not-allowed' : 'pointer',
                      opacity: saving ? 0.5 : 1
                    }}
                  >
                    <Save style={{ width: '16px', height: '16px' }} />
                    {saving ? '保存中...' : '保存配置'}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
