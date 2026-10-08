import React from "react";
import { Composition, Folder } from "remotion";
import { FPS, MONITOR, PHONE, VERTICAL } from "./theme";
import { Animatic, ANIMATIC_DURATION } from "./Animatic";
import { S2Underwrite, S2_DURATION } from "./scenes/S2Underwrite";
import { S3Brief, S3_DURATION } from "./scenes/S3Brief";
import { S4Rehab, S4_DURATION } from "./scenes/S4Rehab";
import { S6ADealBoard, S6A_DURATION } from "./scenes/S6DealBoard";
import { S6BFollowUp, S6B_DURATION } from "./scenes/S6FollowUp";
import { ClosingCTA, OfferOverlay, TimeStamp } from "./scenes/Overlays";
import { AnimaticV2, ANIMATIC_V2_DURATION } from "./AnimaticV2";
import { MorningBrief, MORNING_DURATION } from "./scenes/v2/MorningBrief";
import { BackgroundTray, TRAY_DURATION } from "./scenes/v2/BackgroundTray";
import { OneMessage, ONE_MESSAGE_DURATION } from "./scenes/v2/OneMessage";
import { SuggestedLane, SUGGESTED_DURATION } from "./scenes/v2/SuggestedLane";
import { EndOfDay, END_DURATION } from "./scenes/v2/EndOfDay";
import { DealScreen, DEAL_DURATION } from "./scenes/v2/DealScreen";
import { PropertyBrief, BRIEF_DURATION } from "./scenes/v2/PropertyBrief";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="AnimaticV2" component={AnimaticV2} durationInFrames={ANIMATIC_V2_DURATION} fps={FPS} {...VERTICAL} />
    <Folder name="V2-agent-plates">
      <Composition id="V2-0-MorningBrief" component={MorningBrief} durationInFrames={MORNING_DURATION} fps={FPS} {...PHONE} />
      <Composition id="V2-2-Deal" component={DealScreen} durationInFrames={DEAL_DURATION} fps={FPS} {...PHONE} />
      <Composition id="V2-3-PropertyBrief" component={PropertyBrief} durationInFrames={BRIEF_DURATION} fps={FPS} {...PHONE} />
      <Composition id="V2-4-AgentTray" component={BackgroundTray} durationInFrames={TRAY_DURATION} fps={FPS} {...VERTICAL} />
      <Composition id="V2-6-OneMessage" component={OneMessage} durationInFrames={ONE_MESSAGE_DURATION} fps={FPS} {...PHONE} />
      <Composition id="V2-7-SuggestedLane" component={SuggestedLane} durationInFrames={SUGGESTED_DURATION} fps={FPS} {...MONITOR} />
      <Composition id="V2-8-EndOfDay" component={EndOfDay} durationInFrames={END_DURATION} fps={FPS} {...PHONE} />
    </Folder>

    <Composition id="Animatic" component={Animatic} durationInFrames={ANIMATIC_DURATION} fps={FPS} {...VERTICAL} />

    {/* Screen plates: composite onto the green phone / monitor screens. */}
    <Folder name="Phone-plates">
      <Composition id="S2-Underwrite" component={S2Underwrite} durationInFrames={S2_DURATION} fps={FPS} {...PHONE} />
      <Composition id="S3-Brief" component={S3Brief} durationInFrames={S3_DURATION} fps={FPS} {...PHONE} />
      <Composition id="S4-Rehab" component={S4Rehab} durationInFrames={S4_DURATION} fps={FPS} {...PHONE} />
      <Composition id="S6B-FollowUp" component={S6BFollowUp} durationInFrames={S6B_DURATION} fps={FPS} {...PHONE} />
    </Folder>
    <Folder name="Monitor-plates">
      <Composition id="S6A-DealBoard" component={S6ADealBoard} durationInFrames={S6A_DURATION} fps={FPS} {...MONITOR} />
    </Folder>

    {/* Transparent overlays: render as ProRes 4444 (see README). */}
    <Folder name="Overlays">
      <Composition id="O1-TimeAM" component={TimeStamp} durationInFrames={150} fps={FPS} {...VERTICAL} defaultProps={{ time: "7:40 AM" }} />
      <Composition id="O5-Offer" component={OfferOverlay} durationInFrames={360} fps={FPS} {...VERTICAL} defaultProps={{ showDollars: true }} />
      <Composition id="O5-Offer-NoDollars" component={OfferOverlay} durationInFrames={360} fps={FPS} {...VERTICAL} defaultProps={{ showDollars: false }} />
      <Composition id="O7-TimePM" component={TimeStamp} durationInFrames={150} fps={FPS} {...VERTICAL} defaultProps={{ time: "5:30 PM" }} />
      <Composition id="O7-CTA" component={ClosingCTA} durationInFrames={120} fps={FPS} {...VERTICAL} />
    </Folder>
  </>
);
