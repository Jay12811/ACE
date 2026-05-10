import { motion } from 'motion/react';
import { useState, useEffect } from 'react';

interface TurtleAction {
  command: string;
  args: any[];
}

export default function TurtleCanvas({ command }: { command: TurtleAction }) {
  const [lines, setLines] = useState<{ x1: number; y1: number; x2: number; y2: number; color: string; size: number }[]>([]);
  const [turtle, setTurtle] = useState({ x: 250, y: 250, rotation: 0, penDown: true, color: '#22d3ee', size: 2 });
  
  useEffect(() => {
    if (!command) return;

    const op = command.command;
    const args = command.args;

    setTurtle(prev => {
      let nx = prev.x;
      let ny = prev.y;
      let nr = prev.rotation;
      let np = prev.penDown;
      let nc = prev.color;
      let ns = prev.size;

      switch(op) {
        case 'draw':
          const shape = args[0].toLowerCase();
          const size = parseInt(args[1]) || 50;
          if (shape === 'square') {
            for(let i=0; i<4; i++) {
              let x2 = nx + Math.cos(nr * Math.PI / 180) * size;
              let y2 = ny + Math.sin(nr * Math.PI / 180) * size;
              setLines(l => [...l, { x1: nx, y1: ny, x2, y2, color: nc, size: ns }]);
              nx = x2; ny = y2; nr += 90;
            }
          } else if (shape === 'circle') {
             for(let i=0; i<36; i++) {
              let x2 = nx + Math.cos(nr * Math.PI / 180) * (size/10);
              let y2 = ny + Math.sin(nr * Math.PI / 180) * (size/10);
              setLines(l => [...l, { x1: nx, y1: ny, x2, y2, color: nc, size: ns }]);
              nx = x2; ny = y2; nr += 10;
            }
          } else if (shape === 'star') {
             for(let i=0; i<5; i++) {
              let x2 = nx + Math.cos(nr * Math.PI / 180) * size;
              let y2 = ny + Math.sin(nr * Math.PI / 180) * size;
              setLines(l => [...l, { x1: nx, y1: ny, x2, y2, color: nc, size: ns }]);
              nx = x2; ny = y2; nr += 144;
            }
          } else if (shape === 'polygon') {
             const sides = parseInt(args[2]) || 6;
             for(let i=0; i<sides; i++) {
               let x2 = nx + Math.cos(nr * Math.PI / 180) * size;
               let y2 = ny + Math.sin(nr * Math.PI / 180) * size;
               setLines(l => [...l, { x1: nx, y1: ny, x2, y2, color: nc, size: ns }]);
               nx = x2; ny = y2; nr += (360/sides);
             }
          }
          break;
        case 'move':
          const dist = parseInt(args[0]);
          nx += Math.cos(nr * Math.PI / 180) * dist;
          ny += Math.sin(nr * Math.PI / 180) * dist;
          if (np) {
             setLines(l => [...l, { x1: prev.x, y1: prev.y, x2: nx, y2: ny, color: nc, size: ns }]);
          }
          break;
        case 'turn':
          nr += parseInt(args[0]);
          break;
        case 'pen':
          np = args[0] === 'down';
          if (args[0] === 'color') nc = args[1];
          if (args[0] === 'size') ns = parseInt(args[1]);
          break;
        case 'color':
          nc = args[0];
          break;
        case 'background':
          // Handled via style
          break;
      }
      return { x: nx, y: ny, rotation: nr, penDown: np, color: nc, size: ns };
    });
  }, [command]);

  return (
    <div className="relative aspect-square w-full bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-inner group">
      <svg viewBox="0 0 500 500" className="w-full h-full">
        {lines.map((l, i) => (
          <line 
            key={i} 
            x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} 
            stroke={l.color} 
            strokeWidth={l.size} 
            strokeLinecap="round" 
          />
        ))}
        {/* Turtle Sprite */}
        <motion.g
          animate={{ x: turtle.x, y: turtle.y, rotate: turtle.rotation }}
          transition={{ type: 'spring', damping: 15 }}
        >
          <path d="M0 -10 L8 10 L-8 10 Z" fill={turtle.color} stroke="white" strokeWidth="1" />
        </motion.g>
      </svg>
      
      <div className="absolute top-4 left-4 flex gap-2">
         <div className="px-3 py-1 bg-black/60 border border-white/10 rounded-full text-[10px] font-mono text-slate-400">
            TURTLE_X: {Math.round(turtle.x)}
         </div>
         <div className="px-3 py-1 bg-black/60 border border-white/10 rounded-full text-[10px] font-mono text-slate-400">
            TURTLE_Y: {Math.round(turtle.y)}
         </div>
      </div>
    </div>
  );
}
