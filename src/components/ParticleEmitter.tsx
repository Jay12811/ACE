import { motion } from 'motion/react';

export default function ParticleEmitter({ data }: { data: { count: number; color: string; x: number; y: number } }) {
  const particles = Array.from({ length: Math.min(data.count, 200) });
  
  return (
    <div className="relative aspect-video w-full bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-inner group">
      <div className="absolute inset-0 bg-radial-gradient from-brand-accent/5 to-transparent pointer-events-none" />
      
      {particles.map((_, i) => {
        const angle = (Math.PI * 2 * i) / data.count + Math.random();
        const distance = 40 + Math.random() * 150;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;
        
        return (
          <motion.div
            key={i}
            initial={{ 
              x: `${data.x / 8}%`, 
              y: `${data.y / 6}%`, 
              scale: 0, 
              opacity: 0,
              left: -4,
              top: -4
            }}
            animate={{ 
              x: `calc(${data.x / 8}% + ${tx}px)`, 
              y: `calc(${data.y / 6}% + ${ty}px)`, 
              scale: [0, 1.5, 0], 
              opacity: [0, 1, 0] 
            }}
            transition={{ 
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
            className="absolute w-2 h-2 rounded-full blur-[1px]"
            style={{ backgroundColor: data.color }}
          />
        );
      })}
      
      <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1 bg-black/60 border border-white/10 rounded-full text-[10px] font-mono text-slate-400 backdrop-blur-md">
          <div className="w-1.5 h-1.5 rounded-full bg-brand-accent animate-ping" />
          PARTICLE_ENGINE: {data.count} PRIMITIVES
      </div>
    </div>
  );
}
