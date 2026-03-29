import React, { useState, useRef, useEffect } from 'react';
import { Terminal, ShieldCheck, Box, Settings, Plus, MessageSquare, Pin, Pencil, Trash2 } from 'lucide-react';

function SessionItem({ s, isActive, onSelect, onTogglePin, onRename, onDelete }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(s.title);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      // Optionally select all text
      inputRef.current?.select();
    }
  }, [isEditing]);

  const handleSaveRename = () => {
    setIsEditing(false);
    if (editValue.trim() && editValue !== s.title) {
      onRename(s.id, editValue);
    } else {
      setEditValue(s.title); // revert if empty or unchanged
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSaveRename();
    if (e.key === 'Escape') {
      setIsEditing(false);
      setEditValue(s.title);
    }
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        boxSizing: 'border-box',
        width: '100%',
        padding: '10px 12px',
        borderRadius: '8px',
        background: isActive ? 'rgba(230, 57, 70, 0.1)' : (isHovered ? 'rgba(255,255,255,0.03)' : 'transparent'),
        color: isActive ? 'var(--bl-accent)' : 'var(--bl-text-dim)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        cursor: isEditing ? 'default' : 'pointer',
        transition: 'all 0.2s',
        position: 'relative'
      }}
      onClick={() => { if (!isEditing) onSelect(); }}
    >
      <MessageSquare size={16} style={{minWidth: '16px', flexShrink: 0}} />
      
      {isEditing ? (
        <input 
          ref={inputRef}
          value={editValue}
          onChange={e => setEditValue(e.target.value)}
          onBlur={handleSaveRename}
          onKeyDown={handleKeyDown}
          onClick={e => e.stopPropagation()}
          style={{
            flex: 1, 
            background: 'var(--bl-bg)', 
            border: '1px solid var(--bl-accent)', 
            color: 'white', 
            borderRadius: '4px', 
            padding: '2px 4px', 
            fontSize: '13px', 
            outline: 'none',
            minWidth: 0
          }}
        />
      ) : (
        <span style={{overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1}} title={s.title}>{s.title}</span>
      )}

      {/* Action Bar */}
      {(isHovered || s.isPinned) && !isEditing && (
        <div style={{display: 'flex', gap: '4px', background: isActive ? 'transparent' : (isHovered ? 'var(--bl-sidebar)' : 'transparent'), paddingLeft: '4px'}} onClick={e => e.stopPropagation()}>
          <button onClick={() => onTogglePin(s.id)} style={{background: 'transparent', border: 'none', cursor: 'pointer', color: s.isPinned ? '#fbbf24' : 'var(--bl-text-dim)', padding: '2px', display: 'flex'}} title={s.isPinned ? '取消釘選' : '釘選對話'}>
            <Pin size={14} fill={s.isPinned ? '#fbbf24' : 'none'} transform="rotate(45)" />
          </button>
          
          {isHovered && (
             <>
               <button onClick={() => { setIsEditing(true); setEditValue(s.title); }} style={{background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--bl-text-dim)', padding: '2px', display: 'flex'}} title="更名" onMouseEnter={e => e.currentTarget.style.color = 'white'} onMouseLeave={e => e.currentTarget.style.color = 'var(--bl-text-dim)'}>
                 <Pencil size={14} />
               </button>
               <button onClick={() => onDelete(s.id)} style={{background: 'transparent', border: 'none', cursor: 'pointer', color: '#f87171', padding: '2px', display: 'flex', opacity: 0.7}} title="刪除" onMouseEnter={e => e.currentTarget.style.opacity = 1} onMouseLeave={e => e.currentTarget.style.opacity = 0.7}>
                 <Trash2 size={14} />
               </button>
             </>
          )}
        </div>
      )}
    </div>
  );
}


