import React from "react";
import { AbsoluteFill, Img, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { C, SANS, PHONE, MONITOR } from "./theme";
import { S2Underwrite, S2_DURATION } from "./scenes/S2Underwrite";
import { S3Brief, S3_DURATION } from "./scenes/S3Brief";
import { S4Rehab, S4_DURATION } from "./scenes/S4Rehab";
import { S6ADealBoard, S6A_DURATION } from "./scenes/S6DealBoard";
import { S6BFollowUp, S6B_DURATION } from "./scenes/S6FollowUp";
import { ClosingCTA, OfferOverlay, TimeStamp } from "./scenes/Overlays";

// 9:16 rough cut at script timing (75 s). Real truck photos stand in for the
// truck shots; dark panels stand in for AI shots not generated yet. VO lines
// are burned in as captions so timing can be reviewed with the sound off.

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const SCENES = {
  s1: { from: 0, dur: 150 },
  s2: { from: 150, dur: S2_DURATION },
  s3: { from: 420, dur: S3_DURATION },
  s4: { from: 660, dur: S4_DURATION },
  s5: { from: 1200, dur: 360 },
  s6a: { from: 1560, dur: S6A_DURATION },
  s6b: { from: 1740, dur: S6B_DURATION },
  s7: { from: 1920, dur: 330 },
} as const;
export const ANIMATIC_DURATION = 2250;

// [startSec, endSec, text] — VO from the script, split for reading.
const CAPTIONS: [number, number, string][] = [
  [0.3, 2.6, "Seller called at 7:40."],
  [2.6, 5, "Landlord with an empty rental, says they're done with it."],
  [5, 8.6, "I told my assistant, underwrite this address."],
  [8.6, 11.4, "It pulls the comps and runs the numbers."],
  [11.4, 14, "I check its work when I park."],
  [14, 16.8, "On the way over it builds me a brief."],
  [16.8, 19.4, "How long they've owned it and what they need out of this."],
  [19.4, 22, "I read it in the driveway before I knock."],
  [22, 24.6, "Inside, I just talk."],
  [24.6, 29.5, "Roof's fine. Kitchen's shot. Bathroom needs a new shower pan."],
  [29.5, 34.5, "It writes the rehab line by line while I walk,"],
  [34.5, 40, "and I fix what it gets wrong."],
  [40, 43.5, "Kitchen table. I put the number down"],
  [43.5, 47.5, "and walk them through how I got there."],
  [47.5, 52, "I know every line, so they can ask me anything."],
  [52, 55.5, "Back at the office, every deal's on one board."],
  [55.5, 60.5, "I tell it, follow up with Tuesday's seller and get my plumber out Thursday."],
  [60.5, 64, "It sends the text and puts it on the calendar."],
  [64, 66.6, "5:30, truck's locked."],
  [66.6, 69.4, "I'm still the one making the call."],
  [69.4, 72, "I just don't do the busywork anymore."],
];

export type CaptionLine = [number, number, string];

export const Captions: React.FC<{ lines?: CaptionLine[] }> = ({ lines = CAPTIONS }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const cur = lines.find(([a, b]) => t >= a && t < b);
  if (!cur) return null;
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 420, pointerEvents: "none" }}>
      <div
        style={{
          maxWidth: 900,
          textAlign: "center",
          fontFamily: SANS,
          fontSize: 54,
          fontWeight: 700,
          lineHeight: 1.2,
          color: "#fff",
          padding: "16px 28px",
          borderRadius: 18,
          background: "rgba(0,0,0,0.55)",
        }}
      >
        {cur[2]}
      </div>
    </AbsoluteFill>
  );
};

export const Photo: React.FC<{ src: string; focus?: string; zoom?: [number, number]; dim?: number }> = ({
  src,
  focus = "50% 50%",
  zoom = [1.04, 1.16],
  dim = 0,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      <Img
        src={staticFile(src)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: focus,
          scale: String(interpolate(frame, [0, durationInFrames], zoom, clamp)),
        }}
      />
      {dim > 0 ? <AbsoluteFill style={{ background: `rgba(0,0,0,${dim})` }} /> : null}
    </AbsoluteFill>
  );
};

// Stand-in for an AI shot that hasn't been generated yet.
export const ShotPanel: React.FC<{ id: string; desc: string }> = ({ id, desc }) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(120% 80% at 50% 30%, #2A2C31 0%, ${C.bg} 70%)`,
      fontFamily: SANS,
      alignItems: "center",
      justifyContent: "flex-end",
      paddingBottom: 200,
    }}
  >
    <div style={{ textAlign: "center", color: C.muted }}>
      <div style={{ fontSize: 40, fontWeight: 700, letterSpacing: 4 }}>AI SHOT {id}</div>
      <div style={{ fontSize: 34, marginTop: 10, maxWidth: 760 }}>{desc}</div>
    </div>
  </AbsoluteFill>
);

export const ShotTag: React.FC<{ text: string }> = ({ text }) => (
  <div
    style={{
      position: "absolute",
      top: 70,
      right: 60,
      fontFamily: SANS,
      fontSize: 26,
      fontWeight: 700,
      letterSpacing: 2,
      color: "rgba(255,255,255,0.75)",
      background: "rgba(0,0,0,0.45)",
      padding: "10px 18px",
      borderRadius: 10,
    }}
  >
    {text}
  </div>
);

