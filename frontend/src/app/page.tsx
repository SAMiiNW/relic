'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ScrollText, Library, Stamp } from 'lucide-react';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { HowItWorks } from '@/components/HowItWorks';
import { Footer } from '@/components/Footer';
import { CertificateCard } from '@/components/CertificateCard';
import { Skeleton, EmptyState, ErrorState } from '@/components/States';
import { SubmitModal, type ModalMode } from '@/components/SubmitModal';
import { ToastProvider } from '@/components/Toast';
import { Microprint } from '@/components/Microprint';
import { useWallet } from '@/hooks/useWallet';
import { useContractData } from '@/hooks/useContractData';
import { useTransaction } from '@/hooks/useTransaction';
import type { Artifact } from '@/lib/contract';

type Filter = 'ALL' | 'REGISTERED' | 'GENUINE' | 'DOUBTFUL' | 'FORGERY';

function Catalog() {
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

  const filters: { key: Filter; label: string }[] = [
    { key: 'ALL', label: `All ${data.derived.total}` },
    { key: 'REGISTERED', label: `Pending ${data.derived.registered}` },
    { key: 'GENUINE', label: `Genuine ${data.derived.genuine}` },
    { key: 'DOUBTFUL', label: `Doubtful ${data.derived.doubtful}` },
    { key: 'FORGERY', label: `Forgery ${data.derived.forgery}` },
  ];

  return (
    <>
      <Header wallet={wallet} onRegister={openRegister} />
      <main>
        <Hero onRegister={openRegister} stats={data.derived} />
        <HowItWorks />

        {/* THE REGISTER */}
        <section id="register" className="border-t border-foil/15 py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <Microprint text="ARCHIVAL REGISTER OF CERTIFIED RELICS" />
            <div className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <span className="microlabel flex items-center gap-2 text-foil">
                  <Library size={14} /> The register
                </span>
                <h2 className="mt-3 font-display text-5xl font-700 leading-[0.95] tracking-tight text-parchment sm:text-6xl">
                  Every relic on file
                </h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {filters.map((f) => (
                  <button
                    key={f.key}
                    type="button"
                    onClick={() => setFilter(f.key)}
                    className={`focus-ring border px-3 py-2 font-mono text-[11px] uppercase tracking-wider transition-colors ${
                      filter === f.key
                        ? 'border-foil bg-foil/15 text-foil'
                        : 'border-foil/20 text-muted hover:border-foil/50'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-12">
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
                <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filtered.map((a) => (
                    <CertificateCard key={a.id} artifact={a} onAuthenticate={openAuthenticate} />
                  ))}
                </motion.div>
              )}
            </div>

            {/* CTA banner */}
            <div className="engraved mt-16 flex flex-col items-center justify-between gap-6 bg-foil/5 p-8 sm:flex-row">
              <div className="flex items-start gap-4">
                <Stamp size={28} className="mt-1 shrink-0 text-foil" />
                <div>
                  <h3 className="font-display text-3xl font-700 tracking-tight text-parchment">
                    Hold something with a story?
                  </h3>
                  <p className="mt-2 font-body text-muted">
                    Register the artifact, submit its provenance, and let the authenticator strike a
                    certificate the chain will keep forever.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={openRegister}
                className="focus-ring flex shrink-0 items-center gap-2 border border-foil bg-foil/15 px-7 py-4 font-mono text-xs font-700 uppercase tracking-widest text-foil transition-transform hover:-translate-y-0.5"
              >
                <ScrollText size={18} /> Register a relic
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />

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
    </>
  );
}

export default function Page() {
  return (
    <ToastProvider>
      <Catalog />
    </ToastProvider>
  );
}