export default function Sidebar({ onOpenSettings, isOpen, sessions, currentSessionId, onSelectSession, onNewChat, onTogglePin, onRename, onDelete }) {
  const pinnedSessions = sessions.filter(s => s.isPinned);
  const unpinnedSessions = sessions.filter(s => !s.isPinned);

  return (
    <div className="custom-scrollbar" style={{
      boxSizing: 'border-box', 
      width: isOpen ? '280px' : '0px', 
      minWidth: isOpen ? '280px' : '0px',
      opacity: isOpen ? 1 : 0,
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%', 
      borderRight: isOpen ? '1px solid rgba(255,255,255,0.08)' : 'none', 
      background: 'var(--bl-sidebar)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      overflowY: 'auto',
      overflowX: 'hidden',
      zIndex: 40
    }}>
      <div style={{boxSizing: 'border-box', padding: '24px', width: '280px', minWidth: '280px', display: 'flex', flexDirection: 'column', height: '100%'}}>
        <div style={{marginBottom: '32px'}}>
          <h1 style={{fontSize: '20px', fontWeight: 'bold', margin: 0, color: 'var(--bl-accent)', display: 'flex', alignItems: 'center', gap: '8px', textShadow: '0 0 10px var(--bl-accent-glow)', whiteSpace: 'nowrap'}}>
            <Terminal size={24} />
            黑龍蝦 Agent
          </h1>
          <p style={{fontSize: '12px', color: 'var(--bl-text-dim)', marginTop: '4px'}}>v1.0.0 Autonomous WP Dev</p>
        </div>

        <button 
          onClick={onNewChat}
          style={{boxSizing: 'border-box', width: '100%', marginBottom: '24px', padding: '12px', borderRadius: '8px', border: '1px dashed var(--bl-border)', background: 'rgba(255,255,255,0.02)', color: 'var(--bl-text-primary)', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap'}}
          onMouseEnter={e => {e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'var(--bl-accent)'}}
          onMouseLeave={e => {e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; e.currentTarget.style.borderColor = 'var(--bl-border)'}}
        >
          <Plus size={18} /> 新對話 (New WP Task)
        </button>

        <div className="custom-scrollbar" style={{display: 'flex', flexDirection: 'column', flex: 1, overflowY: 'auto', paddingRight: '4px', marginBottom: '32px'}}>
          {pinnedSessions.length > 0 && (
            <>
              <h2 style={{fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--bl-text-dim)', marginBottom: '16px', whiteSpace: 'nowrap'}}>釘選的紀錄 (Pinned)</h2>
              <div style={{display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px'}}>
                {pinnedSessions.map(s => (
                  <SessionItem key={s.id} s={s} isActive={s.id === currentSessionId} onSelect={() => onSelectSession(s.id)} onTogglePin={onTogglePin} onRename={onRename} onDelete={onDelete} />
                ))}
              </div>
            </>
          )}

          <h2 style={{fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--bl-text-dim)', marginBottom: '16px', whiteSpace: 'nowrap'}}>{pinnedSessions.length > 0 ? '最近紀錄 (Recent)' : '歷史紀錄 (History)'}</h2>
          <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
            {unpinnedSessions.map(s => (
              <SessionItem key={s.id} s={s} isActive={s.id === currentSessionId} onSelect={() => onSelectSession(s.id)} onTogglePin={onTogglePin} onRename={onRename} onDelete={onDelete} />
            ))}
          </div>
        </div>

        <div style={{marginTop: 'auto'}}>
          <h2 style={{fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--bl-text-dim)', marginBottom: '16px', whiteSpace: 'nowrap'}}>Skills Loaded</h2>
          <div style={{display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', whiteSpace: 'nowrap'}}>
              <Box size={18} color="#4ade80" style={{minWidth: '18px'}} />
              <div style={{fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>WP Plugin Dev</div>
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', whiteSpace: 'nowrap'}}>
              <ShieldCheck size={18} color="#60a5fa" style={{minWidth: '18px'}} />
              <div style={{fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>WP Security Strict</div>
            </div>
          </div>

          <button 
            onClick={onOpenSettings}
            className="glass-panel"
            style={{boxSizing: 'border-box', width: '100%', padding: '12px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', color: 'var(--bl-text-primary)'}}>
            <Settings size={18} style={{minWidth: '18px'}} />
            設定 (Settings)
          </button>
        </div>
      </div>
    </div>
  );
}
