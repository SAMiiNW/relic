'use client';

import { FilePlus2, ChevronRight } from 'lucide-react';

/**
 * The intake port: the register-a-relic action presented as an angular feed
 * plate wired into the chamber, not a button bar. A new artifact is fed into
 * the vault through this port and then routed to the authenticator core.
 */
export function IntakePort({ onRegister }: { onRegister: () => void }) {
  return (
    <button
      type="button"
      onClick={onRegister}
      className="focus-ring group relative block w-full overflow-hidden text-left"
      style={{
        clipPath: 'polygon(0 0, 100% 0, 100% 78%, 92% 100%, 0 100%)',
        border: '1px solid rgba(217,195,138,0.55)',
        boxShadow:
          'inset 0 0 0 1px rgba(217,195,138,0.16), inset 0 0 0 4px rgba(12,16,20,0.6), inset 0 0 0 5px rgba(217,195,138,0.2), 0 8px 28px rgba(0,0,0,0.45)',
        background: 'linear-gradient(135deg, rgba(217,195,138,0.14), rgba(17,23,28,0.94) 60%)',
      }}
    >
      <div className="flex items-center gap-3 px-4 py-3.5 sm:px-5">
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center border border-foil-gold/50 text-foil-gold"
          aria-hidden="true"
        >
          <FilePlus2 size={18} />
        </span>
        <div className="min-w-0 flex-1">
          <span className="microlabel text-foil-gold">Intake port</span>
          <p className="mt-0.5 font-display text-xl font-700 leading-none tracking-tight text-parchment">
            Register a relic
          </p>
        </div>
        <ChevronRight
          size={18}
          className="shrink-0 text-foil-gold/70 transition-transform group-hover:translate-x-1"
        />
      </div>
    </button>
  );
}
