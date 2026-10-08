import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  Solid,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Audio } from "@remotion/media";
import { lightLeak } from "@remotion/effects/light-leak";
import { SANS } from "../theme";
import { EDGE } from "../components/readvise";

// Building blocks for the produced cut: graded backgrounds, a floating 3D
// phone, cards that fly out of it, kinetic captions, light leaks and SFX.

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// ---------- Backgrounds ----------

// A real photo with a slow push, a colour wash and a vignette.
export const GradedPhoto: React.FC<{
  src: string;
  focus?: string;
  zoom?: [number, number];
  tint?: string; // rgba wash laid over the photo
  dim?: number;
}> = ({ src, focus = "50% 50%", zoom = [1.06, 1.2], tint = "rgba(20,40,70,0.35)", dim = 0.25 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <Img
        src={staticFile(src)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: focus,
          scale: String(interpolate(frame, [0, durationInFrames], zoom, clamp)),
          filter: "saturate(0.85) contrast(1.08)",
        }}
      />
      <AbsoluteFill style={{ background: tint, mixBlendMode: "multiply" }} />
      <AbsoluteFill style={{ background: `rgba(0,0,0,${dim})` }} />
      <Vignette />
    </AbsoluteFill>
  );
};

export const Vignette: React.FC<{ strength?: number }> = ({ strength = 0.75 }) => (
  <AbsoluteFill
    style={{ background: `radial-gradient(120% 85% at 50% 45%, transparent 45%, rgba(0,0,0,${strength}) 100%)` }}
  />
);

