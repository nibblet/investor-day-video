import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { C } from "../../theme";
import { endOfDay } from "../../data/agents";
import { AgentBadge, RV, RvScreen, StatusIcon } from "../../components/readvise";
import { useCount, useEnter, usePop } from "../../components/ui";

// Scene 8 phone plate, 1:15–1:28. The day's count, then the Social agent asks
// to post about today: the video you're watching. Paul taps Approve.
export const END_DURATION = 390;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const TAP = 250;

export const EndOfDay: React.FC = () => {
  const frame = useCurrentFrame();
  const card = useEnter(6, 14);
  const n = useCount(endOfDay.handled, 14, 30);
  const ask = useEnter(170, 16, 50);
  const press = interpolate(frame, [TAP, TAP + 4, TAP + 10], [0, 1, 0], clamp);
  const approved = frame >= TAP + 6;
  const ok = usePop(TAP + 6);
  const ripple = interpolate(frame, [TAP, TAP + 24], [0, 1], clamp);

  return (
    <RvScreen time="5:30" title="Reflect" subtitle="End of day" tab="reflect">
      <div
        style={{
          ...card,
          padding: "48px 48px 40px",
          borderRadius: 48,
          background: RV.overlay,
          border: `3px solid ${RV.border}`,
          display: "flex",
          flexDirection: "column",
          gap: 30,
        }}
      >
        <AgentBadge role="Chief of Staff" />
        <div style={{ display: "flex", alignItems: "baseline", gap: 24 }}>
          <span style={{ fontSize: 200, fontWeight: 700, letterSpacing: -6, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
            {Math.round(n)}
          </span>
          <span style={{ fontSize: 56, fontWeight: 600, color: C.text2 }}>handled</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {endOfDay.breakdown.map((b, i) => (
            <Line key={b.what} at={50 + i * 16} n={b.n} what={b.what} />
          ))}
        </div>
        <div style={{ ...useEnter(110, 14), fontSize: 46, fontWeight: 600, color: C.brand }}>
          {endOfDay.neededYou} needed you.
        </div>
      </div>

      <div
        style={{
          ...ask,
          padding: "44px 48px",
          borderRadius: 48,
          background: "rgba(139, 92, 246, 0.08)",
          border: "3px solid rgba(139, 92, 246, 0.3)",
          display: "flex",
          flexDirection: "column",
          gap: 28,
        }}
      >
        <AgentBadge role={endOfDay.approval.agent} />
        <div style={{ fontSize: 48, fontWeight: 600, lineHeight: 1.2 }}>{endOfDay.approval.label}</div>
        <div style={{ display: "flex", gap: 24 }}>
          <span style={{ flex: 1, textAlign: "center", padding: "30px 0", borderRadius: 999, background: RV.subtle, color: C.text2, fontSize: 40, fontWeight: 600, border: `3px solid ${RV.border}` }}>
            Edit
          </span>
          <span
            style={{
              flex: 1,
              position: "relative",
              overflow: "hidden",
              textAlign: "center",
              padding: "30px 0",
              borderRadius: 999,
              background: approved ? RV.doneSoft : C.brand,
              color: approved ? RV.done : "#111",
              fontSize: 40,
              fontWeight: 700,
              scale: String(1 - 0.06 * press),
            }}
          >
            {approved ? (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 14, scale: String(0.8 + 0.2 * ok) }}>
                <StatusIcon state="done" size={40} /> Approved
              </span>
            ) : (
              "Approve"
            )}
            {ripple > 0 && ripple < 1 ? (
              <span
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  width: 600 * ripple,
                  height: 600 * ripple,
                  marginLeft: -300 * ripple,
                  marginTop: -300 * ripple,
                  borderRadius: 999,
                  background: `rgba(255,255,255,${0.35 * (1 - ripple)})`,
                }}
              />
            ) : null}
          </span>
        </div>
      </div>
    </RvScreen>
  );
};

const Line: React.FC<{ at: number; n: number; what: string }> = ({ at, n, what }) => {
  const s = useEnter(at, 12, 16);
  return (
    <div style={{ ...s, display: "flex", gap: 24, alignItems: "baseline", fontSize: 40, color: C.text2 }}>
      <span style={{ fontWeight: 700, color: C.text, minWidth: 40, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{n}</span>
      {what}
    </div>
  );
};
