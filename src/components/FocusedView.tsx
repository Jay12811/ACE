import { X, Cpu, Terminal, ChevronRight, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ExecutionResult } from '../types';
import ResultCard from './ResultCard';
import RPGInterface from './game/RPGInterface';
import StoryInterface from './game/StoryInterface';
import PlatformerInterface from './game/PlatformerInterface';
import ParticleEmitter from './ParticleEmitter';
import SoundVisualizer from './SoundVisualizer';
import DataChart from './DataChart';
import SystemDiagnostics from './SystemDiagnostics';
import SecurityInspector from './SecurityInspector';
import LogicComparison from './LogicComparison';
import FeatureDirectory from './FeatureDirectory';
import TurtleCanvas from './TurtleCanvas';

export default function FocusedView({ log, onClose }: { log: ExecutionResult; onClose: () => void }) {
  const isGame = !!log.output.game?.active;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-12 bg-brand-bg/95 backdrop-blur-2xl"
    >
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-40 pointer-events-none" />
      
      <div className={`w-full h-full ${isGame ? 'max-w-none max-h-none' : 'max-w-6xl max-h-[90vh]'} flex flex-col terminal-card bg-slate-900 shadow-[0_0_150px_rgba(0,0,0,0.8)] overflow-hidden relative border-none rounded-none md:rounded-3xl`}>
        <header className="terminal-header shrink-0 px-6 h-14 bg-slate-800/80 backdrop-blur-md z-30">
          <div className="flex items-center gap-3">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                {isGame ? `Runtime Environment: ${log.output.game?.type}` : 'Execution Inspector'}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-[10px] font-mono text-slate-500 bg-black/40 px-3 py-1 rounded-full border border-white/5 opacity-50 hidden md:block">
               OBJECT_ID: {Math.random().toString(16).substring(2, 10).toUpperCase()}
            </div>
            <button 
                onClick={onClose}
                className="p-1 px-4 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-lg transition-all flex items-center gap-2 group border border-red-500/20 active:scale-95"
            >
                <span className="text-[10px] font-bold uppercase tracking-widest ">Exit Buffer</span>
                <X className="w-4 h-4" />
            </button>
          </div>
        </header>

        <div className={`flex-1 overflow-y-auto ${isGame ? 'p-0 flex flex-col' : 'p-8 md:p-12'}`}>
            {isGame ? (
              <div className="flex-1 bg-black overflow-hidden relative">
                 {/* Specialized Game Focal Point */}
                 <div className="h-full w-full">
                    {log.output.game?.type === 'RPG' && <RPGInterface data={log.output.game.data} />}
                    {log.output.game?.type === 'Story' && <StoryInterface data={log.output.game.data} />}
                    {log.output.game?.type === 'Platformer' && <PlatformerInterface data={log.output.game.data} isZoomed={true} />}
                 </div>

                 {/* Corner Overlay info for effect */}
                 <div className="absolute top-8 right-8 text-right space-y-1 pointer-events-none opacity-20">
                    <p className="text-[10px] font-mono text-white">RESOLUTION: NATIVE_BUFFER</p>
                    <p className="text-[10px] font-mono text-cyan-400">FPS: 60_LOCKED</p>
                    <p className="text-[10px] font-mono text-white">SYNC: STABLE</p>
                 </div>
              </div>
            ) : (
                <div className="max-w-4xl mx-auto space-y-12">
                    <div className="flex items-center gap-4 py-8 border-b border-white/5">
                        <ChevronRight className="w-8 h-8 text-cyan-500" />
                        <span className="text-3xl font-mono font-medium text-white tracking-tight italic">"{log.input}"</span>
                    </div>
                    
                    <div className="scale-105 origin-top">
                        <ResultCard log={log} index={0} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-12">
                        <div className="p-8 bg-slate-800/30 rounded-3xl border border-slate-700 space-y-4">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 border-b border-slate-700 pb-3 flex items-center gap-2">
                                <Terminal className="w-4 h-4" /> Trace Analysis
                            </h3>
                            <div className="space-y-6">
                                <div>
                                    <p className="text-[10px] text-slate-500 uppercase font-bold mb-1 tracking-widest">Compiler State</p>
                                    <p className="text-emerald-400 font-mono text-sm px-2 py-1 bg-emerald-500/5 rounded border border-emerald-500/10 w-fit">SUCCESS_COMPLETED</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-500 uppercase font-bold mb-1 tracking-widest">Memory Footprint</p>
                                    <p className="text-white font-mono text-sm">{JSON.stringify(log.output).length} bytes allocated</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-8 bg-slate-800/30 rounded-3xl border border-slate-700">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 border-b border-slate-700 pb-3 mb-4 flex items-center gap-2">
                                <Activity className="w-4 h-4" /> Live Stream
                            </h3>
                            <div className="bg-black/60 p-5 rounded-2xl font-mono text-[11px] text-slate-400 h-40 overflow-y-auto leading-relaxed border border-white/5 scrollbar-thin">
                                <p className="text-slate-600 mb-1">[0.001s] System boot initialization...</p>
                                <p className="text-cyan-500/80 mb-1">[0.024s] Parsing token stream for: {log.input}</p>
                                <p className="text-slate-400 mb-1">[0.045s] Memory allocation 0x42f confirmed.</p>
                                <p className="text-slate-400 mb-1">[0.089s] Executing OpCodes: LOAD_VAR, EVAL_MATH</p>
                                {log.output.shapes?.map((_, i) => (
                                    <p key={i} className="text-indigo-400 mb-1">[{0.1 + i/100}s] Vector_Render_P{i}: Successful.</p>
                                ))}
                                <p className="text-emerald-500/80">[0.150s] Runtime loop stabilized. Result pushed to UI buffer.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
      </div>
    </motion.div>
  );
}
