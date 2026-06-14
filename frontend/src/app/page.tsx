'use client';

import { useMemo, useState } from 'react';
import { GuillocheCanvas } from '@/components/GuillocheCanvas';
import { VaultSpine, type Filter, type FilterEntry } from '@/components/VaultSpine';
import { VaultChamber } from '@/components/VaultChamber';
import { SystemBus } from '@/components/SystemBus';
import { Microprint } from '@/components/Microprint';
import { SubmitModal, type ModalMode } from '@/components/SubmitModal';
import { ToastProvider } from '@/components/Toast';
import { useWallet } from '@/hooks/useWallet';
import { useContractData } from '@/hooks/useContractData';
import { useTransaction } from '@/hooks/useTransaction';
import type { Artifact } from '@/lib/contract';

function VaultTerminal() {
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

  const filters: FilterEntry[] = [
    { key: 'ALL', label: 'All', count: data.derived.total, tone: 'text-foil' },
    { key: 'REGISTERED', label: 'Pending', count: data.derived.registered, tone: 'text-foil' },
    { key: 'GENUINE', label: 'Genuine', count: data.derived.genuine, tone: 'text-genuine' },
    { key: 'DOUBTFUL', label: 'Doubtful', count: data.derived.doubtful, tone: 'text-doubtful' },
    { key: 'FORGERY', label: 'Forgery', count: data.derived.forgery, tone: 'text-forgery' },
  ];

  const online = Boolean(wallet.address && wallet.chainOk);

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* the guilloche field behind the entire vault */}
      <div className="pointer-events-none fixed inset-0 opacity-[0.45]">
        <GuillocheCanvas />
      </div>
      <div className="pointer-events-none fixed inset-0 bg-gradient-to-b from-stock/70 via-stock/35 to-stock" />

      {/* the OS chrome: a narrow vertical command spine on the left edge */}
      <VaultSpine
        wallet={wallet}
        filters={filters}
        active={filter}
        onSelect={setFilter}
        online={online}
        certified={data.derived.certified}
        total={data.derived.total}
      />

      {/* the vault chamber: the rest of the viewport, offset past the spine */}
      <div className="relative lg:pl-[210px] xl:pl-[236px]">
        {/* a faint vertical microprint seam running down the chamber's left edge */}
        <div className="pointer-events-none absolute left-0 top-0 hidden h-full w-4 border-r border-foil/10 lg:block">
          <Microprint text="RELIC VAULT AUTHENTICATION TERMINAL" vertical repeat={40} />
        </div>

        {/* chamber inner padding; extra bottom room for the narrow docked foot bar */}
        <div className="px-4 pb-28 pt-8 sm:px-7 lg:px-10 lg:pb-10 lg:pt-10">
          <VaultChamber
            artifacts={filtered}
            derived={data.derived}
            loading={data.loading}
            error={data.error}
            totalOnFile={data.derived.total}
            onRegister={openRegister}
            onAuthenticate={openAuthenticate}
            onRetry={() => data.refresh()}
          />

          {/* the system bus ribbon docked to the low margin of the chamber */}
          <div className="mt-10 lg:mt-4">
            <SystemBus live={online} />
          </div>
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
      <VaultTerminal />
    </ToastProvider>
  );
}
