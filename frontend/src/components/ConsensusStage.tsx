'use client';

import { motion } from 'framer-motion';
import { Loader2, BadgeCheck, HelpCircle, ShieldX } from 'lucide-react';
import type { TxState } from '@/hooks/useTransaction';
import { rulingColor, rulingLabel } from '@/lib/format';
import { Seal } from './Seal';

const STAGE_ORDER = ['SUBMITTED', 'PROPOSING', 'COMMITTING', 'REVEALING', 'ACCEPTED'];

function stageIndex(status: string): number {
  if (status === 'PENDING' || status === '') return 0;
  if (status === 'LEADER_TIMEOUT' || status === 'VALIDATORS_TIMEOUT') return 1;
  const i = STAGE_ORDER.indexOf(status);
  return i < 0 ? 1 : i;
}

const STAGES = [
  { key: 'SUBMITTED', label: 'Submitted', note: 'Transaction broadcast to Bradbury' },
  { key: 'PROPOSING', label: 'Authenticator drafting', note: 'Leader weighs the provenance' },
  { key: 'COMMITTING', label: 'Validators re-running', note: 'Each re-derives the ruling' },
  { key: 'REVEALING', label: 'Revealing votes', note: 'Independent rulings compared' },
  { key: 'ACCEPTED', label: 'Certificate struck', note: 'Sealed under consensus on-chain' },
];

const ICON: Record<string, typeof BadgeCheck> = {
  GENUINE: BadgeCheck,
  DOUBTFUL: HelpCircle,
  FORGERY: ShieldX,
};

export function ConsensusStage({ tx }: { tx: TxState }) {
  const idx = stageIndex(tx.liveStatus);
  const rotating = tx.liveStatus === 'LEADER_TIMEOUT' || tx.liveStatus === 'VALIDATORS_TIMEOUT';
  const draft = tx.draft;
  const DraftIcon = draft ? ICON[draft.ruling] ?? HelpCircle : HelpCircle;

  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative flex h-40 w-40 items-center justify-center">
        <motion.span
          className="absolute inset-0"
          animate={{ rotate: 360 }}
          transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
        >
          <Seal size={160} className="text-foil/50" />
        </motion.span>
        <Seal size={72} className="text-foil" />
      </div>

      <p className="microlabel mt-6 text-foil">
        {rotating ? 'Rotating leader, still working' : 'Consensus in progress'}
      </p>
      <h3 className="mt-2 font-display text-3xl font-600 tracking-tight text-parchment">
        The bureau deliberates
      </h3>
      <p className="mt-2 max-w-md font-body text-sm text-muted">
        An AI write on Bradbury takes one to five minutes. Validators are re-weighing the provenance
        independently. This panel updates live.
      </p>

      <div className="mt-8 w-full max-w-md space-y-px border border-foil/15 bg-foil/5">
        {STAGES.map((s, i) => {
          const done = i < idx;
          const active = i === idx;
          return (
            <div
              key={s.key}
              className={`flex items-center gap-3 bg-stock-900 p-3 text-left ${active ? 'bg-foil/5' : ''}`}
            >
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border font-mono text-[11px] ${
                  done
                    ? 'border-genuine text-genuine'
                    : active
                      ? 'border-foil text-foil'
                      : 'border-foil/20 text-faint'
                }`}
              >
                {active ? <Loader2 size={13} className="animate-spin" /> : done ? '\u2713' : i + 1}
              </span>
              <div className="min-w-0">
                <p
                  className={`font-mono text-[11px] uppercase tracking-wider ${done || active ? 'text-parchment' : 'text-faint'}`}
                >
                  {s.label}
                </p>
                <p className="font-body text-xs text-faint">{s.note}</p>
              </div>
            </div>
          );
        })}
      </div>

      {draft && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="engraved mt-6 w-full max-w-md bg-stock-800 p-4 text-left"
        >
          <p className="microlabel text-faint">Leader draft, sealing under consensus</p>
          <div className="mt-2 flex items-center justify-between">
            <span
              className={`flex items-center gap-2 font-mono text-sm font-700 uppercase tracking-wider ${rulingColor[draft.ruling] ?? 'text-parchment'}`}
            >
              <DraftIcon size={16} />
              {rulingLabel[draft.ruling] ?? draft.ruling}
            </span>
            {typeof draft.score === 'number' && (
              <span
                className={`tabular font-display text-4xl font-700 ${rulingColor[draft.ruling] ?? 'text-parchment'}`}
              >
                {draft.score}
              </span>
            )}
          </div>
          {draft.rationale && (
            <p className="mt-2 font-body text-sm italic text-parchment/85">{draft.rationale}</p>
          )}
        </motion.div>
      )}

      <p className="mt-6 font-mono text-[11px] text-faint">
        Status: <span className="text-parchment">{tx.liveStatus || 'PENDING'}</span>
      </p>
    </div>
  );
}
