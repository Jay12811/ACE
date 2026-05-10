import { Shield, Sword, Zap, Heart, Scroll, Package, Activity } from 'lucide-react';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';

export default function RPGInterface({ data, isZoomed = false }: { data: any, isZoomed?: boolean }) {
  const [character, setCharacter] = useState(data.stats || { hp: 100, mp: 50, level: 1, xp: 0 });
  const [battleLog, setBattleLog] = useState<string[]>(["-- Initializing Combat Kernel --"]);
  
  const stats = [
    { label: 'Health', value: character.hp, color: 'text-red-400', icon: Heart, max: 100 },
    { label: 'Mana', value: character.mp, color: 'text-indigo-400', icon: Zap, max: 50 },
    { label: 'Experience', value: character.xp, color: 'text-amber-400', icon: Sword, max: character.level * 100 },
  ];

  const handleAction = (type: string) => {
    if (type === 'attack') {
      const dmg = Math.floor(Math.random() * 20) + 10;
      setBattleLog(prev => [`[MSG] Dealt ${dmg} damage to Target.`, ...prev.slice(0, 10)]);
      setCharacter(prev => ({ ...prev, xp: prev.xp + 15 }));
    }
    if (type === 'heal' && character.mp >= 10) {
      setBattleLog(prev => [`[MSG] Restored 20 HP.`, ...prev.slice(0, 10)]);
      setCharacter(prev => ({ ...prev, hp: Math.min(100, prev.hp + 20), mp: prev.mp - 10 }));
    }
  };

  useEffect(() => {
    if (character.xp >= character.level * 100) {
       setCharacter(prev => ({ ...prev, level: prev.level + 1, xp: 0, hp: 100 }));
       setBattleLog(prev => [`*** LEVEL UP: Reached Level ${character.level + 1} ***`, ...prev]);
    }
  }, [character.xp]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1 space-y-4">
        {/* Character Portrait */}
        <div className="aspect-square bg-slate-800 rounded-3xl border border-slate-700 flex items-center justify-center relative overflow-hidden group shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            <motion.div 
               animate={{ y: [0, -5, 0] }}
               transition={{ duration: 4, repeat: Infinity }}
               className="w-24 h-24 bg-brand-accent/20 rounded-full border border-brand-accent/40 flex items-center justify-center"
            >
               <Sword className="w-12 h-12 text-brand-accent shadow-[0_0_20px_rgba(34,211,238,0.4)]" />
            </motion.div>
            <div className="absolute bottom-6 left-6 right-6">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-1">Standard Unit</p>
                <p className="text-sm font-bold text-white uppercase tracking-tight">OPERATOR_0x{Math.random().toString(16).substring(2,6).toUpperCase()}</p>
            </div>
        </div>

        {/* Inventory */}
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl shadow-xl">
          <div className="flex items-center gap-2 mb-4">
             <Package className="w-3.5 h-3.5 text-slate-500" />
             <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Storage_Buffer</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {(data.inventory || []).map((item: string, i: number) => (
              <div key={i} className="aspect-square bg-slate-800 border border-slate-700 rounded-xl flex items-center justify-center group/item cursor-help transition-all hover:border-brand-accent shadow-inner" title={item}>
                 <motion.div whileHover={{ scale: 1.1 }}>
                    <Shield className="w-5 h-5 text-slate-500 group-hover/item:text-brand-accent" />
                 </motion.div>
              </div>
            ))}
            {[...Array(Math.max(0, 4 - (data.inventory?.length || 0)))].map((_, i) => (
               <div key={i} className="aspect-square bg-slate-950 border border-white/5 rounded-xl border-dashed" />
            ))}
          </div>
        </div>
      </div>

      <div className="md:col-span-2 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4">
          {stats.map((stat, i) => (
            <div key={i} className="p-5 bg-slate-900 border border-slate-800 rounded-2xl shadow-lg group">
              <div className="flex items-center gap-2 mb-3">
                <stat.icon className={`w-3.5 h-3.5 ${stat.color} group-hover:scale-110 transition-transform`} />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">{stat.label}</span>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-mono font-bold text-white tracking-tighter">
                  {stat.value}<span className="text-xs text-slate-600 font-normal ml-1">/{stat.max}</span>
                </div>
                <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(stat.value / stat.max) * 100}%` }}
                        className={`h-full ${stat.color.replace('text', 'bg')}`}
                    />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Battle Log Simulation */}
        <div className="bg-black/60 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[350px] backdrop-blur-sm">
          <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-white/5">
              <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-red-500 animate-pulse" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-500">Live_Combat_Link</span>
              </div>
              <div className="flex gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-slate-700" />
                  <div className="w-2 h-2 rounded-full bg-slate-700" />
                  <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
              </div>
          </div>
          <div className="flex-1 p-8 font-mono text-xs text-slate-400 space-y-3 overflow-y-auto scrollbar-thin">
             <p className="text-slate-600 italic">-- Connection Established (MTU 1500) --</p>
             <p className="text-emerald-500/80">[00:01] System boot successful. Level 1 kernel ready.</p>
             <p className="text-slate-400">[00:04] Encounter detected: ROGUE_AI_SENTRY (HP 120)</p>
             <p>[00:06] Player initialized attack sequence with {data.inventory?.[0] || 'Unarmed_Strikes'}</p>
             <p className="font-bold text-white bg-white/5 px-2 py-1 rounded inline-block shadow-lg">[00:07] HIT! Dealt 32 Kinetic damage to Target.</p>
             <p className="text-red-500/80">[00:08] Collision warning. Received -15 HP.</p>
             <p className="text-cyan-500/80">[00:10] Scanning for weaknesses... [Found vulnerability at 0x92a]</p>
             <motion.p 
               animate={{ opacity: [1, 0.4, 1] }}
               transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
               className="text-white border-l-2 border-brand-accent pl-3 py-1 bg-brand-accent/5"
             >
               _Awaiting Command Input_
             </motion.p>
          </div>
          <div className="p-4 bg-white/5 border-t border-white/5 flex gap-2">
             <button 
               onClick={() => handleAction('attack')}
               className="flex-1 py-2 bg-slate-800 hover:bg-red-500/20 hover:border-red-500/40 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all active:scale-95 border border-white/5"
             >
                Execute_Attack
             </button>
             <button 
               onClick={() => handleAction('heal')}
               className="flex-1 py-2 bg-slate-800 hover:bg-emerald-500/20 hover:border-emerald-500/40 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all active:scale-95 border border-white/5"
             >
                Heal_Protocol
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
