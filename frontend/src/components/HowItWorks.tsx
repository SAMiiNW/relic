'use client';

import { motion } from 'framer-motion';
import { ScrollText, FileSearch, Network, BadgeCheck } from 'lucide-react';
import { Microprint } from './Microprint';

const STEPS = [
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

export function HowItWorks() {
  return (
    <section id="how" className="relative border-t border-foil/15 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Microprint text="ISSUANCE PROTOCOL" />
        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="microlabel text-foil">The issuance protocol</span>
            <h2 className="mt-3 font-display text-5xl font-700 leading-[0.95] tracking-tight text-parchment sm:text-6xl">
              How a certificate
              <br />
              is struck
            </h2>
          </div>
          <p className="max-w-md font-body text-muted">
            Relic is not an opinion. The authenticator ruling is the on-chain settlement, reproduced
            independently by every validator before the bureau records it.
          </p>
        </div>

        {/* Vertical ledger column with a drawn spine */}
        <div className="relative mt-16">
          <div className="absolute bottom-0 left-[27px] top-2 hidden w-px bg-gradient-to-b from-foil/40 via-foil/20 to-transparent sm:block" />
          <ol className="space-y-5">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.li
                  key={s.plate}
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="relative flex gap-6"
                >
                  <span className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center border border-foil/40 bg-stock-900 font-display text-xl font-700 text-foil">
                    {s.plate}
                  </span>
                  <div className="engraved flex-1 bg-stock-900/60 p-6">
                    <div className="flex items-center gap-3">
                      <Icon size={18} className="text-foil" />
                      <h3 className="font-display text-2xl font-600 tracking-tight text-parchment">
                        {s.title}
                      </h3>
                    </div>
                    <p className="mt-3 font-body text-sm leading-relaxed text-muted">{s.body}</p>
                  </div>
                </motion.li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
