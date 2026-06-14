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

const SIZE_PX: Record<CapsuleSize, number> = { lg: 320, md: 270, sm: 230 };

/**
 * Suspension coordinates for specimen capsules inside the chamber, expressed
 * as percentages. Deliberately asymmetric with large voids; the core sits
 * off-center at (CX, CY) and every capsule tethers back to it.
 */
const SLOTS: { left: number; top: number; rot: number }[] = [
  { left: 22, top: 30, rot: -1.5 },
  { left: 24, top: 64, rot: 1.5 },
  { left: 47, top: 79, rot: -1 },
  { left: 78, top: 70, rot: 1.5 },
  { left: 86, top: 40, rot: -2 },
  { left: 70, top: 18, rot: 1 },
  { left: 45, top: 22, rot: -1 },
  { left: 88, top: 84, rot: 2 },
  { left: 20, top: 86, rot: -2 },
  { left: 62, top: 50, rot: 1.5 },
];

// authenticator core sits off-center, left-of-middle and high
const CX = 58;
const CY = 46;

function slotFor(i: number) {
  if (i < SLOTS.length) return SLOTS[i];
  const k = i - SLOTS.length;
  const angle = k * 2.399963 + 0.9;
  const r = 30 + (k % 3) * 6;
  const left = Math.max(18, Math.min(88, CX + Math.cos(angle) * r * 1.2));
  const top = Math.max(16, Math.min(86, CY + Math.sin(angle) * r * 0.95));
  const rot = ((k * 37) % 7) - 3;
  return { left, top, rot };
}

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
    () => artifacts.map((a, i) => ({ a, slot: slotFor(i), size: capsuleSize(a) })),
    [artifacts],
  );

  const hasCapsules = !loading && !error && artifacts.length > 0;

  // intake port anchor (matches the absolute plate position below)
  const INTAKE = { left: 19, top: 16 };

  // ---- WIDE: the suspended chamber (lg and up) ----
  const chamber = (
    <div className="relative hidden h-[clamp(860px,90vw,1240px)] w-full lg:block">
      {/* HUD corner brackets */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {/* coordinate ticks along the top edge */}
        {Array.from({ length: 12 }).map((_, i) => (
          <line
            key={`tick-${i}`}
            x1={6 + i * 8}
            y1={1.2}
            x2={6 + i * 8}
            y2={2.6}
            stroke="rgba(159,231,214,0.22)"
            strokeWidth="0.1"
          />
        ))}
        {/* corner brackets */}
        <path d="M1 5 L1 1 L6 1" stroke="rgba(159,231,214,0.4)" strokeWidth="0.16" fill="none" />
        <path d="M94 1 L99 1 L99 5" stroke="rgba(159,231,214,0.4)" strokeWidth="0.16" fill="none" />
        <path d="M1 95 L1 99 L6 99" stroke="rgba(159,231,214,0.4)" strokeWidth="0.16" fill="none" />
        <path
          d="M94 99 L99 99 L99 95"
          stroke="rgba(159,231,214,0.4)"
          strokeWidth="0.16"
          fill="none"
        />

        {/* intake feed line into the core */}
        <line
          x1={CX}
          y1={CY}
          x2={INTAKE.left}
          y2={INTAKE.top}
          stroke="rgba(217,195,138,0.32)"
          strokeWidth="0.12"
        />

        {/* specimen filaments radiating to the core */}
        {hasCapsules &&
          placed.map(({ a, slot }) => (
            <g key={`thread-${a.id}`}>
              <line
                x1={CX}
                y1={CY}
                x2={slot.left}
                y2={slot.top}
                stroke="rgba(159,231,214,0.16)"
                strokeWidth="0.12"
              />
              <line
                x1={CX}
                y1={CY}
                x2={slot.left}
                y2={slot.top}
                stroke="rgba(159,231,214,0.5)"
                strokeWidth="0.1"
                className="thread"
              />
            </g>
          ))}
      </svg>

      {/* authenticator reactor core */}
      <div
        className="absolute z-20"
        style={{ left: `${CX}%`, top: `${CY}%`, transform: 'translate(-50%, -50%)' }}
      >
        <AuthCore total={totalOnFile} certified={derived.certified} genuine={derived.genuine} />
      </div>

      {/* boot note plate, pinned mid-left */}
      <div
        className="engraved absolute z-10 w-[256px] bg-stock-900/75 p-5"
        style={{ left: '15%', top: '47%', transform: 'translate(-50%, -50%) rotate(-1.5deg)' }}
      >
        <span className="microlabel text-foil">Boot note</span>
        <p className="mt-2 font-body text-[13px] leading-relaxed text-muted">
          The public register of the Relic Provenance Bureau. Each capsule is one artifact on file.
          Feed its provenance through the intake port and an injection-resistant authenticator rules
          genuine, doubtful, or forgery under validator consensus.
        </p>
        <div className="mt-3 border-t border-foil/10 pt-3">
          <EngravedMarker
            href={`${EXPLORER}/address/${CONTRACT_ADDRESS}`}
            label="Inspect on explorer"
            icon={Compass}
          />
        </div>
      </div>

      {/* intake port plate, pinned high-left */}
      <div
        className="absolute z-20 w-[256px]"
        style={{
          left: `${INTAKE.left}%`,
          top: `${INTAKE.top}%`,
          transform: 'translate(-50%, -50%) rotate(-2deg)',
        }}
      >
        <IntakePort onRegister={onRegister} />
      </div>

      {/* docs reference engraved on its own, low on the right margin */}
      <div
        className="absolute z-10"
        style={{ left: '90%', top: '93%', transform: 'translate(-50%, -50%)' }}
      >
        <EngravedMarker href="https://docs.genlayer.com" label="GenLayer docs" icon={BookText} />
      </div>

      {/* body: capsules, or a state in place */}
      {loading ? (
        <div className="absolute left-[30%] top-[68%] w-[min(660px,72%)] -translate-x-1/2">
          <Skeleton />
        </div>
      ) : error ? (
        <div className="absolute left-[34%] top-[70%] w-[min(600px,72%)] -translate-x-1/2">
          <ErrorState message={error} onRetry={onRetry} />
        </div>
      ) : artifacts.length === 0 ? (
        <div className="absolute left-[36%] top-[70%] w-[min(620px,72%)] -translate-x-1/2">
          {totalOnFile === 0 ? <EmptyState onRegister={onRegister} /> : <NoMatch />}
        </div>
      ) : (
        placed.map(({ a, slot, size }) => (
          <div
            key={a.id}
            className="absolute z-10"
            style={{
              left: `${slot.left}%`,
              top: `${slot.top}%`,
              width: SIZE_PX[size],
              transform: `translate(-50%, -50%) rotate(${slot.rot}deg)`,
            }}
          >
            <Capsule artifact={a} size={size} onAuthenticate={onAuthenticate} />
          </div>
        ))
      )}
    </div>
  );

  // ---- NARROW: a readable vertical stack (below lg) ----
  const stack = (
    <div className="flex flex-col gap-6 lg:hidden">
      <section className="engraved bg-stock-900/60 p-5">
        <span className="microlabel text-foil">Boot note</span>
        <p className="mt-2 font-body text-[14px] leading-relaxed text-muted">
          The public register of the Relic Provenance Bureau. Each capsule is one artifact on file.
          Feed its provenance through the intake port and an injection-resistant authenticator rules
          genuine, doubtful, or forgery under validator consensus.
        </p>
      </section>

      <div className="flex justify-center py-2">
        <AuthCore
          total={totalOnFile}
          certified={derived.certified}
          genuine={derived.genuine}
          compact
        />
      </div>

      <IntakePort onRegister={onRegister} />

      <div className="flex justify-end">
        <EngravedMarker href="https://docs.genlayer.com" label="GenLayer docs" icon={BookText} />
      </div>

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
        <div className="flex flex-col gap-5">
          {placed.map(({ a, size }) => (
            <Capsule
              key={a.id}
              artifact={a}
              size={size === 'sm' ? 'sm' : 'md'}
              onAuthenticate={onAuthenticate}
            />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <>
      {chamber}
      {stack}
    </>
  );
}
