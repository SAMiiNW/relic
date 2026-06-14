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

export type PlateSize = 'sm' | 'md' | 'lg';

/**
 * A certificate mounted as a framed plate on the vault wall. The same leaf can
 * hang at three sizes; larger and genuine certificates hang as bigger plates.
 * On the wall it is absolutely positioned and slightly tilted by the parent; in
 * the mobile stack it flows as a full-width block. All ruling, score, rationale
 * and the authenticate action are preserved from the prior register entry.
 */
export function Plate({
  artifact,
  size,
  pending,
  fresh,
  onAuthenticate,
}: {
  artifact: Artifact;
  size: PlateSize;
  pending?: boolean;
  fresh?: boolean;
  onAuthenticate?: (a: Artifact) => void;
}) {
  const certified = artifact.status === 'CERTIFIED';
  const Icon = certified ? ICON[artifact.ruling] ?? HelpCircle : Hourglass;
  const accent = certified ? rulingColor[artifact.ruling] ?? 'text-muted' : 'text-foil';
  const frame = certified ? rulingBorder[artifact.ruling] ?? 'border-foil/25' : 'border-foil/25';

  const titleSize =
    size === 'lg' ? 'text-2xl sm:text-3xl' : size === 'md' ? 'text-xl sm:text-2xl' : 'text-lg';
  const sealSize = size === 'lg' ? 40 : size === 'md' ? 34 : 28;

  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className={`engraved group flex h-full flex-col bg-stock-800/80 p-4 backdrop-blur-[1px] transition-transform sm:p-5 ${
        fresh ? 'animate-sealframe' : ''
      } ${pending ? 'opacity-80' : ''} hover:-translate-y-0.5`}
    >
      {/* plate header: plate number, kind tag, seal */}
      <div className="flex items-start justify-between gap-3 border-b border-foil/10 pb-3">
        <div className="min-w-0">
          <p className="microlabel text-faint">Plate {plate(artifact.index)}</p>
          <span
            className={`mt-1.5 inline-flex items-center gap-1.5 border px-2 py-1 font-mono text-[10px] font-700 uppercase tracking-widest ${frame} ${accent}`}
          >
            <Icon size={12} />
            {certified ? rulingLabel[artifact.ruling] : 'Awaiting evidence'}
          </span>
        </div>
        <Seal size={sealSize} className={`shrink-0 ${certified ? accent : 'text-foil/60'}`} />
      </div>

      {/* title + description */}
      <h3
        className={`mt-3 font-display ${titleSize} font-600 leading-snug tracking-tight text-parchment`}
      >
        {artifact.title}
      </h3>
      <p
        className={`mt-2 font-body text-sm leading-relaxed text-muted ${
          size === 'lg' ? 'line-clamp-4' : size === 'md' ? 'line-clamp-3' : 'line-clamp-2'
        }`}
      >
        {artifact.description}
      </p>

      {/* ruling / action block, pinned to the foot of the frame */}
      <div className="mt-auto pt-3">
        {certified ? (
          <div className="flex items-end justify-between gap-3 border-t border-foil/10 pt-3">
            <span
              className={`flex items-center gap-2 font-mono text-[11px] font-700 uppercase tracking-widest ${accent}`}
            >
              <Icon size={14} />
              {rulingLabel[artifact.ruling]}
            </span>
            <div className="text-right">
              <div className={`tabular font-display text-3xl font-700 leading-none ${accent}`}>
                {artifact.score}
              </div>
              <div className="microlabel mt-0.5 text-faint">authenticity</div>
            </div>
          </div>
        ) : (
          onAuthenticate && (
            <div className="border-t border-foil/10 pt-3">
              <button
                type="button"
                onClick={() => onAuthenticate(artifact)}
                className="focus-ring flex min-h-[44px] w-full items-center justify-center gap-1.5 border border-foil bg-foil/10 px-3 py-2 font-mono text-[11px] font-700 uppercase tracking-wider text-foil transition-colors hover:bg-foil/20"
              >
                <Stamp size={13} /> Submit provenance
              </button>
            </div>
          )
        )}

        {certified && artifact.rationale && size === 'lg' && (
          <div className="mt-3 border-l border-foil/30 pl-3">
            <p className="microlabel text-faint">Rationale</p>
            <p className="mt-1 line-clamp-2 font-body text-xs italic leading-relaxed text-parchment/85">
              {artifact.rationale}
            </p>
          </div>
        )}

        <div className="mt-3 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-t border-foil/10 pt-2.5 font-mono text-[10px] text-faint">
          <span>owner {shortAddr(artifact.owner)}</span>
          {certified && <span>sealed {shortAddr(artifact.authenticator)}</span>}
        </div>
      </div>

      {pending && (
        <span className="absolute -top-3 left-4 z-10 animate-pulseseal border border-doubtful bg-stock px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-doubtful">
          Pending
        </span>
      )}
    </motion.article>
  );
}
