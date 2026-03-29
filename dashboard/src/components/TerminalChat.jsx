import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Copy, Check, Pencil, Menu, Package, Play } from 'lucide-react';
import { askLobster } from '../services/ai';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { hasDownloadableFiles, downloadPluginZip, openInPlayground } from '../utils/zipBuilder';

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button 
      onClick={copy}
      style={{background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '4px', padding: '4px 8px', color: 'white', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', fontSize: '12px', transition: 'all 0.2s'}}
    >
      {copied ? <Check size={14} color="#4ade80" /> : <Copy size={14} />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}

function UserMessageActions({ content, onEdit }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-start', marginTop: '12px', paddingTop: '8px', borderTop: '1px solid rgba(230, 57, 70, 0.2)' }}>
      <button 
        onClick={handleCopy}
        title="複製文字"
        style={{background: 'transparent', border: 'none', color: copied ? '#4ade80' : 'var(--bl-text-dim)', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', transition: 'color 0.2s'}}
        onMouseEnter={e => e.currentTarget.style.color = copied ? '#4ade80' : 'white'}
        onMouseLeave={e => e.currentTarget.style.color = copied ? '#4ade80' : 'var(--bl-text-dim)'}
      >
        {copied ? <Check size={16} /> : <Copy size={16} />}
      </button>
      <button 
        onClick={onEdit}
        title="編輯並重新發送 (Edit & Resend)"
        style={{background: 'transparent', border: 'none', color: 'var(--bl-text-dim)', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', transition: 'color 0.2s'}}
        onMouseEnter={e => e.currentTarget.style.color = 'var(--bl-accent)'}
        onMouseLeave={e => e.currentTarget.style.color = 'var(--bl-text-dim)'}
      >
        <Pencil size={16} />
      </button>
    </div>
  );
}

function DownloadZipButton({ content, sessionTitle }) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await downloadPluginZip(content, sessionTitle);
    } catch (err) {
      alert('打包失敗：' + err.message);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={downloading}
      style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        padding: '10px 20px',
        background: 'linear-gradient(135deg, rgba(230,57,70,0.15), rgba(230,57,70,0.05))',
        border: '1px solid var(--bl-accent)',
        borderRadius: '8px', color: 'var(--bl-accent)',
        cursor: downloading ? 'wait' : 'pointer',
        fontSize: '14px', fontWeight: 'bold',
        transition: 'all 0.3s',
        boxShadow: '0 0 15px rgba(230,57,70,0.1)'
      }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 25px rgba(230,57,70,0.3)'; e.currentTarget.style.background = 'linear-gradient(135deg, rgba(230,57,70,0.25), rgba(230,57,70,0.1))'; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 0 15px rgba(230,57,70,0.1)'; e.currentTarget.style.background = 'linear-gradient(135deg, rgba(230,57,70,0.15), rgba(230,57,70,0.05))'; }}
    >
      <Package size={18} />
      {downloading ? '正在打包中...' : '📦 一鍵下載 WP 外掛 (.zip)'}
    </button>
  );
}

function PlaygroundButton({ content }) {
  return (
    <button
      onClick={() => openInPlayground(content)}
      style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        padding: '10px 20px',
        background: 'linear-gradient(135deg, rgba(74,222,128,0.15), rgba(74,222,128,0.05))',
        border: '1px solid #4ade80',
        borderRadius: '8px', color: '#4ade80',
        cursor: 'pointer',
        fontSize: '14px', fontWeight: 'bold',
        transition: 'all 0.3s',
        boxShadow: '0 0 15px rgba(74,222,128,0.1)'
      }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 25px rgba(74,222,128,0.3)'; e.currentTarget.style.background = 'linear-gradient(135deg, rgba(74,222,128,0.25), rgba(74,222,128,0.1))'; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 0 15px rgba(74,222,128,0.1)'; e.currentTarget.style.background = 'linear-gradient(135deg, rgba(74,222,128,0.15), rgba(74,222,128,0.05))'; }}
    >
      <Play size={18} />
      🚀 在 WP Playground 即時預覽
    </button>
  );
}

