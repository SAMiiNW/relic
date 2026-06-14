'use client';

import { ExternalLink } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface Props {
  href: string;
  label: string;
  icon: LucideIcon;
}

/**
 * A single engraved reference marker: a small hairline-ruled tag carrying one
 * outbound link. Deliberately used on its own at separate spots in the vault so
 * the bureau references read as scattered engraved marks, never one cluster.
 */
export function EngravedMarker({ href, label, icon: Icon }: Props) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="focus-ring inline-flex items-center gap-2 border border-foil/20 bg-stock-900/60 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-faint transition-colors hover:border-foil/40 hover:text-foil"
    >
      <Icon size={12} className="shrink-0 text-foil/70" />
      {label}
      <ExternalLink size={11} className="shrink-0 opacity-60" />
    </a>
  );
}
