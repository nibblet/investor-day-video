import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { C } from "./theme";
import { Captions, Monitor, Phone, Photo, ShotPanel, ShotTag, type CaptionLine } from "./Animatic";
import { DealScreen } from "./scenes/v2/DealScreen";
import { PropertyBrief } from "./scenes/v2/PropertyBrief";
import { S4Rehab } from "./scenes/S4Rehab";
import { ClosingCTA, OfferOverlay, TimeStamp } from "./scenes/Overlays";
import { MorningBrief } from "./scenes/v2/MorningBrief";
import { BackgroundTray } from "./scenes/v2/BackgroundTray";
import { OneMessage } from "./scenes/v2/OneMessage";
import { SuggestedLane } from "./scenes/v2/SuggestedLane";
import { EndOfDay } from "./scenes/v2/EndOfDay";

// Script v2 rough cut (88 s, 9:16): the agent layer added around the v1 day.
// Same conventions as the v1 animatic: real truck photos stand in for truck
// shots, labelled panels for AI shots not generated yet, VO burned in.

export const ANIMATIC_V2_DURATION = 2640;

export const CAPTIONS_V2: CaptionLine[] = [
  [0.3, 3.2, "Six-forty. My agents worked while I slept."],
  [3.2, 6.6, "Newsletter's scheduled, the electrician's booked, and three deals got flagged."],
  [6.6, 9, "Nothing went out without me."],
  [9, 11.4, "Seven-forty, a seller calls."],
  [11.4, 14, "Tired landlord, empty rental."],
  [14, 17, "I say, underwrite this address."],
  [17, 19.5, "Comps, rehab, max offer."],
  [19.5, 22, "I check its work when I park."],
  [22, 24.6, "On the way over it builds the brief."],
  [24.6, 29, "How long they've owned it. What they need out of this."],
  [29, 31.5, "Inside, I just talk."],
  [31.5, 36, "Roof's fine. Kitchen's shot. Shower pan."],
  [36, 40.5, "It writes the rehab line by line,"],
  [40.5, 45, "and I fix what it gets wrong."],
  [45, 48, "Kitchen table. I put the number down."],
  [48, 54, "I know every line, so they can ask me anything."],
  [54, 56.5, "Back in the truck, one message."],
  [56.5, 60, "Buyer's money is in, loan's started."],
  [60, 63.5, "That closes two tasks, updates three,"],
  [63.5, 66, "and logs where it heard it."],
  [66, 69.5, "At the office, they've lined up what's next."],
  [69.5, 75, "I keep what's real and toss the rest."],
  [75, 78, "Five-thirty. Nine things handled. One needed me."],
  [78, 82, "I don't do the busywork anymore."],
  [82, 86, "I still make the calls."],
];

export const AnimaticV2: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <Sequence name="0 · 6:40 AM brief" durationInFrames={270}>
      <Photo src="truck/front-driveway-crop.jpg" focus="50% 40%" dim={0.78} zoom={[1.1, 1.2]} />
      <ShotTag text="0A · REAL: DAWN, LIGHT BAR WAKES" />
      <Sequence durationInFrames={75}>
        <TimeStamp time="6:40 AM" />
      </Sequence>
      <Sequence from={45}>
        <Phone>
          <MorningBrief />
        </Phone>
      </Sequence>
    </Sequence>

    <Sequence name="1 · Seller call" from={270} durationInFrames={150}>
      <Photo src="truck/frunk-tools.jpg" focus="38% 55%" dim={0.25} />
      <ShotTag text="1A · STAND-IN: REAL TRUCK" />
      <TimeStamp time="7:40 AM" />
    </Sequence>

    <Sequence name="2 · Underwrite" from={420} durationInFrames={240}>
      <Photo src="truck/frunk-tools.jpg" focus="60% 55%" dim={0.72} zoom={[1.16, 1.24]} />
      <ShotTag text="2A/2B · PHONE PLATE" />
      <Phone>
        <DealScreen />
      </Phone>
    </Sequence>

    <Sequence name="3 · Brief" from={660} durationInFrames={210}>
      <ShotPanel id="3A" desc="Truck in the driveway of a 1960s brick ranch" />
      <ShotTag text="3A · PHONE PLATE" />
      <Phone>
        <PropertyBrief />
      </Phone>
    </Sequence>

    <Sequence name="4 · Walkthrough + agents" from={870} durationInFrames={480}>
      <ShotPanel id="4A/4B" desc="Kitchen and bath walkthrough, handheld" />
      <ShotTag text="4C PHONE · AGENT TRAY OVERLAY" />
      <Phone width={460} left={40} top={160}>
        <S4Rehab />
      </Phone>
      <div style={{ position: "absolute", left: 520, top: 40, width: 1080, height: 1920, scale: "0.62", transformOrigin: "0 0" }}>
        <BackgroundTray />
      </div>
    </Sequence>

    <Sequence name="5 · Kitchen table" from={1350} durationInFrames={270}>
      <ShotPanel id="5A" desc="Kitchen table, two mugs, the page slides across" />
      <ShotTag text="5A · OFFER OVERLAY" />
      <OfferOverlay showDollars />
    </Sequence>

    <Sequence name="6 · One message" from={1620} durationInFrames={360}>
      <Photo src="truck/front-driveway-crop.jpg" focus="50% 40%" dim={0.7} zoom={[1.16, 1.24]} />
      <ShotTag text="6A · REAL: IN THE CAB" />
      <Phone>
        <OneMessage />
      </Phone>
    </Sequence>

    <Sequence name="7 · Suggested lane" from={1980} durationInFrames={270}>
      <ShotPanel id="7A" desc="Office, over the shoulder to the monitor" />
      <ShotTag text="7B · MONITOR PLATE" />
      <Monitor>
        <SuggestedLane />
      </Monitor>
    </Sequence>

    <Sequence name="8 · 5:30 PM" from={2250} durationInFrames={390}>
      <Photo src="truck/golden-hour-lot.jpg" focus="30% 60%" zoom={[1.0, 1.1]} dim={0.3} />
      <ShotTag text="8A · REAL: GOLDEN-HOUR LOT" />
      <Sequence durationInFrames={70}>
        <TimeStamp time="5:30 PM" />
      </Sequence>
      <Sequence from={30} durationInFrames={290}>
        <Phone>
          <EndOfDay />
        </Phone>
      </Sequence>
      <Sequence from={320} durationInFrames={70}>
        <AbsoluteFill style={{ background: "rgba(0,0,0,0.45)" }} />
        <ClosingCTA />
      </Sequence>
    </Sequence>

    <Captions lines={CAPTIONS_V2} />
  </AbsoluteFill>
);
