import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { C, SANS } from "../theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const outExpo = Easing.bezier(0.16, 1, 0.3, 1);

// Fade + rise in at `start` frames.
export const useEnter = (start: number, dur = 14, rise = 28) => {
  const frame = useCurrentFrame();
  return {
    opacity: interpolate(frame, [start, start + dur], [0, 1], { ...clamp, easing: outExpo }),
    translate: `0px ${interpolate(frame, [start, start + dur], [rise, 0], { ...clamp, easing: outExpo })}px`,
  };
};

// Number that counts up between two frames.
export const useCount = (value: number, start: number, dur = 24) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [start, start + dur], [0, value], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
};

export const usePop = (start: number) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - start, fps, config: { damping: 14, stiffness: 180 } });
};

// Text that types in, one character per `cps`-paced frame.
export const Typed: React.FC<{ text: string; start: number; cps?: number }> = ({
  text,
  start,
  cps = 28,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const n = Math.max(0, Math.floor(((frame - start) / fps) * cps));
  return <>{text.slice(0, n)}</>;
};

// ---------- Phone chrome ----------

export const StatusBar: React.FC<{ time: string }> = ({ time }) => (
  <div
    style={{
      height: 150,
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "space-between",
      padding: "0 72px 22px",
      fontFamily: SANS,
      fontWeight: 600,
      fontSize: 40,
      color: C.text,
    }}
  >
    <span>{time}</span>
    <span style={{ display: "flex", gap: 14, alignItems: "flex-end" }}>
      {[14, 20, 26, 32].map((h) => (
        <span key={h} style={{ width: 9, height: h, borderRadius: 3, background: C.text }} />
      ))}
      <span
        style={{
          marginLeft: 14,
          width: 62,
          height: 30,
          borderRadius: 9,
          border: `3px solid ${C.text2}`,
          padding: 3,
        }}
      >
        <span style={{ display: "block", width: "78%", height: "100%", borderRadius: 4, background: C.text }} />
      </span>
    </span>
  </div>
);

export const PhoneScreen: React.FC<{
  time: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}> = ({ time, title, subtitle, children }) => (
  <AbsoluteFill style={{ background: C.bg, fontFamily: SANS, color: C.text }}>
    <StatusBar time={time} />
    <div style={{ padding: "28px 64px 20px", borderBottom: `2px solid ${C.surface}` }}>
      <div style={{ fontSize: 60, fontWeight: 700, letterSpacing: -1 }}>{title}</div>
      {subtitle ? (
        <div style={{ fontSize: 36, color: C.text2, marginTop: 8 }}>{subtitle}</div>
      ) : null}
    </div>
    <div style={{ flex: 1, padding: "40px 56px", display: "flex", flexDirection: "column", gap: 28 }}>
      {children}
    </div>
  </AbsoluteFill>
);

export const Card: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
  accent?: string;
}> = ({ children, style, accent }) => (
  <div
    style={{
      background: C.surface,
      borderRadius: 36,
      padding: "36px 40px",
      border: `2px solid ${accent ?? C.elevated}`,
      ...style,
    }}
  >
    {children}
  </div>
);

export const Label: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({
  children,
  style,
}) => (
  <div
    style={{
      fontSize: 30,
      fontWeight: 600,
      letterSpacing: 2.4,
      textTransform: "uppercase",
      color: C.muted,
      ...style,
    }}
  >
    {children}
  </div>
);

export const Money: React.FC<{ value: number; size?: number; color?: string }> = ({
  value,
  size = 88,
  color = C.text,
}) => (
  <span
    style={{
      fontFamily: SANS,
      fontWeight: 600,
      fontSize: size,
      color,
      fontVariantNumeric: "tabular-nums",
      letterSpacing: -size * 0.03,
    }}
  >
    ${Math.round(value).toLocaleString("en-US")}
  </span>
);

export const Pill: React.FC<{ children: React.ReactNode; color: string; bg: string; size?: number }> = ({
  children,
  color,
  bg,
  size = 30,
}) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 10,
      padding: `${size * 0.35}px ${size * 0.8}px`,
      borderRadius: 999,
      background: bg,
      color,
      fontSize: size,
      fontWeight: 700,
      letterSpacing: 1,
    }}
  >
    {children}
  </span>
);

export const Check: React.FC<{ size?: number; color?: string }> = ({ size = 44, color = C.success }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="11" fill={color} opacity={0.18} />
    <path d="M7 12.5l3.2 3.2L17 9" stroke={color} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Three bouncing dots while the assistant "thinks".
export const Thinking: React.FC<{ start: number; end: number }> = ({ start, end }) => {
  const frame = useCurrentFrame();
  if (frame < start || frame > end) return null;
  return (
    <span style={{ display: "inline-flex", gap: 12 }}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            width: 18,
            height: 18,
            borderRadius: 9,
            background: C.text2,
            opacity: 0.35 + 0.65 * Math.max(0, Math.sin((frame - start) / 4 - i * 0.9)),
          }}
        />
      ))}
    </span>
  );
};

// Live mic indicator used on voice screens.
export const MicLive: React.FC<{ label?: string }> = ({ label = "Listening" }) => {
  const frame = useCurrentFrame();
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 16, color: C.brand, fontSize: 34, fontWeight: 600 }}>
      <span style={{ display: "inline-flex", gap: 6, alignItems: "center", height: 40 }}>
        {[0, 1, 2, 3, 4].map((i) => (
          <span
            key={i}
            style={{
              width: 7,
              borderRadius: 4,
              background: C.brand,
              height: 10 + 28 * Math.abs(Math.sin(frame / 5 + i * 1.3)),
            }}
          />
        ))}
      </span>
      {label}
    </span>
  );
};