export default function TerminalChat({ apiKey, messages = [], setMessages, isSidebarOpen, onToggleSidebar, sessionTitle }) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    
    const userMsg = input.trim();
    setInput('');
    const newHistory = [...messages, { role: 'user', content: userMsg }];
    setMessages(newHistory);
    setLoading(true);

    try {
      const response = await askLobster(newHistory, apiKey);
      setMessages([...newHistory, { role: 'assistant', content: response }]);
    } catch (error) {
      setMessages([...newHistory, { role: 'assistant', content: `**Error:** ${error.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden'}}>
      <div style={{padding: '16px', borderBottom: '1px solid var(--bl-border)', display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(0,0,0,0.3)'}}>
        <button onClick={onToggleSidebar} style={{background: 'transparent', border: 'none', color: 'var(--bl-text-primary)', cursor: 'pointer', padding: '4px', display: 'flex', transition: 'color 0.2s'}} title="切換側邊欄 (Toggle Sidebar)" onMouseEnter={e => e.currentTarget.style.color = 'var(--bl-accent)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--bl-text-primary)'}>
          <Menu size={20} />
        </button>
        <div style={{width: 10, height: 10, borderRadius: '50%', background: 'var(--bl-accent)', boxShadow: '0 0 10px var(--bl-accent-glow)', marginLeft: '8px'}} />
        <span style={{fontSize: '14px', fontFamily: 'monospace', color: 'var(--bl-text-dim)'}}>black-lobster-shell ~ /wp-dev</span>
      </div>

      <div className="custom-scrollbar" style={{flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '32px'}}>
        {messages.length === 0 && (
          <div style={{margin: 'auto', textAlign: 'center', color: 'var(--bl-text-dim)'}}>
            <Bot size={48} color="var(--bl-accent)" style={{margin: '0 auto 16px', filter: 'drop-shadow(0 0 10px var(--bl-accent-glow))'}} />
            <h2>Awaiting Instructions</h2>
            <p>Type "寫一個外掛" to begin engaging with Taiwanese localization rules.</p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} style={{
            display: 'flex', 
            gap: '16px', 
            alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', 
            maxWidth: msg.role === 'user' ? '85%' : '100%',
            width: msg.role === 'user' ? 'auto' : '100%'
          }}>
            {msg.role === 'assistant' && (
              <div style={{width: 32, height: 32, borderRadius: '8px', background: 'var(--bl-bg)', border: '1px solid var(--bl-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', shrink: 0}}>
                <Bot size={18} color="var(--bl-accent)" />
              </div>
            )}
            
            <div style={{
              background: msg.role === 'user' ? 'rgba(230, 57, 70, 0.1)' : 'transparent',
              border: msg.role === 'user' ? '1px solid var(--bl-accent-glow)' : 'none',
              padding: msg.role === 'user' ? '16px' : '0 8px 16px 0',
              borderRadius: msg.role === 'user' ? '12px' : '0',
              color: 'var(--bl-text-primary)',
              minWidth: 0,
              flex: 1,
              overflowX: 'hidden'
            }}>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  p({node, children, ...props}) {
                    return <p style={{lineHeight: 1.6, marginBottom: '16px'}} {...props}>{children}</p>
                  },
                  code({node, inline, className, children, ...props}) {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                      <div style={{ position: 'relative', marginTop: '16px', marginBottom: '16px', borderRadius: '8px', border: '1px solid var(--bl-border)', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ position: 'sticky', top: 0, zIndex: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(37, 37, 38, 0.95)', backdropFilter: 'blur(4px)', padding: '8px 16px', borderBottom: '1px solid #1e1e1e', borderTopLeftRadius: '8px', borderTopRightRadius: '8px' }}>
                          <span style={{ fontSize: '12px', color: '#a3a3a3', fontFamily: 'monospace', textTransform: 'uppercase' }}>{match[1]}</span>
                          <CopyButton text={String(children).replace(/\n$/, '')} />
                        </div>
                          <SyntaxHighlighter
                            children={String(children).replace(/\n$/, '')}
                            style={vscDarkPlus}
                            language={match[1]}
                            showLineNumbers={true}
                            wrapLines={false}
                            customStyle={{ 
                              margin: 0, 
                              padding: '16px', 
                              background: '#1e1e1e', 
                              fontSize: '13px', 
                              lineHeight: '1.5',
                              overflowX: 'auto',
                              width: '100%',
                              boxSizing: 'border-box',
                              borderBottomLeftRadius: '8px',
                              borderBottomRightRadius: '8px'
                            }}
                            codeTagProps={{
                              style: {
                                fontFamily: 'Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace'
                              }
                            }}
                            {...props}
                          />
                      </div>
                    ) : (
                      <code className={className} style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px', fontSize: '14px', fontFamily: 'monospace' }} {...props}>
                        {children}
                      </code>
                    )
                  }
                }}
              >
                {msg.content}
              </ReactMarkdown>
              
              {msg.role === 'user' && (
                <UserMessageActions content={msg.content} onEdit={() => setInput(msg.content)} />
              )}
              
              {msg.role === 'assistant' && hasDownloadableFiles(msg.content) && (
                <div style={{display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '16px', alignItems: 'stretch'}}>
                  <DownloadZipButton content={msg.content} sessionTitle={sessionTitle} />
                  <PlaygroundButton content={msg.content} />
                </div>
              )}
            </div>
          </div>
        ))}
        
        {loading && (
          <div style={{display: 'flex', gap: '16px', alignSelf: 'flex-start', maxWidth: '100%'}}>
             <div style={{width: 32, height: 32, borderRadius: '8px', background: 'var(--bl-bg)', border: '1px solid var(--bl-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', shrink: 0}}>
                <Bot size={18} color="var(--bl-accent)" className="animate-pulse" />
              </div>
              <div style={{padding: '0 8px', color: 'var(--bl-text-dim)', alignSelf: 'center'}}>
                Thinking locally and writing codes...
              </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div style={{padding: '24px', background: 'rgba(0,0,0,0.2)', borderTop: '1px solid var(--bl-border)'}}>
        <form onSubmit={handleSubmit} style={{maxWidth: '800px', margin: '0 auto', display: 'flex', gap: '12px', background: 'var(--bl-bg)', border: '1px solid var(--bl-border)', borderRadius: '12px', padding: '8px 16px', alignItems: 'center'}}>
          <span style={{color: 'var(--bl-accent)', fontFamily: 'monospace'}}>&gt;</span>
          <input 
            type="text" 
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Deploy a new WordPress capability..."
            style={{flex: 1, background: 'transparent', border: 'none', color: 'white', outline: 'none', padding: '8px', fontSize: '15px'}}
          />
          <button type="submit" disabled={loading} style={{background: 'transparent', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.5 : 1}}>
            <Send size={20} color="var(--bl-accent)" style={{filter: 'drop-shadow(0 0 5px var(--bl-accent-glow))'}} />
          </button>
        </form>
      </div>
    </div>
  );
}
