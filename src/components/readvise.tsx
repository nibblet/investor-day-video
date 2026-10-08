import React from "react";
import { AbsoluteFill } from "remotion";
import {
  BarChart3,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Circle,
  Compass,
  House,
  Lightbulb,
  LineChart,
  MapPin,
  MapPinned,
  Plus,
  Search,
  Settings,
  SquarePen,
} from "lucide-react";
import { C, SANS } from "../theme";

// Recreation of the forVEX Edge iPhone app (readvise mobile), matched to
// Paul's 2026-10-08 screen recording: near-black background, #131416 cards,
// teal for BUY / ranges, orange for the active pill and tab, coloured left
// bars on list rows, and the Operate · Sense · Track · Reflect tab bar.
// Plates are 1080×2340; the phone is 1260×2736 at 3×, so sizes here are the
// recording's pixels × ~0.86.

export const EDGE = {
  bg: "#0B0C0E",
  card: "#131416",
  cardHi: "#1A1B1E",
  field: "#1E1F23",
  segActive: "#53545A",
  hairline: "rgba(255,255,255,0.08)",
  teal: "rgb(37, 203, 181)",
  tealSoft: "rgba(37, 203, 181, 0.14)",
  orange: "rgb(246, 101, 19)",
  orangeSoft: "rgba(246, 101, 19, 0.22)",
  slate: "#5E6E80", // muted blue-grey row meta
  pillGrey: "#2A2D33",
  white: "#F5F5F7",
  grey: "#8E8E93",
};

// Task-state colours kept from readvise's TaskItem (web) so the meaning matches.
export const RV = {
  suggested: "rgb(251, 191, 36)",
  suggestedSoft: "rgba(251, 191, 36, 0.15)",
  active: "rgb(6, 182, 212)",
  activeSoft: "rgba(6, 182, 212, 0.15)",
  done: "rgb(16, 185, 129)",
  doneSoft: "rgba(16, 185, 129, 0.15)",
  ai: "rgb(167, 139, 250)",
  aiSoft: "rgba(139, 92, 246, 0.15)",
  place: EDGE.teal,
  placeSoft: EDGE.tealSoft,
  overlay: EDGE.card,
  subtle: EDGE.field,
  border: EDGE.hairline,
};

export type TaskState = "suggested" | "pending" | "active" | "done";

const BAR: Record<TaskState, string> = {
  suggested: RV.suggested,
  active: RV.active,
  done: RV.done,
  pending: "#4B5563",
};

export const StatusIcon: React.FC<{ state: TaskState; size?: number }> = ({
  state,
  size = 48,
}) => {
  if (state === "done")
    return (
      <CheckCircle2
        size={size}
        color={RV.done}
        fill={RV.done}
        stroke={EDGE.bg}
      />
    );
  if (state === "suggested")
    return <Lightbulb size={size} color={RV.suggested} />;
  if (state === "active") return <Circle size={size} color={RV.active} />;
  return <Circle size={size} color={C.muted} />;
};

export const Chip: React.FC<{
  color: string;
  bg: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}> = ({ color, bg, children, icon }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 10,
      padding: "6px 22px",
      borderRadius: 999,
      background: bg,
      color,
      fontSize: 34,
      fontWeight: 600,
      whiteSpace: "nowrap",
    }}
  >
    {icon}
    {children}
  </span>
);

// Agent attribution: readvise's purple "AI" badge with the role added.
export const AgentBadge: React.FC<{ role: string }> = ({ role }) => (
  <span
    style={{
      padding: "6px 20px",
      borderRadius: 999,
      background: RV.aiSoft,
      color: RV.ai,
      fontSize: 28,
      fontWeight: 700,
      letterSpacing: 2,
      textTransform: "uppercase",
      whiteSpace: "nowrap",
    }}
  >
    AI · {role}
  </span>
);

export type TaskRowProps = {
  state: TaskState;
  label: string;
  agent?: string;
  place?: string;
  due?: string;
  note?: string;
  noteColor?: string;
  highlight?: number; // 0..1 ring for "this just changed"
  showPromote?: boolean;
  promotePressed?: number; // 0..1
  style?: React.CSSProperties;
};

