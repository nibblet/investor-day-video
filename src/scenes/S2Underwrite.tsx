import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { C } from "../theme";
import { deal } from "../data/valleyStation";
import {
  Card,
  Check,
  Label,
  MicLive,
  Money,
  PhoneScreen,
  Pill,
  Thinking,
  Typed,
  useCount,
  useEnter,
  usePop,
} from "../components/ui";

// Shot 2A/2B phone plate, 0:05–0:14. "Underwrite this address" → result.
export const S2_DURATION = 270;

const Step: React.FC<{ at: number; text: string }> = ({ at, text }) => {
  const s = useEnter(at, 10, 16);
  return (
    <div style={{ ...s, display: "flex", alignItems: "center", gap: 20, fontSize: 38, color: C.text2 }}>
      <Check size={46} />
      {text}
    </div>
  );
};

export const S2Underwrite: React.FC = () => {
  const frame = useCurrentFrame();
  const userBubble = useEnter(6, 12);
  const reply = useEnter(62, 12);
  const result = useEnter(150, 18, 80);
  const verdict = usePop(168);
  const arv = useCount(deal.arv, 172, 30);
  const mao = useCount(deal.maxOffer, 186, 30);
  // Chat collapses upward as the result card arrives.
  const chatOut = interpolate(frame, [140, 160], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <PhoneScreen time="7:48" title="Assistant" subtitle={deal.area}>
      <div style={{ opacity: chatOut, scale: String(0.94 + 0.06 * chatOut), display: "flex", flexDirection: "column", gap: 28 }}>
        <div style={{ alignSelf: "flex-end", maxWidth: "82%", ...userBubble }}>
          <div
            style={{
              background: C.brand,
              color: "#111",
              fontSize: 46,
              fontWeight: 600,
              padding: "30px 40px",
              borderRadius: "40px 40px 10px 40px",
            }}
          >
            <Typed text="Underwrite this address." start={8} cps={22} />
          </div>
          <div style={{ marginTop: 14, textAlign: "right" }}>
            {frame < 50 ? <MicLive label="Voice" /> : null}
          </div>
        </div>

        <div style={{ alignSelf: "flex-start", width: "90%" }}>
          <div style={{ padding: "8px 4px" }}>
            <Thinking start={44} end={62} />
          </div>
          <Card style={{ ...reply, display: "flex", flexDirection: "column", gap: 22 }}>
            <div style={{ fontSize: 42, fontWeight: 500 }}>
              On it. Pulling comps and running the numbers.
            </div>
            <Step at={80} text={`${deal.comps.count} sold comps · ${deal.comps.radiusMi} mi · ${deal.comps.months} mo`} />
            <Step at={98} text={`Rehab scoped from the listing + photos`} />
            <Step at={116} text={`${deal.strategiesScored} exit strategies scored`} />
          </Card>
        </div>
      </div>

      <Card
        accent={C.elevated}
        style={{
          ...result,
          position: "absolute",
          left: 56,
          right: 56,
          top: 400,
          padding: "48px 48px 52px",
          display: "flex",
          flexDirection: "column",
          gap: 52,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 50, fontWeight: 700 }}>{deal.area}</div>
            <div style={{ fontSize: 34, color: C.text2, marginTop: 6 }}>{deal.facts}</div>
          </div>
          <span style={{ scale: String(verdict) }}>
            <Pill color={C.success} bg={C.successSoft} size={40}>
              {deal.verdict}
            </Pill>
          </span>
        </div>

        <div style={{ height: 2, background: C.elevated }} />

        <div>
          <Label>After-repair value</Label>
          <Money value={arv} size={112} />
          <div style={{ fontSize: 32, color: C.text2, marginTop: 6 }}>
            Comp confidence: {deal.comps.confidence} · {deal.comps.score}
          </div>
        </div>

        <div
          style={{
            background: C.brandSoft,
            borderRadius: 28,
            padding: "30px 36px",
            border: `2px solid rgba(249,115,22,0.35)`,
          }}
        >
          <Label style={{ color: C.brand }}>Max offer · retail</Label>
          <Money value={mao} size={112} color={C.brand} />
        </div>

        <div style={{ display: "flex", gap: 24 }}>
          {[
            ["Rehab est.", `$${deal.rehabTotal.toLocaleString("en-US")}`],
            ["Rent est.", `$${deal.rent.toLocaleString("en-US")}/mo`],
          ].map(([k, v]) => (
            <div key={k} style={{ flex: 1, background: C.elevated, borderRadius: 24, padding: "24px 28px" }}>
              <Label style={{ fontSize: 26 }}>{k}</Label>
              <div style={{ fontSize: 46, fontWeight: 600, marginTop: 6 }}>{v}</div>
            </div>
          ))}
        </div>
      </Card>
    </PhoneScreen>
  );
};
