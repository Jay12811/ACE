import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Command, 
  Terminal, 
  Cpu, 
  Play, 
  Trash2, 
  Settings, 
  HelpCircle,
  Shapes,
  Gamepad2,
  BookOpen,
  Info
} from 'lucide-react';
import { AceCompiler } from './lib/plainspeak/compiler';
import { ExecutionResult, CompilerState } from './types';
import Editor from './components/Editor';
import OutputLog from './components/OutputLog';
import Sidebar from './components/Sidebar';
import FocusedView from './components/FocusedView';

export default function App() {
  const [input, setInput] = useState('');
  const [compiler] = useState(new AceCompiler());
  const [logs, setLogs] = useState<ExecutionResult[]>([]);
  const [state, setState] = useState<CompilerState>(compiler.getState());
  const [focusedLog, setFocusedLog] = useState<ExecutionResult | null>(null);
  const [stats, setStats] = useState({ cpu: 14, mem: 244 });
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setStats({
        cpu: Math.floor(Math.random() * 15 + 5),
        mem: 244 + logs.length * 2 + Math.floor(Math.random() * 5)
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [logs.length]);

  const handleExecute = () => {
    if (!input.trim()) return;
    const result = compiler.execute(input);
    setLogs(prev => [...prev, result]);
    setState({ ...compiler.getState() });
    setInput('');
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const clearLogs = () => {
    setLogs([]);
  };

  const exportLogs = () => {
    const data = JSON.stringify(logs, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ace-session-${new Date().getTime()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-screen bg-brand-bg text-slate-300 selection:bg-cyan-500/30 overflow-hidden">
      {/* Sidebar - Repurposed as the Global Variables & Logic Context */}
      <Sidebar 
        state={state} 
        onAction={(cmd) => {
          setInput(cmd);
          // We can't easily trigger handleExecute here because of state batching 
          // without using a ref or a side effect.
          // Let's just set the input for now.
        }} 
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header Navigation */}
        <header className="h-16 border-b border-brand-border flex items-center justify-between px-8 bg-brand-bg/80 backdrop-blur-md sticky top-0 z-10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              ACE <span className="text-cyan-400">Engine</span>
            </span>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-slate-800/50 rounded-full border border-slate-700">
              <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]"></div>
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400">System Ready</span>
            </div>
            <div className="h-4 w-[1px] bg-slate-700 hidden md:block"></div>
            <div className="flex gap-4">
              <button 
                onClick={exportLogs}
                className="text-[10px] font-bold uppercase tracking-widest text-cyan-400 hover:text-white transition-colors"
                disabled={logs.length === 0}
              >
                Export Session
              </button>
              <button 
                onClick={clearLogs}
                className="text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-red-400 transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear
              </button>
            </div>
          </div>
        </header>

        {/* Console / Workspace Area */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] bg-fixed"
        >
          {logs.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-sm mx-auto space-y-8 animate-in fade-in duration-1000">
              <div className="relative">
                <div className="absolute -inset-8 bg-cyan-500/10 blur-3xl rounded-full"></div>
                <Terminal className="w-16 h-16 mb-2 mx-auto text-cyan-400/20 relative" />
              </div>
              <div className="space-y-2">
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-slate-500">Awaiting Command Input</p>
                <p className="text-xs font-mono text-slate-600">v1.0.4 Runtime Kernel v6.2.3</p>
              </div>
              <div className="grid grid-cols-2 gap-3 w-full">
                {["Calculate 10 * 10 / 2.", "Remember 100 as myVar.", "Draw a circle with size 100, color blue, position 200 200.", "Initialize RPG."].map((cmd) => (
                  <button 
                    key={cmd}
                    onClick={() => setInput(cmd)}
                    className="p-3 text-[10px] uppercase font-bold tracking-tighter border border-slate-800 rounded-xl bg-slate-900/40 hover:border-cyan-400/50 text-slate-500 hover:text-cyan-400 transition-all text-left"
                  >
                    "{cmd.substring(0, 20)}..."
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto w-full">
              <OutputLog logs={logs} onFocus={setFocusedLog} />
            </div>
          )}
        </div>

        {/* Footer / Input Bar */}
        <footer className="shrink-0 bg-[#0B0E14] border-t border-slate-800 p-6">
          <div className="max-w-4xl mx-auto">
            <Editor 
              value={input} 
              onChange={setInput} 
              onExecute={handleExecute} 
              history={logs.map(l => l.input)}
            />
          </div>
        </footer>

        {/* System Bar */}
        <div className="h-10 bg-slate-950 border-t border-slate-800 px-6 flex items-center justify-between text-[11px] font-medium text-slate-500 shrink-0">
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <span className="text-slate-600 font-mono">CPU</span> 
              <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <motion.div 
                   animate={{ width: `${stats.cpu}%` }}
                   className="h-full bg-cyan-600"
                />
              </div> 
              <span className="font-mono">{stats.cpu}%</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-600 font-mono">MEM</span> 
              <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <motion.div 
                   animate={{ width: `${Math.min((stats.mem / 1024) * 100, 100)}%` }}
                   className="h-full bg-indigo-600 shadow-[0_0_8px_#4f46e5]"
                />
              </div> 
              <span className="font-mono">{stats.mem}MB</span>
            </div>
          </div>
          <div className="flex gap-4 italic font-mono lowercase">
            <span>Uptime: {Math.floor(performance.now() / 1000)}s</span>
            <span className="text-cyan-400 underline cursor-pointer hover:text-cyan-300 transition-colors">Kernel Logs</span>
          </div>
        </div>
      </main>

      <AnimatePresence>
        {focusedLog && (
          <FocusedView 
            log={focusedLog} 
            onClose={() => setFocusedLog(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