// A phone-shaped frame that shows a 1080×2340 plate at reduced size.
export const Phone: React.FC<{ children: React.ReactNode; width?: number; top?: number; left?: number }> = ({
  children,
  width = 540,
  top = 120,
  left,
}) => {
  const frame = useCurrentFrame();
  const s = width / PHONE.width;
  const enter = interpolate(frame, [0, 16], [80, 0], { ...clamp });
  return (
    <div
      style={{
        position: "absolute",
        left: left ?? (1080 - width) / 2 - 16,
        top: top + enter,
        opacity: interpolate(frame, [0, 10], [0, 1], clamp),
        padding: 16,
        borderRadius: 96,
        background: "#0A0A0B",
        boxShadow: "0 40px 120px rgba(0,0,0,0.6), 0 0 0 3px #2C2F36",
      }}
    >
      <div style={{ width, height: PHONE.height * s, borderRadius: 82, overflow: "hidden", position: "relative" }}>
        <div style={{ width: PHONE.width, height: PHONE.height, scale: String(s), transformOrigin: "0 0", position: "absolute" }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export const Monitor: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const width = 1000;
  const s = width / MONITOR.width;
  return (
    <div
      style={{
        position: "absolute",
        left: 40,
        top: 420,
        opacity: interpolate(frame, [0, 10], [0, 1], clamp),
        padding: 14,
        borderRadius: 22,
        background: "#0A0A0B",
        boxShadow: "0 40px 120px rgba(0,0,0,0.6), 0 0 0 3px #2C2F36",
      }}
    >
      <div style={{ width, height: MONITOR.height * s, borderRadius: 10, overflow: "hidden", position: "relative" }}>
        <div style={{ width: MONITOR.width, height: MONITOR.height, scale: String(s), transformOrigin: "0 0", position: "absolute" }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export const Animatic: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <Sequence name="1 · Seller call" from={SCENES.s1.from} durationInFrames={SCENES.s1.dur}>
      <Photo src="truck/frunk-tools.jpg" focus="38% 55%" dim={0.25} />
      <ShotTag text="1A · STAND-IN: REAL TRUCK" />
      <TimeStamp time="7:40 AM" />
    </Sequence>

    <Sequence name="2 · Underwrite" from={SCENES.s2.from} durationInFrames={SCENES.s2.dur}>
      <Photo src="truck/frunk-tools.jpg" focus="60% 55%" dim={0.72} zoom={[1.16, 1.24]} />
      <ShotTag text="2A/2B · PHONE PLATE" />
      <Phone>
        <S2Underwrite />
      </Phone>
    </Sequence>

    <Sequence name="3 · Brief" from={SCENES.s3.from} durationInFrames={SCENES.s3.dur}>
      <ShotPanel id="3A" desc="Truck in the driveway of a 1960s brick ranch" />
      <ShotTag text="3A · PHONE PLATE" />
      <Phone>
        <S3Brief />
      </Phone>
    </Sequence>

    <Sequence name="4 · Walkthrough" from={SCENES.s4.from} durationInFrames={SCENES.s4.dur}>
      <ShotPanel id="4A/4B" desc="Kitchen and bath walkthrough, handheld" />
      <ShotTag text="4C · PHONE PLATE" />
      <Phone>
        <S4Rehab />
      </Phone>
    </Sequence>

    <Sequence name="5 · Kitchen table" from={SCENES.s5.from} durationInFrames={SCENES.s5.dur}>
      <ShotPanel id="5A" desc="Kitchen table, two mugs, the page slides across" />
      <ShotTag text="5A · OFFER OVERLAY" />
      <OfferOverlay showDollars />
    </Sequence>

    <Sequence name="6A · Deal board" from={SCENES.s6a.from} durationInFrames={SCENES.s6a.dur}>
      <ShotPanel id="6A" desc="Office, over the shoulder to the monitor" />
      <ShotTag text="6A · MONITOR PLATE" />
      <Monitor>
        <S6ADealBoard />
      </Monitor>
    </Sequence>

    <Sequence name="6B · Follow-up" from={SCENES.s6b.from} durationInFrames={SCENES.s6b.dur}>
      <ShotPanel id="6B" desc="Speaks one instruction, sets the phone down" />
      <ShotTag text="6B · PHONE PLATE" />
      <Phone>
        <S6BFollowUp />
      </Phone>
    </Sequence>

    <Sequence name="7 · 5:30" from={SCENES.s7.from} durationInFrames={SCENES.s7.dur}>
      <Photo src="truck/golden-hour-lot.jpg" focus="30% 60%" zoom={[1.0, 1.1]} dim={0.15} />
      <ShotTag text="7A · STAND-IN: REAL TRUCK" />
      <Sequence durationInFrames={150}>
        <TimeStamp time="5:30 PM" />
      </Sequence>
      <Sequence from={210} durationInFrames={120}>
        <AbsoluteFill style={{ background: "rgba(0,0,0,0.35)" }} />
        <ClosingCTA />
      </Sequence>
    </Sequence>

    <Captions />
  </AbsoluteFill>
);
