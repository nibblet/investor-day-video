import React from "react";
import { C } from "../theme";
import { brief } from "../data/valleyStation";
import { Card, Label, PhoneScreen, Pill, useEnter } from "../components/ui";

// Shot 3A phone plate, 0:14–0:22. Seller brief read in the driveway.
export const S3_DURATION = 240;

const Fact: React.FC<{ at: number; k: string; v: string }> = ({ at, k, v }) => {
  const s = useEnter(at, 12, 20);
  return (
    <div
      style={{
        ...s,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        padding: "26px 0",
        borderBottom: `2px solid ${C.elevated}`,
      }}
    >
      <span style={{ fontSize: 38, color: C.text2 }}>{k}</span>
      <span style={{ fontSize: 44, fontWeight: 600 }}>{v}</span>
    </div>
  );
};

export const S3Brief: React.FC = () => {
  const head = useEnter(4, 14);
  const edge = useEnter(96, 16);
  const open = useEnter(128, 16);
  const pitch = useEnter(160, 16);

  return (
    <PhoneScreen time="8:21" title="Seller brief" subtitle="Ready before you knock">
      <div style={{ ...head, display: "flex", gap: 16, flexWrap: "wrap" }}>
        <Pill color={C.brand} bg={C.brandSoft}>{brief.motivation}</Pill>
        <Pill color={C.text2} bg={C.surface}>{brief.occupancy}</Pill>
      </div>

      <Card style={{ padding: "8px 40px 8px" }}>
        <Fact at={18} k="Owned" v={`${brief.ownedYears} years`} />
        <Fact at={34} k="Occupancy" v={brief.occupancy} />
        <Fact at={50} k="Owner" v={brief.portfolio} />
        <div style={{ borderBottom: "none" }}>
          <Fact at={66} k="Title" v={brief.liens} />
        </div>
      </Card>

      <div style={edge}>
        <Label>Their situation</Label>
        <div style={{ fontSize: 46, fontWeight: 600, marginTop: 12, lineHeight: 1.25 }}>{brief.edge}</div>
      </div>

      <Card accent="rgba(249,115,22,0.4)" style={{ ...open, background: C.brandSoft }}>
        <Label style={{ color: C.brand }}>Opening move</Label>
        <div style={{ fontSize: 46, fontWeight: 500, marginTop: 14, lineHeight: 1.3 }}>
          “{brief.openingMove}”
        </div>
      </Card>

      <div style={{ ...pitch, fontSize: 44, color: C.text2, lineHeight: 1.35 }}>
        <span style={{ color: C.text, fontWeight: 600 }}>Then: </span>
        {brief.pitch}
      </div>

      <div style={{ ...pitch, display: "flex", gap: 20, marginTop: 8 }}>
        {["Listen first", "Share the number", "Ask for their reaction"].map((step, i) => (
          <div key={step} style={{ flex: 1, background: C.surface, borderRadius: 28, padding: "28px 26px", border: `2px solid ${C.elevated}` }}>
            <div style={{ fontSize: 30, fontWeight: 700, color: C.brand }}>{i + 1}</div>
            <div style={{ fontSize: 36, fontWeight: 600, marginTop: 8, lineHeight: 1.2 }}>{step}</div>
          </div>
        ))}
      </div>
    </PhoneScreen>
  );
};
