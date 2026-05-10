import { motion } from 'motion/react';
import { Cpu, Activity, Clock, Database, Terminal } from 'lucide-react';

export default function SystemDiagnostics({ data }: { data: { type: 'clock' | 'diagnostics' | 'file_system' | 'timer' | 'beep'; payload: any } }) {
  if (data.type === 'timer') {
    return (
       <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl flex flex-col items-center gap-4">
          <Clock className="w-12 h-12 text-amber-500 animate-spin" />
          <div className="text-center">
            <p className="text-2xl font-mono text-white">{data.payload.duration}s</p>
            <p className="text-[10px] uppercase tracking-widest text-slate-500">Execution Yield In Progress</p>
          </div>
       </div>
    );
  }

  if (data.type === 'file_system') {
    const files = Object.keys(data.payload.files || {});
    return (
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-4">
        <div className="flex items-center gap-2">
           <Database className="w-4 h-4 text-cyan-400" />
           <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Virtual_Disk_Manifest</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {files.length > 0 ? files.map(f => (
            <div key={f} className="p-3 bg-black/40 rounded-xl border border-white/5 flex items-center gap-3">
               <Terminal className="w-3 h-3 text-slate-500" />
               <span className="text-xs text-slate-300 truncate">{f}</span>
            </div>
          )) : <p className="text-xs text-slate-600 col-span-2 text-center uppercase tracking-widest py-4">No volumes mounted</p>}
        </div>
      </div>
    );
  }

  if (data.type === 'clock') {
    const time = new Date(data.payload.time);
    return (
      <div className="p-8 bg-slate-950 border border-slate-800 rounded-[2.5rem] flex flex-col items-center justify-center space-y-6 shadow-2xl relative overflow-hidden group">
         <div className="absolute inset-0 bg-radial-gradient from-cyan-500/5 to-transparent pointer-events-none" />
         
         <div className="p-4 bg-cyan-500/10 rounded-full border border-cyan-500/20 group-hover:scale-110 transition-transform">
            <Clock className="w-8 h-8 text-cyan-400 animate-pulse" />
         </div>

         <div className="text-center space-y-1">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">Temporal_Sync</h3>
            <div className="text-5xl font-mono font-bold text-white tracking-tighter tabular-nums">
              {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </div>
            <p className="text-[10px] font-mono text-cyan-500/60 uppercase tracking-widest">{time.toLocaleDateString()}</p>
         </div>

         <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent" />

         <div className="flex gap-8 text-[9px] font-mono text-slate-500 uppercase tracking-widest">
            <div className="flex items-center gap-2">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> UTC_OFFSET: {time.getTimezoneOffset()}
            </div>
            <div className="flex items-center gap-2">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> STATUS: LOCKED
            </div>
         </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
       <motion.div 
         initial={{ opacity: 0, x: -20 }}
         animate={{ opacity: 1, x: 0 }}
         className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-6"
       >
          <div className="flex items-center gap-3">
             <Cpu className="w-5 h-5 text-purple-400" />
             <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Core_Processor</span>
          </div>
          <div className="space-y-4">
             <div className="flex justify-between items-end">
                <span className="text-3xl font-mono font-bold text-white">{data.payload.cpu}</span>
                <span className="text-[10px] text-slate-600 font-mono">LOAD_OPTIMAL</span>
             </div>
             <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: data.payload.cpu }}
                  className="h-full bg-purple-500"
                />
             </div>
          </div>
       </motion.div>

       <motion.div 
         initial={{ opacity: 0, x: 20 }}
         animate={{ opacity: 1, x: 0 }}
         className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-6"
       >
          <div className="flex items-center gap-3">
             <Database className="w-5 h-5 text-amber-400" />
             <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Memory_Stack</span>
          </div>
          <div className="space-y-4">
             <div className="flex justify-between items-end">
                <span className="text-3xl font-mono font-bold text-white">{data.payload.memo}</span>
                <span className="text-[10px] text-slate-600 font-mono">STACK_READY</span>
             </div>
             <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '45%' }}
                  className="h-full bg-amber-500"
                />
             </div>
          </div>
       </motion.div>

       <div className="md:col-span-2 p-6 bg-black/40 border border-slate-800 rounded-3xl">
          <div className="flex items-center justify-between mb-4">
             <div className="flex items-center gap-3">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Kernel_Log</span>
             </div>
             <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 font-bold uppercase tracking-widest">{data.payload.status}</span>
          </div>
          <div className="font-mono text-[10px] text-slate-500 space-y-1">
             <p>[OK] All subsystems reported ready.</p>
             <p>[OK] Virtual memory allocated (8GB Swp).</p>
             <p>[OK] Network interface eth0: UP.</p>
             <p className="text-emerald-500/60">&gt; System diagnostic summary exported to console.</p>
          </div>
       </div>
    </div>
  );
}
