'use client';

import { ExternalLink } from 'lucide-react';
import { CONTRACT_ADDRESS, DEPLOY_TX, EXPLORER, FAUCET } from '@/lib/contract';
import { shortAddr, shortHash } from '@/lib/format';
import { CopyButton } from './CopyButton';
import { Seal } from './Seal';
import { Microprint } from './Microprint';

export function Footer() {
  return (
    <footer className="border-t border-foil/20 bg-stock-900">
      <Microprint text={'RELIC PROVENANCE BUREAU \u00B7 GENLAYER BRADBURY'} />

      {/* masthead band */}
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="flex flex-col items-center gap-5 text-center">
          <Seal size={64} className="text-foil/80" />
          <h2 className="font-display text-5xl font-700 tracking-tight text-parchment sm:text-6xl">
            Relic
          </h2>
          <p className="max-w-xl font-body text-sm leading-relaxed text-muted">
            An on-chain provenance oracle. Certificates of authenticity issued by an
            injection-resistant AI authenticator under GenLayer validator consensus. No deposit, no
            custody, no backend.
          </p>
        </div>

        {/* on-chain register line + resources, single ruled row */}
        <div className="mt-12 grid gap-6 border-t border-foil/10 pt-8 font-mono text-[11px] sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-center justify-between gap-2 text-muted">
            <a
              href={`${EXPLORER}/address/${CONTRACT_ADDRESS}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foil"
            >
              Contract {shortAddr(CONTRACT_ADDRESS)}
            </a>
            <CopyButton value={CONTRACT_ADDRESS} label="Copy contract" />
          </div>
          <div className="flex items-center justify-between gap-2 text-muted">
            <a
              href={`${EXPLORER}/tx/${DEPLOY_TX}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foil"
            >
              Deploy {shortHash(DEPLOY_TX)}
            </a>
            <CopyButton value={DEPLOY_TX} label="Copy deploy tx" />
          </div>
          <a
            href={FAUCET}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-muted hover:text-foil"
          >
            Bradbury faucet <ExternalLink size={12} />
          </a>
          <a
            href="https://docs.genlayer.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-muted hover:text-foil"
          >
            GenLayer docs <ExternalLink size={12} />
          </a>
        </div>
      </div>

      <div className="border-t border-foil/10 px-4 py-5 text-center font-mono text-[11px] text-faint sm:px-6">
        Built on GenLayer Bradbury Testnet. A certificate is an AI ruling under validator consensus,
        not a professional appraisal.
      </div>
    </footer>
  );
}
