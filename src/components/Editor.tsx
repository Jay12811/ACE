import { Send, Terminal } from 'lucide-react';
import { KeyboardEvent, useState } from 'react';

interface EditorProps {
  value: string;
  onChange: (val: string) => void;
  onExecute: () => void;
  history: string[];
}

export default function Editor({ value, onChange, onExecute, history }: EditorProps) {
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isTyping, setIsTyping] = useState(false);

  const isCommandKnown = (val: string) => {
    const v = val.toLowerCase();
    return v.startsWith('calculate') || 
           v.startsWith('remember') || 
           v.startsWith('draw') || 
           v.startsWith('emit') || 
           v.startsWith('play') || 
           v.startsWith('transform') || 
           v.startsWith('chart') || 
           v.includes('initialize') ||
           v.startsWith('let') ||
           v.startsWith('run');
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    setIsTyping(true);
    setTimeout(() => setIsTyping(false), 200);

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      setHistoryIndex(-1);
      onExecute();
    }
    
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const nextIdx = historyIndex + 1;
      if (nextIdx < history.length) {
        setHistoryIndex(nextIdx);
        onChange(history[history.length - 1 - nextIdx]);
      }
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIdx = historyIndex - 1;
      if (nextIdx >= 0) {
        setHistoryIndex(nextIdx);
        onChange(history[history.length - 1 - nextIdx]);
      } else {
        setHistoryIndex(-1);
        onChange('');
      }
    }
  };

  return (
    <div className="relative group terminal-card !rounded-2xl">
      <div className="terminal-header">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Input Console (v1.0.4)</span>
        <div className="flex gap-1.5">
          <div className="w-2 h-2 rounded-full bg-slate-600"></div>
          <div className="w-2 h-2 rounded-full bg-slate-600"></div>
          <div className="w-2 h-2 rounded-full bg-slate-600"></div>
        </div>
      </div>
      
      <div className="relative flex items-center bg-slate-900/60 p-2 pr-4 min-h-[80px]">
        <div className="pl-4 pr-3 text-cyan-500/50 self-start mt-3">
          <Terminal className="w-5 h-5" />
        </div>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter ACE instruction... (e.g. 'Calculate 5 + 5.')"
          className="flex-1 bg-transparent border-none focus:ring-0 text-cyan-400 placeholder:text-slate-600 resize-none font-mono text-sm py-3 h-full min-h-[50px] selection:bg-cyan-500/30"
          rows={1}
        />
        <button
          onClick={onExecute}
          disabled={!value.trim()}
          className="ml-4 px-6 py-2.5 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-xl transition-all active:scale-95 flex items-center gap-2 group/btn shadow-lg shadow-cyan-900/40"
        >
          <span className="text-xs font-bold font-mono tracking-wider uppercase">Execute</span>
          <Send className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
        </button>
      </div>

      <div className="px-4 py-2 border-t border-brand-border bg-slate-800/20 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <p className="text-[10px] text-slate-600 font-mono tracking-tight uppercase">
            Ready to interpret | UTF-8 | ACE-L1
          </p>
          {value.trim() && (
            <div className={`text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest border transition-all ${isCommandKnown(value) ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'}`}>
               {isCommandKnown(value) ? 'Pattern_Detected' : 'Searching_Core_Syntax...'}
            </div>
          )}
        </div>
        <p className="text-[10px] text-slate-600 font-mono">
          Press <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-slate-400">ENTER</kbd>
        </p>
      </div>
    </div>
  );
}
