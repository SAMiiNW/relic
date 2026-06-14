'use client';

import { motion } from 'framer-motion';
import { ScrollText, ArrowDown } from 'lucide-react';
import { GuillocheCanvas } from './GuillocheCanvas';
import { Seal } from './Seal';
import { CONTRACT_ADDRESS, EXPLORER, FAUCET } from '@/lib/contract';
import { shortAddr } from '@/lib/format';
import { CopyButton } from './CopyButton';

interface Props {
  onRegister: () => void;
  stats: { total: number; certified: number; genuine: number; forgery: number } | null;
}

export function Hero({ onRegister, stats }: Props) {
  const genuineRate =
    stats && stats.certified ? Math.round((stats.genuine / stats.certified) * 100) : null;

  return (
    <section id="top" className="relative flex min-h-screen items-center overflow-hidden pt-16">
      <GuillocheCanvas />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-stock/40 via-transparent to-stock" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-stock via-stock/60 to-transparent" />

      <div className="relative mx-auto grid w-full max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.55fr_1fr] lg:items-center">
        {/* Left: kicker stack + foil title */}
        <div>
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3 border-l-2 border-foil pl-4"
          >
            <span className="microlabel text-foil">Certificate of authenticity</span>
            <span className="microlabel text-faint">Series MMXXVI</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="mt-6 font-display text-[clamp(3rem,8.5vw,7.5rem)] font-700 leading-[0.92] tracking-tight"
          >
            <span className="text-parchment">Provenance,</span>
            <br />
            <span className="foil-text">struck on-chain.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12 }}
            className="mt-7 max-w-xl font-body text-lg leading-relaxed text-muted"
          >
            Register an artifact, then submit its chain of ownership, documentation, and markings. An
            injection-resistant authenticator weighs the evidence and rules GENUINE, DOUBTFUL, or
            FORGERY with an authenticity score, and every validator re-runs the ruling before it is
            struck into a tamper-evident certificate.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <button
              type="button"
              onClick={onRegister}
              className="focus-ring flex items-center gap-2 border border-foil bg-foil/15 px-7 py-4 font-mono text-xs font-700 uppercase tracking-widest text-foil transition-transform hover:-translate-y-0.5"
            >
              <ScrollText size={17} /> Register a relic
            </button>
            <a
              href="#register"
              className="focus-ring flex items-center gap-2 border border-foil/25 px-7 py-4 font-mono text-xs font-600 uppercase tracking-widest text-parchment transition-colors hover:border-foil/60"
            >
              View the register <ArrowDown size={15} />
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[11px] text-faint"
          >
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-foil" /> Live on Bradbury
            </span>
            <span className="flex items-center gap-2">
              Contract {shortAddr(CONTRACT_ADDRESS)}
              <CopyButton value={CONTRACT_ADDRESS} label="Copy contract address" />
            </span>
            <a
              href={FAUCET}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring text-foil hover:underline"
            >
              Claim test GEN
            </a>
            <a
              href={`${EXPLORER}/address/${CONTRACT_ADDRESS}`}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring hover:text-parchment"
            >
              Explorer
            </a>
          </motion.div>
        </div>

        {/* Right: a seal medallion with a spec-margin ledger of figures */}
        <motion.aside
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="engraved relative mx-auto w-full max-w-sm bg-stock-900/70 p-7 backdrop-blur-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="microlabel text-faint">Bureau ledger</p>
              <p className="mt-1 font-display text-xl text-parchment">Issuance to date</p>
            </div>
            <Seal size={56} className="text-foil/80" spin />
          </div>

          <dl className="mt-7 space-y-px border border-foil/10 bg-foil/5">
            {[
              { k: 'Artifacts registered', v: stats ? stats.total : '\u2014' },
              { k: 'Certificates issued', v: stats ? stats.certified : '\u2014' },
              {
                k: 'Ruled genuine',
                v: genuineRate === null ? '\u2014' : `${stats?.genuine ?? 0} (${genuineRate}%)`,
              },
              { k: 'Flagged forgery', v: stats ? stats.forgery : '\u2014' },
              { k: 'Deposit required', v: 'None' },
            ].map((row) => (
              <div key={row.k} className="flex items-baseline justify-between gap-4 bg-stock-900 px-4 py-3">
                <dt className="font-body text-sm text-muted">{row.k}</dt>
                <dd className="tabular font-display text-2xl font-700 text-foil">{row.v}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-5 font-mono text-[10px] leading-relaxed text-faint">
            Every figure is derived live from contract state under GenLayer validator consensus. No
            custodian holds the ledger.
          </p>
        </motion.aside>
      </div>
    </section>
  );
}
