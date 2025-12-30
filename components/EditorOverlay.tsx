
import React from 'react';
import { EditorResponse } from '../types';

interface EditorOverlayProps {
  response: EditorResponse | null;
  loading: boolean;
  onClose: () => void;
}

const EditorOverlay: React.FC<EditorOverlayProps> = ({ response, loading, onClose }) => {
  if (!response && !loading) return null;

  const sentimentStyles = {
    positive: 'bg-emerald-950 border-emerald-500/50 text-emerald-100',
    critical: 'bg-rose-950 border-rose-500/50 text-rose-100',
    neutral: 'bg-zinc-900 border-zinc-700 text-zinc-100'
  };

  const style = response ? sentimentStyles[response.sentiment] : sentimentStyles.neutral;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex flex-col items-center justify-end p-8">
      <div className={`
        pointer-events-auto max-w-lg w-full p-6 rounded-3xl border shadow-2xl backdrop-blur-md transition-all duration-500
        ${loading ? 'opacity-50 translate-y-4' : 'opacity-100 translate-y-0'}
        ${style}
      `}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700 text-xl">
            🧐
          </div>
          <div>
            <h3 className="font-bold text-sm tracking-tight opacity-70">THE EDITOR</h3>
            {loading && <div className="text-[10px] animate-pulse">CONTEMPLATING...</div>}
          </div>
          <button onClick={onClose} className="ml-auto hover:bg-white/10 p-1 rounded-full transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="text-lg font-medium leading-relaxed mb-4 italic">
          "{loading ? "Let me think about that for a moment..." : response?.text}"
        </div>

        {response?.sources && response.sources.length > 0 && (
          <div className="pt-4 border-t border-white/10 flex flex-wrap gap-2">
            <span className="text-[10px] font-bold uppercase opacity-50 w-full mb-1">Citations & Reviews:</span>
            {response.sources.map((s, i) => (
              <a 
                key={i} 
                href={s.uri} 
                target="_blank" 
                rel="noreferrer"
                className="text-[10px] bg-white/10 px-2 py-1 rounded hover:bg-white/20 transition-colors"
              >
                {s.title}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EditorOverlay;
