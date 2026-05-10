import { ScrollText, Heart, User, Ghost, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';

export default function StoryInterface({ data }: { data: any }) {
  const storyText = data.config?.story || "A long time ago, a human fell into the digital wastes... * But nobody came.";
  const chapters = storyText.split(/\.|\n/).filter((s: string) => s.trim().length > 2);
  
  const [currentChapter, setCurrentChapter] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Typewriter effect logic
  useEffect(() => {
    const fullText = chapters[currentChapter]?.trim() || "";
    setDisplayedText("");
    setIsTyping(true);
    let i = 0;
    
    const interval = setInterval(() => {
      setDisplayedText(fullText.substring(0, i));
      i++;
      if (i > fullText.length) {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [currentChapter]);

  return (
    <div className="max-w-4xl mx-auto p-4 bg-black min-h-[500px] flex flex-col font-mono selection:bg-white selection:text-black">
      
      {/* Sprite/Cinematic Area */}
      <div className="flex-1 flex items-center justify-center relative min-h-[250px]">
          <motion.div 
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="relative"
          >
             <div className="w-32 h-44 bg-white rounded-sm border-4 border-white relative shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                <div className="absolute inset-2 bg-black flex items-center justify-center">
                   <User className="w-16 h-16 text-white" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-10">
                   <ScrollText className="w-24 h-24 text-white" />
                </div>
             </div>
             
             {/* Character Labels */}
             <div className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] text-white/40 tracking-[.3em] uppercase">
                Digital_Vessel.v1
             </div>

             <motion.div 
               animate={{ scale: [1, 1.2, 1] }} 
               transition={{ duration: 1, repeat: Infinity }}
               className="absolute -bottom-12 left-1/2 -translate-x-1/2"
             >
                <Heart className="w-8 h-8 text-red-600 fill-red-600 drop-shadow-[0_0_12px_rgba(220,38,38,1)]" />
             </motion.div>
          </motion.div>

          {/* Random Debris/Particles for Vibes */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.4, 0], y: [-20, 20] }}
              transition={{ duration: 3, delay: i * 0.5, repeat: Infinity }}
              className="absolute w-1 h-1 bg-white"
              style={{ left: `${20 + i * 15}%`, top: `${30 + (i % 2) * 20}%` }}
            />
          ))}
      </div>

      {/* Undertale Dialogue Box */}
      <div className="border-4 border-white p-8 bg-black relative shadow-[inset_0_0_20px_rgba(255,255,255,0.1)]">
          <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Talk Sprite */}
              <div className="w-24 h-24 border-4 border-white flex items-center justify-center bg-black flex-shrink-0 relative overflow-hidden">
                  <motion.div
                    animate={isTyping ? { 
                      scaleY: [1, 1.1, 1],
                      y: [0, -2, 0]
                    } : {}}
                    transition={{ duration: 0.15, repeat: Infinity }}
                  >
                    <Ghost className="w-16 h-16 text-white" />
                  </motion.div>
                  <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent pointer-events-none" />
              </div>

              {/* Text Area */}
              <div className="flex-1 min-h-[120px]">
                  <p className="text-2xl text-white leading-relaxed tracking-wider break-words font-mono">
                     * {displayedText}
                     {isTyping && <span className="w-4 h-8 bg-white inline-block ml-2 align-middle" />}
                  </p>
              </div>
          </div>

          {/* Interaction Menu */}
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: 'FIGHT', color: 'text-orange-500' },
                { name: 'ACT', color: 'text-yellow-400' },
                { name: 'ITEM', color: 'text-orange-300' },
                { name: 'MERCY', color: 'text-pink-400' }
              ].map((btn, idx) => (
                <button 
                  key={idx}
                  onClick={() => {
                    if (!isTyping) {
                      setCurrentChapter(prev => Math.min(chapters.length - 1, (prev + 1) % chapters.length));
                    } else {
                      setDisplayedText(chapters[currentChapter]);
                      setIsTyping(false);
                    }
                  }}
                  className={`border-4 border-white px-4 py-3 group relative transition-all active:scale-95 hover:bg-white/5 active:bg-white/10`}
                >
                    <div className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                       <Heart className="w-4 h-4 text-red-600 fill-red-600" />
                    </div>
                    <span className={`text-xl font-bold uppercase ${btn.color} group-hover:drop-shadow-[0_0_5px_currentColor]`}>{btn.name}</span>
                </button>
              ))}
          </div>
      </div>

      {/* Footer Stats */}
      <div className="mt-6 mb-2 flex justify-between items-end px-4 border-t-2 border-white/10 pt-4">
         <div className="flex items-center gap-8">
            <div className="flex flex-col">
              <span className="text-[10px] text-white/40 uppercase tracking-widest">Player</span>
              <span className="text-xl text-white font-bold">FRISK</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-white/40 uppercase tracking-widest">LV</span>
              <span className="text-xl text-white font-bold">01</span>
            </div>
         </div>
         
         <div className="flex items-center gap-4">
            <span className="text-[10px] text-white/40 uppercase tracking-widest">HP</span>
            <div className="w-32 h-6 bg-red-900 border-2 border-white relative">
               <motion.div 
                 initial={{ width: "100%" }}
                 animate={{ width: "100%" }}
                 className="h-full bg-yellow-400" 
               />
            </div>
            <span className="text-xl text-white font-bold">20 / 20</span>
         </div>
      </div>
    </div>
  );
}
