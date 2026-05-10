import { motion } from 'motion/react';
import { Lock, Unlock, ShieldCheck } from 'lucide-react';

export default function SecurityInspector({ data }: { data: { original: string, encoded: string, method: string } }) {
  return (
    <div className="p-8 bg-slate-900 border border-slate-800 rounded-[2.5rem] space-y-6 shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none group-hover:rotate-12 transition-transform duration-700">
         <Lock className="w-48 h-48" />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/10 rounded-2xl border border-amber-500/20">
             <ShieldCheck className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-0.5">Crypto_Core</h3>
            <p className="text-xs font-bold text-white uppercase tracking-tight">{data.method}</p>
          </div>
        </div>
        <div className="flex gap-1">
           {[...Array(3)].map((_, i) => (
             <div key={i} className="w-1 h-1 rounded-full bg-amber-500/40 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
        <div className="p-6 bg-black/40 border border-white/5 rounded-3xl space-y-2">
           <div className="flex items-center gap-2 opacity-50">
              <Unlock className="w-3 h-3 text-slate-400" />
              <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">Source_Buffer</span>
           </div>
           <p className="text-lg font-mono text-white break-all leading-tight">"{data.original}"</p>
        </div>

        <div className="p-6 bg-amber-500/5 border border-amber-500/20 rounded-3xl space-y-2 group shadow-[0_0_30px_rgba(245,158,11,0.05)]">
           <div className="flex items-center gap-2 opacity-70">
              <Lock className="w-3 h-3 text-amber-500" />
              <span className="text-[9px] font-bold uppercase tracking-widest text-amber-500">Hash_Address</span>
           </div>
           <p className="text-lg font-mono text-amber-200 break-all leading-tight tracking-[0.2em]">{data.encoded}</p>
        </div>

        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:block">
           <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shadow-xl">
              <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-ping" />
           </div>
        </div>
      </div>

      <div className="pt-4 border-t border-white/5 flex justify-between items-center text-[9px] font-mono text-slate-600">
         <span className="uppercase tracking-widest">Entropy: 0.82 bits/char</span>
         <span className="uppercase tracking-widest">Protocol: Active</span>
      </div>
    </div>
  );
}
