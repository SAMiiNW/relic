'use client';

import { motion } from 'framer-motion';
import { BadgeCheck, HelpCircle, ShieldX, Hourglass, Stamp } from 'lucide-react';
import type { Artifact } from '@/lib/contract';
import { shortAddr, rulingColor, rulingBorder, rulingLabel, plate } from '@/lib/format';
import { Seal } from './Seal';

const ICON: Record<string, typeof BadgeCheck> = {
  GENUINE: BadgeCheck,
  DOUBTFUL: HelpCircle,
  FORGERY: ShieldX,
};

/**
 * A single full-column-width certificate, one per row, like a leaf in a bound
 * register. The seal and plate number sit in a left margin rail; the body and
 * ruling run across the page. Distinct from the multi-column card grid.
 */
export function LedgerEntry({
  artifact,
  pending,
  onAuthenticate,
}: {
  artifact: Artifact;
  pending?: boolean;
  onAuthenticate?: (a: Artifact) => void;
}) {
  const certified = artifact.status === 'CERTIFIED';
  const Icon = certified ? ICON[artifact.ruling] ?? HelpCircle : Hourglass;
  const accent = certified ? rulingColor[artifact.ruling] ?? 'text-muted' : 'text-foil';
  const frame = certified ? rulingBorder[artifact.ruling] ?? 'border-foil/20' : 'border-foil/20';

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.4 }}
      className={`engraved relative grid grid-cols-[auto_1fr] gap-5 bg-stock-800/70 p-6 sm:gap-7 ${
        pending ? 'opacity-70' : ''
      }`}
    >
      {/* left margin rail: seal + plate */}
      <div className="flex w-16 flex-col items-center gap-3 border-r border-foil/10 pr-5 sm:w-20">
        <Seal size={48} className={certified ? accent : 'text-foil/60'} />
        <div className="text-center">
          <p className="microlabel text-faint">Plate</p>
          <p className="mt-0.5 font-mono text-[11px] text-parchment">{plate(artifact.index)}</p>
        </div>
      </div>

      {/* the leaf body */}
      <div className="min-w-0">
        <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
          <div className="min-w-0">
            <h3 className="font-display text-2xl font-600 leading-snug tracking-tight text-parchment sm:text-3xl">
              {artifact.title}
            </h3>
            <p className="mt-1 font-mono text-[11px] text-faint">{artifact.id}</p>
          </div>
          <span
            className={`flex shrink-0 items-center gap-2 border px-3 py-1.5 font-mono text-[11px] font-700 uppercase tracking-widest ${frame} ${accent}`}
          >
            <Icon size={14} />
            {certified ? rulingLabel[artifact.ruling] : 'Awaiting evidence'}
          </span>
        </div>

        <p className="mt-3 font-body text-sm leading-relaxed text-muted">{artifact.description}</p>

        {certified ? (
          <div className="mt-5 flex flex-wrap items-end gap-x-8 gap-y-4 border-t border-foil/10 pt-4">
            <div>
              <div className={`tabular font-display text-5xl font-700 leading-none ${accent}`}>
                {artifact.score}
              </div>
              <div className="microlabel mt-1.5 text-faint">authenticity score</div>
            </div>
            {artifact.rationale && (
              <div className="min-w-[12rem] flex-1 border-l border-foil/30 pl-4">
                <p className="microlabel text-faint">Authenticator rationale</p>
                <p className="mt-1 font-body text-sm italic leading-relaxed text-parchment/85">
                  {artifact.rationale}
                </p>
              </div>
            )}
          </div>
        ) : (
          onAuthenticate && (
            <div className="mt-5 border-t border-foil/10 pt-4">
              <button
                type="button"
                onClick={() => onAuthenticate(artifact)}
                className="focus-ring flex items-center gap-1.5 border border-foil bg-foil/10 px-4 py-2 font-mono text-[11px] font-700 uppercase tracking-wider text-foil transition-colors hover:bg-foil/20"
              >
                <Stamp size={14} /> Submit provenance to authenticate
              </button>
            </div>
          )
        )}

        <div className="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t border-foil/10 pt-3 font-mono text-[11px] text-faint">
          <span>owner {shortAddr(artifact.owner)}</span>
          {certified && <span>sealed by {shortAddr(artifact.authenticator)}</span>}
        </div>
      </div>

      {pending && (
        <span className="absolute -top-3 left-6 animate-pulseseal border border-doubtful bg-stock px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-doubtful">
          Pending
        </span>
      )}
    </motion.article>
  );
}
