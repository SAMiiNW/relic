import { createClient } from 'genlayer-js';
import { testnetBradbury } from 'genlayer-js/chains';
import type { GenLayerClient } from 'genlayer-js/types';

export const CONTRACT_ADDRESS = '0x1F6259d86B900A64628990D4605d8657F4537D59' as const;
export const DEPLOY_TX =
  '0xdedb8cd9dd10ade6d9cb7ac5380278e8d090112fe93484828cc853aea1f1fcca' as const;
export const EXPLORER = 'https://explorer-bradbury.genlayer.com';
export const FAUCET = 'https://testnet-faucet.genlayer.foundation/';
export const CHAIN_ID = 4221;

export type Ruling = 'GENUINE' | 'DOUBTFUL' | 'FORGERY' | '';

export interface Artifact {
  id: string;
  title: string;
  description: string;
  owner: string;
  status: 'REGISTERED' | 'CERTIFIED';
  ruling: Ruling;
  score: number;
  rationale: string;
  authenticator: string;
  index: number;
}

export interface Stats {
  artifacts: number;
  certified: number;
  genuine: number;
  forgery: number;
  owner: string;
}

export const readClient: GenLayerClient<typeof testnetBradbury> = createClient({
  chain: testnetBradbury,
});

export function makeWalletClient(account: `0x${string}`) {
  return createClient({ chain: testnetBradbury, account } as Parameters<typeof createClient>[0]);
}

export async function withRpcRetry<T>(fn: () => Promise<T>, tries = 4): Promise<T> {
  let last: unknown;
  for (let i = 0; i < tries; i++) {
    try {
      return await fn();
    } catch (e) {
      last = e;
      if (!/rate limit|429|timeout|network|fetch|-32/i.test(String(e))) throw e;
      await new Promise((r) => setTimeout(r, 2500 * 2 ** i));
    }
  }
  throw last;
}

function pick(raw: unknown, k: string): unknown {
  if (raw instanceof Map) return raw.get(k);
  if (raw && typeof raw === 'object') return (raw as Record<string, unknown>)[k];
  return undefined;
}

function normalizeArtifact(raw: unknown): Artifact {
  const r = String(pick(raw, 'ruling') ?? '').toUpperCase();
  const status = String(pick(raw, 'status') ?? 'REGISTERED').toUpperCase();
  return {
    id: String(pick(raw, 'id') ?? ''),
    title: String(pick(raw, 'title') ?? ''),
    description: String(pick(raw, 'description') ?? ''),
    owner: String(pick(raw, 'owner') ?? ''),
    status: status === 'CERTIFIED' ? 'CERTIFIED' : 'REGISTERED',
    ruling: (['GENUINE', 'DOUBTFUL', 'FORGERY'].includes(r) ? r : '') as Ruling,
    score: Number(pick(raw, 'score') ?? 0),
    rationale: String(pick(raw, 'rationale') ?? ''),
    authenticator: String(pick(raw, 'authenticator') ?? ''),
    index: Number(pick(raw, 'index') ?? 0),
  };
}

function normalizeStats(raw: unknown): Stats {
  return {
    artifacts: Number(pick(raw, 'artifacts') ?? 0),
    certified: Number(pick(raw, 'certified') ?? 0),
    genuine: Number(pick(raw, 'genuine') ?? 0),
    forgery: Number(pick(raw, 'forgery') ?? 0),
    owner: String(pick(raw, 'owner') ?? ''),
  };
}

export async function fetchArtifacts(start = 0): Promise<Artifact[]> {
  const res = await withRpcRetry(() =>
    readClient.readContract({
      address: CONTRACT_ADDRESS,
      functionName: 'get_artifacts',
      args: [start],
    }),
  );
  return Array.isArray(res) ? res.map(normalizeArtifact) : [];
}

export async function fetchStats(): Promise<Stats> {
  const res = await withRpcRetry(() =>
    readClient.readContract({
      address: CONTRACT_ADDRESS,
      functionName: 'get_stats',
      args: [],
    }),
  );
  return normalizeStats(res);
}

export async function registerArtifact(
  client: ReturnType<typeof makeWalletClient>,
  title: string,
  description: string,
): Promise<`0x${string}`> {
  return client.writeContract({
    address: CONTRACT_ADDRESS,
    functionName: 'register_artifact',
    args: [title, description],
    value: 0n,
  }) as Promise<`0x${string}`>;
}

export async function authenticateArtifact(
  client: ReturnType<typeof makeWalletClient>,
  artifactId: string,
  evidence: string,
): Promise<`0x${string}`> {
  return client.writeContract({
    address: CONTRACT_ADDRESS,
    functionName: 'authenticate',
    args: [artifactId, evidence],
    value: 0n,
  }) as Promise<`0x${string}`>;
}
