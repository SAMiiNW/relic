'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useAnimationControls } from 'framer-motion';

interface Props {
  /** count of sealed certificates on file; a rise triggers the press */
  certified: number;
  /** latest plate number to engrave on the matrix face */
  plateNo: number;
}

const MOTTO = 'RELIC PROVENANCE BUREAU \u00B7 SEALED UNDER VALIDATOR CONSENSUS \u00B7';

/**
 * The bureau authorizing stamp: an embossed wax-seal matrix unique to Relic.
 * The bureau motto runs as microprint around the rim, a plate-number ticker
 * sits on the matrix face, and the whole seal presses down with a brief foil
 * flare each time a new certificate is sealed under validator consensus. This
 * element does not exist in the sibling bureaus.
 */
export function WaxSeal({ certified, plateNo }: Props) {
  const controls = useAnimationControls();
  const prev = useRef(certified);
  const [flare, setFlare] = useState(false);

  useEffect(() => {
    if (certified > prev.current) {
      setFlare(true);
      controls
        .start({
          scale: [1, 0.86, 1.04, 1],
          rotate: [0, -3, 1.5, 0],
          transition: { duration: 0.7, ease: 'easeOut' },
        })
        .then(() => setFlare(false));
    }
    prev.current = certified;
  }, [certified, controls]);

  return (
    <div className="flex items-center gap-3">
      <motion.div
        animate={controls}
        className="relative grid h-[58px] w-[58px] shrink-0 place-items-center rounded-full"
        style={{
          background:
            'radial-gradient(circle at 38% 32%, rgba(229,143,199,0.5), rgba(159,231,214,0.16) 55%, rgba(12,16,20,0.9) 100%)',
          boxShadow:
            'inset 0 0 0 1px rgba(159,231,214,0.5), inset 0 2px 6px rgba(255,255,255,0.12), inset 0 -3px 7px rgba(0,0,0,0.6), 0 6px 16px rgba(0,0,0,0.5)',
        }}
        aria-hidden="true"
      >
        {/* foil flare ring on press */}
        <span
          className={`absolute inset-[-6px] rounded-full transition-opacity duration-300 ${
            flare ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ boxShadow: '0 0 18px 2px rgba(159,231,214,0.6)' }}
        />
        {/* microprint motto running around the rim */}
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
          <defs>
            <path
              id="waxrim"
              d="M50,50 m-37,0 a37,37 0 1,1 74,0 a37,37 0 1,1 -74,0"
              fill="none"
            />
          </defs>
          <text
            fill="rgba(159,231,214,0.55)"
            style={{ fontFamily: 'var(--font-space-mono), monospace', letterSpacing: '0.04em' }}
            fontSize="5.4"
          >
            <textPath href="#waxrim" startOffset="0">
              {MOTTO}
            </textPath>
          </text>
        </svg>
        {/* embossed matrix center */}
        <span className="relative z-10 font-display text-[13px] font-700 leading-none text-stock-950 [text-shadow:0_1px_0_rgba(159,231,214,0.5)]">
          RB
        </span>
      </motion.div>
      <div className="leading-tight">
        <span className="microlabel block text-foil">Bureau stamp</span>
        <span className="tabular mt-1 block font-mono text-[10px] uppercase tracking-[0.2em] text-faint">
          Plate {String(plateNo).padStart(4, '0')}
        </span>
      </div>
    </div>
  );
}
