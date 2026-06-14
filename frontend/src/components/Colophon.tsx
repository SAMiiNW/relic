'use client';

import { ExternalLink } from 'lucide-react';
import { CONTRACT_ADDRESS, DEPLOY_TX, EXPLORER, FAUCET } from '@/lib/contract';
import { shortAddr, shortHash } from '@/lib/format';
import { CopyButton } from './CopyButton';
import { Seal } from './Seal';

/**
 * The colophon: a final stamped-seal line at the foot of the ledger column.
 * A centered seal, a single engraved record line, and the disclaimer, instead
 * of a wide brand-and-links footer grid.
 */
export function Colophon() {
  return (
    <footer className="mt-4 flex flex-col items-center gap-5 border-t border-foil/15 pt-10 text-center">
      <Seal size={56} className="text-foil/80" />
      <p className="microlabel text-foil">Sealed under validator consensus</p>

      <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 font-mono text-[11px] text-muted">
        <span className="flex items-center gap-1.5">
          <a
            href={`${EXPLORER}/address/${CONTRACT_ADDRESS}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foil"
          >
            Contract {shortAddr(CONTRACT_ADDRESS)}
          </a>
          <CopyButton value={CONTRACT_ADDRESS} label="Copy contract" />
        </span>
        <span className="hidden h-1 w-1 rounded-full bg-foil/40 sm:block" />
        <a
          href={`${EXPLORER}/tx/${DEPLOY_TX}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-foil"
        >
          Deploy {shortHash(DEPLOY_TX)}
        </a>
        <span className="hidden h-1 w-1 rounded-full bg-foil/40 sm:block" />
        <a
          href={FAUCET}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 hover:text-foil"
        >
          Draw filing fees <ExternalLink size={12} />
        </a>
        <span className="hidden h-1 w-1 rounded-full bg-foil/40 sm:block" />
        <a
          href="https://docs.genlayer.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 hover:text-foil"
        >
          GenLayer docs <ExternalLink size={12} />
        </a>
      </div>

      <p className="microlabel text-faint">Free filing, you hold your own keys</p>
    </footer>
  );
}
