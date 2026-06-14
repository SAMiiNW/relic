'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Masthead } from '@/components/Masthead';
import { RegisterRow } from '@/components/RegisterRow';
import { RegisterClauses } from '@/components/RegisterClauses';
import { SpecMargin } from '@/components/SpecMargin';
import { Colophon } from '@/components/Colophon';
import { LedgerEntry } from '@/components/LedgerEntry';
import { GuillocheCanvas } from '@/components/GuillocheCanvas';
import { Skeleton, EmptyState, ErrorState } from '@/components/States';
import { SubmitModal, type ModalMode } from '@/components/SubmitModal';
import { ToastProvider } from '@/components/Toast';
import { Microprint } from '@/components/Microprint';
import { useWallet } from '@/hooks/useWallet';
import { useContractData } from '@/hooks/useContractData';
import { useTransaction } from '@/hooks/useTransaction';
import type { Artifact } from '@/lib/contract';

type Filter = 'ALL' | 'REGISTERED' | 'GENUINE' | 'DOUBTFUL' | 'FORGERY';

function Ledger() {
  const wallet = useWallet();
  const data = useContractData();
  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState<ModalMode>('register');
  const [target, setTarget] = useState<Artifact | null>(null);
  const [filter, setFilter] = useState<Filter>('ALL');
  const txApi = useTransaction(() => {
    void data.refresh();
  });

  const openRegister = () => {
    setMode('register');
    setTarget(null);
    setModalOpen(true);
  };
  const openAuthenticate = (a: Artifact) => {
    setMode('authenticate');
    setTarget(a);
    setModalOpen(true);
  };

  const filtered = useMemo(() => {
    const list = [...data.artifacts].sort((a, b) => b.index - a.index);
    if (filter === 'ALL') return list;
    if (filter === 'REGISTERED') return list.filter((a) => a.status === 'REGISTERED');
    return list.filter((a) => a.status === 'CERTIFIED' && a.ruling === filter);
  }, [data.artifacts, filter]);

  const filters: { key: Filter; label: string; count: number }[] = [
    { key: 'ALL', label: 'All', count: data.derived.total },
    { key: 'REGISTERED', label: 'Pending', count: data.derived.registered },
    { key: 'GENUINE', label: 'Genuine', count: data.derived.genuine },
    { key: 'DOUBTFUL', label: 'Doubtful', count: data.derived.doubtful },
    { key: 'FORGERY', label: 'Forgery', count: data.derived.forgery },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* faint guilloche behind the whole document */}
      <div className="pointer-events-none fixed inset-0 opacity-[0.45]">
        <GuillocheCanvas />
      </div>
      <div className="pointer-events-none fixed inset-0 bg-gradient-to-b from-stock/70 via-stock/35 to-stock" />

      <div className="relative">
        {/* FULL-WIDTH engraved masthead band with thin record sub-band */}
        <Masthead wallet={wallet} stats={data.derived} />

        {/* the body: a single narrow centered ledger column, with a slim right
            spec margin on wide screens. Side rails carry vertical microprint. */}
        <div className="mx-auto flex w-full max-w-[1080px] justify-center gap-6 px-3 py-10 sm:px-5 sm:py-14 lg:gap-10">
          <div className="hidden w-4 shrink-0 self-stretch border-x border-foil/10 sm:block">
            <Microprint text="RELIC PROVENANCE BUREAU" vertical repeat={30} />
          </div>

          <main className="min-w-0 flex-1" style={{ maxWidth: 720 }}>
            {/* intro entry: the register's opening note */}
            <section className="engraved bg-stock-900/55 px-5 py-6 sm:px-7 sm:py-7">
              <span className="microlabel text-foil">Entry, opening note</span>
              <p className="mt-2.5 font-body text-[15px] leading-relaxed text-muted">
                This is the public register of the Relic Provenance Bureau. Each line below is one
                artifact on file. Anyone may submit the chain of ownership, documentation, and
                markings for a plate; an injection-resistant authenticator weighs only what the
                evidence supports and rules genuine, doubtful, or forgery with an authenticity
                score. Every validator re-runs the ruling before it is struck into a tamper-evident
                certificate.
              </p>
            </section>

            {/* ruled call-to-action entry within the column flow */}
            <div className="mt-7">
              <RegisterRow onRegister={openRegister} />
            </div>

            {/* the issuance protocol as ruled clauses */}
            <div className="mt-12">
              <RegisterClauses />
            </div>

            {/* THE REGISTER, stacked vertically one plate per row */}
            <section id="register" className="mt-14">
              <Microprint text="ARCHIVAL REGISTER OF CERTIFIED RELICS" />

              <div className="mt-7 flex items-baseline justify-between gap-3 border-b border-foil/15 pb-2.5">
                <h2 className="font-display text-3xl font-700 leading-none tracking-tight text-parchment sm:text-4xl">
                  The register
                </h2>
                <span className="font-mono text-[11px] uppercase tracking-widest text-faint">
                  {filtered.length} of {data.derived.total} plates
                </span>
              </div>

              {/* inline engraved index line of filters, not floated pills */}
              <div className="mt-3 flex flex-wrap items-center gap-x-1 gap-y-2 font-mono text-[11px] uppercase tracking-widest">
                <span className="mr-1 text-faint">Index</span>
                {filters.map((f, i) => (
                  <span key={f.key} className="flex items-center">
                    {i > 0 && <span className="px-2 text-foil/30">|</span>}
                    <button
                      type="button"
                      onClick={() => setFilter(f.key)}
                      className={`focus-ring transition-colors ${
                        filter === f.key ? 'text-foil' : 'text-muted hover:text-parchment'
                      }`}
                    >
                      {f.label}
                      <span className="ml-1.5 text-faint">{f.count}</span>
                    </button>
                  </span>
                ))}
              </div>

              <div className="mt-7">
                {data.loading ? (
                  <Skeleton />
                ) : data.error ? (
                  <ErrorState message={data.error} onRetry={() => data.refresh()} />
                ) : data.artifacts.length === 0 ? (
                  <EmptyState onRegister={openRegister} />
                ) : filtered.length === 0 ? (
                  <div className="engraved bg-stock-800/60 px-6 py-14 text-center font-body text-muted">
                    No relics match this filter yet.
                  </div>
                ) : (
                  <motion.div layout className="flex flex-col gap-5">
                    {filtered.map((a) => (
                      <LedgerEntry key={a.id} artifact={a} onAuthenticate={openAuthenticate} />
                    ))}
                  </motion.div>
                )}
              </div>
            </section>

            <div className="mt-16">
              <Colophon />
            </div>
          </main>

          {/* slim right spec margin with plate counts */}
          <SpecMargin stats={data.derived} />
        </div>
      </div>

      <SubmitModal
        open={modalOpen}
        mode={mode}
        target={target}
        onClose={() => setModalOpen(false)}
        address={wallet.address}
        chainOk={wallet.chainOk}
        onConnect={wallet.connect}
        txApi={txApi}
        setTxInFlight={data.setTxInFlight}
      />
    </div>
  );
}

export default function Page() {
  return (
    <ToastProvider>
      <Ledger />
    </ToastProvider>
  );
}
