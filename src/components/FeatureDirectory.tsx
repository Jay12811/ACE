import { motion } from 'motion/react';
import { 
  Variable, 
  Calculator, 
  Zap, 
  Music, 
  Terminal, 
  BarChart3, 
  Gamepad2, 
  Globe, 
  ShieldCheck, 
  GitCompare,
  List,
  Code2,
  Sword,
  ScrollText,
  Clock,
  Palette,
  Shapes as ShapeIcon,
  Database,
  PlayCircle,
  Activity,
  HelpCircle
} from 'lucide-react';

const FEATURES = [
  { category: 'Core Language', items: [
    { cmd: 'Define [name] with [args]: [body]', desc: 'Parameters & Return values', icon: Code2 },
    { cmd: 'Remember [val] as [name]', desc: 'Symbol table assignment', icon: Variable },
    { cmd: 'Calculate [expr]', desc: 'Sanitized math evaluator', icon: Calculator },
    { cmd: 'If [cond] then [action]', desc: 'Conditional branching', icon: GitCompare },
    { cmd: 'Repeat [n] times / While [cond]', desc: 'Loop iteration engine', icon: List },
    { cmd: 'Run [func] with [args]', desc: 'Procedure execution', icon: PlayCircle as any },
  ]},
  { category: 'Advanced Math', items: [
    { cmd: 'Log / Exp / Power / Sqrt', desc: 'Scientific calculations', icon: Zap },
    { cmd: 'Sin / Cos / Tan', desc: 'Trigonometric operations', icon: Globe },
    { cmd: 'Min / Max of [a] and [b]', desc: 'Range evaluation', icon: Calculator },
    { cmd: 'Random [limit]', desc: 'Stochastic value generation', icon: Activity as any },
    { cmd: 'Hex to Dec / Dec to Hex', desc: 'Radix base conversion', icon: GitCompare },
  ]},
  { category: 'Text & Lists', items: [
    { cmd: 'Lowercase / Uppercase [txt]', desc: 'String casing manipulation', icon: ShieldCheck },
    { cmd: 'Length of [txt/list]', desc: 'Buffer size metadata', icon: List },
    { cmd: 'Replace [x] with [y] in [z]', desc: 'Regex-lite string helper', icon: Terminal },
    { cmd: 'Chart [list] as [bar/line]', desc: 'Dynamic visualization', icon: BarChart3 },
    { cmd: 'Sort / Reverse / Join [list]', desc: 'Array buffer manipulation', icon: List },
  ]},
  { category: 'Systems & Turtle', items: [
    { cmd: 'Move [d] / Turn [a]', desc: 'Vector drawing state', icon: Globe },
    { cmd: 'Draw [square/star/polygon] [size]', desc: 'Complex shape generator', icon: ShapeIcon },
    { cmd: 'Pen Down / Color [c]', desc: 'Vector drawing state', icon: Palette },
    { cmd: 'Write / Append / Read / Delete [file]', desc: 'V-Disk IO storage ops', icon: Terminal },
    { cmd: 'Wait [n] seconds', desc: 'Execution delay kernel', icon: Clock },
    { cmd: 'Play a beep / Show clock', desc: 'Audio & Time interrupts', icon: Music },
    { cmd: 'Clear / List variables', desc: 'Heap memory maintenance', icon: Database },
  ]},
  { category: 'Integrated AI & Analysis', items: [
    { cmd: 'Analyze [txt] sentiment', desc: 'Syntactic emotional parsing', icon: Activity },
    { cmd: 'Extract keywords from [txt]', desc: 'Entity recognition kernel', icon: Code2 },
    { cmd: 'Translate [txt] to [lang]', desc: 'Cross-radix linguistic mapping', icon: Globe },
    { cmd: 'Identify [txt] type', desc: 'Binary format detection', icon: Terminal },
  ]},
  { category: 'Cryptography', items: [
    { cmd: 'Encrypt [txt] with [key]', desc: 'XOR/Base64 cypher stream', icon: ShieldCheck },
    { cmd: 'Hash [txt] with SHA256', desc: 'One-way entropy digest', icon: Database },
    { cmd: 'Generate UUID', desc: 'Global unique identifier generator', icon: Zap },
    { cmd: 'Validate checksum [hash]', desc: 'Memory integrity verification', icon: Activity },
  ]},
  { category: 'Visual Arts (Vector)', items: [
    { cmd: 'Draw spiral [size]', desc: 'Recursive polar coordinate plot', icon: Palette },
    { cmd: 'Draw polygon [sides]', desc: 'Synchronous vertex placement', icon: ShapeIcon },
    { cmd: 'Fill color [hex]', desc: 'Rasterization buffer fill', icon: Palette },
    { cmd: 'Save drawing as [name]', desc: 'Vector state snapshot', icon: Database },
  ]},
  { category: 'System Utils', items: [
    { cmd: 'Check quota', desc: 'Resource allocation report', icon: Activity },
    { cmd: 'Ping [ip/host]', desc: 'Network latency discovery', icon: Globe },
    { cmd: 'System uptime', desc: 'Kernel clock since boot', icon: Clock },
    { cmd: 'Clear logs', desc: 'Flush application log buffer', icon: Terminal },
    { cmd: 'About system', desc: 'Kernel build metadata', icon: HelpCircle },
  ]},
  { category: 'Game Engines', items: [
    { cmd: 'Initialize Platformer', desc: '50-Level Physics Engine', icon: Gamepad2 },
    { cmd: 'Initialize RPG', desc: 'XP/Combat Dungeon Crawl', icon: Sword },
    { cmd: 'Initialize Undertale Story', desc: 'Pixel-style Narrative Engine', icon: ScrollText },
  ]}
];

export default function FeatureDirectory() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {FEATURES.map((cat, i) => (
        <motion.div 
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-4"
        >
          <h3 className="text-[10px] font-bold text-cyan-500 uppercase tracking-[0.2em]">{cat.category}</h3>
          <div className="space-y-3">
            {cat.items.map((item, j) => (
              <div key={j} className="flex items-start gap-3 group">
                <div className="mt-0.5 p-1.5 bg-white/5 rounded-lg border border-white/5 group-hover:border-cyan-500/30 transition-colors">
                  <item.icon className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-400" />
                </div>
                <div>
                   <p className="text-xs font-mono font-bold text-white group-hover:text-cyan-400 transition-colors">{item.cmd}</p>
                   <p className="text-[10px] text-slate-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
