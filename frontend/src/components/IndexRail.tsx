'use client';

import { useState } from 'react';
import { Filter as FilterIcon, X } from 'lucide-react';
import { Seal } from './Seal';
import { WalletControl } from './WalletControl';
import { Microprint } from './Microprint';
import type { WalletState } from '@/hooks/useWallet';

export type Filter = 'ALL' | 'REGISTERED' | 'GENUINE' | 'DOUBTFUL' | 'FORGERY';

export interface FilterEntry {
  key: Filter;
  label: string;
  count: number;
  tone: string;
}

interface Props {
  wallet: WalletState & { connect: () => void; disconnect: () => void };
  filters: FilterEntry[];
  active: Filter;
  onSelect: (f: Filter) => void;
}

function IndexList({
  filters,
  active,
  onSelect,
}: {
  filters: FilterEntry[];
  active: Filter;
  onSelect: (f: Filter) => void;
}) {
  return (
    <nav aria-label="Filter the vault wall" className="flex flex-col">
      {filters.map((f, i) => {
        const on = active === f.key;
        return (
          <button
            key={f.key}
            type="button"
            onClick={() => onSelect(f.key)}
            aria-pressed={on}
            className={`focus-ring group flex min-h-[44px] items-center justify-between gap-3 border-b border-foil/10 px-1 py-2 text-left transition-colors ${
              on ? 'text-foil' : 'text-muted hover:text-parchment'
            }`}
          >
            <span className="flex items-baseline gap-2.5">
              <span className="font-mono text-[10px] text-faint">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span
                className={`font-display text-lg font-600 leading-none tracking-tight ${
                  on ? f.tone : ''
                }`}
              >
                {f.label}
              </span>
            </span>
            <span
              className={`tabular font-mono text-[11px] ${on ? 'text-parchment' : 'text-faint'}`}
            >
              {f.count}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

/**
 * The engraved index rail. On wide screens it is fixed to the left edge of the
 * vault, running vertically: the bureau seal, the wallet entry, the filters as
 * an engraved index, and a microprint spine. On narrow screens it collapses to
 * a slim docked bar at the foot with a sheet that lifts the same index.
 */
export function IndexRail({ wallet, filters, active, onSelect }: Props) {
  const [open, setOpen] = useState(false);
  const activeLabel = filters.find((f) => f.key === active)?.label ?? 'All';

  return (
    <>
      {/* WIDE: fixed vertical engraved rail on the left edge */}
      <aside
        aria-label="Engraved index"
        className="fixed left-0 top-0 z-30 hidden h-screen w-[208px] flex-col border-r border-foil/20 bg-stock-950/80 px-5 py-6 backdrop-blur-sm lg:flex xl:w-[232px]"
      >
        <div className="flex items-center gap-3">
          <Seal size={40} className="shrink-0 text-foil" spin />
          <div className="min-w-0 leading-none">
            <span className="block font-display text-2xl font-700 tracking-tight">
              <span className="foil-text">Relic</span>
            </span>
            <span className="microlabel mt-1 block text-faint">Provenance Bureau</span>
          </div>
        </div>

        <div className="mt-6 border-y border-foil/10 py-4">
          <span className="microlabel text-faint">Wallet</span>
          <div className="mt-2.5">
            <WalletControl wallet={wallet} />
          </div>
        </div>

        <div className="mt-5">
          <span className="microlabel text-foil">Engraved index</span>
          <div className="mt-2.5">
            <IndexList filters={filters} active={active} onSelect={onSelect} />
          </div>
        </div>

        <div className="mt-auto flex items-end justify-between gap-2 pt-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-faint">
            Series
            <br />
            MMXXVI
          </p>
          <div className="h-24 overflow-hidden">
            <Microprint text="RELIC PROVENANCE BUREAU" vertical repeat={20} />
          </div>
        </div>
      </aside>

      {/* NARROW: slim docked bar at the foot */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-foil/20 bg-stock-950/95 backdrop-blur-sm lg:hidden">
        <div className="flex items-center justify-between gap-3 px-4 py-2.5">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open the engraved index"
            className="focus-ring flex min-h-[44px] items-center gap-2 border border-foil/30 bg-foil/10 px-4 font-mono text-[11px] font-700 uppercase tracking-wider text-foil"
          >
            <FilterIcon size={15} /> {activeLabel}
          </button>
          <WalletControl wallet={wallet} />
        </div>
      </div>

      {/* NARROW: index sheet */}
      {open && (
        <div
          className="fixed inset-0 z-40 flex items-end bg-stock-950/80 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
        >
          <div
            className="engraved w-full bg-stock-900 p-6 pb-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-foil/15 pb-3">
              <span className="flex items-center gap-2.5">
                <Seal size={28} className="text-foil" />
                <span className="microlabel text-foil">Engraved index</span>
              </span>
              <button
                type="button"
                aria-label="Close the index"
                onClick={() => setOpen(false)}
                className="focus-ring flex h-11 w-11 items-center justify-center text-faint hover:text-parchment"
              >
                <X size={22} />
              </button>
            </div>
            <div className="mt-3">
              <IndexList
                filters={filters}
                active={active}
                onSelect={(f) => {
                  onSelect(f);
                  setOpen(false);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
