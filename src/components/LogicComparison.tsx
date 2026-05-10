import { motion } from 'motion/react';
import { GitCompare, CheckCircle2, XCircle } from 'lucide-react';

export default function LogicComparison({ data }: { data: { a: any, b: any, comparison: string, result: boolean } }) {
  return (
    <div className="p-8 bg-slate-900 border border-slate-800 rounded-[2.5rem] space-y-8 shadow-2xl relative">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
           <GitCompare className="w-6 h-6 text-indigo-400" />
        </div>
        <div>
          <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-0.5">Logic_Gate_Analyzer</h3>
          <p className="text-xs font-bold text-white uppercase tracking-tight">Operation: EQUALITY_TEST</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center gap-12 py-4">
        <div className="flex flex-col items-center gap-3">
           <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Register_A</div>
           <div className="w-24 h-24 rounded-3xl bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-2xl font-mono font-bold text-indigo-300 shadow-inner">
             {String(data.a)}
           </div>
        </div>

        <div className="relative">
           <div className="text-4xl font-mono font-bold text-slate-700">{data.comparison}</div>
           <motion.div 
             animate={{ scale: [1, 1.2, 1] }}
             transition={{ duration: 2, repeat: Infinity }}
             className="absolute -top-12 left-1/2 -translate-x-1/2"
           >
             {data.result ? (
               <CheckCircle2 className="w-10 h-10 text-emerald-400 drop-shadow-[0_0_10px_#10b981]" />
             ) : (
               <XCircle className="w-10 h-10 text-red-400 drop-shadow-[0_0_10px_#f87171]" />
             )}
           </motion.div>
        </div>

        <div className="flex flex-col items-center gap-3">
           <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Register_B</div>
           <div className="w-24 h-24 rounded-3xl bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-2xl font-mono font-bold text-indigo-300 shadow-inner">
             {String(data.b)}
           </div>
        </div>
      </div>

      <div className={`p-4 rounded-2xl border text-center font-mono text-xs uppercase tracking-widest font-bold ${data.result ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
         Branch_Affinity: {data.result ? 'POSITIVE_PATH' : 'NEGATIVE_PATH'}
      </div>
    </div>
  );
}
