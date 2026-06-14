'use client';

import { motion } from 'framer-motion';
import { ScrollText } from 'lucide-react';
import { Seal } from './Seal';
import { WalletControl } from './WalletControl';
import { CONTRACT_ADDRESS, EXPLORER, FAUCET } from '@/lib/contract';
import { shortAddr } from '@/lib/format';
import { CopyButton } from './CopyButton';
import type { WalletState } from '@/hooks/useWallet';

interface Props {
  wallet: WalletState & { connect: () => void; disconnect: () => void };
  onRegister: () => void;
  stats: { total: number; certified: number; genuine: number; forgery: number } | null;
}

/**
 * The certificate title plate: an engraved masthead at the head of the ledger
 * column. A centered seal medallion, plate and series numbering, and a stamped
 * record block carrying the contract and network. Deliberately not a wide
 * two-line accent headline.
 */
export function TitlePlate({ wallet, onRegister, stats }: Props) {
  const genuineRate =
    stats && stats.certified ? Math.round((stats.genuine / stats.certified) * 100) : null;

  return (
    <motion.header
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="engraved relative bg-stock-900/70 px-6 py-10 text-center sm:px-10 sm:py-12"
    >
      {/* top rule: bureau line + wallet */}
      <div className="mb-8 flex items-center justify-between gap-3 border-b border-foil/10 pb-5">
        <span className="microlabel text-left text-faint">
          Relic
          <br />
          Provenance Bureau
        </span>
        <WalletControl wallet={wallet} />
      </div>

      {/* seal + engraved title */}
      <div className="flex flex-col items-center">
        <Seal size={84} className="text-foil" spin />
        <span className="microlabel mt-6 text-foil">Certificate of Authenticity</span>
        <h1 className="mt-3 font-display text-[clamp(2.6rem,9vw,4.6rem)] font-700 leading-[0.95] tracking-tight text-parchment">
          Relic
        </h1>
        <div className="mt-3 flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.28em] text-faint">
          <span>Plate No. 00001</span>
          <span className="h-1 w-1 rounded-full bg-foil/50" />
          <span>Series MMXXVI</span>
        </div>
      </div>

      {/* engraved description clause */}
      <p className="mx-auto mt-8 max-w-xl font-body text-[15px] leading-relaxed text-muted">
        An on-chain provenance oracle. Register an artifact, submit its chain of ownership and
        markings, and an injection-resistant authenticator rules genuine, doubtful, or forgery with
        an authenticity score. Every validator re-runs the ruling before it is struck into a
        tamper-evident certificate.
      </p>

      {/* stamped record block: contract + network (replaces chip row) */}
      <div className="mx-auto mt-9 max-w-lg border border-foil/20 bg-foil/5 px-5 py-4 text-left font-mono text-[11px] text-muted">
        <div className="flex items-center justify-between gap-3 border-b border-foil/10 pb-2.5">
          <span className="microlabel text-faint">Registry of record</span>
          <span className="flex items-center gap-2 text-foil">
            <span className="h-1.5 w-1.5 rounded-full bg-foil" /> Live on Bradbury
          </span>
        </div>
        <div className="mt-2.5 flex items-center justify-between gap-2">
          <span className="text-faint">Contract</span>
          <span className="flex items-center gap-2">
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
        </div>
        <div className="mt-2 flex items-center justify-between gap-2">
          <span className="text-faint">Issued to date</span>
          <span className="text-parchment">
            {stats ? stats.total : '\u2014'} registered
            <span className="text-faint"> / </span>
            {stats ? stats.certified : '\u2014'} sealed
            {genuineRate !== null && <span className="text-faint"> / {genuineRate}% genuine</span>}
          </span>
        </div>
        <div className="mt-2 flex items-center justify-between gap-2">
          <span className="text-faint">Test GEN</span>
          <a
            href={FAUCET}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring text-foil hover:underline"
          >
            Claim from faucet
          </a>
        </div>
      </div>

      <button
        type="button"
        onClick={onRegister}
        className="focus-ring mx-auto mt-9 flex items-center gap-2 border border-foil bg-foil/15 px-7 py-3.5 font-mono text-xs font-700 uppercase tracking-widest text-foil transition-transform hover:-translate-y-0.5"
      >
        <ScrollText size={16} /> Register a relic
      </button>
    </motion.header>
  );
}