// Dark studio backdrop with slow bokeh, standing in for AI shots not made yet.
export const StudioBG: React.FC<{ warm?: boolean; label?: string }> = ({ warm, label }) => {
  const frame = useCurrentFrame();
  const blobs = warm
    ? [
        ["rgba(246,101,19,0.55)", 260, 520, 520],
        ["rgba(255,170,90,0.35)", 820, 1240, 420],
        ["rgba(120,60,20,0.5)", 400, 1600, 600],
      ]
    : [
        ["rgba(246,101,19,0.38)", 220, 420, 520],
        ["rgba(37,203,181,0.30)", 860, 1180, 560],
        ["rgba(139,92,246,0.28)", 300, 1640, 520],
      ];
  return (
    <AbsoluteFill style={{ background: "#07080A", overflow: "hidden" }}>
      {blobs.map(([c, x, y, r], i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: (x as number) + 60 * Math.sin(frame / 70 + i * 2),
            top: (y as number) + 50 * Math.cos(frame / 85 + i),
            width: r as number,
            height: r as number,
            marginLeft: -(r as number) / 2,
            marginTop: -(r as number) / 2,
            borderRadius: 999,
            background: c as string,
            filter: "blur(120px)",
          }}
        />
      ))}
      <Vignette strength={0.85} />
      {label ? (
        <div
          style={{
            position: "absolute",
            left: 60,
            bottom: 60,
            fontFamily: SANS,
            fontSize: 24,
            fontWeight: 700,
            letterSpacing: 3,
            color: "rgba(255,255,255,0.35)",
          }}
        >
          {label}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ---------- Floating devices ----------

const PLATE = { w: 1080, h: 2340 };

// A phone floating in 3D: springs up into frame, drifts in rotation, bobs,
// catches a moving glare, and drops out at the end of its Sequence.
export const Phone3D: React.FC<{
  children: React.ReactNode;
  width?: number;
  x?: number; // centre, px
  y?: number;
  rotY?: [number, number];
  rotX?: [number, number];
  exit?: boolean;
}> = ({ children, width = 600, x = 540, y = 900, rotY = [-18, -8], rotX = [10, 5], exit = true }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const height = (width * PLATE.h) / PLATE.w;
  const inP = spring({ frame, fps, config: { damping: 15, stiffness: 80 } });
  const outP = exit ? interpolate(frame, [durationInFrames - 14, durationInFrames], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) }) : 0;
  const ry = interpolate(frame, [0, durationInFrames], rotY, clamp);
  const rx = interpolate(frame, [0, durationInFrames], rotX, clamp);
  const bob = Math.sin(frame / 28) * 10;
  const s = width / PLATE.w;
  return (
    <div style={{ position: "absolute", left: x - width / 2, top: y - height / 2, perspective: 2600 }}>
      <div
        style={{
          width,
          height,
          transform: `translateY(${(1 - inP) * 900 + bob - outP * 300}px) rotateY(${ry + (1 - inP) * -25}deg) rotateX(${rx}deg) scale(${0.92 + 0.08 * inP})`,
          opacity: Math.min(1, inP * 1.4) * (1 - outP),
          transformStyle: "preserve-3d",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: -18,
            borderRadius: 110,
            background: "linear-gradient(145deg, #2B2D31, #0A0A0B 40%, #1C1D20)",
            boxShadow: "0 80px 160px rgba(0,0,0,0.7), 0 0 120px rgba(246,101,19,0.16), inset 0 0 0 3px #3A3C41",
          }}
        />
        <div style={{ position: "absolute", inset: 0, borderRadius: 94, overflow: "hidden", background: EDGE.bg }}>
          <div style={{ width: PLATE.w, height: PLATE.h, scale: String(s), transformOrigin: "0 0" }}>{children}</div>
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(${115 + ry * 2}deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 38%)`,
              pointerEvents: "none",
            }}
          />
        </div>
      </div>
    </div>
  );
};

// A monitor in 3D for the office beat.
export const Monitor3D: React.FC<{ children: React.ReactNode; width?: number }> = ({ children, width = 1000 }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const height = (width * 1080) / 1920;
  const inP = spring({ frame, fps, config: { damping: 16, stiffness: 80 } });
  const ry = interpolate(frame, [0, durationInFrames], [14, 6], clamp);
  return (
    <div style={{ position: "absolute", left: 540 - width / 2, top: 760 - height / 2, perspective: 2400 }}>
      <div
        style={{
          width,
          height,
          transform: `translateZ(${(1 - inP) * -600}px) rotateY(${ry}deg) rotateX(4deg)`,
          opacity: inP,
          borderRadius: 18,
          padding: 14,
          background: "#0A0A0B",
          boxShadow: "0 60px 140px rgba(0,0,0,0.7), 0 0 100px rgba(37,203,181,0.12), inset 0 0 0 3px #2C2F36",
        }}
      >
        <div style={{ width: width - 28, height: height - 28, borderRadius: 8, overflow: "hidden", position: "relative" }}>
          <div style={{ width: 1920, height: 1080, scale: String((width - 28) / 1920), transformOrigin: "0 0" }}>{children}</div>
        </div>
      </div>
    </div>
  );
};

// A card that flies out from (fromX, fromY) to its spot and hovers there.
export const FlyCard: React.FC<{
  at: number;
  from: [number, number];
  to: [number, number];
  tilt?: number;
  width?: number;
  scale?: number;
  children: React.ReactNode;
}> = ({ at, from, to, tilt = 0, width = 900, scale = 0.55, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < at) return null;
  const p = spring({ frame: frame - at, fps, config: { damping: 14, stiffness: 110 } });
  const x = from[0] + (to[0] - from[0]) * p;
  const y = from[1] + (to[1] - from[1]) * p + Math.sin((frame - at) / 22) * 6 * p;
  return (
    <div style={{ position: "absolute", left: x, top: y, perspective: 1600 }}>
      <div
        style={{
          width,
          transform: `translate(-50%, -50%) rotateY(${tilt * p}deg) scale(${(0.3 + 0.7 * p) * scale})`,
          transformOrigin: "50% 50%",
          opacity: Math.min(1, p * 2),
          filter: "drop-shadow(0 40px 60px rgba(0,0,0,0.65))",
        }}
      >
        {children}
      </div>
    </div>
  );
};

// A big floating stat chip (e.g. "ARV $212,500").
export const StatChip: React.FC<{ label: string; value: string; color?: string }> = ({ label, value, color = EDGE.teal }) => (
  <div
    style={{
      fontFamily: SANS,
      padding: "34px 48px",
      borderRadius: 40,
      background: "rgba(19,20,22,0.92)",
      border: `3px solid ${color}55`,
      boxShadow: `0 0 80px ${color}33`,
    }}
  >
    <div style={{ fontSize: 34, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: "#9CA3AF" }}>{label}</div>
    <div style={{ fontSize: 110, fontWeight: 800, letterSpacing: -3, color, fontVariantNumeric: "tabular-nums" }}>{value}</div>
  </div>
);

// ---------- Light bar (the truck's signature) ----------

// A horizontal light line: grows from the centre, then opens like a
// shutter to reveal the scene behind it. Reverse it to close the film.
export const LightBar: React.FC<{ mode: "open" | "close" }> = ({ mode }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const f = mode === "open" ? frame : durationInFrames - frame;
  const grow = interpolate(f, [4, 26], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const open = interpolate(f, [30, 50], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const gap = open * 1000;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 960 - gap, background: "#000" }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 960 - gap, background: "#000" }} />
      <div
        style={{
          position: "absolute",
          top: 960 - 4,
          left: 540 - 470 * grow,
          width: 940 * grow,
          height: 8,
          borderRadius: 8,
          background: "#FFF6EC",
          boxShadow: "0 0 30px 8px rgba(255,220,180,0.9), 0 0 120px 40px rgba(246,101,19,0.45)",
          opacity: 1 - open,
        }}
      />
    </AbsoluteFill>
  );
};

// ---------- Light leak & sound ----------

export const LeakOverlay: React.FC<{ seed?: number; hueShift?: number }> = ({ seed = 0, hueShift = 0 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames, height, width } = useVideoConfig();
  return (
    <Solid
      width={width}
      height={height}
      style={{ mixBlendMode: "screen", opacity: 0.8 }}
      effects={[
        lightLeak({
          seed,
          hueShift,
          progress: interpolate(frame, [0, durationInFrames - 1], [0, 1], clamp),
        }),
      ]}
    />
  );
};

export const Sfx: React.FC<{ name: "whoosh" | "whip" | "mouse-click" | "ding" | "switch"; volume?: number }> = ({
  name,
  volume = 0.5,
}) => <Audio src={staticFile(`sfx/${name}.wav`)} volume={volume} />;

// ---------- Kinetic captions ----------

export type Line = [number, number, string];

const KEYWORDS = /^(agents?|nothing|max|offer|rehab|wrong|one|message|nine|busywork|calls|evidence|anything|real)$/i;

// Each VO line is split into 2–3 word bursts that pop in on time; keywords
// light up orange. Sits above the bottom fifth.
export const KineticCaptions: React.FC<{ lines: Line[]; hideAfter?: number }> = ({ lines, hideAfter }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  if (hideAfter !== undefined && t >= hideAfter) return null;
  const line = lines.find(([a, b]) => t >= a && t < b);
  if (!line) return null;
  const [a, b, text] = line;
  const words = text.split(" ");
  const chunks: string[][] = [];
  for (let i = 0; i < words.length; ) {
    const n = words.length - i === 4 ? 2 : Math.min(3, words.length - i);
    chunks.push(words.slice(i, i + n));
    i += n;
  }
  const total = chunks.reduce((s, c) => s + c.join(" ").length, 0);
  let acc = a;
  let current = 0;
  let chunkStart = a;
  chunks.forEach((c, i) => {
    const d = ((b - a) * c.join(" ").length) / total;
    if (t >= acc) {
      current = i;
      chunkStart = acc;
    }
    acc += d;
  });
  const local = Math.round((t - chunkStart) * fps);
  const pop = spring({ frame: local, fps, config: { damping: 12, stiffness: 220 } });
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 430, pointerEvents: "none" }}>
      <div
        style={{
          fontFamily: SANS,
          fontSize: 92,
          fontWeight: 800,
          letterSpacing: -2,
          lineHeight: 1.05,
          textAlign: "center",
          maxWidth: 940,
          color: "#fff",
          textShadow: "0 6px 30px rgba(0,0,0,0.85), 0 2px 4px rgba(0,0,0,0.9)",
          scale: String(0.82 + 0.18 * pop),
          translate: `0px ${(1 - pop) * 30}px`,
          opacity: Math.min(1, pop * 2),
        }}
      >
        {chunks[current].map((w, i) => (
          <span key={i} style={{ color: KEYWORDS.test(w.replace(/[^\w]/g, "")) ? EDGE.orange : "#fff" }}>
            {w}
            {i < chunks[current].length - 1 ? " " : ""}
          </span>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// Big time stamp that slams in, for chapter beats.
export const BigTime: React.FC<{ time: string }> = ({ time }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const p = spring({ frame, fps, config: { damping: 13, stiffness: 160 } });
  const out = interpolate(frame, [durationInFrames - 10, durationInFrames], [1, 0], clamp);
  return (
    <AbsoluteFill style={{ fontFamily: SANS, padding: "200px 80px", pointerEvents: "none" }}>
      <div style={{ opacity: p * out, scale: String(1.25 - 0.25 * p), transformOrigin: "0 50%" }}>
        <div style={{ fontSize: 170, fontWeight: 800, letterSpacing: -6, color: "#fff", textShadow: "0 8px 50px rgba(0,0,0,0.7)" }}>
          {time}
        </div>
        <div style={{ width: 160 * p, height: 10, borderRadius: 5, background: EDGE.orange, marginTop: 12 }} />
      </div>
    </AbsoluteFill>
  );
};
