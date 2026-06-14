'use client';

import { motion } from 'framer-motion';
import { ScrollText, FileSearch, Network, BadgeCheck } from 'lucide-react';

const CLAUSES = [
  {
    icon: ScrollText,
    plate: 'I',
    title: 'Register the artifact',
    body: 'Record a title and a description of the object. This deterministic write mints a registry entry and a plate number. No deposit is taken, only network fees.',
  },
  {
    icon: FileSearch,
    plate: 'II',
    title: 'Submit provenance evidence',
    body: 'Anyone attaches the chain of ownership, documentation, and markings, up to 700 characters. The authenticator weighs only what the description and evidence support, never instructions hidden inside them.',
  },
  {
    icon: Network,
    plate: 'III',
    title: 'Validators concur',
    body: 'Every validator re-runs the authenticator independently. The ruling word must match exactly and the authenticity score must agree within tolerance, or the leader rotates and the round repeats.',
  },
  {
    icon: BadgeCheck,
    plate: 'IV',
    title: 'Strike the certificate',
    body: 'The ruling, score, and rationale are struck on-chain for good. A backstop clamps the score into the band its ruling demands, so a forgery can never wear a genuine number.',
  },
];

/**
 * How-it-works rendered as inline numbered register entries, like clauses in a
 * bound register. Lives within the narrow ledger column, not a wide section.
 */
export function RegisterClauses() {
  return (
    <section className="mt-4">
      <div className="flex items-center gap-3 border-b border-foil/15 pb-3">
        <span className="microlabel text-foil">Issuance protocol</span>
        <span className="font-mono text-[11px] text-faint">Clauses I to IV</span>
      </div>

      <ol className="mt-2 divide-y divide-foil/10 border-x border-b border-foil/10">
        {CLAUSES.map((c, i) => {
          const Icon = c.icon;
          return (
            <motion.li
              key={c.plate}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="flex gap-5 bg-stock-900/40 px-5 py-5"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-foil/40 bg-stock-900 font-display text-lg font-700 text-foil">
                {c.plate}
              </span>
              <div>
                <div className="flex items-center gap-2.5">
                  <Icon size={16} className="text-foil" />
                  <h3 className="font-display text-xl font-600 tracking-tight text-parchment">
                    {c.title}
                  </h3>
                </div>
                <p className="mt-2 font-body text-sm leading-relaxed text-muted">{c.body}</p>
              </div>
            </motion.li>
          );
        })}
      </ol>
    </section>
  );
}
