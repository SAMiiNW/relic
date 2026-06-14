'use client';

import { useMemo } from 'react';
import { Compass, BookText } from 'lucide-react';
import type { Artifact } from '@/lib/contract';
import { CONTRACT_ADDRESS, EXPLORER } from '@/lib/contract';
import { Capsule, type CapsuleSize } from './Capsule';
import { AuthCore } from './AuthCore';
import { IntakePort } from './IntakePort';
import { EngravedMarker } from './EngravedMarker';
import { Skeleton, EmptyState, ErrorState } from './States';

interface Derived {
  total: number;
  registered: number;
  certified: number;
  genuine: number;
  doubtful: number;
  forgery: number;
}

interface Props {
  artifacts: Artifact[];
  derived: Derived;
  loading: boolean;
  error: string | null;
  totalOnFile: number;
  onRegister: () => void;
  onAuthenticate: (a: Artifact) => void;
  onRetry: () => void;
}

function NoMatch() {
  return (
    <div className="engraved bg-stock-800/60 px-6 py-12 text-center font-body text-muted">
      No specimens in this drawer yet.
    </div>
  );
}

function capsuleSize(a: Artifact): CapsuleSize {
  if (a.status === 'CERTIFIED' && a.ruling === 'GENUINE') return 'lg';
  if (a.status === 'CERTIFIED') return 'md';
  return 'sm';
}

/**
 * A purely decorative guilloche filament backdrop. It carries no controls and
 * never receives pointer events, so it can never overlap or collide with the
 * cards in front of it. It only adds the faint security-print signature behind
 * the top band of the chamber.
 */
function Filaments() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full opacity-50"
      viewBox="0 0 100 60"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path d="M0 4 L100 4" stroke="rgba(159,231,214,0.16)" strokeWidth="0.12" fill="none" />
      <path d="M0 56 L100 56" stroke="rgba(159,231,214,0.16)" strokeWidth="0.12" fill="none" />
      {Array.from({ length: 13 }).map((_, i) => (
        <line
          key={`tick-${i}`}
          x1={6 + i * 7}
          y1={1.4}
          x2={6 + i * 7}
          y2={3}
          stroke="rgba(159,231,214,0.22)"
          strokeWidth="0.1"
        />
      ))}
      <path d="M0.6 2.4 L0.6 0.6 L4 0.6" stroke="rgba(159,231,214,0.4)" strokeWidth="0.16" fill="none" />
      <path d="M96 0.6 L99.4 0.6 L99.4 2.4" stroke="rgba(159,231,214,0.4)" strokeWidth="0.16" fill="none" />
    </svg>
  );
}

/**
 * The vault chamber, laid out in normal document flow. A top band carries the
 * boot note beside the authenticator reactor core, the intake port sits on its
 * own clear row, and every specimen capsule is a normal cell in a responsive
 * grid (one, two, then three columns) with real gaps, so nothing overlaps on
 * any viewport. The bureau reference markers trail below in flow.
 */
export function VaultChamber({
  artifacts,
  derived,
  loading,
  error,
  totalOnFile,
  onRegister,
  onAuthenticate,
  onRetry,
}: Props) {
  const placed = useMemo(
    () => artifacts.map((a) => ({ a, size: capsuleSize(a) })),
    [artifacts],
  );

  return (
    <div className="flex flex-col gap-8">
      {/* top band: boot note beside the authenticator reactor core */}
      <section className="relative">
        <Filaments />
        <div className="relative grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-stretch">
          <div className="engraved flex flex-col bg-stock-900/70 p-5 sm:p-6">
            <span className="microlabel text-foil">Boot note</span>
            <p className="mt-2 font-body text-[14px] leading-relaxed text-muted">
              The public register of the Relic Provenance Bureau. Each capsule is one artifact on
              file. Feed its provenance through the intake port and an injection-resistant
              authenticator rules genuine, doubtful, or forgery under validator consensus.
            </p>
            <div className="mt-4 border-t border-foil/10 pt-4">
              <EngravedMarker
                href={`${EXPLORER}/address/${CONTRACT_ADDRESS}`}
                label="Inspect on explorer"
                icon={Compass}
              />
            </div>
          </div>

          <div className="engraved flex items-center justify-center bg-stock-900/50 p-5 sm:p-6 lg:px-10">
            <AuthCore total={totalOnFile} certified={derived.certified} genuine={derived.genuine} />
          </div>
        </div>
      </section>

      {/* intake port: the register-a-relic action on its own clear row */}
      <section>
        <IntakePort onRegister={onRegister} />
      </section>

      {/* heading for the specimen grid */}
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-foil/15 pb-3">
        <div>
          <span className="microlabel text-foil">Vault wall</span>
          <h2 className="mt-1 font-display text-2xl font-700 tracking-tight text-parchment sm:text-3xl">
            Artifacts on file
          </h2>
        </div>
        <span className="tabular font-mono text-[11px] uppercase tracking-[0.2em] text-faint">
          {artifacts.length} shown / {totalOnFile} on file
        </span>
      </div>

      {/* the specimens, as a responsive grid of normal cells */}
      {loading ? (
        <Skeleton />
      ) : error ? (
        <ErrorState message={error} onRetry={onRetry} />
      ) : artifacts.length === 0 ? (
        totalOnFile === 0 ? (
          <EmptyState onRegister={onRegister} />
        ) : (
          <NoMatch />
        )
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {placed.map(({ a, size }) => (
            <Capsule key={a.id} artifact={a} size={size} onAuthenticate={onAuthenticate} />
          ))}
        </div>
      )}

      {/* bureau reference markers, trailing below in flow */}
      <div className="flex flex-wrap items-center gap-3 pt-2">
        <EngravedMarker
          href={`${EXPLORER}/address/${CONTRACT_ADDRESS}`}
          label="Inspect on explorer"
          icon={Compass}
        />
        <EngravedMarker href="https://docs.genlayer.com" label="GenLayer docs" icon={BookText} />
      </div>
    </div>
  );
}
