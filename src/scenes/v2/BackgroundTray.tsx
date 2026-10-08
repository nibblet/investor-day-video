import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { C, SANS } from "../../theme";
import { backgroundTray } from "../../data/agents";
import { RV, StatusIcon } from "../../components/readvise";
import { useEnter } from "../../components/ui";

// Scene 4 transparent overlay (1080×1920), 0:29–0:45. While Paul walks the
// house, a small tray shows agents finishing work in the background.
export const TRAY_DURATION = 480;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const START = 30;
const GAP = 120;
const WORK = 70; // frames each item spends "working"

const Spinner: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <span
      style={{
        width: 40,
        height: 40,
        borderRadius: 999,
        border: `5px solid ${RV.border}`,
        borderTopColor: RV.active,
        rotate: `${frame * 12}deg`,
        display: "inline-block",
      }}
    />
  );
};

export const BackgroundTray: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const head = useEnter(START - 12, 12, 20);
  const out = interpolate(frame, [durationInFrames - 15, durationInFrames], [1, 0], clamp);

  return (
    <AbsoluteFill style={{ fontFamily: SANS, justifyContent: "flex-start", padding: "200px 60px 0" }}>
      <div
        style={{
          ...head,
          opacity: head.opacity * out,
          width: 720,
          padding: "28px 32px",
          borderRadius: 40,
          background: "rgba(17,18,20,0.82)",
          border: `3px solid ${RV.border}`,
          boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
          display: "flex",
          flexDirection: "column",
          gap: 22,
        }}
      >
        <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: C.muted }}>
          Working in the background
        </div>
        {backgroundTray.map((item, i) => {
          const at = START + i * GAP;
          if (frame < at) return null;
          const done = frame >= at + WORK;
          const flash = interpolate(frame, [at + WORK, at + WORK + 4, at + WORK + 24], [0, 1, 0], clamp);
          return (
            <div
              key={item.agent}
              style={{
                opacity: interpolate(frame, [at, at + 10], [0, 1], clamp),
                display: "flex",
                gap: 22,
                alignItems: "center",
                padding: "14px 18px",
                borderRadius: 24,
                background: flash > 0 ? `rgba(16,185,129,${0.18 * flash})` : "transparent",
              }}
            >
              <span style={{ width: 44, display: "inline-flex", justifyContent: "center" }}>
                {done ? <StatusIcon state="done" size={40} /> : <Spinner />}
              </span>
              <div>
                <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: RV.ai }}>
                  {item.agent}
                </div>
                <div style={{ fontSize: 34, fontWeight: 500, color: done ? C.text : C.text2, marginTop: 2 }}>
                  {done ? item.done : item.working}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
