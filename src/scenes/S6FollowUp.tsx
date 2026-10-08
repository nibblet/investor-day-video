import React from "react";
import { C } from "../theme";
import { deal } from "../data/valleyStation";
import { Card, Check, Label, MicLive, PhoneScreen, Thinking, Typed, useEnter } from "../components/ui";

// Shot 6B phone plate, 0:58–1:04. One spoken instruction → a sent text and a
// calendar entry. Names stay generic ("Tuesday's seller", "plumber").
export const S6B_DURATION = 180;

const Action: React.FC<{ at: number; kind: string; title: string; detail: string }> = ({ at, kind, title, detail }) => {
  const s = useEnter(at, 14, 30);
  return (
    <Card style={{ ...s, display: "flex", gap: 30, alignItems: "flex-start" }}>
      <Check size={64} />
      <div style={{ flex: 1 }}>
        <Label>{kind}</Label>
        <div style={{ fontSize: 46, fontWeight: 600, marginTop: 8 }}>{title}</div>
        <div style={{ fontSize: 36, color: C.text2, marginTop: 8, lineHeight: 1.3 }}>{detail}</div>
      </div>
    </Card>
  );
};

// The day so far, so the last screen ties the story together.
const Today: React.FC = () => {
  const s = useEnter(140, 16, 30);
  const items = [
    `Underwrote ${deal.area}`,
    "Read the seller brief",
    `Scoped the rehab · $${deal.rehabTotal.toLocaleString("en-US")}`,
    "Offer on the table",
  ];
  return (
    <div style={{ ...s, marginTop: 12 }}>
      <Label>Today</Label>
      <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 18 }}>
        {items.map((item) => (
          <div key={item} style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 40, color: C.text2 }}>
            <Check size={44} color={C.muted} />
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};

export const S6BFollowUp: React.FC = () => {
  const bubble = useEnter(4, 12);
  return (
    <PhoneScreen time="3:42" title="Assistant">
      <div style={{ ...bubble, alignSelf: "flex-end", maxWidth: "88%" }}>
        <div style={{ marginBottom: 14, textAlign: "right" }}>
          <MicLive label="Voice" />
        </div>
        <div style={{ background: C.brand, color: "#111", fontSize: 46, fontWeight: 600, padding: "30px 40px", borderRadius: "40px 40px 10px 40px", lineHeight: 1.25 }}>
          <Typed text="Follow up with Tuesday's seller, and get my plumber out Thursday." start={6} cps={30} />
        </div>
      </div>
      <div style={{ padding: "4px 8px" }}>
        <Thinking start={76} end={92} />
      </div>
      <Action at={92} kind="Text sent" title="Tuesday's seller" detail="“Thanks again for your time Tuesday. Happy to walk through the numbers whenever you're ready.”" />
      <Action at={116} kind="Calendar" title="Plumber · Thu 9:00 AM" detail={`${deal.area} · shower pan`} />
      <Today />
    </PhoneScreen>
  );
};
