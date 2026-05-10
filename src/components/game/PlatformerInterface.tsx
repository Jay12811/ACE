import { Code2, Play, Download, Layers, MoveRight, MoveLeft, Space, Settings2, Palette, Globe, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, useRef } from 'react';

export default function PlatformerInterface({ data, isZoomed = false }: { data: any; isZoomed?: boolean }) {
  const [charColor, setCharColor] = useState(data.charColor || '#22d3ee');
  const [bgColor, setBgColor] = useState(data.bgColor || '#0B0E14');
  const [gravity, setGravity] = useState(data.gravity || 0.6);
  const [platforms, setPlatforms] = useState(data.platforms || []);
  const [showConfig, setShowConfig] = useState(false);

  const [pos, setPos] = useState({ x: 400, y: 500 });
  const [vel, setVel] = useState({ x: 0, y: 0 });
  const [keys, setKeys] = useState<Record<string, boolean>>({});
  const gameRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number>(null);

  // Constants
  const [level, setLevel] = useState(data.level || 1);
  const [deaths, setDeaths] = useState(0);

  const WIDTH = 800;
  const HEIGHT = 600;

  useEffect(() => {
     if (pos.x > WIDTH - 50) {
        setLevel(l => Math.min(50, l + 1));
        setPos({ x: 50, y: 500 });
     }
  }, [pos.x]);
  const CHAR_SIZE = 40;

  useEffect(() => {
    const handleDown = (e: KeyboardEvent) => setKeys(prev => ({ ...prev, [e.key.toLowerCase()]: true }));
    const handleUp = (e: KeyboardEvent) => setKeys(prev => ({ ...prev, [e.key.toLowerCase()]: false }));

    window.addEventListener('keydown', handleDown);
    window.addEventListener('keyup', handleUp);

    const update = () => {
      setPos(p => {
        let nvx = 0;
        if (keys['arrowleft'] || keys['a']) nvx = -7;
        if (keys['arrowright'] || keys['d']) nvx = 7;

        let nvy = vel.y + gravity;
        if ((keys[' '] || keys['arrowup'] || keys['w']) && vel.y === 0) {
          nvy = -15;
        }

        let nx = p.x + nvx;
        let ny = p.y + nvy;

        // Ground
        if (ny > HEIGHT - CHAR_SIZE - 32) {
          ny = HEIGHT - CHAR_SIZE - 32;
          nvy = 0;
        }

        // Platforms
        platforms.forEach((plat: any) => {
          const px = plat.x;
          const py = HEIGHT - plat.y - 16;
          const pw = plat.w;
          
          // Collision check
          if (nx + CHAR_SIZE > px && nx < px + pw) {
            if (p.y + CHAR_SIZE <= py && ny + CHAR_SIZE >= py) {
              ny = py - CHAR_SIZE;
              nvy = 0;
            }
          }
        });

        // Boundaries
        if (nx < 0) nx = 0;
        if (nx > WIDTH - CHAR_SIZE) nx = WIDTH - CHAR_SIZE;

        setVel({ x: nvx, y: nvy });
        return { x: nx, y: ny };
      });
      frameRef.current = requestAnimationFrame(update);
    };

    frameRef.current = requestAnimationFrame(update);

    return () => {
      window.removeEventListener('keydown', handleDown);
      window.removeEventListener('keyup', handleUp);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [keys, vel.y, gravity, platforms]);

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (!isZoomed || !showConfig) return;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * WIDTH;
    const y = HEIGHT - (((e.clientY - rect.top) / rect.height) * HEIGHT);
    
    setPlatforms([...platforms, { x, y, w: 150 }]);
  };

  return (
    <div className={`space-y-4 ${isZoomed ? 'h-full flex flex-col' : ''}`}>
      {/* Visual Simulation */}
      <div 
        ref={gameRef}
        onClick={handleCanvasClick}
        className={`relative border border-slate-800 rounded-3xl overflow-hidden shadow-2xl transition-colors duration-1000 ${isZoomed ? 'flex-1' : 'h-80'} ${showConfig ? 'cursor-crosshair' : ''}`}
        style={{ backgroundColor: bgColor }}
      >
        <div className="absolute inset-0 opacity-[0.05] grid grid-cols-12 grid-rows-12 pointer-events-none">
            {[...Array(144)].map((_, i) => <div key={i} className="border-[0.5px] border-slate-400" />)}
        </div>
        
        {/* Ground */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-black/40 border-t border-white/5 backdrop-blur-sm" />

        {/* Dynamic Platforms */}
        {platforms.map((p: any, i: number) => (
          <div
            key={i}
            className="absolute h-4 bg-slate-800 border border-slate-600 rounded-full shadow-lg group/plat"
            style={{ 
              left: `${(p.x / WIDTH) * 100}%`, 
              top: `${( (HEIGHT - p.y - 8) / HEIGHT) * 100}%`, 
              width: `${(p.w / WIDTH) * 100}%` 
            }}
          >
             {showConfig && (
               <button 
                 onClick={(e) => {
                   e.stopPropagation();
                   setPlatforms(platforms.filter((_: any, idx: number) => idx !== i));
                 }}
                 className="absolute -top-6 left-1/2 -translate-x-1/2 p-1 bg-red-500 rounded text-white opacity-0 group-hover/plat:opacity-100 transition-opacity"
               >
                 <X className="w-3 h-3" />
               </button>
             )}
          </div>
        ))}

        {/* Character */}
        <motion.div 
            animate={{ 
              top: pos.y, 
              left: `${(pos.x / WIDTH) * 100}%`,
              rotate: vel.x * 5
            }}
            transition={{ type: "tween", duration: 0.1, ease: "linear" }}
            className="absolute w-10 h-10 rounded-xl border-2 shadow-[0_0_20px_rgba(34,211,238,0.2)] z-20"
            style={{ backgroundColor: charColor, borderColor: '#ffffff20' }}
        >
          <div className="flex gap-1.5 justify-center mt-2.5">
            <div className={`w-1.5 h-1.5 bg-black rounded-full ${vel.x > 0 ? 'translate-x-[1px]' : vel.x < 0 ? '-translate-x-[1px]' : ''}`} />
            <div className={`w-1.5 h-1.5 bg-black rounded-full ${vel.x > 0 ? 'translate-x-[1px]' : vel.x < 0 ? '-translate-x-[1px]' : ''}`} />
          </div>
        </motion.div>

        {/* Toolbar UI (Zoomed only) */}
        {isZoomed && (
          <div className="absolute top-6 right-6 flex items-center gap-3">
             <button 
               onClick={() => setShowConfig(!showConfig)}
               className={`p-3 rounded-2xl border transition-all ${showConfig ? 'bg-cyan-500 text-white border-cyan-400' : 'bg-black/60 text-slate-400 border-white/10 backdrop-blur-md'}`}
             >
                <Settings2 className="w-5 h-5" />
             </button>
          </div>
        )}

        <AnimatePresence>
          {showConfig && isZoomed && (
            <motion.div 
              initial={{ x: 300 }}
              animate={{ x: 0 }}
              exit={{ x: 300 }}
              className="absolute top-20 right-6 w-64 bg-black/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 space-y-6 z-40"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                   <Settings2 className="w-4 h-4 text-cyan-400" />
                   <h3 className="text-xs font-bold uppercase tracking-widest text-white">Simulation Config</h3>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-500 mb-1.5 block">Character Color</label>
                    <div className="flex gap-2">
                       {['#22d3ee', '#fbbf24', '#f87171', '#c084fc'].map(c => (
                         <button 
                           key={c}
                           onClick={() => setCharColor(c)}
                           className={`w-6 h-6 rounded-full border-2 transition-transform ${charColor === c ? 'scale-110 border-white' : 'border-transparent'}`}
                           style={{ backgroundColor: c }}
                         />
                       ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-500 mb-1.5 block">Planet Gravity ({gravity}G)</label>
                    <input 
                      type="range" min="0.1" max="2.0" step="0.1"
                      value={gravity}
                      onChange={(e) => setGravity(parseFloat(e.target.value))}
                      className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-500 mb-1.5 block">Level Objects</label>
                    <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-[10px] text-slate-400">
                      Click anywhere on the map to place a platform.
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="absolute top-4 left-4 flex flex-col gap-2">
            <div className="flex items-center gap-2 px-3 py-1 bg-black/60 border border-white/10 rounded-full text-[10px] font-mono text-slate-400 backdrop-blur-md">
                <Layers className="w-3 h-3 text-cyan-400" /> PHYS_ENGINE: {gravity}G
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-mono text-emerald-400 backdrop-blur-md">
                <Play className="w-3 h-3 animate-pulse" /> PLAYABLE_SIM_ACTIVE
            </div>
        </div>

        <div className="absolute bottom-4 left-4 flex gap-2">
            <div className="p-1.5 bg-black/40 rounded border border-white/10 text-[8px] text-slate-500 uppercase font-bold flex items-center gap-1">
              <MoveLeft className="w-2.5 h-2.5" /> <MoveRight className="w-2.5 h-2.5" /> MOVE
            </div>
            <div className="p-1.5 bg-black/40 rounded border border-white/10 text-[8px] text-slate-500 uppercase font-bold flex items-center gap-1">
              <Space className="w-2.5 h-2.5" /> JUMP
            </div>
            {isZoomed && (
               <div className="p-1.5 bg-cyan-500/10 rounded border border-cyan-500/20 text-[8px] text-cyan-500 uppercase font-bold flex items-center gap-1">
                  <Globe className="w-2.5 h-2.5" /> WORLD_EDITOR_ENABLED
               </div>
            )}
        </div>
      </div>
    </div>
  );
}

