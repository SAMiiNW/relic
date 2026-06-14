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

export function CertificateCard({
  artifact,
  fresh,
  pending,
  onAuthenticate,
}: {
  artifact: Artifact;
  fresh?: boolean;
  pending?: boolean;
  onAuthenticate?: (a: Artifact) => void;
}) {
  const certified = artifact.status === 'CERTIFIED';
  const Icon = certified ? ICON[artifact.ruling] ?? HelpCircle : Hourglass;
  const accent = certified ? rulingColor[artifact.ruling] ?? 'text-muted' : 'text-foil';
  const frame = certified ? rulingBorder[artifact.ruling] ?? 'border-foil/20' : 'border-foil/20';

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className={`engraved group relative flex flex-col bg-stock-800/70 p-6 transition-transform hover:-translate-y-1 ${
        fresh ? 'animate-sealframe' : ''
      } ${pending ? 'opacity-70' : ''}`}
    >
      {/* plate header */}
      <div className="flex items-start justify-between gap-3 border-b border-foil/10 pb-4">
        <div>
          <p className="microlabel text-faint">Plate {plate(artifact.index)}</p>
          <p className="mt-1 font-mono text-[11px] text-muted">{artifact.id}</p>
        </div>
        <Seal size={40} className={certified ? accent : 'text-foil/60'} />
      </div>

      <h3 className="mt-5 font-display text-2xl font-600 leading-snug tracking-tight text-parchment">
        {artifact.title}
      </h3>

      <p className="mt-3 line-clamp-3 font-body text-sm leading-relaxed text-muted">
        {artifact.description}
      </p>

      {/* ruling block */}
      <div className="mt-5 flex items-end justify-between border-t border-foil/10 pt-4">
        <span
          className={`flex items-center gap-2 font-mono text-xs font-700 uppercase tracking-widest ${accent}`}
        >
          <Icon size={16} />
          {certified ? rulingLabel[artifact.ruling] : 'Awaiting evidence'}
        </span>
        {certified ? (
          <div className="text-right">
            <div className={`tabular font-display text-4xl font-700 leading-none ${accent}`}>
              {artifact.score}
            </div>
            <div className="microlabel mt-1 text-faint">authenticity</div>
          </div>
        ) : (
          onAuthenticate && (
            <button
              type="button"
              onClick={() => onAuthenticate(artifact)}
              className="focus-ring flex items-center gap-1.5 border border-foil bg-foil/10 px-3 py-1.5 font-mono text-[11px] font-700 uppercase tracking-wider text-foil transition-colors hover:bg-foil/20"
            >
              <Stamp size={13} /> Authenticate
            </button>
          )
        )}
      </div>

      {certified && artifact.rationale && (
        <div className="mt-4 border-l border-foil/30 pl-3">
          <p className="microlabel text-faint">Authenticator rationale</p>
          <p className="mt-1 font-body text-sm italic leading-relaxed text-parchment/85">
            {artifact.rationale}
          </p>
        </div>
      )}

      <div className="mt-5 flex items-center justify-between border-t border-foil/10 pt-3 font-mono text-[11px] text-faint">
        <span>owner {shortAddr(artifact.owner)}</span>
        {certified && <span>sealed by {shortAddr(artifact.authenticator)}</span>}
      </div>

      {pending && (
        <span className="absolute -top-3 left-4 animate-pulseseal border border-doubtful bg-stock px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-doubtful">
          Pending
        </span>
      )}
    </motion.article>
  );
}
