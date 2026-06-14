'use client';

import { Seal } from './Seal';

interface Props {
  stats: { total: number; certified: number; genuine: number; doubtful: number; forgery: number; registered: number } | null;
}

/**
 * A slim right spec margin that tallies plate counts beside the ledger column,
 * the way a register keeps a running marginal count. Sticky on wide screens,
 * hidden on narrow ones where the single column stands alone.
 */
export function SpecMargin({ stats }: Props) {
  const rows: { k: string; v: number | string; tone?: string }[] = [
    { k: 'Plates total', v: stats ? stats.total : '\u2014' },
    { k: 'Awaiting', v: stats ? stats.registered : '\u2014' },
    { k: 'Sealed', v: stats ? stats.certified : '\u2014' },
    { k: 'Genuine', v: stats ? stats.genuine : '\u2014', tone: 'text-genuine' },
    { k: 'Doubtful', v: stats ? stats.doubtful : '\u2014', tone: 'text-doubtful' },
    { k: 'Forgery', v: stats ? stats.forgery : '\u2014', tone: 'text-forgery' },
  ];

  return (
    <aside className="sticky top-6 hidden w-44 shrink-0 lg:block">
      <div className="engraved bg-stock-900/60 p-4">
        <div className="flex items-center justify-between border-b border-foil/10 pb-3">
          <span className="microlabel text-faint">Marginal tally</span>
          <Seal size={26} className="text-foil/70" />
        </div>
        <dl className="mt-3 space-y-2.5">
          {rows.map((r) => (
            <div key={r.k} className="flex items-baseline justify-between gap-2">
              <dt className="font-mono text-[10px] uppercase tracking-wider text-faint">{r.k}</dt>
              <dd className={`tabular font-display text-xl font-700 ${r.tone ?? 'text-foil'}`}>
                {r.v}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </aside>
  );
}
