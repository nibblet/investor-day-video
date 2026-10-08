import React from "react";
import { brief, deal } from "../../data/valleyStation";
import { EDGE, RvScreen } from "../../components/readvise";
import { useEnter } from "../../components/ui";

// Scene 3 phone plate (v2), 0:22–0:29. The Edge "Property brief" page from
// the recording (Basics · Owner & Equity · History & Risk), plus the seller
// read. The real page shows the owner's name: never render it here.
export const BRIEF_DURATION = 210;

const Grid: React.FC<{ cells: [string, string][] }> = ({ cells }) => (
  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", rowGap: 30, columnGap: 30, marginTop: 22 }}>
    {cells.map(([k, v]) => (
      <div key={k}>
        <div style={{ fontSize: 46, fontWeight: 700 }}>{v}</div>
        <div style={{ fontSize: 34, color: "#9CA3AF", marginTop: 2 }}>{k}</div>
      </div>
    ))}
  </div>
);

const Section: React.FC<{ at: number; title: string; children: React.ReactNode; accent?: boolean }> = ({
  at,
  title,
  children,
  accent,
}) => {
  const s = useEnter(at, 14, 36);
  return (
    <div
      style={{
        ...s,
        background: accent ? EDGE.orangeSoft : EDGE.card,
        border: accent ? `3px solid rgba(246,101,19,0.45)` : "none",
        borderRadius: 40,
        padding: "36px 44px",
      }}
    >
      <div style={{ fontSize: 50, fontWeight: 800, color: accent ? EDGE.orange : EDGE.white }}>{title}</div>
      {children}
    </div>
  );
};

export const PropertyBrief: React.FC = () => (
  <RvScreen time="8:21" back="Deal" title="Property brief">
    <Section at={4} title="Basics">
      <Grid
        cells={[
          ["Built", "1960"],
          ["Type", "SFR"],
          ["Size", "1,000 sf"],
          ["Flood zone", "X"],
        ]}
      />
    </Section>
    <Section at={26} title="Owner & Equity">
      <Grid
        cells={[
          ["Owned", `${brief.ownedYears} yrs`],
          ["Occupancy", brief.occupancy],
          ["Liens", "None on record"],
          ["Portfolio", "2 properties"],
        ]}
      />
    </Section>
    <Section at={52} title="Seller read" accent>
      <div style={{ fontSize: 44, fontWeight: 600, marginTop: 16, lineHeight: 1.3 }}>
        {brief.motivation}. {brief.edge}
      </div>
      <div style={{ fontSize: 42, marginTop: 22, lineHeight: 1.35, color: EDGE.white }}>
        <span style={{ color: EDGE.orange, fontWeight: 700 }}>Open with: </span>“{brief.openingMove}”
      </div>
    </Section>
    <div style={{ ...useEnter(84, 14), fontSize: 36, color: EDGE.slate, textAlign: "center" }}>
      {deal.area} · ready before you knock
    </div>
  </RvScreen>
);
