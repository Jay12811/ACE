import { motion, AnimatePresence } from 'motion/react';
import { ExecutionResult } from '../types';
import ResultCard from './ResultCard';

export default function OutputLog({ logs, onFocus }: { logs: ExecutionResult[]; onFocus: (log: ExecutionResult) => void }) {
  return (
    <div className="space-y-8 pb-12">
      <AnimatePresence initial={false}>
        {logs.map((log, i) => (
          <ResultCard key={i} log={log} index={i} onFocus={onFocus} />
        ))}
      </AnimatePresence>
    </div>
  );
}
