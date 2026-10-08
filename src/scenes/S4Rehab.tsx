import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { C, SANS } from "../theme";
import { rehab, deal, type RehabLine } from "../data/valleyStation";
import { Label, MicLive, Money, PhoneScreen, useEnter, usePop } from "../components/ui";

// Shot 4C phone plate, 0:22–0:40. Rehab builds line by line from what Paul
// says on the walkthrough; one line gets corrected mid-walk.
export const S4_DURATION = 540;

const FIRST = 36;
const GAP = 48;
const CORRECTION_HOLD = 44; // extra time on the corrected line

// Frame each line appears, plus when its correction lands.
const timeline = (() => {
  let t = FIRST;
  return rehab.map((line) => {
    const at = t;
    const fixAt = line.corrected ? at + 40 : null;
    t += GAP + (line.corrected ? CORRECTION_HOLD : 0);
    return { line, at, fixAt };
  });
})();
const DONE = timeline[timeline.length - 1].at + 40;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const Row: React.FC<{ line: RehabLine; at: number; fixAt: number | null }> = ({ line, at, fixAt }) => {
  const frame = useCurrentFrame();
  const s = useEnter(at, 12, 24);
  const fixed = fixAt !== null && frame >= fixAt;
  const flash = fixAt !== null ? interpolate(frame, [fixAt, fixAt + 6, fixAt + 30], [0, 1, 0], clamp) : 0;
  const label = line.corrected && !fixed ? line.corrected.from : line.label;
  const amount = line.corrected && !fixed ? line.corrected.fromAmount : line.amount;
  const zero = amount === 0;
  return (
    <div
      style={{
        ...s,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "22px 30px",
        borderRadius: 24,
        background: flash > 0 ? `rgba(249,115,22,${0.22 * flash})` : C.surface,
        border: `2px solid ${flash > 0 ? C.brand : C.elevated}`,
      }}
    >
      <span style={{ fontSize: 38, fontWeight: 500, color: zero ? C.muted : C.text }}>
        {label}
        {fixed ? (
          <span style={{ marginLeft: 16, fontSize: 26, fontWeight: 700, color: C.brand, letterSpacing: 1.5 }}>
            EDITED
          </span>
        ) : null}
      </span>
      <span
        style={{
          fontFamily: SANS,
          fontWeight: 600,
          fontSize: 42,
          color: zero ? C.muted : C.text,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {zero ? "—" : `$${amount.toLocaleString("en-US")}`}
      </span>
    </div>
  );
};

export const S4Rehab: React.FC = () => {
  const frame = useCurrentFrame();

  // What Paul just said: the latest line's phrase, or the correction.
  let said = "";
  let isCorrection = false;
  for (const { line, at, fixAt } of timeline) {
    if (frame >= at - 14) said = line.said;
    if (fixAt !== null && frame >= fixAt - 14 && line.corrected) {
      said = line.corrected.said;
      isCorrection = frame < fixAt + GAP;
    }
  }

  // Running total eases toward the sum of visible lines.
  const total = timeline.reduce((sum, { line, at, fixAt }) => {
    const shown = interpolate(frame, [at + 4, at + 22], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
    if (!line.corrected || fixAt === null) return sum + line.amount * shown;
    const fix = interpolate(frame, [fixAt, fixAt + 18], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
    return sum + shown * (line.corrected.fromAmount + (line.amount - line.corrected.fromAmount) * fix);
  }, 0);

  const done = frame >= DONE;
  const doneFlash = usePop(DONE);
  const quote = useEnter(0, 10, 10);

  return (
    <PhoneScreen time="9:06" title="Walkthrough" subtitle={`${deal.area} · rehab scope`}>
      <div style={{ ...quote, display: "flex", flexDirection: "column", gap: 14, minHeight: 170 }}>
        <MicLive label={done ? "Scope saved" : isCorrection ? "Correction" : "Listening"} />
        <div style={{ fontSize: 50, fontWeight: 600, lineHeight: 1.2, color: isCorrection ? C.brand : C.text }}>
          {said ? `“${said}”` : ""}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {timeline.map(({ line, at, fixAt }) => (frame >= at ? <Row key={line.label} line={line} at={at} fixAt={fixAt} /> : null))}
      </div>

      <div
        style={{
          position: "absolute",
          left: 56,
          right: 56,
          bottom: 90,
          padding: "36px 44px",
          borderRadius: 36,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: done ? C.brandSoft : C.surface,
          border: `2px solid ${done ? C.brand : C.elevated}`,
          scale: done ? String(0.96 + 0.04 * doneFlash) : "1",
        }}
      >
        <div>
          <Label style={{ color: done ? C.brand : C.muted }}>Rehab total</Label>
          <div style={{ fontSize: 30, color: C.text2, marginTop: 6 }}>
            {timeline.filter((t) => frame >= t.at && t.line.amount > 0).length} line items
          </div>
        </div>
        <Money value={total} size={96} color={done ? C.brand : C.text} />
      </div>
    </PhoneScreen>
  );
};
