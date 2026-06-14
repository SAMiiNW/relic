'use client';

import { motion } from 'framer-motion';
import { Seal } from './Seal';

interface Props {
  total: number;
  certified: number;
  genuine: number;
  /** compact header variant used on the mobile stack */
  compact?: boolean;
}

/**
 * The central wax-seal medallion of the vault wall. Hairline guilloche threads
 * radiate toward it; on its face it carries the running tally of the bureau:
 * artifacts on file, certificates struck, and rulings of genuine. It is the
 * gravitational center of the hang, not a header banner.
 */
export function CentralSeal({ total, certified, genuine, compact = false }: Props) {
  const size = compact ? 132 : 188;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7 }}
      className="relative flex select-none items-center justify-center"
      style={{ width: size, height: size }}
    >
      {/* wax disc behind the engraved medallion */}
      <span
        aria-hidden="true"
        className="absolute inset-0 rounded-full"
        style={{
          background:
            'radial-gradient(circle at 38% 32%, rgba(229,143,199,0.20), rgba(12,16,20,0.92) 70%)',
          boxShadow:
            'inset 0 0 0 1px rgba(159,231,214,0.35), inset 0 0 28px rgba(12,16,20,0.9), 0 10px 40px rgba(0,0,0,0.55)',
        }}
      />
      <span className="absolute" aria-hidden="true">
        <Seal size={size} className="text-foil" spin />
      </span>

      <div className="relative z-10 flex flex-col items-center text-center">
        <span className="microlabel text-foil">Bureau tally</span>
        <span className="tabular mt-1 font-display text-[2.6rem] font-700 leading-none text-parchment">
          {total}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-faint">
          artifacts on file
        </span>
        <div className="mt-2 flex items-center gap-3 font-mono text-[10px] uppercase tracking-wider">
          <span className="text-foil">
            <span className="tabular text-parchment">{certified}</span> sealed
          </span>
          <span className="h-1 w-1 rounded-full bg-foil/40" />
          <span className="text-genuine">
            <span className="tabular">{genuine}</span> genuine
          </span>
        </div>
      </div>
    </motion.div>
  );
}
