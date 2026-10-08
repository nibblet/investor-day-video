import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { C } from "../../theme";
import { oneMessage } from "../../data/agents";
import { RvScreen, TaskRow, RV } from "../../components/readvise";
import { MicLive, Typed, useEnter } from "../../components/ui";

// Scene 6 phone plate, 0:54–1:06. Paul says one sentence; five tasks on the
// pending sale change in sequence, each citing where the update came from.
export const ONE_MESSAGE_DURATION = 360;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const SAID_AT = 8;
const FLIP_AT = 120; // first task changes
const FLIP_GAP = 18;

export const OneMessage: React.FC = () => {
  const frame = useCurrentFrame();
  const bubble = useEnter(SAID_AT, 12);
  const list = useEnter(70, 14);
  const lastFlip = FLIP_AT + (oneMessage.changes.length - 1) * FLIP_GAP;
  const ledger = useEnter(lastFlip + 24, 16);

  return (
    <RvScreen time="1:00" back="Operate" title="Tasks">
      <div style={{ ...bubble, alignSelf: "flex-end", maxWidth: "88%" }}>
        <div style={{ textAlign: "right", marginBottom: 12 }}>{frame < 100 ? <MicLive label="Voice" /> : null}</div>
        <div
          style={{
            background: C.brand,
            color: "#111",
            fontSize: 44,
            fontWeight: 600,
            lineHeight: 1.25,
            padding: "30px 40px",
            borderRadius: "48px 48px 12px 48px",
          }}
        >
          <Typed text={oneMessage.said} start={SAID_AT + 2} cps={26} />
        </div>
      </div>

      <div style={{ ...list, display: "flex", flexDirection: "column", gap: 22 }}>
        {oneMessage.changes.map((c, i) => {
          const at = FLIP_AT + i * FLIP_GAP;
          const changed = frame >= at;
          const highlight = interpolate(frame, [at, at + 4, at + 40], [0, 1, 0], clamp);
          return (
            <TaskRow
              key={c.label}
              state={changed ? c.to : c.from}
              label={c.label}
              note={changed ? c.note : undefined}
              noteColor={c.to === "done" ? RV.done : RV.active}
              highlight={highlight}
              style={{ padding: "30px 40px" }}
            />
          );
        })}
      </div>

      <div
        style={{
          ...ledger,
          display: "flex",
          justifyContent: "center",
          gap: 28,
          fontSize: 38,
          fontWeight: 600,
          padding: "26px 0",
          borderRadius: 40,
          background: RV.doneSoft,
          color: RV.done,
        }}
      >
        <span>Closed {oneMessage.summary.closed}</span>
        <span style={{ color: C.muted }}>·</span>
        <span style={{ color: RV.active }}>Updated {oneMessage.summary.updated}</span>
        <span style={{ color: C.muted }}>·</span>
        <span style={{ color: C.text2 }}>Logged</span>
      </div>
    </RvScreen>
  );
};
