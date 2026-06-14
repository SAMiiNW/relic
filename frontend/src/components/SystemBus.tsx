'use client';

import { CONTRACT_ADDRESS, DEPLOY_TX, EXPLORER } from '@/lib/contract';
import { shortAddr, shortHash } from '@/lib/format';
import { CopyButton } from './CopyButton';

interface Props {
  live: boolean;
}

/**
 * The system bus: a thin engraved status ribbon docked to a low margin of the
 * vault chamber. It carries only the seal of record now, the network and the
 * bureau-seal contract with its copy control and deploy hash. The filing-fee
 * tap lives on the command spine and the explorer and docs markers are engraved
 * separately elsewhere, so the bus no longer reads as one bunched link cluster.
 */
export function SystemBus({ live }: Props) {
  return (
    <section
      aria-label="System bus, seal of record"
      className="engraved bg-stock-900/75 px-4 py-3 sm:px-5"
    >
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[11px] text-muted">
        <span className="flex items-center gap-2">
          <span className={`h-1.5 w-1.5 rounded-full ${live ? 'bg-foil' : 'bg-foil/60'}`} />
          <span className="text-faint">Registry held on</span>
          <span className="text-parchment">Bradbury Testnet</span>
        </span>
        <span className="hidden h-3 w-px bg-foil/20 sm:block" />
        <span className="flex items-center gap-2">
          <span className="text-faint">Bureau seal</span>
          <a
            href={`${EXPLORER}/address/${CONTRACT_ADDRESS}`}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring text-parchment hover:text-foil"
          >
            {shortAddr(CONTRACT_ADDRESS)}
          </a>
          <CopyButton value={CONTRACT_ADDRESS} label="Copy contract address" />
        </span>
        <span className="hidden h-3 w-px bg-foil/20 sm:block" />
        <span className="flex items-center gap-2 text-faint">
          <span>Sealed by deploy</span>
          <span className="text-parchment">{shortHash(DEPLOY_TX)}</span>
        </span>
      </div>
    </section>
  );
}
