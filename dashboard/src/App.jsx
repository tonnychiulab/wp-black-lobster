import React, { useState, useEffect } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import SettingsModal from './components/SettingsModal';
import TerminalChat from './components/TerminalChat';

function App() {
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKey] = useState('');
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);
  const [sessions, setSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);

  // Load from LocalStorage
  useEffect(() => {
    setApiKey(localStorage.getItem('bl_openai_key') || '');
    const savedSessions = localStorage.getItem('bl_chat_history');
    if (savedSessions) {
      try {
        const parsed = JSON.parse(savedSessions);
        setSessions(parsed);
        if (parsed.length > 0) {
           setCurrentSessionId(parsed[0].id);
        } else {
           handleNewChat();
        }
      } catch(e) { handleNewChat(); }
    } else {
       handleNewChat();
    }
  }, []);

  // Sync to localStorage
  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem('bl_chat_history', JSON.stringify(sessions));
    } else {
      localStorage.removeItem('bl_chat_history');
    }
  }, [sessions]);

  const createNewChatIfNeeded = (currentSessions) => {
    // 檢查第一個未釘選的對話是否已經是全新的空白對話
    const firstUnpinned = currentSessions.find(s => !s.isPinned);
    if (firstUnpinned && firstUnpinned.title === '全新對話' && firstUnpinned.messages.length === 0) {
      return { sessions: currentSessions, id: firstUnpinned.id };
    }
    // 如果沒有，才產生一個真正的新對話
    const newSession = {
      id: Date.now().toString() + '_' + Math.random().toString(36).substring(2, 7),
      title: '全新對話',
      messages: [],
      isPinned: false
    };
    return { sessions: [newSession, ...currentSessions], id: newSession.id };
  };

  const handleNewChat = () => {
    setSessions(prev => {
      const { sessions: nextSessions, id } = createNewChatIfNeeded(prev);
      // 利用 setTimeout 離開當前 render cycle 以安全變更另一個狀態
      setTimeout(() => {
        setCurrentSessionId(id);
        if(window.innerWidth < 768) setIsSidebarOpen(false);
      }, 0);
      return nextSessions;
    });
  };

  const handleTogglePinSession = (id) => {
    setSessions(prev => prev.map(s => s.id === id ? { ...s, isPinned: !s.isPinned } : s));
  };

  const handleRenameSession = (id, newTitle) => {
    if (!newTitle.trim()) return;
    setSessions(prev => prev.map(s => s.id === id ? { ...s, title: newTitle, customTitle: true } : s));
  };

  const handleDeleteSession = (id) => {
    if (!window.confirm("確定要刪除這筆對話紀錄嗎？")) return;
    setSessions(prev => {
      const newSessions = prev.filter(s => s.id !== id);
      if (newSessions.length === 0) {
        setTimeout(handleNewChat, 0); 
      } else if (currentSessionId === id) {
        setCurrentSessionId(newSessions[0].id);
      }
      return newSessions;
    });
  };

  const handleUpdateMessages = (newMessages) => {
    setSessions(prev => prev.map(s => {
      if (s.id === currentSessionId) {
         let newTitle = s.title;
         // Auto title on first user insert if customTitle is not set
         if (!s.customTitle && s.title === '全新對話' && newMessages.length > 0) {
           const firstUserMsg = newMessages.find(m => m.role === 'user');
           if (firstUserMsg) {
              newTitle = firstUserMsg.content.substring(0, 20) + (firstUserMsg.content.length > 20 ? '...' : '');
           }
         }
         return { ...s, title: newTitle, messages: newMessages };
      }
      return s;
    }));
  };

  const currentSession = sessions.find(s => s.id === currentSessionId) || { messages: [] };

  return (
    <div className="app-container" style={{display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden'}}>
      <Sidebar 
         onOpenSettings={() => setShowSettings(true)}
         isOpen={isSidebarOpen}
         sessions={sessions}
         currentSessionId={currentSessionId}
         onSelectSession={(id) => {
            setCurrentSessionId(id);
            if(window.innerWidth < 768) setIsSidebarOpen(false);
         }}
         onNewChat={handleNewChat}
         onTogglePin={handleTogglePinSession}
         onRename={handleRenameSession}
         onDelete={handleDeleteSession}
      />
      
      {!apiKey && !showSettings && (
        <div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '20px', background: 'var(--bl-bg)'}}>
          <h2 style={{color: 'var(--bl-text-dim)'}}>System Initializing...</h2>
          <button 
            className="glass-panel"
            onClick={() => setShowSettings(true)}
            style={{padding: '12px 24px', cursor: 'pointer', borderRadius: '8px', color: 'var(--bl-accent)', border: '1px solid var(--bl-accent)', background: 'rgba(230,57,70,0.1)'}}>
            Provide valid Neural Link (OpenAI API Key)
          </button>
        </div>
      )}

      {apiKey && (
        <TerminalChat 
           apiKey={apiKey}
           messages={currentSession.messages}
           setMessages={handleUpdateMessages}
           isSidebarOpen={isSidebarOpen}
           onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
           sessionTitle={currentSession.title || '黑龍蝦外掛'}
        />
      )}

      {showSettings && (
        <SettingsModal onClose={() => setShowSettings(false)} />
      )}
    </div>
  );
}

export default App;
