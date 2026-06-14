'use client';

import { useState } from 'react';
import { ChevronDown, ExternalLink, LogOut, Wallet } from 'lucide-react';
import { CONTRACT_ADDRESS, EXPLORER } from '@/lib/contract';
import { shortAddr } from '@/lib/format';
import { CopyButton } from './CopyButton';
import type { WalletState } from '@/hooks/useWallet';

interface Props {
  wallet: WalletState & { connect: () => void; disconnect: () => void };
  /** prominent full-width treatment, used as the primary control at the top of the spine */
  block?: boolean;
}

/**
 * The keyholder control. Connect, account menu, network indicator. The `block`
 * variant is a full-width foil button used as the first interactive control at
 * the head of the command spine; the compact variant sits in the narrow foot.
 */
export function WalletControl({ wallet, block = false }: Props) {
  const [menu, setMenu] = useState(false);

  if (!wallet.address) {
    return (
      <button
        type="button"
        onClick={wallet.connect}
        disabled={wallet.connecting}
        className={
          block
            ? 'focus-ring flex w-full items-center justify-center gap-2 border border-foil bg-foil/15 px-4 py-3 font-mono text-[13px] font-700 uppercase tracking-[0.18em] text-foil shadow-[0_0_0_1px_rgba(159,231,214,0.15),0_8px_24px_rgba(0,0,0,0.35)] transition-colors hover:bg-foil/25 disabled:opacity-60'
            : 'focus-ring flex items-center gap-2 border border-foil/40 bg-foil/10 px-4 py-2 font-mono text-[11px] font-700 uppercase tracking-wider text-foil transition-colors hover:bg-foil/20 disabled:opacity-60'
        }
      >
        <Wallet size={block ? 16 : 15} />
        {wallet.connecting ? 'Connecting' : 'Connect wallet'}
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setMenu((v) => !v)}
        className={
          block
            ? 'focus-ring flex w-full items-center gap-2 border border-foil/50 bg-foil/10 px-3 py-2.5 font-mono text-[12px] text-parchment transition-colors hover:bg-foil/15'
            : 'focus-ring flex items-center gap-2 border border-foil/40 bg-foil/5 px-3 py-2 font-mono text-[11px] text-parchment'
        }
      >
        <span className={`h-2 w-2 rounded-full ${wallet.chainOk ? 'bg-foil' : 'bg-doubtful'}`} />
        {shortAddr(wallet.address)}
        {!wallet.chainOk && (
          <span className="font-700 uppercase tracking-wider text-doubtful">off-net</span>
        )}
        <ChevronDown size={14} className={block ? 'ml-auto' : ''} />
      </button>
      {menu && (
        <div
          className={`engraved absolute z-30 w-72 max-w-[78vw] bg-stock-800 p-4 ${
            block ? 'left-0 top-full mt-2' : 'right-0 top-12'
          }`}
        >
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
