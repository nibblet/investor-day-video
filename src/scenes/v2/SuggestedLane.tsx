import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { MousePointer2 } from "lucide-react";
import { C, SANS } from "../../theme";
import { morningBrief, oneMessage } from "../../data/agents";
import { SectionHeader, TaskRow } from "../../components/readvise";
import { useEnter } from "../../components/ui";

// Scene 7 monitor plate (1920×1080), 1:06–1:15. The Chief of Staff's three
// at-risk suggestions: Paul promotes two to Active and dismisses one.
export const SUGGESTED_DURATION = 270;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
// Task rows are built at phone scale (3×); the desktop list shows them at 0.5.
const S = 0.5;

const flags = morningBrief.filter((c) => c.state === "suggested");
// [frame of click, action]
const plan: { at: number; action: "promote" | "dismiss" }[] = [
  { at: 70, action: "promote" },
  { at: 130, action: "promote" },
  { at: 190, action: "dismiss" },
];

// Cursor waypoints in screen px, keyed to the clicks above.
const cursor = (frame: number) => {
  const pts = [
    { f: 30, x: 1500, y: 860 },
    { f: 62, x: 1400, y: 360 },
    { f: 122, x: 1400, y: 360 },
    { f: 182, x: 1340, y: 420 },
  ];
  const x = interpolate(frame, pts.map((p) => p.f), pts.map((p) => p.x), { ...clamp, easing: Easing.bezier(0.65, 0, 0.35, 1) });
  const y = interpolate(frame, pts.map((p) => p.f), pts.map((p) => p.y), { ...clamp, easing: Easing.bezier(0.65, 0, 0.35, 1) });
  return { x, y };
};

export const SuggestedLane: React.FC = () => {
  const frame = useCurrentFrame();
  const head = useEnter(0, 12, 12);
  const promoted = plan.filter((p) => p.action === "promote" && frame >= p.at + 10).length;
  const { x, y } = cursor(frame);
  const click = plan.find((p) => frame >= p.at && frame < p.at + 8);

  return (
    <AbsoluteFill style={{ background: C.bg, fontFamily: SANS, color: C.text }}>
      <div style={{ ...head, padding: "56px 120px 28px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <div style={{ fontSize: 48, fontWeight: 700, letterSpacing: -1 }}>Tasks</div>
          <div style={{ fontSize: 22, color: C.text2, marginTop: 4 }}>Lined up by your agents · you decide what's real</div>
        </div>
      </div>

      <div style={{ position: "absolute", left: 120, top: 170, width: 1680 / S, scale: String(S), transformOrigin: "0 0", display: "flex", gap: 80 }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 28 }}>
          <SectionHeader kind="suggested" title="Suggested" count={plan.filter((p) => frame < p.at + 10).length} />
          {flags.map((c, i) => {
            const p = plan[i];
            const gone = frame >= p.at + 10;
            const pressed = interpolate(frame, [p.at, p.at + 4, p.at + 10], [0, 1, 0], clamp);
            const fade = interpolate(frame, [p.at + 6, p.at + 18], [1, 0], clamp);
            if (gone && fade === 0) return null;
            return (
              <div key={c.place} style={{ opacity: fade, translate: `${p.action === "promote" ? 60 * (1 - fade) : 0}px 0px` }}>
                <TaskRow
                  state="suggested"
                  label={`${c.label}`}
                  agent={c.agent}
                  place={c.place}
                  note={c.note}
                  showPromote={p.action === "promote"}
                  promotePressed={pressed}
                  style={p.action === "dismiss" && frame >= p.at ? { textDecoration: "line-through" } : undefined}
                />
              </div>
            );
          })}
          {frame >= plan[2].at + 10 ? (
            <div style={{ fontSize: 34, color: C.muted, padding: "0 44px" }}>South Louisville dismissed: a missing date in the record, not a deal problem.</div>
          ) : null}
          <div style={{ height: 24 }} />
          <SectionHeader kind="pending" title="Pending" count={oneMessage.changes.filter((c) => c.to === "pending").length} />
          {oneMessage.changes
            .filter((c) => c.to === "pending")
            .map((c) => (
              <TaskRow key={c.label} state="pending" label={c.label} place={oneMessage.place} note={c.note} />
            ))}
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 28 }}>
          <SectionHeader kind="active" title="Active" count={promoted} />
          {flags.map((c, i) => {
            const p = plan[i];
            if (p.action !== "promote" || frame < p.at + 10) return null;
            const s = interpolate(frame, [p.at + 10, p.at + 22], [0, 1], clamp);
            return (
              <div key={c.place} style={{ opacity: s, translate: `${-60 * (1 - s)}px 0px` }}>
                <TaskRow state="active" label={c.label} agent={c.agent} place={c.place} note="Promoted by Paul" />
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ position: "absolute", left: x, top: y, scale: click ? "0.85" : "1" }}>
        <MousePointer2 size={44} color="#fff" fill="#fff" stroke="#111" strokeWidth={1.2} />
      </div>
    </AbsoluteFill>
  );
};
