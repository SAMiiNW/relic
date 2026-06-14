'use client';

import { motion } from 'framer-motion';
import { Seal } from './Seal';
import { Microprint } from './Microprint';
import { WalletControl } from './WalletControl';
import { CopyButton } from './CopyButton';
import { CONTRACT_ADDRESS, EXPLORER, FAUCET } from '@/lib/contract';
import { shortAddr } from '@/lib/format';
import type { WalletState } from '@/hooks/useWallet';

interface Props {
  wallet: WalletState & { connect: () => void; disconnect: () => void };
  stats: { total: number; certified: number; genuine: number; forgery: number } | null;
}

/**
 * The bureau masthead: a full-width engraved banner band that runs edge to edge
 * across the head of the document, the way a banknote or a certificate register
 * carries its issuing-bureau header. Microprint runs along the top and bottom
 * edges, the bureau name and a single line of purpose sit on the plate, and a
 * thin engraved sub-band beneath carries the network of record, the contract,
 * the faucet and the explorer as a ruled register strip. Deliberately not a
 * centered two-line hero, and the network details are not a centered chip row.
 */
export function Masthead({ wallet, stats }: Props) {
  const live = Boolean(wallet.address && wallet.chainOk);

  return (
    <header id="top" className="relative w-full border-b border-foil/20 bg-stock-900/70">
      <Microprint text={'RELIC PROVENANCE BUREAU \u00B7 CERTIFICATE OF AUTHENTICITY'} repeat={60} />

      {/* the engraved masthead plate, full bleed */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mx-auto flex max-w-[1180px] flex-col gap-7 px-4 py-9 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:gap-10"
      >
        <div className="flex items-center gap-5 sm:gap-7">
          <Seal size={72} className="shrink-0 text-foil" spin />
          <div className="min-w-0">
            <span className="microlabel text-foil">Bureau of provenance and authenticity</span>
            <h1 className="mt-1 font-display text-[clamp(2.6rem,7vw,4.6rem)] font-700 leading-[0.9] tracking-tight">
              <span className="foil-text">Relic</span>
            </h1>
            <p className="mt-2 max-w-xl font-body text-[15px] leading-snug text-muted">
              An on-chain oracle that rules an artifact genuine, doubtful, or forgery and strikes a
              tamper-evident certificate under GenLayer validator consensus.
            </p>
          </div>
        </div>

        {/* right plate: series numbering + wallet, ledger-style stamp block */}
        <div className="flex shrink-0 flex-col items-start gap-4 lg:items-end">
          <WalletControl wallet={wallet} />
          <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.28em] text-faint">
            <span>Plate No. 00001</span>
            <span className="h-1 w-1 rounded-full bg-foil/50" />
            <span>Series MMXXVI</span>
          </div>
          <div className="font-mono text-[11px] text-faint">
            <span className="text-parchment">{stats ? stats.total : '\u2014'}</span> registered
            <span className="px-1.5 text-foil/40">/</span>
            <span className="text-parchment">{stats ? stats.certified : '\u2014'}</span> sealed
          </div>
        </div>
      </motion.div>

      {/* thin engraved sub-band: network of record, contract, faucet, explorer */}
      <div className="border-t border-foil/15 bg-foil/5">
        <div className="mx-auto flex max-w-[1180px] flex-col gap-y-2 px-4 py-2.5 font-mono text-[11px] text-muted sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-7 sm:px-8">
          <span className="flex items-center gap-2">
            <span className={`h-1.5 w-1.5 rounded-full ${live ? 'bg-foil' : 'bg-foil/60'}`} />
            <span className="text-faint">Network of record</span>
            <span className="text-parchment">Bradbury Testnet</span>
          </span>
          <span className="hidden h-3 w-px bg-foil/20 sm:block" />
          <span className="flex items-center gap-2">
            <span className="text-faint">Contract</span>
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
            Claim test GEN
          </a>
          <span className="hidden h-3 w-px bg-foil/20 sm:block" />
          <a
            href={`${EXPLORER}/address/${CONTRACT_ADDRESS}`}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring hover:text-parchment"
          >
            Explorer
          </a>
        </div>
      </div>
    </header>
  );
}