// A list row in the Edge style: dark card, coloured left bar, bold title,
// slate meta line. Task semantics (icon, promote) follow readvise's TaskItem.
export const TaskRow: React.FC<TaskRowProps> = ({
  state,
  label,
  agent,
  place,
  due,
  note,
  noteColor,
  highlight = 0,
  showPromote,
  promotePressed = 0,
  style,
}) => {
  const done = state === "done";
  return (
    <div
      style={{
        position: "relative",
        borderRadius: 36,
        padding: "34px 40px 34px 52px",
        background: EDGE.card,
        border: `3px solid ${highlight > 0 ? `rgba(246,101,19,${0.3 + 0.7 * highlight})` : "transparent"}`,
        boxShadow:
          highlight > 0
            ? `0 0 ${44 * highlight}px rgba(246,101,19,${0.28 * highlight})`
            : "none",
        display: "flex",
        gap: 28,
        alignItems: "flex-start",
        overflow: "hidden",
        ...style,
      }}
    >
      <span
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 10,
          background: BAR[state],
        }}
      />
      <div style={{ marginTop: 4 }}>
        <StatusIcon state={state} size={46} />
      </div>
      <div
        style={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        {agent ? (
          <div>
            <AgentBadge role={agent} />
          </div>
        ) : null}
        <span
          style={{
            fontSize: 46,
            fontWeight: 700,
            lineHeight: 1.2,
            color: done ? EDGE.grey : EDGE.white,
            textDecoration: done ? "line-through" : "none",
          }}
        >
          {label}
        </span>
        {place || due ? (
          <div
            style={{
              display: "flex",
              gap: 20,
              alignItems: "center",
              color: EDGE.slate,
              fontSize: 36,
            }}
          >
            {place ? (
              <span
                style={{
                  display: "inline-flex",
                  gap: 8,
                  alignItems: "center",
                  color: EDGE.teal,
                  fontWeight: 600,
                }}
              >
                <MapPin size={32} />
                {place}
              </span>
            ) : null}
            {due ? <span>{due}</span> : null}
          </div>
        ) : null}
        {note ? (
          <div
            style={{
              fontSize: 36,
              lineHeight: 1.3,
              color: noteColor ?? EDGE.slate,
            }}
          >
            {note}
          </div>
        ) : null}
      </div>
      {showPromote ? (
        <span
          style={{
            alignSelf: "center",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 104,
            height: 104,
            borderRadius: 999,
            background:
              promotePressed > 0
                ? `rgba(6,182,212,${0.15 + 0.4 * promotePressed})`
                : RV.activeSoft,
            color: RV.active,
            scale: String(1 - 0.12 * promotePressed),
          }}
        >
          <ChevronRight size={48} />
        </span>
      ) : null}
    </div>
  );
};

const SECTION = {
  suggested: { color: RV.suggested },
  active: { color: RV.active },
  pending: { color: EDGE.grey },
  done: { color: RV.done },
};

// Section label in the list: small caps title + count, like "106 deals".
export const SectionHeader: React.FC<{
  kind: keyof typeof SECTION;
  title: string;
  count: number;
}> = ({ kind, title, count }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 18,
      padding: "8px 8px 0",
      fontSize: 36,
      fontWeight: 700,
      letterSpacing: 2.5,
      textTransform: "uppercase",
      color: SECTION[kind].color,
    }}
  >
    <span>{title}</span>
    <span
      style={{
        padding: "2px 20px",
        borderRadius: 999,
        background: "rgba(255,255,255,0.08)",
        color: EDGE.white,
        fontVariantNumeric: "tabular-nums",
        letterSpacing: 0,
      }}
    >
      {count}
    </span>
  </div>
);

// ---------- Chrome ----------

export const EdgeStatusBar: React.FC<{ time: string }> = ({ time }) => (
  <div
    style={{
      height: 150,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "18px 64px 0 76px",
      fontFamily: SANS,
      fontWeight: 600,
      fontSize: 46,
      color: EDGE.white,
    }}
  >
    <span>{time}</span>
    {/* Dynamic Island */}
    <span
      style={{ width: 300, height: 88, borderRadius: 999, background: "#000" }}
    />
    <span style={{ display: "flex", gap: 12, alignItems: "flex-end" }}>
      {[14, 20, 26, 32].map((h) => (
        <span
          key={h}
          style={{
            width: 9,
            height: h,
            borderRadius: 3,
            background: EDGE.white,
          }}
        />
      ))}
      <span
        style={{
          marginLeft: 14,
          padding: "2px 10px",
          borderRadius: 10,
          background: EDGE.white,
          color: "#000",
          fontSize: 28,
          fontWeight: 700,
        }}
      >
        82
      </span>
    </span>
  </div>
);

type Tab = "operate" | "sense" | "track" | "reflect";

