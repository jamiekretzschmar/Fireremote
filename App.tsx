
import React, { useState, useEffect, useRef, useCallback } from 'react';
import RemoteControl from './components/RemoteControl';
import EditorOverlay from './components/EditorOverlay';
import SettingsModal from './components/SettingsModal';
import { RemoteAction, EditorResponse, ConnectionState } from './types';
import { EditorService } from './services/geminiService';

const BRIDGE_URL = 'http://localhost:5000';

const App: React.FC = () => {
  const [lastAction, setLastAction] = useState<RemoteAction | null>(null);
  const [editorResponse, setEditorResponse] = useState<EditorResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [connection, setConnection] = useState<ConnectionState>({
    ip: localStorage.getItem('firetv_ip') || '',
    isConnected: false,
    isConnecting: false,
  });
  
  const editorServiceRef = useRef<EditorService | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    editorServiceRef.current = new EditorService();
  }, []);

  const triggerEditor = useCallback(async (prompt: string) => {
    if (!editorServiceRef.current) return;
    setLoading(true);
    const response = await editorServiceRef.current.getFeedback(prompt);
    setEditorResponse(response);
    setLoading(false);
  }, []);

  const handleConnect = async (ip: string) => {
    setConnection(prev => ({ ...prev, isConnecting: true, ip }));
    localStorage.setItem('firetv_ip', ip);
    
    try {
      const res = await fetch(`${BRIDGE_URL}/connect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ip }),
      });
      const data = await res.json();
      if (res.ok) {
        setConnection(prev => ({ ...prev, isConnected: true, isConnecting: false }));
        triggerEditor(`Successfully connected to Fire TV at ${ip}. Give a cheeky compliment about the user's home network or technical prowess.`);
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      setConnection(prev => ({ ...prev, isConnected: false, isConnecting: false }));
      triggerEditor(`Failed to connect to ${ip}. Critique their networking setup and mention that a true cinephile would have a more stable connection.`);
    }
  };

  const handleSearchSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!searchQuery.trim()) return;
    triggerEditor(`The user is asking for a critique/search for: "${searchQuery}". Provide your honest Editor's opinion.`);
    setSearchQuery('');
    searchInputRef.current?.blur();
  };

  const startVoiceInput = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech Recognition is not supported in this browser. Please use Chrome or Safari.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsVoiceActive(true);
      searchInputRef.current?.focus();
    };

    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0])
        .map((result) => result.transcript)
        .join('');
      setSearchQuery(transcript);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      setIsVoiceActive(false);
    };

    recognition.onend = () => {
      setIsVoiceActive(false);
      // Auto-submit if there's text after a short delay
      if (searchQuery.trim()) {
        setTimeout(() => handleSearchSubmit(), 500);
      }
    };

    recognition.start();
  }, [searchQuery]);

  const handleRemoteAction = async (action: RemoteAction) => {
    setLastAction(action);
    
    if (connection.isConnected) {
      try {
        fetch(`${BRIDGE_URL}/command`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action }),
        });
      } catch (e) {
        console.error("Bridge command failed", e);
      }
    }

    switch (action) {
      case 'POWER':
        triggerEditor("The user just turned their TV on. Welcome them as 'The Editor' and tell them if there's anything worth watching right now.");
        break;
      case 'HOME':
        setEditorResponse(null);
        break;
      case 'VOICE':
        startVoiceInput();
        break;
      case 'MUTE':
        triggerEditor("Silence. Finally. Give a short quote about the beauty of quiet or a critique of noise in media.");
        break;
      default:
        if (Math.random() > 0.97) {
          triggerEditor("The user is browsing. Give them a recommendation for a truly high-quality film or show.");
        }
        break;
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full" />
      
      <div className="flex flex-col md:flex-row items-center gap-12 z-10 w-full max-w-5xl">
        <div className="flex flex-col items-center flex-shrink-0">
          <RemoteControl 
            onAction={handleRemoteAction} 
            onOpenSettings={() => setShowSettings(true)}
            connection={connection}
          />
          <div className="mt-6 text-zinc-600 text-[10px] font-mono uppercase tracking-widest text-center">
            {isVoiceActive ? (
              <span className="text-blue-500 animate-pulse">Listening to your thoughts...</span>
            ) : (
              lastAction ? (
                <span>Command: <span className="text-zinc-400">{lastAction}</span></span>
              ) : (
                connection.isConnected ? 'Awaiting Input' : 'Not Connected'
              )
            )}
          </div>
        </div>

        <div className="flex flex-col flex-grow space-y-8">
          <header>
            <h1 className="text-5xl font-bold mb-4 tracking-tighter">
              THE EDITOR'S <span className="text-zinc-500">FIREREMOTE</span>
            </h1>
            <p className="text-zinc-400 leading-relaxed max-w-md">
              A universal interface for your Fire TV, overseen by a world-class critic. 
              Control your hardware and get the truth about what you're watching.
            </p>
          </header>

          <form onSubmit={handleSearchSubmit} className="relative group max-w-md">
            <div className={`absolute -inset-1 bg-gradient-to-r ${isVoiceActive ? 'from-blue-500 to-purple-500 animate-pulse' : 'from-blue-500/20 to-purple-500/20'} rounded-2xl blur opacity-25 group-focus-within:opacity-100 transition duration-1000`}></div>
            <div className="relative flex items-center bg-zinc-900/80 border border-zinc-800 rounded-2xl p-2 pl-5 backdrop-blur-xl">
              <svg className={`w-5 h-5 ${isVoiceActive ? 'text-blue-400' : 'text-zinc-500'} mr-3`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input 
                ref={searchInputRef}
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isVoiceActive ? "Listening..." : "Ask the Editor for a critique..."}
                className="bg-transparent border-none text-white w-full focus:outline-none text-sm placeholder:text-zinc-600 font-medium"
              />
              <div className="flex items-center gap-1">
                <button 
                  type="button"
                  onClick={startVoiceInput}
                  className={`p-2 rounded-xl transition-all ${isVoiceActive ? 'bg-blue-500 text-white' : 'hover:bg-zinc-800 text-zinc-500'}`}
                  title="Voice Search"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                  </svg>
                </button>
                <button 
                  type="submit"
                  className="bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white px-4 py-2 rounded-xl text-xs font-bold transition-all uppercase tracking-widest whitespace-nowrap"
                >
                  Critique
                </button>
              </div>
            </div>
          </form>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
            <div className="p-6 rounded-3xl bg-zinc-900/40 border border-zinc-800/50 backdrop-blur-sm">
              <h2 className="text-[10px] font-bold text-zinc-500 uppercase mb-3 tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                System Status
              </h2>
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${connection.isConnected ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-rose-500'}`} />
                <span className="text-sm text-zinc-200 font-medium">
                  {connection.isConnected ? `Linked: ${connection.ip}` : 'Device Offline'}
                </span>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-zinc-900/40 border border-zinc-800/50 backdrop-blur-sm">
              <h2 className="text-[10px] font-bold text-zinc-500 uppercase mb-3 tracking-widest">Editor's Logic</h2>
              <p className="text-xs italic text-zinc-400 leading-relaxed">
                "Modern streaming is a labyrinth of mediocrity. I am your Ariadne's thread."
              </p>
            </div>
          </div>
        </div>
      </div>

      {showSettings && (
        <SettingsModal 
          connection={connection}
          onConnect={handleConnect}
          onClose={() => setShowSettings(false)}
          bridgeUrl={BRIDGE_URL}
        />
      )}

      <EditorOverlay 
        response={editorResponse} 
        loading={loading} 
        onClose={() => setEditorResponse(null)} 
      />
    </div>
  );
};

export default App;
