import { Variable, HelpCircle, Activity, Zap, PlayCircle, BarChart3, Clock, Terminal, Globe, Code2, GitCompare, ScrollText, Palette } from 'lucide-react';
import { CompilerState } from '../types';

export default function Sidebar({ state, onAction }: { state: CompilerState; onAction?: (cmd: string) => void }) {
  const variables = Object.entries(state.variables).filter(([name]) => !name.startsWith('macro_'));
  const macros = Object.entries(state.variables).filter(([name]) => name.startsWith('macro_'));
  const varCount = variables.length;

  return (
    <aside className="w-80 border-r border-slate-800 flex flex-col bg-[#0B0E14]/50 backdrop-blur-xl shrink-0 hidden lg:flex">
      <div className="p-6 border-b border-slate-800">
        <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-cyan-400" /> Runtime Resources
        </h2>
        <div className="mt-6 p-4 bg-slate-900/40 rounded-2xl border border-slate-800 shadow-inner">
          <div className="flex justify-between items-end mb-2">
            <span className="text-3xl font-mono font-bold text-white tracking-tighter">{varCount}</span>
            <span className="text-[10px] text-slate-500 font-bold mb-1 uppercase tracking-widest px-2 py-0.5 bg-slate-800 rounded">Allocated</span>
          </div>
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-cyan-500 shadow-[0_0_8px_rgba(34,211,238,0.5)] transition-all duration-700" 
              style={{ width: `${Math.min(varCount * 12, 100)}%` }}
            />
          </div>
          <p className="mt-3 text-[10px] font-mono text-slate-600">Memory Offset: 0x{varCount.toString(16).padStart(4, '0')}</p>
        </div>
      </div>

      <div className="flex-1 p-6 space-y-10 overflow-y-auto scrollbar-thin">
        {/* Variables List */}
        <div>
          <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
            <Variable className="w-3.5 h-3.5" /> Virtual Heap
          </h2>
          <div className="space-y-1.5">
            {variables.length === 0 ? (
              <div className="p-4 border border-dashed border-slate-800 rounded-xl text-center">
                <p className="text-[10px] text-slate-600 uppercase tracking-widest">No Symbols Found</p>
              </div>
            ) : (
              variables.map(([name, val]) => (
                <div key={name} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/30 border border-slate-800/50 group hover:border-cyan-500/30 transition-all">
                  <span className="text-xs font-mono text-slate-400 group-hover:text-cyan-400 transition-colors">{name}</span>
                  <span className="text-xs font-mono font-bold text-amber-400 bg-amber-400/5 px-2 py-0.5 rounded-md border border-amber-400/10 truncate max-w-[100px]">{String(val)}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Macros */}
        {macros.length > 0 && (
          <div>
            <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-amber-400" /> Stored Procedures
            </h2>
            <div className="space-y-2">
              {macros.map(([name]) => {
                const cleanName = name.replace('macro_', '');
                return (
                  <button 
                    key={name} 
                    onClick={() => onAction?.(`Run ${cleanName}.`)}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 group hover:border-amber-400/50 hover:bg-amber-500/10 transition-all text-left"
                  >
                    <div className="flex items-center gap-2">
                       <PlayCircle className="w-3.5 h-3.5 text-amber-500 group-hover:scale-110 transition-transform" />
                       <span className="text-xs font-bold text-amber-200 uppercase tracking-tight">{cleanName}</span>
                    </div>
                    <span className="text-[9px] font-mono text-amber-500/60 uppercase">EXEC_PTR</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Syntax Guide */}
        <div>
          <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
            <HelpCircle className="w-3.5 h-3.5" /> Core Directives
          </h2>
          <ul className="space-y-4">
            {[
              { cmd: "Initialize Undertale Story: In 2026...", desc: "Starts a pixel-style cinematic RPG.", icon: ScrollText },
              { cmd: "Analyze \"I love coding\" sentiment", desc: "Run semantic analysis on a string.", icon: Activity },
              { cmd: "Draw spiral 100", desc: "Execute a recursive vector drawing.", icon: Palette },
              { cmd: "Generate UUID", desc: "Get a unique system identifier.", icon: Zap },
              { cmd: "Define fib with [n]: ...", desc: "Instantiates a new procedure in memory.", icon: Code2 },
              { cmd: "Move 100. Turn 90.", desc: "Issues turtle vector commands.", icon: Globe },
              { cmd: "Count features", desc: "Audit the total system capability count.", icon: Activity },
              { cmd: "Launch diagnostics", desc: "Hardware integrity and resource check.", icon: Zap },
              { cmd: "Write \"log.txt\" data: Hello.", desc: "IO Simulation on virtual disk.", icon: Terminal },
              { cmd: "Compare X and Y.", desc: "Equality logic gate evaluation.", icon: GitCompare },
              { cmd: "Features", desc: "Access full capability manifest.", icon: HelpCircle }
            ].map((item, idx) => (
              <li key={idx} className="space-y-1 group cursor-pointer" onClick={() => onAction?.(item.cmd)}>
                <div className="flex items-center gap-2 mb-1">
                   {item.icon && <item.icon className="w-3 h-3 text-slate-600 group-hover:text-cyan-400" />}
                   <code className="text-[10px] bg-slate-800/80 px-2 py-1 rounded-md text-cyan-400 font-mono block w-fit border border-slate-700 group-hover:border-cyan-500/50 transition-colors">
                     {item.cmd}
                   </code>
                </div>
                <p className="text-[10px] text-slate-500 leading-relaxed font-medium pl-5 group-hover:text-slate-400 transition-colors">
                  {item.desc}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="p-6 border-t border-slate-800 bg-slate-950/50">
        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-600 uppercase tracking-widest">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_8px_#22d3ee]"></div>
            Runtime Instance #9421
        </div>
      </div>
    </aside>
  );
}