const TabBar: React.FC<{ active: Tab }> = ({ active }) => {
  const items: [Tab, string, typeof House][] = [
    ["operate", "Operate", House],
    ["sense", "Sense", Compass],
    ["track", "Track", BarChart3],
    ["reflect", "Reflect", LineChart],
  ];
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        padding: "18px 12px 70px",
        background: EDGE.bg,
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
      }}
    >
      {items.map(([slug, label, Icon]) => {
        const on = slug === active;
        return (
          <div
            key={slug}
            style={{
              margin: "0 18px",
              padding: "16px 0 12px",
              borderRadius: 14,
              background: on ? "rgba(246,101,19,0.18)" : "transparent",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Icon
              size={64}
              color={on ? EDGE.orange : "#9AA0A6"}
              fill={on && slug === "operate" ? EDGE.orange : "none"}
              strokeWidth={on ? 1.6 : 2}
            />
            <span
              style={{
                fontSize: 28,
                fontWeight: 600,
                color: on ? EDGE.orange : "#9AA0A6",
              }}
            >
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

// Large-title screen (Operate list) or a pushed screen with a nav bar
// ("< Operate   Deal   ✎ 📍").
export const RvScreen: React.FC<{
  time: string;
  title: string;
  subtitle?: string;
  back?: string; // when set, renders an iOS nav bar instead of a large title
  segment?: "Deals" | "Tasks";
  tab?: Tab;
  children: React.ReactNode;
}> = ({ time, title, subtitle, back, segment, tab = "operate", children }) => (
  <AbsoluteFill
    style={{ background: EDGE.bg, fontFamily: SANS, color: EDGE.white }}
  >
    <EdgeStatusBar time={time} />
    {back ? (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center",
          padding: "26px 48px 26px",
        }}
      >
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            fontSize: 50,
          }}
        >
          <ChevronLeft size={64} />
          {back}
        </span>
        <span style={{ fontSize: 50, fontWeight: 700 }}>{title}</span>
        <span style={{ display: "flex", justifyContent: "flex-end", gap: 56 }}>
          <SquarePen size={58} />
          <MapPinned size={58} />
        </span>
      </div>
    ) : (
      <div style={{ padding: "0 56px 24px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 64,
            padding: "20px 0 10px",
          }}
        >
          <Plus size={66} />
          <Settings size={62} />
        </div>
        <div
          style={{
            fontSize: 112,
            fontWeight: 800,
            letterSpacing: -2,
            lineHeight: 1.05,
          }}
        >
          {title}
        </div>
        {subtitle ? (
          <div style={{ fontSize: 40, color: EDGE.slate, marginTop: 10 }}>
            {subtitle}
          </div>
        ) : null}
        {segment ? (
          <div
            style={{
              marginTop: 28,
              display: "flex",
              alignItems: "center",
              gap: 22,
              padding: "26px 30px",
              borderRadius: 24,
              background: EDGE.field,
              color: "#7C7F86",
              fontSize: 48,
            }}
          >
            <Search size={52} />
            Address, city, or ZIP
          </div>
        ) : null}
        {segment ? (
          <div
            style={{
              marginTop: 26,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              padding: 6,
              borderRadius: 20,
              background: EDGE.field,
            }}
          >
            {(["Deals", "Tasks"] as const).map((s) => (
              <span
                key={s}
                style={{
                  textAlign: "center",
                  padding: "14px 0",
                  borderRadius: 16,
                  fontSize: 34,
                  fontWeight: 700,
                  background: s === segment ? EDGE.segActive : "transparent",
                }}
              >
                {s}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    )}
    <div
      style={{
        flex: 1,
        minHeight: 0,
        overflow: "hidden",
        padding: "6px 40px 300px",
        display: "flex",
        flexDirection: "column",
        gap: 26,
      }}
    >
      {children}
    </div>
    <TabBar active={tab} />
  </AbsoluteFill>
);

// A grouped card used on the Deal screen ("What we decided", "Evidence").
export const EdgeCard: React.FC<{
  icon?: React.ReactNode;
  title: string;
  chevron?: boolean;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ icon, title, chevron, children, style }) => (
  <div
    style={{
      background: EDGE.card,
      borderRadius: 40,
      padding: "36px 40px",
      ...style,
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
      {icon}
      <span style={{ flex: 1, fontSize: 52, fontWeight: 800 }}>{title}</span>
      {chevron ? <ChevronRight size={56} color={EDGE.grey} /> : null}
    </div>
    {children ? (
      <div style={{ marginTop: 18, paddingLeft: icon ? 82 : 0 }}>
        {children}
      </div>
    ) : null}
  </div>
);
