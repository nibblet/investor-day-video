import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { BarChart3, FileText, Home, SlidersHorizontal } from "lucide-react";
import { deal } from "../../data/valleyStation";
import { EDGE, EdgeCard, RvScreen } from "../../components/readvise";
import { MicLive, Typed, useCount, useEnter } from "../../components/ui";

// Scene 2 phone plate (v2), 0:14–0:22. The real Edge Deal screen, as in
// Paul's recording: spinner → "BUY as …" card → What we decided → Evidence →
// Property brief. Valley Station numbers; no address, no profit.
export const DEAL_DURATION = 240;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const LOADED = 46;

// Comp range from the deal's comp decision (anchor low/high, 13 comps, high).
const COMP_LOW = 193;
const COMP_HIGH = 212;
const ALL_IN_PCT = Math.round(((deal.offer + deal.rehabTotal) / deal.arv) * 100);

const Stat: React.FC<{ k: string; v: React.ReactNode; sub?: string; border?: boolean }> = ({ k, v, sub, border }) => (
  <div style={{ flex: 1, padding: "0 22px", borderLeft: border ? `2px solid ${EDGE.hairline}` : "none" }}>
    <div style={{ fontSize: 38, color: "#9CA3AF", lineHeight: 1.2 }}>{k}</div>
    <div style={{ fontSize: 58, fontWeight: 800, marginTop: 8, fontVariantNumeric: "tabular-nums" }}>{v}</div>
    {sub ? <div style={{ fontSize: 36, color: "#9CA3AF" }}>{sub}</div> : null}
  </div>
);

export const DealScreen: React.FC = () => {
  const frame = useCurrentFrame();
  const toast = useEnter(2, 10, -30);
  const toastOut = interpolate(frame, [LOADED + 20, LOADED + 32], [1, 0], clamp);
  const c1 = useEnter(LOADED, 14, 40);
  const c2 = useEnter(LOADED + 26, 14, 40);
  const c3 = useEnter(LOADED + 44, 14, 40);
  const c4 = useEnter(LOADED + 62, 14, 40);
  const c5 = useEnter(LOADED + 80, 14, 40);
  const mao = useCount(deal.maxOffer, LOADED + 6, 26);
  const arv = useCount(deal.arv, LOADED + 90, 26);
  const spinner = frame < LOADED;

  return (
    <RvScreen time="7:48" back="Operate" title="Deal">
      {spinner ? (
        <div style={{ height: 600, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span
            style={{
              width: 90,
              height: 90,
              borderRadius: 999,
              border: `8px solid ${EDGE.field}`,
              borderTopColor: EDGE.orange,
              rotate: `${frame * 14}deg`,
            }}
          />
        </div>
      ) : null}

      {!spinner ? (
        <>
          <div style={{ ...c1, background: EDGE.card, borderRadius: 40, padding: "40px 32px" }}>
            <div style={{ fontSize: 76, fontWeight: 800, paddingLeft: 22 }}>
              <span style={{ color: EDGE.teal }}>{deal.verdict}</span> as Retail flip
            </div>
            <div style={{ display: "flex", marginTop: 28 }}>
              <Stat k="Max offer" v={`$${Math.round(mao).toLocaleString("en-US")}`} />
              <Stat k="All-in cost" v={`${ALL_IN_PCT}%`} sub="of ARV" border />
              <Stat k="Deal score" v="10" sub="out of 10" border />
            </div>
          </div>

          <div style={c2}>
            <EdgeCard icon={<FileText size={60} />} title="What we decided" chevron />
          </div>

          <div style={c3}>
            <EdgeCard icon={<BarChart3 size={60} />} title="Evidence" chevron>
              <div style={{ fontSize: 44, lineHeight: 1.35, color: "#9CA3AF" }}>
                Comp ARV{" "}
                <span style={{ color: EDGE.teal, fontWeight: 800 }}>
                  ${COMP_LOW}K – ${COMP_HIGH}K
                </span>{" "}
                · {deal.comps.confidence} confidence · {deal.comps.count} comps
              </div>
            </EdgeCard>
          </div>

          <div style={c4}>
            <EdgeCard icon={<Home size={60} />} title="Property brief" chevron>
              <div style={{ fontSize: 44, color: "#9CA3AF" }}>{deal.facts} · Flood X</div>
            </EdgeCard>
          </div>

          <div style={c5}>
            <EdgeCard icon={<SlidersHorizontal size={60} />} title="Key inputs">
              <div style={{ display: "flex", marginLeft: -82, marginTop: 6 }}>
                <Stat k="Working ARV" v={`$${Math.round(arv).toLocaleString("en-US")}`} />
                <Stat k="Rehab (est.)" v={`$${deal.rehabTotal.toLocaleString("en-US")}`} border />
              </div>
            </EdgeCard>
          </div>
        </>
      ) : null}

      <div
        style={{
          ...toast,
          opacity: toast.opacity * toastOut,
          position: "absolute",
          top: 330,
          left: 120,
          right: 120,
          padding: "28px 36px",
          borderRadius: 40,
          background: EDGE.orange,
          color: "#111",
          fontSize: 46,
          fontWeight: 700,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
        }}
      >
        <span>
          <Typed text="Underwrite this address." start={4} cps={22} />
        </span>
        <span style={{ filter: "brightness(0.2)" }}>
          <MicLive label="" />
        </span>
      </div>
    </RvScreen>
  );
};
