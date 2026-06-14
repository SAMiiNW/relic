export const shortAddr = (a: string): string =>
  a && a.length > 10 ? `${a.slice(0, 6)}\u2026${a.slice(-4)}` : a;

export const shortHash = (h: string): string =>
  h && h.length > 14 ? `${h.slice(0, 10)}\u2026${h.slice(-6)}` : h;

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export const plate = (index: number): string => `No. ${String(index).padStart(5, '0')}`;

export const rulingColor: Record<string, string> = {
  GENUINE: 'text-genuine',
  DOUBTFUL: 'text-doubtful',
  FORGERY: 'text-forgery',
};

export const rulingBorder: Record<string, string> = {
  GENUINE: 'border-genuine',
  DOUBTFUL: 'border-doubtful',
  FORGERY: 'border-forgery',
};

export const rulingLabel: Record<string, string> = {
  GENUINE: 'Genuine',
  DOUBTFUL: 'Doubtful',
  FORGERY: 'Forgery',
};
