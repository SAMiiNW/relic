'use client';

/**
 * A microprint rule: a hairline of repeating tiny security text, the kind that
 * runs along the edge of a banknote or certificate. Decorative only.
 *
 * `vertical` renders the same repeating text rotated to run down a side rail,
 * used to frame the ledger column like the engraved margin of a certificate.
 */
export function Microprint({
  text = 'RELIC CERTIFICATE OF AUTHENTICITY',
  vertical = false,
  repeat = 40,
}: {
  text?: string;
  vertical?: boolean;
  repeat?: number;
}) {
  const unit = ` ${text} \u00B7`;
  if (vertical) {
    return (
      <div
        className="microprint h-full"
        aria-hidden="true"
        style={{ writingMode: 'vertical-rl' }}
      >
        {unit.repeat(repeat)}
      </div>
    );
  }
  return (
    <div className="microprint w-full border-y border-foil/10 py-1" aria-hidden="true">
      {unit.repeat(repeat)}
    </div>
  );
}
