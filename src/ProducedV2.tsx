import React from "react";
import { AbsoluteFill, Sequence, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import { CAPTIONS_V2 } from "./AnimaticV2";
import { morningBrief, oneMessage } from "./data/agents";
import { deal } from "./data/valleyStation";
import { EDGE, TaskRow } from "./components/readvise";
import { S4Rehab } from "./scenes/S4Rehab";
import { ClosingCTA, OfferOverlay } from "./scenes/Overlays";
import { MorningBrief } from "./scenes/v2/MorningBrief";
import { BackgroundTray } from "./scenes/v2/BackgroundTray";
import { OneMessage } from "./scenes/v2/OneMessage";
import { SuggestedLane } from "./scenes/v2/SuggestedLane";
import { EndOfDay } from "./scenes/v2/EndOfDay";
import { DealScreen } from "./scenes/v2/DealScreen";
import { PropertyBrief } from "./scenes/v2/PropertyBrief";
import {
  BigTime,
  FlyCard,
  GradedPhoto,
  KineticCaptions,
  LeakOverlay,
  LightBar,
  Monitor3D,
  Phone3D,
  Sfx,
  StatChip,
  StudioBG,
} from "./produced/kit";

// The produced cut of script v2 (88 s, 9:16): same timeline and VO as
// AnimaticV2, finished for Reels/TikTok. Floating 3D phones, cards that fly
// out of the screens, kinetic captions, light leaks on the cuts, SFX and a
// TEMP music bed (public/music/temp-bed.mp3, replace before publishing).
// Truck photos stand in for the real footage Paul is shooting.

export const PRODUCED_V2_DURATION = 2640;

const CUTS = [270, 420, 660, 870, 1350, 1620, 1980, 2250];

const At: React.FC<{ f: number; d?: number; children: React.ReactNode }> = ({ f, d = 60, children }) => (
  <Sequence from={f} durationInFrames={d} layout="none">
    {children}
  </Sequence>
);

export const ProducedV2: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    {/* 0 · 6:40 AM — light bar wakes, morning brief, cards fly out */}
    <Sequence name="0 · Cold open" durationInFrames={270}>
      <GradedPhoto src="truck/front-driveway-crop.jpg" focus="50% 40%" zoom={[1.25, 1.1]} tint="rgba(30,55,110,0.55)" dim={0.35} />
      <Sequence from={40} durationInFrames={80}>
        <BigTime time="6:40 AM" />
      </Sequence>
      <Sequence from={70} durationInFrames={200}>
        <Phone3D x={720} y={780} width={500} rotY={[-22, -12]}>
          <MorningBrief />
        </Phone3D>
      </Sequence>
      {morningBrief
        .filter((_, i) => i < 3)
        .map((c, i) => (
          <FlyCard key={i} at={150 + i * 24} from={[720, 780]} to={[330, 500 + i * 270]} tilt={12} width={900} scale={0.48}>
            <TaskRow state={c.state} label={c.label} agent={c.agent} place={c.place} />
          </FlyCard>
        ))}
      <Sequence durationInFrames={60}>
        <LightBar mode="open" />
      </Sequence>
    </Sequence>

    {/* 1 · 7:40 AM — the call */}
    <Sequence name="1 · Seller call" from={270} durationInFrames={150}>
      <GradedPhoto src="truck/frunk-tools.jpg" focus="35% 55%" tint="rgba(255,190,140,0.25)" dim={0.25} />
      <BigTime time="7:40 AM" />
      <FlyCard at={30} from={[540, -100]} to={[540, 640]} width={900} scale={0.8}>
        <div
          style={{
            fontFamily: "Geist",
            display: "flex",
            alignItems: "center",
            gap: 30,
            padding: "34px 44px",
            borderRadius: 60,
            background: "rgba(28,28,30,0.92)",
            color: "#fff",
          }}
        >
          <div style={{ width: 96, height: 96, borderRadius: 999, background: EDGE.teal, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 50 }}>
            ☎
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 34, color: "#9CA3AF" }}>Incoming call</div>
            <div style={{ fontSize: 50, fontWeight: 700 }}>Seller · {deal.area}</div>
          </div>
        </div>
      </FlyCard>
    </Sequence>

    {/* 2 · Underwrite */}
    <Sequence name="2 · Deal" from={420} durationInFrames={240}>
      <StudioBG label="AI SHOT 2A · IN THE CAB" />
      <Phone3D x={470} y={780} width={540} rotY={[16, 8]}>
        <DealScreen />
      </Phone3D>
      <FlyCard at={130} from={[470, 780]} to={[790, 380]} tilt={-12} width={760} scale={0.55}>
        <StatChip label="ARV" value={`$${deal.arv.toLocaleString("en-US")}`} />
      </FlyCard>
      <FlyCard at={150} from={[470, 780]} to={[800, 620]} tilt={-12} width={760} scale={0.55}>
        <StatChip label="Max offer" value={`$${deal.maxOffer.toLocaleString("en-US")}`} color={EDGE.orange} />
      </FlyCard>
    </Sequence>

    {/* 3 · Brief in the driveway */}
    <Sequence name="3 · Brief" from={660} durationInFrames={210}>
      <StudioBG label="AI SHOT 3A · DRIVEWAY" />
      <Phone3D x={600} y={780} width={540} rotY={[-16, -6]}>
        <PropertyBrief />
      </Phone3D>
      <FlyCard at={70} from={[600, 780]} to={[290, 420]} tilt={14} width={760} scale={0.5}>
        <StatChip label="Owned" value="10.6 yrs" color="#fff" />
      </FlyCard>
      <FlyCard at={90} from={[600, 780]} to={[290, 640]} tilt={14} width={760} scale={0.5}>
        <StatChip label="Occupancy" value="Vacant" color={EDGE.orange} />
      </FlyCard>
    </Sequence>

    {/* 4 · Walkthrough + agents working in the background */}
    <Sequence name="4 · Walkthrough" from={870} durationInFrames={480}>
      <StudioBG label="AI SHOTS 4A/4B · WALKTHROUGH" />
      <Phone3D x={330} y={780} width={470} rotY={[18, 10]}>
        <S4Rehab />
      </Phone3D>
      <div style={{ position: "absolute", left: 560, top: 240, perspective: 2000 }}>
        <div style={{ width: 1080, height: 1920, transform: "rotateY(-14deg) scale(0.66)", transformOrigin: "0 0" }}>
          <BackgroundTray />
        </div>
      </div>
    </Sequence>

    {/* 5 · Kitchen table */}
    <Sequence name="5 · Offer" from={1350} durationInFrames={270}>
      <StudioBG warm label="AI SHOT 5A · KITCHEN TABLE" />
      <div style={{ position: "absolute", inset: 0, scale: "1.15" }}>
        <OfferOverlay showDollars />
      </div>
    </Sequence>

    {/* 6 · One message */}
    <Sequence name="6 · One message" from={1620} durationInFrames={360}>
      <GradedPhoto src="truck/front-driveway-crop.jpg" focus="50% 40%" zoom={[1.2, 1.32]} tint="rgba(40,60,90,0.4)" dim={0.5} />
      <Phone3D x={540} y={830} width={540} rotY={[-10, 6]}>
        <OneMessage />
      </Phone3D>
      <FlyCard at={250} from={[540, 900]} to={[540, 230]} width={900} scale={0.62}>
        <StatChip label="One message" value={`Closed ${oneMessage.summary.closed} · Updated ${oneMessage.summary.updated}`} />
      </FlyCard>
    </Sequence>

    {/* 7 · Office, suggested lane */}
    <Sequence name="7 · Suggested lane" from={1980} durationInFrames={270}>
      <StudioBG label="AI SHOT 7A · OFFICE" />
      <Monitor3D width={1000}>
        <SuggestedLane />
      </Monitor3D>
    </Sequence>

    {/* 8 · 5:30 PM — count, approve the post, light bar closes */}
    <Sequence name="8 · 5:30 PM" from={2250} durationInFrames={390}>
      <GradedPhoto src="truck/golden-hour-lot.jpg" focus="30% 60%" zoom={[1.0, 1.12]} tint="rgba(255,150,80,0.25)" dim={0.3} />
      <Sequence durationInFrames={70}>
        <BigTime time="5:30 PM" />
      </Sequence>
      <Sequence from={30} durationInFrames={300}>
        <Phone3D x={540} y={800} width={540} rotY={[12, -4]}>
          <EndOfDay />
        </Phone3D>
      </Sequence>
      <Sequence from={330} durationInFrames={60}>
        <AbsoluteFill style={{ background: "rgba(0,0,0,0.55)" }} />
        <ClosingCTA />
      </Sequence>
      <Sequence from={350} durationInFrames={40}>
        <LightBar mode="close" />
      </Sequence>
    </Sequence>

    {/* Light leaks on the cuts */}
    {CUTS.map((c, i) => (
      <Sequence key={c} from={c - 15} durationInFrames={30}>
        <LeakOverlay seed={i * 7 + 3} hueShift={i % 2 ? 150 : 0} />
      </Sequence>
    ))}

    <KineticCaptions lines={CAPTIONS_V2} hideAfter={86} />

    {/* Sound: TEMP music bed + SFX */}
    <Audio src={staticFile("music/temp-bed.mp3")} volume={0.95} />
    <At f={18} d={45}><Sfx name="whoosh" volume={0.6} /></At>
    {CUTS.map((c) => (
      <At key={c} f={c - 8} d={30}><Sfx name="whoosh" volume={0.3} /></At>
    ))}
    {[150, 174, 198].map((f) => (
      <At key={f} f={f} d={15}><Sfx name="mouse-click" volume={0.35} /></At>
    ))}
    <At f={300} d={20}><Sfx name="switch" volume={0.4} /></At>
    {[550, 570, 730, 750].map((f) => (
      <At key={f} f={f} d={15}><Sfx name="mouse-click" volume={0.35} /></At>
    ))}
    {[0, 1, 2, 3, 4].map((i) => (
      <At key={i} f={1620 + 120 + i * 18} d={15}><Sfx name="mouse-click" volume={0.4} /></At>
    ))}
    <At f={1870} d={45}><Sfx name="ding" volume={0.25} /></At>
    {[70, 130, 190].map((f) => (
      <At key={f} f={1980 + f} d={15}><Sfx name="mouse-click" volume={0.4} /></At>
    ))}
    <At f={2250 + 30 + 250} d={20}><Sfx name="switch" volume={0.45} /></At>
    <At f={2250 + 30 + 256} d={45}><Sfx name="ding" volume={0.3} /></At>
  </AbsoluteFill>
);
