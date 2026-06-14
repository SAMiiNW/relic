'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { fetchArtifacts, fetchStats, type Artifact, type Stats } from '@/lib/contract';

const POLL_MS = 95000;

export interface ContractData {
  artifacts: Artifact[];
  stats: Stats | null;
  loading: boolean;
  error: string | null;
  derived: {
    total: number;
    registered: number;
    certified: number;
    genuine: number;
    doubtful: number;
    forgery: number;
  };
  refresh: () => Promise<void>;
  setTxInFlight: (v: boolean) => void;
}

export function useContractData(): ContractData {
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const txInFlight = useRef(false);
  const alive = useRef(true);

  const loadAll = useCallback(async () => {
    try {
      const all: Artifact[] = [];
      let start = 0;
      for (let guard = 0; guard < 50; guard++) {
        const page = await fetchArtifacts(start);
        all.push(...page);
        if (page.length < 20) break;
        start += 20;
      }
      const s = await fetchStats();
      if (!alive.current) return;
      setArtifacts(all);
      setStats(s);
      setError(null);
    } catch (e) {
      if (!alive.current) return;
      const msg = String(e);
      if (/contract not found|execution reverted/i.test(msg)) {
        setError(
          'No contract responded at the configured address on Bradbury. The deployment may need repair.',
        );
      } else {
        setError('Could not reach the registry.');
      }
    } finally {
      if (alive.current) setLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    await loadAll();
  }, [loadAll]);

  const setTxInFlight = useCallback((v: boolean) => {
    txInFlight.current = v;
  }, []);

  useEffect(() => {
    alive.current = true;
    loadAll();
    const id = setInterval(() => {
      if (!txInFlight.current) loadAll();
    }, POLL_MS);
    return () => {
      alive.current = false;
      clearInterval(id);
    };
  }, [loadAll]);

  const derived = useMemo(() => {
    const total = artifacts.length;
    const certified = artifacts.filter((a) => a.status === 'CERTIFIED');
    return {
      total,
      registered: artifacts.filter((a) => a.status === 'REGISTERED').length,
      certified: certified.length,
      genuine: certified.filter((a) => a.ruling === 'GENUINE').length,
      doubtful: certified.filter((a) => a.ruling === 'DOUBTFUL').length,
      forgery: certified.filter((a) => a.ruling === 'FORGERY').length,
    };
  }, [artifacts]);

  return { artifacts, stats, loading, error, derived, refresh, setTxInFlight };
}
