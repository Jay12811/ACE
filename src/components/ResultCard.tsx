import { motion } from 'motion/react';
import { ExecutionResult } from '../types';
import { 
  ChevronRight, 
  Cpu, 
  Terminal, 
  AlertCircle, 
  Calculator, 
  Shapes, 
  Gamepad2,
  Code,
  Maximize2
} from 'lucide-react';
import CanvasRenderer from './CanvasRenderer';
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

export default function ResultCard({ log, index, onFocus }: { log: ExecutionResult; index: number; onFocus?: (log: ExecutionResult) => void }) {
  const isError = !!log.output.error;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className="group relative"
    >
      <div className="flex gap-6">
        {/* Step Indicator */}
        <div className="hidden md:flex flex-col items-center pt-8 relative">
            <div className="absolute top-16 bottom-[-32px] w-[1px] bg-slate-800" />
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center z-10 group-hover:border-cyan-500 group-hover:shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all duration-500">
                <span className="text-xs font-bold font-mono text-slate-500 group-hover:text-cyan-400">{String(index + 1).padStart(2, '0')}</span>
            </div>
        </div>

        <div className="flex-1 space-y-4">
          {/* Input Header */}
          <div className="flex items-center gap-3 opacity-40 group-hover:opacity-100 transition-opacity">
            <ChevronRight className="w-4 h-4 text-cyan-500" />
            <span className="text-xs font-mono font-medium text-slate-400 italic">"{log.input}"</span>
          </div>

          <div className="terminal-card overflow-hidden transition-all duration-500 hover:border-slate-700">
            {/* Background Logic Header */}
            <div className="terminal-header">
              <div className="flex items-center gap-2">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Background Logic Engine</span>
              </div>
              <div className="flex gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
              </div>
            </div>

            {/* Background Logic Content */}
            <div className="p-4 bg-black/40 font-mono text-[11px] text-slate-500 leading-relaxed border-b border-brand-border">
              <div className="flex gap-4">
                <span className="text-slate-700 select-none">00{index + 1}</span>
                <span className="text-slate-400">
                  {log.backgroundLogic.split('\n').map((line, i) => (
                    <span key={i} className="block">
                        <span className="text-cyan-500/50 mr-2">EXEC_OP:</span>
                        {line}
                    </span>
                  ))}
                </span>
              </div>
            </div>

            {/* Result Content */}
            <div className="p-6 space-y-6 bg-slate-900/20">
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-amber-500" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Preview Buffer</span>
                </div>
                {onFocus && (
                  <button 
                    onClick={() => onFocus(log)}
                    className="p-1 px-3 border border-brand-accent/30 bg-brand-accent/10 rounded-full text-[10px] font-bold text-brand-accent hover:bg-brand-accent hover:text-white transition-all flex items-center gap-2 uppercase tracking-widest shadow-[0_0_15px_rgba(34,211,238,0.2)]"
                  >
                    <Maximize2 className="w-3.5 h-3.5" /> 
                    {log.output.game?.active ? 'Enter Simulation' : 'Zoom Object'}
                  </button>
                )}
              </div>

              {isError ? (
                <div className="flex items-start gap-3 p-4 bg-red-500/5 border border-red-500/20 rounded-2xl text-red-400">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-bold text-sm tracking-tight">Logic Exception</p>
                    <p className="text-xs font-mono opacity-80">{log.output.error}</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Text Output */}
                  {log.output.text && (
                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-xl font-semibold text-white tracking-tight leading-snug"
                    >
                      {log.output.text}
                    </motion.p>
                  )}

                  {/* Math Result */}
                  {log.output.math !== undefined && (
                    <div className="flex items-center gap-6 p-6 bg-indigo-500/5 border border-indigo-500/20 rounded-2xl relative overflow-hidden group/math">
                      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover/math:opacity-10 transition-opacity">
                         <Calculator className="w-24 h-24" />
                      </div>
                      <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                        <Calculator className="w-8 h-8 text-indigo-400" />
                      </div>
                      <div className="relative">
                        <span className="text-[10px] block uppercase tracking-[0.2em] font-bold text-indigo-500/60 mb-1">Evaluated Result</span>
                        <span className="text-5xl font-mono font-bold tracking-tighter text-white drop-shadow-[0_0_15px_rgba(99,102,241,0.3)]">{log.output.math}</span>
                      </div>
                    </div>
                  )}

                  {/* Shapes Canvas */}
                  {log.output.shapes && log.output.shapes.length > 0 && (
                    <div className="relative aspect-video w-full bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-inner group/canvas">
                      <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 opacity-[0.03] pointer-events-none">
                        {[...Array(144)].map((_, i) => (
                          <div key={i} className="border-[0.5px] border-slate-100" />
                        ))}
                      </div>
                      <CanvasRenderer shapes={log.output.shapes} />
                      <div className="absolute bottom-4 right-4 flex items-center gap-3 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 group-hover/canvas:border-cyan-500/50 transition-colors">
                        <Shapes className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Render: Vector_0x{log.output.shapes.length}</span>
                      </div>
                    </div>
                  )}

                  {/* Particles */}
                  {log.output.particles && (
                    <ParticleEmitter data={log.output.particles} />
                  )}

                  {/* Sound */}
                  {log.output.sound && (
                    <SoundVisualizer data={log.output.sound} />
                  )}

                  {/* Turtle */}
                  {log.output.turtle && (
                    <TurtleCanvas command={log.output.turtle} />
                  )}

                  {/* Chart */}
                  {log.output.chart && (
                    <DataChart data={log.output.chart} />
                  )}

                  {/* System */}
                  {log.output.system && (
                    log.output.system.payload.features ? (
                      <FeatureDirectory />
                    ) : (
                      <SystemDiagnostics data={log.output.system} />
                    )
                  )}

                  {/* Security */}
                  {log.output.crypto && (
                    <SecurityInspector data={log.output.crypto} />
                  )}

                  {/* Logic */}
                  {log.output.logic && (
                    <LogicComparison data={log.output.logic} />
                  )}

                  {/* Game Interfaces */}
                  {log.output.game?.active && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 px-4 py-1.5 bg-slate-800/80 border border-slate-700 rounded-full w-fit">
                            <Gamepad2 className="w-3.5 h-3.5 text-amber-500" />
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 font-mono">Module: {log.output.game.type}_ENGINE</span>
                        </div>
                        <div className="animate-in fade-in zoom-in duration-500 slide-in-from-bottom-4">
                            {log.output.game.type === 'RPG' && <RPGInterface data={log.output.game.data} />}
                            {log.output.game.type === 'Story' && <StoryInterface data={log.output.game.data} />}
                            {log.output.game.type === 'Platformer' && <PlatformerInterface data={log.output.game.data} />}
                        </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
