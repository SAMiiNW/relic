'use client';

/**
 * A microprint rule: a hairline of repeating tiny security text, the kind that
 * runs along the edge of a banknote or certificate. Decorative only.
 */
export function Microprint({ text = 'RELIC CERTIFICATE OF AUTHENTICITY' }: { text?: string }) {
  const unit = ` ${text} \u00B7`;
  return (
    <div className="microprint w-full border-y border-foil/10 py-1" aria-hidden="true">
      {unit.repeat(40)}
    </div>
  );
}
