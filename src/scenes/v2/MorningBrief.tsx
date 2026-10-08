import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { C } from "../../theme";
import { morningBrief } from "../../data/agents";
import {
  RvScreen,
  SectionHeader,
  TaskRow,
  AgentBadge,
} from "../../components/readvise";
import { useEnter } from "../../components/ui";

// Scene 0 phone plate, 0:00–0:09. The readvise Tasks screen at 6:40 AM:
// what the agents finished overnight, and what they suggest.
export const MORNING_DURATION = 270;

const STAGGER = 22;
const FIRST = 40;

export const MorningBrief: React.FC = () => {
  const frame = useCurrentFrame();
  const brief = useEnter(8, 14);
  const done = morningBrief.filter((c) => c.state === "done");
  const suggested = morningBrief.filter((c) => c.state === "suggested");
  // Rows land in order; sections count up as they do.
  const at = (i: number) => FIRST + i * STAGGER;
  const shownDone = done.filter((_, i) => frame >= at(i)).length;
  const shownSuggested = suggested.filter(
    (_, i) => frame >= at(done.length + i),
  ).length;

  return (
    <RvScreen
      time="6:40"
      title="Operate"
      segment="Tasks"
    >
      <div
        style={{
          ...brief,
          display: "flex",
          alignItems: "center",
          gap: 24,
          padding: "28px 36px",
          borderRadius: 40,
          background: "rgba(139, 92, 246, 0.08)",
          border: "3px solid rgba(139, 92, 246, 0.25)",
        }}
      >
        <AgentBadge role="Chief of Staff" />
        <span style={{ fontSize: 40, fontWeight: 600 }}>
          Morning brief · {morningBrief.length} items
        </span>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 28,
          translate: `0px ${interpolate(frame, [at(3), at(4) + 16], [0, -560], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.45, 0, 0.2, 1),
          })}px`,
        }}
      >
        <SectionHeader kind="done" title="Done overnight" count={shownDone} />
        {done.map((c, i) => (
          <Row key={c.label} start={at(i)} card={c} />
        ))}

        <SectionHeader
          kind="suggested"
          title="Suggested"
          count={shownSuggested}
        />
        {suggested.map((c, i) => (
          <Row key={c.label + c.place} start={at(done.length + i)} card={c} />
        ))}

        <div
          style={{
            ...useEnter(at(morningBrief.length) + 10, 14),
            fontSize: 36,
            color: C.text2,
            textAlign: "center",
            marginTop: 8,
          }}
        >
          Suggested items wait for you. Nothing goes out on its own.
        </div>
      </div>
    </RvScreen>
  );
};

const Row: React.FC<{ start: number; card: (typeof morningBrief)[number] }> = ({
  start,
  card,
}) => {
  const frame = useCurrentFrame();
  const s = useEnter(start, 12, 30);
  if (frame < start) return null;
  return (
    <div style={s}>
      <TaskRow
        state={card.state}
        label={card.label}
        agent={card.agent}
        place={card.place}
        note={card.note}
        showPromote={card.state === "suggested"}
      />
    </div>
  );
};
