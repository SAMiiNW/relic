'use client';

import { useState } from 'react';
import { ChevronDown, ExternalLink, LogOut, Wallet } from 'lucide-react';
import { CONTRACT_ADDRESS, EXPLORER } from '@/lib/contract';
import { shortAddr } from '@/lib/format';
import { CopyButton } from './CopyButton';
import type { WalletState } from '@/hooks/useWallet';

interface Props {
  wallet: WalletState & { connect: () => void; disconnect: () => void };
}

/**
 * A compact wallet control that sits inside the ledger column instead of a
 * wide fixed site header. Connect, account menu, network indicator.
 */
export function WalletControl({ wallet }: Props) {
  const [menu, setMenu] = useState(false);

  if (!wallet.address) {
    return (
      <button
        type="button"
        onClick={wallet.connect}
        disabled={wallet.connecting}
        className="focus-ring flex items-center gap-2 border border-foil/40 bg-foil/10 px-4 py-2 font-mono text-[11px] font-700 uppercase tracking-wider text-foil transition-colors hover:bg-foil/20 disabled:opacity-60"
      >
        <Wallet size={15} />
        {wallet.connecting ? 'Connecting' : 'Connect wallet'}
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setMenu((v) => !v)}
        className="focus-ring flex items-center gap-2 border border-foil/40 bg-foil/5 px-3 py-2 font-mono text-[11px] text-parchment"
      >
        <span className={`h-2 w-2 rounded-full ${wallet.chainOk ? 'bg-foil' : 'bg-doubtful'}`} />
        {shortAddr(wallet.address)}
        <ChevronDown size={14} />
      </button>
      {menu && (
        <div className="engraved absolute right-0 top-12 z-30 w-72 bg-stock-800 p-4">
          <p className="microlabel text-faint">Connected wallet</p>
          <div className="mt-2 flex items-center justify-between gap-2 break-all font-mono text-[11px] text-muted">
            <span>{wallet.address}</span>
            <CopyButton value={wallet.address} label="Copy address" />
          </div>
          {!wallet.chainOk && (
            <p className="mt-3 border border-doubtful/40 bg-doubtful/10 p-2 font-mono text-[11px] text-doubtful">
              Wrong network. Switch to Bradbury (4221).
            </p>
          )}
          <a
            href={`${EXPLORER}/address/${CONTRACT_ADDRESS}`}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring mt-3 flex items-center gap-1 font-mono text-[11px] text-foil hover:underline"
          >
            View contract <ExternalLink size={12} />
          </a>
          <button
            type="button"
            onClick={() => {
              wallet.disconnect();
              setMenu(false);
            }}
            className="focus-ring mt-4 flex w-full items-center justify-center gap-2 border border-foil/20 py-2 font-mono text-[11px] uppercase tracking-wider text-muted transition-colors hover:border-forgery hover:text-forgery"
          >
            <LogOut size={14} /> Disconnect
          </button>
        </div>
      )}
    </div>
  );
}
