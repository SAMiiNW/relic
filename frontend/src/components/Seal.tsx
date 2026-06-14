'use client';

interface SealProps {
  size?: number;
  className?: string;
  spin?: boolean;
}

/**
 * Hand-drawn engraved seal medallion: concentric guilloche rings with a
 * radial burst and a center void for an icon. No emoji, pure inline SVG.
 */
export function Seal({ size = 64, className = '', spin = false }: SealProps) {
  const teeth = Array.from({ length: 48 });
  const cx = 50;
  const cy = 50;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <g
        className={spin ? 'origin-center' : ''}
        style={spin ? { animation: 'spin 22s linear infinite', transformOrigin: 'center' } : undefined}
      >
        {teeth.map((_, i) => {
          const a = (i / teeth.length) * Math.PI * 2;
          const r1 = 44;
          const r2 = 48;
          return (
            <line
              key={i}
              x1={cx + r1 * Math.cos(a)}
              y1={cy + r1 * Math.sin(a)}
              x2={cx + r2 * Math.cos(a)}
              y2={cy + r2 * Math.sin(a)}
              stroke="currentColor"
              strokeWidth="0.8"
              opacity="0.55"
            />
          );
        })}
      </g>
      <circle cx={cx} cy={cy} r="44" stroke="currentColor" strokeWidth="0.8" opacity="0.7" />
      <circle cx={cx} cy={cy} r="38" stroke="currentColor" strokeWidth="0.6" opacity="0.45" />
      <circle cx={cx} cy={cy} r="26" stroke="currentColor" strokeWidth="0.6" opacity="0.6" />
      {Array.from({ length: 24 }).map((_, i) => {
        const a = (i / 24) * Math.PI * 2;
        const inner = 26;
        const outer = 38;
        return (
          <line
            key={i}
            x1={cx + inner * Math.cos(a)}
            y1={cy + inner * Math.sin(a)}
            x2={cx + outer * Math.cos(a)}
            y2={cy + outer * Math.sin(a)}
            stroke="currentColor"
            strokeWidth="0.4"
            opacity="0.3"
          />
        );
      })}
    </svg>
  );
}
