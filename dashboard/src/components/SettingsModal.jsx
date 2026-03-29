import React, { useState, useEffect } from 'react';
import { Key, CheckCircle, XCircle, Loader } from 'lucide-react';
import { testApiKey } from '../services/ai';

export default function SettingsModal({ onClose }) {
  const [apiKey, setApiKey] = useState('');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null); // null | 'success' | 'fail'
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('bl_openai_key');
    if (saved) setApiKey(saved);
  }, []);

  const handleSave = async () => {
    if (!apiKey.trim()) {
      setTestResult('fail');
      setErrorMsg('請輸入 API Key。');
      return;
    }

    // 先驗證再儲存
    setTesting(true);
    setTestResult(null);
    setErrorMsg('');

    const result = await testApiKey(apiKey.trim());

    if (result.valid) {
      setTestResult('success');
      localStorage.setItem('bl_openai_key', apiKey.trim());
      // 延遲關閉，讓使用者看到成功動畫
      setTimeout(() => {
        onClose();
        window.location.reload(); // 重新載入以套用新 Key
      }, 1200);
    } else {
      setTestResult('fail');
      setErrorMsg(result.error || 'API Key 驗證失敗，請確認後重試。');
    }
    setTesting(false);
  };

  return (
    <div style={{position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.8)', padding: '24px', zIndex: 50}}>
      <div className="glass-panel" style={{width: '100%', maxWidth: '440px', borderRadius: '16px', border: '1px solid var(--bl-accent-glow)', padding: '32px'}}>
        <h2 style={{fontSize: '22px', fontWeight: 'bold', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px'}}>
          <Key size={22} color="var(--bl-accent)" /> 神經連結設定 (API Key)
        </h2>
        
        <div style={{marginBottom: '20px'}}>
          <label style={{display: 'block', fontSize: '14px', color: 'var(--bl-text-dim)', marginBottom: '8px'}}>OpenAI API Key</label>
          <input 
            type="password"
            value={apiKey}
            onChange={(e) => { setApiKey(e.target.value); setTestResult(null); }}
            placeholder="sk-..."
            disabled={testing}
            style={{width: '100%', boxSizing: 'border-box', background: 'rgba(0,0,0,0.5)', border: `1px solid ${testResult === 'fail' ? '#f87171' : testResult === 'success' ? '#4ade80' : 'var(--bl-border)'}`, color: 'white', padding: '12px 16px', borderRadius: '8px', outline: 'none', transition: 'border-color 0.3s'}}
          />
          <p style={{fontSize: '12px', color: 'var(--bl-text-dim)', marginTop: '8px'}}>
            金鑰只會存在您的瀏覽器 localStorage，不會傳到任何第三方伺服器。
          </p>
        </div>

        {/* 驗證結果回饋 */}
        {testResult === 'success' && (
          <div style={{display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', borderRadius: '8px', background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.3)', marginBottom: '20px', animation: 'fadeIn 0.3s'}}>
            <CheckCircle size={20} color="#4ade80" />
            <span style={{color: '#4ade80', fontSize: '14px', fontWeight: 'bold'}}>✅ 連線成功！神經連結已建立，正在載入系統...</span>
          </div>
        )}
        {testResult === 'fail' && (
          <div style={{display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', borderRadius: '8px', background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)', marginBottom: '20px'}}>
            <XCircle size={20} color="#f87171" />
            <span style={{color: '#f87171', fontSize: '13px'}}>{errorMsg}</span>
          </div>
        )}

        <div style={{display: 'flex', justifyContent: 'flex-end', gap: '12px'}}>
          <button 
            onClick={onClose} 
            disabled={testing}
            style={{padding: '10px 16px', borderRadius: '8px', border: '1px solid var(--bl-border)', background: 'transparent', color: 'white', cursor: 'pointer'}}>
            取消
          </button>
          <button 
            onClick={handleSave} 
            disabled={testing}
            style={{
              padding: '10px 20px', borderRadius: '8px', border: 'none', 
              background: testing ? 'rgba(230,57,70,0.5)' : 'var(--bl-accent)', 
              color: 'white', fontWeight: 'bold', 
              cursor: testing ? 'wait' : 'pointer', 
              boxShadow: '0 0 15px var(--bl-accent-glow)',
              display: 'flex', alignItems: 'center', gap: '8px'
            }}>
            {testing && <Loader size={16} className="animate-spin" style={{animation: 'spin 1s linear infinite'}} />}
            {testing ? '驗證中...' : '驗證並儲存'}
          </button>
        </div>
      </div>
    </div>
  );
}
