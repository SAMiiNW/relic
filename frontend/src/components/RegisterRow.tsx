'use client';

import { ScrollText } from 'lucide-react';

/**
 * The primary action rendered as a ruled call-to-action entry that sits within
 * the ledger column flow, like an instruction line ruled into a register page,
 * rather than a free-floating hero button pair.
 */
export function RegisterRow({ onRegister }: { onRegister: () => void }) {
  return (
    <div className="engraved flex flex-col gap-4 bg-stock-900/60 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
      <div className="min-w-0">
        <span className="microlabel text-foil">Open a new entry</span>
        <p className="mt-1.5 font-body text-sm leading-relaxed text-muted">
          Record a title and description to mint a registry plate, then submit provenance evidence
          for the authenticator to rule on. No deposit is taken, only network fees.
        </p>
      </div>
      <button
        type="button"
        onClick={onRegister}
        className="focus-ring flex shrink-0 items-center justify-center gap-2 border border-foil bg-foil/15 px-6 py-3 font-mono text-xs font-700 uppercase tracking-widest text-foil transition-transform hover:-translate-y-0.5"
      >
        <ScrollText size={16} /> Register a relic
      </button>
    </div>
  );
}
