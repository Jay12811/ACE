import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'motion/react';
import { BarChart3, LineChart as LineChartIcon } from 'lucide-react';

export default function DataChart({ data }: { data: { type: 'bar' | 'line'; data: number[]; label?: string } }) {
  const chartData = data.data.map((val, i) => ({ name: `Pt ${i + 1}`, value: val }));
  
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-6 shadow-2xl relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
        {data.type === 'bar' ? <BarChart3 className="w-32 h-32" /> : <LineChartIcon className="w-32 h-32" />}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
             {data.type === 'bar' ? <BarChart3 className="w-4 h-4 text-cyan-400" /> : <LineChartIcon className="w-4 h-4 text-cyan-400" />}
          </div>
          <div>
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-0.5">Visualization_Kernel</h3>
            <p className="text-xs font-bold text-white uppercase tracking-tight">{data.label || 'SYSTEM_CHART_01'}</p>
          </div>
        </div>
        <div className="px-3 py-1 bg-black/40 border border-white/5 rounded-full text-[9px] font-mono text-slate-500">
           SAMPLES: {data.data.length}
        </div>
      </div>

      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {data.type === 'bar' ? (
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
              <XAxis dataKey="name" hide />
              <YAxis hide />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', fontSize: '10px' }}
                itemStyle={{ color: '#22d3ee' }}
              />
              <Bar dataKey="value" fill="#22d3ee" radius={[4, 4, 0, 0]} />
            </BarChart>
          ) : (
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
              <XAxis dataKey="name" hide />
              <YAxis hide />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', fontSize: '10px' }}
                itemStyle={{ color: '#22d3ee' }}
              />
              <Line type="monotone" dataKey="value" stroke="#22d3ee" strokeWidth={3} dot={{ fill: '#22d3ee', strokeWidth: 2, r: 4 }} activeDot={{ r: 6, strokeWidth: 0 }} />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>

      <div className="flex justify-between items-center pt-2">
         <div className="flex gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
            <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
            <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
         </div>
         <span className="text-[9px] font-mono text-slate-600 uppercase">Buffer_Status: Optimized</span>
      </div>
    </motion.div>
  );
}
