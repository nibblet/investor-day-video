import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { C, SANS } from "../theme";
import { deal } from "../data/valleyStation";
import { Label, Money, useCount, useEnter } from "../components/ui";

// Transparent overlays for the edit. Rendered as ProRes 4444 with alpha so
// they drop straight over the generated shots.

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const useOut = (fadeFrames = 12) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return interpolate(frame, [durationInFrames - fadeFrames, durationInFrames], [1, 0], clamp);
};

// Scene 1 / scene 7 time stamp, top-left, like a chapter card.
export const TimeStamp: React.FC<{ time: string; caption?: string }> = ({ time, caption }) => {
  const s = useEnter(6, 16);
  const out = useOut();
  return (
    <AbsoluteFill style={{ fontFamily: SANS, padding: "190px 90px" }}>
      <div style={{ ...s, opacity: s.opacity * out }}>
        <div
          style={{
            fontSize: 132,
            fontWeight: 700,
            color: C.text,
            letterSpacing: -4,
            textShadow: "0 4px 40px rgba(0,0,0,0.55)",
          }}
        >
          {time}
        </div>
        <div style={{ width: 120, height: 8, borderRadius: 4, background: C.brand, marginTop: 18 }} />
        {caption ? (
          <div style={{ fontSize: 48, fontWeight: 500, color: C.text, marginTop: 24, textShadow: "0 2px 24px rgba(0,0,0,0.6)" }}>
            {caption}
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

// Scene 5: the offer over the kitchen-table shot. `showDollars=false` gives
// the no-dollar line from the script.
export const OfferOverlay: React.FC<{ showDollars: boolean }> = ({ showDollars }) => {
  const s = useEnter(40, 20, 40);
  const n = useCount(deal.offer, 46, 36);
  const out = useOut(18);
  return (
    <AbsoluteFill style={{ fontFamily: SANS, justifyContent: "flex-end", alignItems: "center", paddingBottom: 820 }}>
      <div
        style={{
          ...s,
          opacity: s.opacity * out,
          textAlign: "center",
          padding: "44px 72px",
          borderRadius: 40,
          background: "rgba(17,18,20,0.72)",
          border: `2px solid rgba(249,115,22,0.5)`,
        }}
      >
        {showDollars ? (
          <>
            <Label style={{ color: C.brand, fontSize: 36 }}>The offer</Label>
            <Money value={n} size={150} />
          </>
        ) : (
          <div style={{ fontSize: 76, fontWeight: 700, color: C.text, lineHeight: 1.15 }}>
            The offer.
            <div style={{ fontSize: 48, fontWeight: 500, color: C.text2, marginTop: 12 }}>
              On paper, face to face.
            </div>
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

// Scene 7 closing question.
export const ClosingCTA: React.FC = () => {
  const a = useEnter(10, 18);
  const b = useEnter(40, 18);
  return (
    <AbsoluteFill style={{ fontFamily: SANS, justifyContent: "center", padding: "0 90px" }}>
      <div style={{ ...a, fontSize: 104, fontWeight: 700, color: C.text, letterSpacing: -3, lineHeight: 1.05, textShadow: "0 4px 40px rgba(0,0,0,0.6)" }}>
        What would you hand off first?
      </div>
      <div style={{ ...b, width: 160, height: 10, borderRadius: 5, background: C.brand, marginTop: 40 }} />
    </AbsoluteFill>
  );
};
