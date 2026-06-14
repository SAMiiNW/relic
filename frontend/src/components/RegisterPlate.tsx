'use client';

import { ScrollText } from 'lucide-react';

/**
 * The register-a-relic action mounted as a distinct brass plate. It hangs off
 * center on the vault wall (positioned by the parent) rather than living in a
 * top button bar. Brass is suggested with a warm gold foil edge.
 */
export function RegisterPlate({ onRegister }: { onRegister: () => void }) {
  return (
    <button
      type="button"
      onClick={onRegister}
      className="focus-ring group block w-full text-left"
      style={{
        border: '1px solid rgba(217,195,138,0.55)',
        boxShadow:
          'inset 0 0 0 1px rgba(217,195,138,0.18), inset 0 0 0 4px rgba(12,16,20,0.6), inset 0 0 0 5px rgba(217,195,138,0.22), 0 8px 28px rgba(0,0,0,0.45)',
        background:
          'linear-gradient(135deg, rgba(217,195,138,0.14), rgba(17,23,28,0.92) 60%)',
      }}
    >
      <div className="flex items-center gap-3 px-4 py-3.5 sm:px-5">
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center border border-foil-gold/50 text-foil-gold"
          aria-hidden="true"
        >
          <ScrollText size={18} />
        </span>
        <div className="min-w-0">
          <span className="microlabel text-foil-gold">Open a new entry</span>
          <p className="mt-0.5 font-display text-xl font-700 leading-none tracking-tight text-parchment">
            Register a relic
          </p>
        </div>
      </div>
    </button>
  );
}
