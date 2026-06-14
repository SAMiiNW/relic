'use client';

import { CONTRACT_ADDRESS, DEPLOY_TX, EXPLORER, FAUCET } from '@/lib/contract';
import { shortAddr, shortHash } from '@/lib/format';
import { CopyButton } from './CopyButton';

interface Props {
  live: boolean;
}

/**
 * The system bus: a thin engraved status ribbon docked to a low margin of the
 * vault chamber carrying the on-chain particulars. Network of record, the
 * bureau seal contract, the filing-fee faucet, the explorer and deploy links,
 * with the bureau disclaimer in fine print beneath. Docked as a margin bus, not
 * a stacked footer band.
 */
export function SystemBus({ live }: Props) {
  return (
    <section
      aria-label="System bus, on-chain particulars"
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
        <a
          href={FAUCET}
          target="_blank"
          rel="noopener noreferrer"
          className="focus-ring text-foil hover:underline"
        >
          Draw filing fees
        </a>
        <span className="hidden h-3 w-px bg-foil/20 sm:block" />
        <a
          href={`${EXPLORER}/address/${CONTRACT_ADDRESS}`}
          target="_blank"
          rel="noopener noreferrer"
          className="focus-ring hover:text-parchment"
        >
          Inspect on explorer
        </a>
        <span className="hidden h-3 w-px bg-foil/20 sm:block" />
        <a
          href={`${EXPLORER}/tx/${DEPLOY_TX}`}
          target="_blank"
          rel="noopener noreferrer"
          className="focus-ring hover:text-parchment"
        >
          Deploy {shortHash(DEPLOY_TX)}
        </a>
      </div>
      <p className="mt-2.5 max-w-3xl font-mono text-[10px] leading-relaxed text-faint">
        This bureau is an experiment on the GenLayer Bradbury testnet. A certificate records the
        consensus of independent validators, not the opinion of a licensed appraiser, and confers no
        warranty of title or value. Filing is free; you hold your own keys throughout.
      </p>
    </section>
  );
}
