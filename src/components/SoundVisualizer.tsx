import { motion } from 'motion/react';
import { Music, Volume2 } from 'lucide-react';

export default function SoundVisualizer({ data }: { data: { type: string; frequency?: number; note?: string } }) {
  const bars = Array.from({ length: 24 });
  
  return (
    <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex items-center gap-8 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
         <Music className="w-32 h-32" />
      </div>

      <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
        <Volume2 className="w-8 h-8 text-emerald-400" />
      </div>

      <div className="flex-1 space-y-4">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Audio Buffer</span>
          <div className="h-px flex-1 bg-slate-800" />
          <span className="text-[10px] font-mono text-emerald-400 uppercase">Osc: {data.type === 'freq' ? 'Sin' : 'Saw'}</span>
        </div>

        <div className="flex items-end gap-1 h-12">
          {bars.map((_, i) => (
            <motion.div
              key={i}
              animate={{ 
                height: [
                  "20%", 
                  `${20 + Math.random() * 80}%`, 
                  `${20 + Math.random() * 80}%`, 
                  "20%"
                ] 
              }}
              transition={{ 
                duration: 0.5 + Math.random(), 
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="flex-1 bg-emerald-500/40 rounded-t-sm"
            />
          ))}
        </div>

        <div className="flex justify-between items-end">
           <div>
             <span className="text-3xl font-mono font-bold text-white tracking-tighter">
               {data.type === 'freq' ? `${data.frequency}Hz` : data.note}
             </span>
           </div>
           <div className="text-[10px] font-mono text-slate-500 italic">
             BUFFER_STABLE: 44.1kHz
           </div>
        </div>
      </div>
    </div>
  );
}
