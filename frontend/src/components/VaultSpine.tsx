'use client';

import { useState } from 'react';
import { Droplet, SlidersHorizontal, X } from 'lucide-react';
import { Seal } from './Seal';
import { WalletControl } from './WalletControl';
import { WaxSeal } from './WaxSeal';
import { Microprint } from './Microprint';
import { FAUCET } from '@/lib/contract';
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
  online: boolean;
  /** sealed certificate count, drives the wax-seal press */
  certified: number;
  /** total artifacts on file, used as the current plate number */
  total: number;
}

/** The vault drawers: filters rendered as OS drawer rows with a lit tick. */
function DrawerList({
  filters,
  active,
  onSelect,
}: {
  filters: FilterEntry[];
  active: Filter;
  onSelect: (f: Filter) => void;
}) {
  return (
    <nav aria-label="Vault drawers" className="flex flex-col gap-px">
      {filters.map((f, i) => {
        const on = active === f.key;
        return (
          <button
            key={f.key}
            type="button"
            onClick={() => onSelect(f.key)}
            aria-pressed={on}
            className={`focus-ring group relative flex min-h-[44px] items-center gap-3 px-1 py-2 pl-3 text-left transition-colors ${
              on ? 'bg-foil/5 text-foil' : 'text-muted hover:text-parchment'
            }`}
          >
            {/* lit tick on the active drawer */}
            <span
              aria-hidden="true"
              className={`absolute left-0 top-1/2 h-6 w-[2px] -translate-y-1/2 transition-all ${
                on ? 'bg-foil' : 'bg-transparent group-hover:bg-foil/30'
              }`}
            />
            <span className="font-mono text-[10px] text-faint">
              {String(i + 1).padStart(2, '0')}
            </span>
            <span
              className={`flex-1 font-display text-lg font-600 leading-none tracking-tight ${
                on ? f.tone : ''
              }`}
            >
              {f.label}
            </span>
            <span
              className={`tabular font-mono text-[11px] ${on ? 'text-parchment' : 'text-faint'}`}
            >
              {String(f.count).padStart(2, '0')}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

function StatusLine({ online }: { online: boolean }) {
  return (
    <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em]">
      <span
        className={`h-1.5 w-1.5 rounded-full ${online ? 'bg-foil animate-pulseseal' : 'bg-foil/40'}`}
      />
      <span className={online ? 'text-foil' : 'text-faint'}>
        {online ? 'Online' : 'Standby'}
      </span>
    </span>
  );
}

/**
 * The command spine: the OS chrome of the vault terminal, running vertically
 * down the left edge. Boot seal + wordmark + status, the KEYHOLDER (wallet)
 * module, the VAULT DRAWERS (filters), and a microprint foot. Never a
 * horizontal bar. Collapses to a docked foot control + lift sheet when narrow.
 */
export function VaultSpine({ wallet, filters, active, onSelect, online, certified, total }: Props) {
  const [open, setOpen] = useState(false);
  const activeLabel = filters.find((f) => f.key === active)?.label ?? 'All';

  return (
    <>
      {/* WIDE: fixed vertical command spine */}
      <aside
        aria-label="Vault command spine"
        className="fixed left-0 top-0 z-30 hidden h-screen w-[210px] flex-col border-r border-foil/20 bg-stock-950/85 px-5 py-6 backdrop-blur-sm lg:flex xl:w-[236px]"
      >
        {/* boot header */}
        <div className="flex items-center gap-3">
          <Seal size={42} className="shrink-0 text-foil" spin />
          <div className="min-w-0 leading-none">
            <span className="block font-display text-2xl font-700 tracking-tight">
              <span className="foil-text">Relic</span>
            </span>
            <span className="microlabel mt-1 block text-faint">Vault terminal</span>
          </div>
        </div>

        {/* keyholder: the first interactive control, at the head of the spine */}
        <div className="mt-5">
          <span className="microlabel text-foil">Keyholder</span>
          <div className="mt-2.5">
            <WalletControl wallet={wallet} block />
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between border-y border-foil/10 py-2.5">
          <StatusLine online={online} />
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-faint">v1.0</span>
        </div>

        {/* vault drawers */}
        <div className="mt-6">
          <span className="microlabel text-foil">Vault drawers</span>
          <div className="mt-2.5">
            <DrawerList filters={filters} active={active} onSelect={onSelect} />
          </div>
        </div>

        {/* foot: bureau wax stamp, filing-fee tap, microprint spine */}
        <div className="mt-auto pt-5">
          <div className="border-t border-foil/10 pt-4">
            <WaxSeal certified={certified} plateNo={total} />
          </div>
          <a
            href={FAUCET}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring mt-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-foil transition-colors hover:text-parchment"
          >
            <Droplet size={13} /> Draw filing fees
          </a>
          <div className="mt-4 flex items-end justify-between gap-2">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-faint">
              Series
              <br />
              MMXXVI
            </p>
            <div className="h-20 overflow-hidden">
              <Microprint text="RELIC VAULT AUTHENTICATION TERMINAL" vertical repeat={16} />
            </div>
          </div>
        </div>
      </aside>

      {/* NARROW: docked foot control */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-foil/20 bg-stock-950/95 backdrop-blur-sm lg:hidden">
        <div className="flex items-center justify-between gap-3 px-4 py-2.5">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open vault drawers"
            className="focus-ring flex min-h-[44px] items-center gap-2 border border-foil/30 bg-foil/10 px-4 font-mono text-[11px] font-700 uppercase tracking-wider text-foil"
          >
            <SlidersHorizontal size={15} /> {activeLabel}
          </button>
          <WalletControl wallet={wallet} />
        </div>
      </div>

      {/* NARROW: drawers sheet */}
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
                <span className="microlabel text-foil">Vault drawers</span>
              </span>
              <button
                type="button"
                aria-label="Close drawers"
                onClick={() => setOpen(false)}
                className="focus-ring flex h-11 w-11 items-center justify-center text-faint hover:text-parchment"
              >
                <X size={22} />
              </button>
            </div>
            <div className="mt-3">
              <DrawerList
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
