'use client';

import { ScrollText, RefreshCw, TriangleAlert, ExternalLink } from 'lucide-react';
import { CONTRACT_ADDRESS, EXPLORER } from '@/lib/contract';
import { Seal } from './Seal';

export function Skeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="engraved bg-stock-800/70 p-6">
          <div className="flex justify-between border-b border-foil/10 pb-4">
            <div className="h-8 w-24 animate-pulse bg-foil/10" />
            <div className="h-10 w-10 animate-pulse rounded-full bg-foil/10" />
          </div>
          <div className="mt-5 h-7 w-3/4 animate-pulse bg-foil/10" />
          <div className="mt-4 space-y-2">
            <div className="h-3 w-full animate-pulse bg-foil/10" />
            <div className="h-3 w-5/6 animate-pulse bg-foil/10" />
            <div className="h-3 w-2/3 animate-pulse bg-foil/10" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function EmptyState({ onRegister }: { onRegister: () => void }) {
  return (
    <div className="engraved flex flex-col items-center bg-stock-800/60 px-6 py-20 text-center">
      <Seal size={80} className="text-foil/70" spin />
      <h3 className="mt-7 font-display text-3xl font-600 tracking-tight text-parchment">
        The register is empty
      </h3>
      <p className="mt-3 max-w-md font-body text-muted">
        No relics have been entered into the bureau yet. Register the first artifact, submit its
        provenance, and let the authenticator strike its certificate.
      </p>
      <button
        type="button"
        onClick={onRegister}
        className="focus-ring mt-7 flex items-center gap-2 border border-foil bg-foil/15 px-6 py-3 font-mono text-xs font-700 uppercase tracking-widest text-foil transition-transform hover:-translate-y-0.5"
      >
        <ScrollText size={16} /> Register the first relic
      </button>
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="engraved flex flex-col items-center border-forgery/40 bg-forgery/5 px-6 py-16 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full border border-forgery bg-stock">
        <TriangleAlert size={28} className="text-forgery" />
      </span>
      <h3 className="mt-6 font-display text-3xl font-600 tracking-tight text-parchment">
        Could not reach the bureau
      </h3>
      <p className="mt-2 max-w-md font-body text-sm text-muted">{message}</p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={onRetry}
          className="focus-ring flex items-center gap-2 border border-foil bg-foil/15 px-5 py-2.5 font-mono text-[11px] font-700 uppercase tracking-widest text-foil transition-transform hover:-translate-y-0.5"
        >
          <RefreshCw size={14} /> Retry
        </button>
        <a
          href={`${EXPLORER}/address/${CONTRACT_ADDRESS}`}
          target="_blank"
          rel="noopener noreferrer"
          className="focus-ring flex items-center gap-2 border border-foil/30 px-5 py-2.5 font-mono text-[11px] uppercase tracking-widest text-muted hover:text-parchment"
        >
          Explorer <ExternalLink size={13} />
        </a>
      </div>
    </div>
  );
}
