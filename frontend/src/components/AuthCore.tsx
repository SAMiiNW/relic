'use client';

import { motion } from 'framer-motion';
import { Seal } from './Seal';

interface Props {
  total: number;
  certified: number;
  genuine: number;
  /** compact variant used in the narrow chamber stack */
  compact?: boolean;
}

/**
 * The authenticator reactor core: the gravitational anchor of the vault
 * chamber that every specimen filament terminates into. Concentric rotating
 * guilloche rings enclose a glass core reading the bureau tally. It is a
 * machine at the heart of an authentication terminal, not a header banner or a
 * KPI card.
 */
export function AuthCore({ total, certified, genuine, compact = false }: Props) {
  const size = compact ? 150 : 234;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.86 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="relative flex select-none items-center justify-center"
      style={{ width: size, height: size }}
    >
      {/* reactor halo */}
      <span
        aria-hidden="true"
        className="absolute inset-[-14%] rounded-full"
        style={{
          background:
            'radial-gradient(circle at 42% 36%, rgba(159,231,214,0.16), rgba(229,143,199,0.08) 46%, rgba(12,16,20,0) 72%)',
        }}
      />
      {/* containment disc */}
      <span
        aria-hidden="true"
        className="absolute inset-0 rounded-full"
        style={{
          background:
            'radial-gradient(circle at 40% 34%, rgba(229,143,199,0.16), rgba(12,16,20,0.94) 68%)',
          boxShadow:
            'inset 0 0 0 1px rgba(159,231,214,0.4), inset 0 0 32px rgba(12,16,20,0.92), 0 12px 48px rgba(0,0,0,0.6)',
        }}
      />
      {/* counter-rotating guilloche rings */}
      <span className="absolute" aria-hidden="true">
        <Seal size={size} className="text-foil" spin />
      </span>
      <motion.span
        className="absolute"
        aria-hidden="true"
        animate={{ rotate: -360 }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
      >
        <Seal size={size * 0.66} className="text-foil-magenta/60" />
      </motion.span>

      {/* glass core readout */}
      <div className="relative z-10 flex flex-col items-center text-center">
        <span className="microlabel text-foil">Authenticator core</span>
        <span className="tabular mt-1 font-display text-[2.9rem] font-700 leading-none text-parchment">
          {total}
        </span>
        <span className="font-mono text-[9px] uppercase tracking-[0.24em] text-faint">
          artifacts on file
        </span>
        <div className="mt-2.5 flex items-center gap-2.5 font-mono text-[10px] uppercase tracking-wider">
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
